# GHL build sheet: 20 June, one workflow at a time

> The simple checklist for building the launch workflows in the GHL UI. Reconciled to the public
> open day (`RECONCILED-20-june-public-open-day-2026-06-03.md`). Location `agzsSZWgovjwgpcoASWG`.
> Build top to bottom. Each one is: trigger, filter, the tags it adds, publish, test. That's it.
>
> Only these 5 need building. Everything else (newsletter, shop EOI, contact form, quiz, pulse)
> already tags via the website code and existing workflows. Do not rebuild those.
>
> **Philosophy lock (orbit model, see `harvest-audience-map-2026-06-03.md`):** these workflows
> **tag only, they never climb anyone.** An RSVP is not a rung. The public stays curious; people
> enter the Membership Journey by *doing*, hand-read after the day. Never drip a `lane:community`
> contact. The system catches energy; a human reads it.

## The tags these workflows use (type them exactly)

| Tag | Means | Set by |
|---|---|---|
| `witta-gathering-2026-06-20` | came to / RSVP'd for 20 June (any way in) | every RSVP path |
| `rsvp-maker-morning` | booked the maker session | workflow 1 |
| `rsvp-pizza-dinner` | **the dough count** (public + members) | workflows 2 + 4 |
| `interest:markets` | wants to talk shop shelf | workflows 3 + 5 |
| `shop-call-booked` | booked a shop chat | workflow 3 |
| `shop-nurture-sent` | got the shop follow-up | workflow 5 |

Shop routing tags (already on contacts from the EOI): `project:act-hv`, `role:supplier`,
`interest:markets`, `shop-follow-up`, plus offer branch tags `shop-produce`, `shop-maker`,
`shop-food`, and `shop-consignment`. Full tag library: `harvest-ghl-tag-and-automation-map.md`.

Hard rule on every workflow below: **never add `harvest-member` or `harvest-newsletter`.** An RSVP is not a subscribe.

---

## 1. Maker session RSVP  →  tags
- **Trigger:** Customer Booked Appointment
- **Filter:** Calendar is `RSVP: Maker session, Sat 20 June` (`M0KzSu7Bo3jJ3ZQta3ag`)
- **Action:** Add Tag `witta-gathering-2026-06-20`
- **Action:** Add Tag `rsvp-maker-morning`
- **Settings:** Re-entry OFF
- **Then:** Publish → test-book once → check the contact has both tags → `npm run count:rsvps:ghl`
- [ ] built   [ ] tested

## 2. Afternoon + pizza RSVP  →  tags  (members' RSVP path)
- **Trigger:** Customer Booked Appointment
- **Filter:** Calendar is `RSVP: Afternoon + pizza, Sat 20 June` (`4IpU9GnzAChTMkKFJPWi`)
- **Action:** Add Tag `witta-gathering-2026-06-20`
- **Action:** Add Tag `rsvp-pizza-dinner`
- **Settings:** Re-entry OFF
- **Then:** Publish → test-book once → check both tags → `npm run count:rsvps:ghl`
- [ ] built   [ ] tested

## 3. Shop chat booked  →  tags
- **Trigger:** Customer Booked Appointment
- **Filter:** Calendar is `Book a chat about the shop` (`viM1BRnHG9gwpIEZd4HM`)
- **Action:** Add Tag `project:act-hv`
- **Action:** Add Tag `interest:markets`
- **Action:** Add Tag `shop-call-booked`
- **Settings:** Re-entry OFF
- **Then:** Publish → test-book once → check both tags
- [ ] built   [ ] tested

## 4. "I'm coming" trigger link  →  tags  (the PUBLIC RSVP)
First build the link: Marketing → Trigger Links → add `Pizza RSVP — I'm coming (20 June public)`,
redirect `https://www.theharvestwitta.com.au/june-20`. Then the workflow:
- **Trigger:** Trigger Link Clicked → the link above
- **Action:** Add Tag `rsvp-pizza-dinner`
- **Action:** Add Tag `witta-gathering-2026-06-20`
- **Settings:** Re-entry OFF
- **Then:** Publish → set `VITE_GHL_IM_COMING_URL` to the trigger-link URL → deploy → click it yourself → check both tags → `npm run count:rsvps:ghl` → remove the test tag
- [ ] link built   [ ] workflow built   [ ] env set   [ ] tested

> Why both 2 and 4 add `rsvp-pizza-dinner`: members book via calendar (2), public taps the link (4),
> both land on the same tag, so the dough count is one number from two doors. Do not put the calendar
> link on the public page.

## 5. Shop nurture  (not launch-gating, build after if short on time)
- **Trigger:** Contact Tag added `interest:markets`
- **Filter (community line, do not skip):** exclude anyone tagged `lane:community`. A drip must never reach a storyteller, elder, or community contact.
- **Action:** Wait 4 days
- **Action:** If/Else by offer tag (`shop-produce` / `shop-maker` / `shop-food` / `shop-consignment`)
- **Action:** Send the matching shop email (copy in `ghl-workflow-build-specs.md` spec 6)
- **Action:** Add Tag `shop-nurture-sent`
- **Settings:** Re-entry OFF
- **Then:** Publish → test with a dummy `interest:markets` contact
- [ ] built   [ ] tested

---

## Already built, do NOT rebuild
Newsletter signup, membership, member question, shop EOI, contact form, event/business/workshop
submissions, pulse, quiz, photo wall: these tag via website code + existing workflows (the env-var
enrolment in `harvest-ghl-tag-and-automation-map.md` § Flow Tags). The 20 June website RSVP handler
exists but is intentionally disabled; the trigger link (workflow 4) is the public RSVP instead.

## When all 5 are green
The pizza dough count is `rsvp-pizza-dinner`. Watch it through launch week: `npm run count:rsvps:ghl`.
