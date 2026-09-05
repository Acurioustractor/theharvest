import {
  upsertGHLContact,
  addGHLContactNote,
  addGHLInboundFormMessage,
  markGHLConversationUnread,
  upsertGHLHarvestInboxOpportunity,
  triggerGHLWorkflow,
} from "./gohighlevel.js";

/**
 * One way in for every Harvest form.
 *
 * Every public form used to hand-roll the same five steps (upsert the contact,
 * tag it, keep a note, post the message into GHL Conversations, fire a receipt
 * workflow), and that is how three forms ended up with no receipt and one with
 * no ask tag. This is the chokepoint instead. A new form is one call.
 *
 * What a caller decides:
 *   needsReply   true when a person is expected to write back. Adds `act-inquiry`,
 *                which is what puts someone on the waiting list
 *                (scripts/report-ghl-waiting.ts, and the 7am check-in).
 *   card         only when the thing needs more than a reply: a booking, a listing,
 *                a business registration. Cards cannot move themselves when you
 *                reply (GHL has no trigger for that), so reply-only forms must
 *                not create them.
 *   receiptWorkflowEnv   the env var (or ordered fallbacks) holding the GHL receipt
 *                workflow id. Unset means the submitter hears nothing, which is
 *                logged so it is never silent by accident.
 *
 * What is always done: `project:act-hv` (stamped inside upsertGHLContact) and
 * `harvest-website`. See docs/strategy/ghl-pipeline-playbook.md, "How to get
 * back to people".
 */
export interface HarvestSubmission {
  /** Short form id for logs, e.g. "rsvp", "contact", "shop-interest". */
  form: string;
  /** Full name as typed. Split into first/last unless firstName is given. */
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone?: string | null;
  /** GHL contact source, e.g. "Harvest | RSVP Witta Pizza 2026-09-05". */
  source: string;
  /** Form-specific tags. `harvest-website` and `project:act-hv` are added for you. */
  tags: string[];
  /** A person is expected to reply. Adds `act-inquiry`. */
  needsReply: boolean;
  /** This submission is itself the newsletter opt-in (the dedicated signup form only). */
  newsletterConsent?: boolean;
  /** Markdown note kept on the contact record. */
  note?: string;
  /** Fail the submission if the note cannot be saved (the note is the record). */
  requireNote?: boolean;
  /** Lands in GHL Conversations so the thread exists and the reply goes from GHL. */
  message?: { subject: string; html: string };
  /** Mark the thread unread after posting the message, so it surfaces in the inbox. */
  markUnread?: boolean;
  /** Only for things that need more than a reply. Falls back to the Harvest Inbox pipeline. */
  card?: { title: string; pipelineId?: string; pipelineStageId?: string };
  /** Env var name(s) holding the receipt workflow id; the first one that is set wins. */
  receiptWorkflowEnv?: string | string[];
}

export interface HarvestCaptureResult {
  success: boolean;
  contactId?: string;
  error?: string;
}

export function splitPersonName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ") || undefined,
  };
}

function receiptWorkflowId(env?: string | string[]): { id?: string; names: string[] } {
  const names = env === undefined ? [] : Array.isArray(env) ? env : [env];
  for (const name of names) {
    const value = process.env[name];
    if (value) return { id: value, names };
  }
  return { names };
}

export async function captureHarvestSubmission(submission: HarvestSubmission): Promise<HarvestCaptureResult> {
  const split = splitPersonName(submission.name);
  const firstName = submission.firstName ?? split.firstName;
  const lastName = submission.firstName ? submission.lastName : split.lastName;
  const tags = Array.from(
    new Set(["harvest-website", ...submission.tags, ...(submission.needsReply ? ["act-inquiry"] : [])]),
  );

  const contact = await upsertGHLContact({
    email: submission.email || undefined,
    firstName,
    lastName,
    phone: submission.phone || undefined,
    source: submission.source,
    tags,
    ...(submission.newsletterConsent ? { newsletterConsent: true } : {}),
  });
  if (!contact.success || !contact.contactId) {
    return { success: false, error: contact.error };
  }
  const contactId = contact.contactId;

  // Everything below is best-effort unless the caller says otherwise: the
  // contact exists and is tagged, which is what the waiting list and the
  // receipt depend on. Each step is awaited, not fire-and-forget, because
  // Vercel ends the function when the handler returns.
  if (submission.note) {
    const note = await addGHLContactNote(contactId, submission.note);
    if (!note.success) {
      if (submission.requireNote) {
        return { success: false, contactId, error: note.error || `Failed to save the ${submission.form} note` };
      }
      console.error(`GHL note failed (${submission.form}):`, note.error);
    }
  }

  if (submission.message) {
    await addGHLInboundFormMessage({
      contactId,
      fromEmail: submission.email || undefined,
      subject: submission.message.subject,
      html: submission.message.html,
    }).catch((err) => console.error(`GHL inbox message failed (${submission.form}):`, err));
  }

  if (submission.card) {
    const card = await upsertGHLHarvestInboxOpportunity({
      contactId,
      name: `${submission.name.trim()} - ${submission.card.title}`,
      source: submission.source,
      ...(submission.card.pipelineId && submission.card.pipelineStageId
        ? { pipelineId: submission.card.pipelineId, pipelineStageId: submission.card.pipelineStageId }
        : {}),
    });
    if (!card.success) console.error(`GHL card failed (${submission.form}):`, card.error);
  }

  const receipt = receiptWorkflowId(submission.receiptWorkflowEnv);
  if (receipt.id) {
    const triggered = await triggerGHLWorkflow(receipt.id, contactId).catch((err) => ({
      success: false as const,
      error: String(err),
    }));
    if (!triggered.success) console.error(`GHL receipt workflow failed (${submission.form}):`, triggered.error);
  } else if (receipt.names.length) {
    console.warn(`No receipt for ${submission.form}: none of ${receipt.names.join(", ")} is set.`);
  }

  if (submission.markUnread && submission.message) {
    const unread = await markGHLConversationUnread(contactId);
    if (!unread.success) console.error(`GHL mark unread failed (${submission.form}):`, unread.error);
  }

  return { success: true, contactId };
}
