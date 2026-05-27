# Email Operating System

> Status: living reference. Created 2026-05-28.
> The rules for sending email at The Harvest without sending the wrong thing to the wrong people. This is the "how", and it is the thing the team lives by. The tag mechanics live in `harvest-ghl-tag-and-automation-map.md`, the welcome-email copy in `ghl-workflow-build-specs.md`, and the broadcast copy in `content-calendar-june-2026.md`. This doc does not repeat those. It is the rules of the road that sit over them.

## The one rule that prevents disasters

There are two kinds of email, and they must never be confused.

1. **Automated welcomes (Workflows).** Fire once, automatically, the moment someone joins a list. One per list. Set up once, then left alone.
2. **Broadcasts (Campaigns).** You manually send a specific email to a specific list at a specific time. They do not auto-fire.

The trap: **adding a tag is what triggers a workflow.** So the cardinal rule is that **sending a broadcast must never add a tag.** Press send to a list; do not tag people as part of sending. If you keep welcomes (workflows) and broadcasts (campaigns) separate, you cannot accidentally spam anyone.

Field Notes, Harvest Notes, the Makers' invite are all **broadcasts**. The follow welcome and member welcome are **workflows**.

## The three lists

| List | Tag (the only way in) | GHL smart list | Auto-welcome (workflow, fires once) | Broadcasts (you send) |
| --- | --- | --- | --- | --- |
| **Newsletter** (follow along) | `harvest-newsletter`, via the footer follow form | The Harvest / followers | Follow Welcome (live, `GHL_NEWSLETTER_WORKFLOW_ID`) | Field Notes (public story) |
| **Members** | `harvest-member`, via the `/membership` join form only | Harvest Members | Member Welcome (live, `GHL_MEMBER_WELCOME_WORKFLOW_ID`) | Harvest Notes (members first) |
| **Shop** | `harvest-shop-interest`, via the `/shop` form | Shop | Shop nurture (spec 6, not built yet) | shop updates |

A person can be on more than one list. The lists are tags, not folders, so someone can be a follower and a member and a shop maker at once. Send to the list that fits the message.

## The guardrails to live by

- **The only door into `harvest-member` is the join form.** The footer is a follow-along now (it sets `member: false`), so followers never silently become members. Known wrinkle: the server logic also grants `harvest-member` when a form's interests include "membership" (`buildNewsletterTags`, `server/routers.ts`), so keep "membership" off the interest pick-lists on follow and contact forms. The deliberate join form is the intended door.
- **A broadcast goes to one named smart list, never "All".** Members-only content goes to the Harvest Members list only.
- **Check the contact count before you send.** If the number looks wrong, stop and find out why before sending.
- **Welcome workflows have re-entry off**, so nobody is welcomed twice.
- **Always test-send to yourself first.** Check the rendering, every link, and the From address.
- **An RSVP or event signup never auto-subscribes anyone to the newsletter.** An event yes is not a subscribe. Invite event guests to follow in the after-story, by choice.

## The safe broadcast checklist

Every time you send a Field Note or Harvest Note:

1. Build it as a one-off **Campaign** in `Marketing -> Emails`, not a workflow.
2. Set the audience to **one smart list**. Read the contact count out loud.
3. Confirm the **From address** is a Harvest address (see the open item below).
4. Paste the copy from the content calendar. Do not add or remove tags as part of the send.
5. **Test-send to yourself.** Open it on a phone. Click every link.
6. Schedule or send.

Open item: Harvest welcomes and sends currently go from `hi@act.place`, the shared location default, not a Harvest address. To send from a Harvest address, verify the domain as a GHL sending domain and set it in each workflow and campaign. Worth fixing before the first members-first broadcast.

## Worked example: Harvest Note 02 to members

The members-first "you hear the 20 June date first" email, scheduled 9 June.

1. It is a **broadcast**. Build it as a one-off Campaign, not a workflow.
2. Audience: the **Harvest Members** smart list. Nothing else.
3. Copy is ready in `content-calendar-june-2026.md`.
4. **Blocker:** the email contains the afternoon-plus-pizza RSVP link, which does not exist until the B2 Class Booking calendar is built (see `ghl-setup-runbook.md` Part 0 B). So this send is gated on the calendar work.
5. Fix the From address first (above).
6. Test-send to yourself, then schedule for 9 June.

## How events layer on top

Once the three lists and the send-system are solid, events sit cleanly over them:

- An event is an **RSVP calendar (Class Booking) plus an event tag** (for example `witta-gathering-2026-06-20`, `rsvp-maker-morning`, `rsvp-pizza-dinner`). See the Calendar Booking Tags section of the tag map.
- **Invites are broadcasts** to the right segment (the Makers' invite to makers and doers; Harvest Note 02 to members).
- The calendar's own **confirmation and day-before reminder** are its automated messages, set per event. They are separate from the welcome workflows.
- An RSVP **never** auto-subscribes the person to the newsletter.

So the order holds: get the three lists and the send-system right first, then events are just broadcasts plus a calendar, and they stay safe.
