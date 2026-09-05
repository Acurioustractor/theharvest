import "dotenv/config";

/**
 * Who is waiting on a human reply, per ACT project.
 *
 * The GHL Conversations tab cannot answer this on its own, because the
 * auto-acknowledgment replies to everyone within seconds and every thread then
 * reads as "answered". GHL does record whether the last outbound message was
 * sent by a workflow or typed by a person, and that is the signal this uses:
 *
 *   waiting = last message is inbound
 *          OR last message is outbound and was automated
 *
 * scoped to one project's contacts who actually asked something, not
 * newsletter or member signups who only ever received a welcome email.
 *
 * Two tags carry the whole model:
 *   project:act-XX   which project this person belongs to (one per contact)
 *   act-inquiry      a human is expected to reply
 * Until every form applies act-inquiry at capture, each project below lists
 * the legacy tags its forms use instead.
 *
 * Blind spot: threads that only exist in Gmail (someone emails benjamin@ or
 * nicholas@ directly) never reach GHL, so a long wait here is worth a
 * `in:sent` check in Gmail before treating it as real.
 *
 * Read-only, unless --sync-tag --apply is passed (see below).
 *
 *   npm run waiting:ghl                    Harvest, plain table
 *   npm run waiting:ghl -- --project gd    Goods
 *   npm run waiting:ghl -- --all           every project
 *   npm run waiting:ghl -- --md            markdown, for pasting into Notion
 *
 * To review the same list inside GHL:
 *   npm run waiting:sync:ghl               what the `needs-reply` tag would change
 *   npm run waiting:sync:ghl:apply         write it
 * Then in GHL: Contacts, filter Tags is `needs-reply` (add `project:act-hv` for
 * one project), Save as a Smart List. That works on every GHL version, unlike
 * the Conversations tag filter.
 */

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const CONVERSATIONS_API_VERSION = "2021-04-15";
const CONTACTS_API_VERSION = "2021-07-28";
const BRISBANE_UTC_OFFSET_HOURS = 10;

// The universal "a human is expected to reply" tag. Every project's ask-type
// forms should apply it at capture. The per-project lists are the legacy tags
// those forms apply today; they can be deleted once the forms are fixed.
const ASKED_TAG = "act-inquiry";

// The tag this script maintains so the same list is reviewable inside GHL.
// GHL cannot be asked "who is waiting on a human", because the auto-ack makes
// every thread look answered; it can be asked "who has this tag". So the tag is
// the answer: added to whoever is waiting, removed from whoever no longer is,
// on every --sync-tag --apply run. Never edit it by hand in GHL, the next sync
// overwrites it. Only projects with syncTag are tagged, see the field comment.
const NEEDS_REPLY_TAG = "needs-reply";

type Project = {
  code: string;
  name: string;
  projectTag: string;
  legacyAskedTags: string[];
  /**
   * Maintain the `needs-reply` tag for this project, so its waiting list is
   * reviewable inside GHL. Only safe where GHL sees all the traffic. Harvest
   * arrives through website forms, so it does. Goods, JusticeHub and CONTAINED
   * run on relationships Ben and Nic carry in Gmail, which GHL never sees, so
   * tagging them would mark people who were answered days ago. Checked on
   * 2026-09-05: no existing tag separates the two (`role:partner` covers both
   * Christine Tylor, never emailed, and people emailed last week). Flip these
   * on when the "Gmail Email to Contact" workflow reliably files those threads.
   */
  syncTag?: boolean;
  /** Pipeline used as a manual worklist, if the project has one. */
  inboxPipelineId?: string;
  inboxStages?: Record<string, string>;
};

const PROJECTS: Record<string, Project> = {
  hv: {
    code: "hv",
    name: "The Harvest",
    projectTag: "project:act-hv",
    legacyAskedTags: ["contact-form", "venue-enquiry", "shop-follow-up", "shop-prospect", "member-question"],
    syncTag: true,
    inboxPipelineId: process.env.GHL_HARVEST_INBOX_PIPELINE_ID ?? "5ZqAuFokM4LsNqMCMPmY",
    inboxStages: {
      "aafc9a01-1ad6-42c8-8c47-69a74cf1141d": "New",
      "b72b1b9d-0e1a-495d-9b81-e1df4c9cdd09": "In progress",
      "b09e201d-bd10-4e84-b501-ca6a25fb1a94": "Waiting on them",
      "c343a664-7e10-4f96-b62d-8eda57748036": "Resolved",
    },
  },
  gd: {
    code: "gd",
    name: "Goods on Country",
    projectTag: "project:act-gd",
    legacyAskedTags: ["goods-inquiry", "goods-general-inquiry"],
  },
  jh: {
    code: "jh",
    name: "JusticeHub",
    projectTag: "project:act-jh",
    // The JusticeHub contact form applies no ask tag today. Until it does,
    // nothing from that form can appear here.
    legacyAskedTags: ["goods-inquiry"],
  },
  el: {
    code: "el",
    name: "Empathy Ledger",
    projectTag: "project:act-el",
    legacyAskedTags: [],
  },
  contained: {
    code: "contained",
    name: "CONTAINED",
    projectTag: "project:contained",
    legacyAskedTags: ["goods-inquiry"],
  },
};

// Staff and test records. Never a reply owed.
const IGNORED_EMAIL_PATTERNS = [/@act\.placee?$/i, /^knighttss@gmail\.com$/i, /@benjamink\.com\.au$/i, /^jane@gmail\.com$/i];

// The Harvest contact-form handler stores the submitted message here. Threads
// created before 2026-07-06 have no inbound message, so this is the only copy.
const MESSAGE_CUSTOM_FIELD_ID = "ceJz9FUf8dE4fmvnPDKd";

type GhlConversation = {
  id: string;
  contactId: string;
  contactName?: string | null;
  fullName?: string | null;
  email?: string | null;
  tags?: string[];
  dateAdded?: number;
  lastMessageDate?: number;
  lastMessageDirection?: "inbound" | "outbound";
  lastOutboundMessageAction?: "manual" | "automated";
  /** Epoch ms of the last message a person typed. Absent if nobody ever has. */
  lastManualMessageDate?: number;
  opportunities?: { id: string; pipelineId: string; pipelineStageId: string; status: string }[];
  sort?: number[];
};

type GhlMessage = {
  direction?: "inbound" | "outbound";
  body?: string | null;
  dateAdded?: string;
  messageType?: string;
};

type Waiting = {
  name: string;
  email: string;
  askedTags: string[];
  waitingSince: Date;
  days: number;
  message: string;
  card: string;
  conversationId: string;
  contactId: string;
};

const apiKey = process.env.GHL_API_KEY;
const locationId = process.env.GHL_LOCATION_ID;
if (!apiKey || !locationId) {
  console.error("GHL_API_KEY and GHL_LOCATION_ID are required.");
  process.exit(1);
}

async function ghl<T>(path: string, version: string): Promise<T> {
  const response = await fetch(`${GHL_API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: version,
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`GHL ${response.status} on ${path}: ${(await response.text()).slice(0, 200)}`);
  }
  return (await response.json()) as T;
}

async function listConversations(query: Record<string, string>): Promise<GhlConversation[]> {
  const all: GhlConversation[] = [];
  let startAfterDate: number | undefined;
  for (;;) {
    const params = new URLSearchParams({
      locationId: locationId!,
      limit: "100",
      sortBy: "last_message_date",
      sort: "desc",
      ...query,
    });
    if (startAfterDate) params.set("startAfterDate", String(startAfterDate));
    const page = await ghl<{ conversations?: GhlConversation[] }>(
      `/conversations/search?${params.toString()}`,
      CONVERSATIONS_API_VERSION,
    );
    const rows = page.conversations ?? [];
    all.push(...rows);
    const last = rows.at(-1);
    if (rows.length < 100 || !last?.sort?.[0]) break;
    startAfterDate = last.sort[0];
  }
  return all;
}

// The most recent thing they wrote, not the first: a person can be answered and
// then ask again in the same thread, and the current question is the one waiting.
async function latestInboundMessage(conversationId: string): Promise<GhlMessage | undefined> {
  const data = await ghl<{ messages?: { messages?: GhlMessage[] } | GhlMessage[] }>(
    `/conversations/${conversationId}/messages?limit=50`,
    CONVERSATIONS_API_VERSION,
  );
  const messages = Array.isArray(data.messages) ? data.messages : (data.messages?.messages ?? []);
  return messages
    .filter((m) => m.direction === "inbound" && m.messageType !== "TYPE_ACTIVITY_OPPORTUNITY")
    .sort((a, b) => Date.parse(b.dateAdded ?? "") - Date.parse(a.dateAdded ?? ""))[0];
}

async function storedFormMessage(contactId: string): Promise<string> {
  const data = await ghl<{ contact?: { customFields?: { id: string; value?: string | null }[] } }>(
    `/contacts/${contactId}`,
    CONTACTS_API_VERSION,
  );
  return data.contact?.customFields?.find((f) => f.id === MESSAGE_CUSTOM_FIELD_ID)?.value?.trim() ?? "";
}

// Shop, venue and member-question forms write what the person said as a note.
async function latestNote(contactId: string): Promise<string> {
  const data = await ghl<{ notes?: { body?: string | null; dateAdded?: string }[] }>(
    `/contacts/${contactId}/notes`,
    CONTACTS_API_VERSION,
  );
  return (
    (data.notes ?? [])
      .sort((a, b) => Date.parse(b.dateAdded ?? "") - Date.parse(a.dateAdded ?? ""))[0]
      ?.body?.trim() ?? ""
  );
}

// Last resort: the card title carries the topic ("Reply needed - Serge - shop makers").
async function cardTitle(opportunityId: string): Promise<string> {
  const data = await ghl<{ opportunity?: { name?: string | null } }>(`/opportunities/${opportunityId}`, CONTACTS_API_VERSION);
  return data.opportunity?.name?.trim() ?? "";
}

async function whatTheyAsked(c: GhlConversation, inboundBody: string, cardId?: string): Promise<string> {
  if (inboundBody) return inboundBody;
  const stored = await storedFormMessage(c.contactId);
  if (stored) return stored;
  const note = await latestNote(c.contactId);
  if (note) return note;
  if (cardId) {
    const title = await cardTitle(cardId);
    if (title) return `Card: ${title}`;
  }
  return "(registered interest, nothing written)";
}

function isIgnored(email: string): boolean {
  return IGNORED_EMAIL_PATTERNS.some((pattern) => pattern.test(email));
}

function brisbaneDate(date: Date): string {
  return new Date(date.getTime() + BRISBANE_UTC_OFFSET_HOURS * 3600_000).toISOString().slice(0, 10);
}

function preview(text: string, max = 140): string {
  const flat = text.replace(/^Subject:\s*/i, "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}

async function waitingFor(project: Project, inbound: GhlConversation[], robotAnswered: GhlConversation[]): Promise<Waiting[]> {
  const asked = new Set([ASKED_TAG, ...project.legacyAskedTags]);
  const candidates = [...inbound, ...robotAnswered].filter((c) => {
    const tags = c.tags ?? [];
    const email = c.email ?? "";
    return tags.includes(project.projectTag) && tags.some((t) => asked.has(t)) && email && !isIgnored(email);
  });

  const waiting: Waiting[] = [];
  for (const c of candidates) {
    const inboundMessage = await latestInboundMessage(c.id);
    const since = inboundMessage?.dateAdded ? new Date(inboundMessage.dateAdded) : new Date(c.dateAdded ?? Date.now());
    // A person already answered since they last wrote: not waiting. act-inquiry
    // stays on the contact, so without this a later automated email (newsletter,
    // nurture) would put an answered enquiry straight back on the list.
    if (c.lastManualMessageDate && c.lastManualMessageDate >= since.getTime()) continue;
    const card = project.inboxPipelineId
      ? (c.opportunities ?? []).find((o) => o.pipelineId === project.inboxPipelineId && o.status === "open")
      : undefined;
    const message = await whatTheyAsked(c, inboundMessage?.body?.trim() ?? "", card?.id);
    waiting.push({
      name: (c.contactName ?? c.fullName ?? c.email ?? "").trim(),
      email: c.email ?? "",
      askedTags: (c.tags ?? []).filter((t) => asked.has(t)),
      waitingSince: since,
      days: Math.floor((Date.now() - since.getTime()) / 86_400_000),
      message,
      card: project.inboxPipelineId
        ? card
          ? (project.inboxStages?.[card.pipelineStageId] ?? "other stage")
          : "no card"
        : "n/a",
      conversationId: c.id,
      contactId: c.contactId,
    });
  }
  return waiting.sort((a, b) => b.days - a.days);
}

function print(project: Project, waiting: Waiting[], markdown: boolean, today: string) {
  if (markdown) {
    console.log(`## ${project.name}: waiting on a human reply, ${today}\n`);
    console.log(`${waiting.length} people. Unanswered or robot-answered, tagged \`${project.projectTag}\`, asked something.\n`);
    console.log("| Days | Who | Asked | Board | What they said |");
    console.log("|---:|---|---|---|---|");
    for (const w of waiting) {
      console.log(`| ${w.days} | ${w.name} <${w.email}> | ${w.askedTags.join(", ")} | ${w.card} | ${preview(w.message, 110)} |`);
    }
    console.log();
    return;
  }
  console.log(`${project.name} (${project.projectTag}), waiting on a human reply, ${today}: ${waiting.length}\n`);
  for (const w of waiting) {
    console.log(`${String(w.days).padStart(3)}d  ${w.name.padEnd(24)} ${w.email.padEnd(32)} card: ${w.card}`);
    console.log(`      ${preview(w.message)}`);
  }
  console.log();
}

async function contactIdsWithTag(tag: string): Promise<Set<string>> {
  const ids = new Set<string>();
  let searchAfter: unknown[] | undefined;
  for (;;) {
    const body: Record<string, unknown> = {
      locationId,
      pageLimit: 100,
      filters: [{ field: "tags", operator: "eq", value: tag }],
    };
    if (searchAfter) body.searchAfter = searchAfter;
    const res = await fetch(`${GHL_API_BASE}/contacts/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: CONTACTS_API_VERSION,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`GHL ${res.status} on /contacts/search: ${(await res.text()).slice(0, 200)}`);
    const page = (await res.json()) as { contacts?: { id: string; searchAfter?: unknown[] }[] };
    const rows = page.contacts ?? [];
    rows.forEach((c) => ids.add(c.id));
    if (rows.length < 100) break;
    searchAfter = rows.at(-1)?.searchAfter;
    if (!searchAfter) break;
  }
  return ids;
}

async function editTag(method: "POST" | "DELETE", contactId: string, tag: string): Promise<boolean> {
  const res = await fetch(`${GHL_API_BASE}/contacts/${contactId}/tags`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: CONTACTS_API_VERSION,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tags: [tag] }),
  });
  if (!res.ok) {
    console.error(`  ${method} ${tag} on ${contactId} failed: ${res.status} ${(await res.text()).slice(0, 120)}`);
  }
  return res.ok;
}

/**
 * Reconcile NEEDS_REPLY_TAG so GHL's own Contacts filter shows the waiting list.
 * Returns the number of writes that failed, so a partial reconcile cannot look
 * like a clean run to a scheduler.
 */
async function syncNeedsReplyTag(waiting: Waiting[], apply: boolean): Promise<number> {
  const shouldHave = new Map(waiting.map((w) => [w.contactId, w]));
  const has = await contactIdsWithTag(NEEDS_REPLY_TAG);
  const toAdd = [...shouldHave.keys()].filter((id) => !has.has(id));
  const toRemove = [...has].filter((id) => !shouldHave.has(id));

  console.log(`\n${NEEDS_REPLY_TAG}: ${has.size} tagged now, ${shouldHave.size} waiting.`);
  console.log(`  add ${toAdd.length}, remove ${toRemove.length}${apply ? "" : "   (dry run, pass --apply to write)"}`);
  for (const id of toAdd) {
    const w = shouldHave.get(id)!;
    console.log(`  + ${w.name} <${w.email}> ${w.days}d`);
  }
  for (const id of toRemove) console.log(`  - ${id} (answered, or no longer matches)`);
  if (!apply) return 0;

  let ok = 0;
  for (const id of toAdd) if (await editTag("POST", id, NEEDS_REPLY_TAG)) ok++;
  for (const id of toRemove) if (await editTag("DELETE", id, NEEDS_REPLY_TAG)) ok++;
  const attempted = toAdd.length + toRemove.length;
  console.log(`  wrote ${ok}/${attempted}`);
  return attempted - ok;
}

async function main() {
  const args = process.argv.slice(2);
  const markdown = args.includes("--md");
  const all = args.includes("--all");
  const syncTag = args.includes("--sync-tag");
  const apply = args.includes("--apply");
  const projectArg = args[args.indexOf("--project") + 1];
  const codes = all ? Object.keys(PROJECTS) : [args.includes("--project") ? projectArg : "hv"];
  const unknown = codes.filter((c) => !PROJECTS[c]);
  if (unknown.length) {
    console.error(`Unknown project ${unknown.join(", ")}. Known: ${Object.keys(PROJECTS).join(", ")}`);
    process.exit(1);
  }

  // One pull of the location's threads serves every project.
  const [inbound, robotAnswered] = await Promise.all([
    listConversations({ lastMessageDirection: "inbound" }),
    listConversations({ lastMessageDirection: "outbound", lastMessageAction: "automated" }),
  ]);
  const today = brisbaneDate(new Date());
  if (!markdown) {
    console.log(`Location-wide: ${inbound.length} threads unanswered, ${robotAnswered.length} robot-answered.\n`);
  }
  const taggable: Waiting[] = [];
  for (const code of codes) {
    const project = PROJECTS[code];
    const waiting = await waitingFor(project, inbound, robotAnswered);
    if (project.syncTag) taggable.push(...waiting);
    print(project, waiting, markdown, today);
  }

  if (syncTag) {
    // Reconcile against the projects actually scanned. With one project it would
    // strip the tag from every other project's waiting contacts, so refuse.
    if (!all) {
      console.error("--sync-tag needs --all, or it would remove the tag from the projects it did not scan.");
      process.exit(1);
    }
    const synced = Object.values(PROJECTS).filter((p) => p.syncTag).map((p) => p.name);
    console.log(`\nTagging ${synced.join(", ")} only. The rest run on Gmail relationships GHL cannot see.`);
    const failed = await syncNeedsReplyTag([...new Map(taggable.map((w) => [w.contactId, w])).values()], apply);
    if (failed > 0) {
      // A partial reconcile leaves the Smart List wrong in a way nobody can see
      // from GHL. Exit non-zero so a scheduler or a person notices.
      console.error(`\n${failed} tag write(s) failed: the needs-reply list is only partly reconciled. Re-run.`);
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
