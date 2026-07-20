# Producer re-engagement and Mighty drafts

Created 2026-06-27 from a read-only GHL and Gmail review.

Purpose: get every Harvest producer, maker, grower, and practical helper into one clean operating view, reply to the people still waiting on us, and invite only the right first cohort into Mighty.

## Verified snapshot

Checked with:

```bash
npm run audit:contacts:ghl
npm run desk:ghl
npm run report:mighty
npm run report:launch-gates:ghl
```

Current live signals:

| Signal | Count | Meaning |
| --- | ---: | --- |
| Harvest contacts | 273 | All Harvest-scoped contacts in GHL |
| `interest:markets` | 121 | Too broad. Includes members who ticked markets, not only producers |
| Harvest producer view | 34 | `project:act-hv` plus producer/shop signal |
| Explicit shop EOI / hard shop tags | 3 | Leeza, Serge, Catriona |
| `shop-follow-up` | 3 | Active shop follow-up set |
| `shop-stage-1` | 2 | Stage-2 detail still needed |
| `shop-call-booked` | 0 | No reliable shop-chat booking signal yet |
| Mighty visible members | 25 | Mighty is live, but not reconciled back to GHL yet |
| GHL Mighty mirror tags | 0 contacts using them | Tags exist, but no one has been mirrored yet |

Important finding: `role:supplier` is polluted by Goods supplier records in the shared GHL location. Never use `role:supplier` alone for the Harvest shop. Scope it with `project:act-hv`, shop tags, or the Shop pipeline.

Update 2026-06-29:

- Duplicate Mighty `Start Here` space removed. Kept `Start Here [24050197]`; deleted empty duplicate `[24050240]`.
- Suzie and Joey now exist as GHL users. The shop-chat calendar is assigned to them.
- `shop-call-booked` is still zero because there are no shop-chat appointments from 2026-06-01 to 2026-12-31, and the GHL appointment-tag workflow still needs to be built in the workflow UI.

## Rules

1. GHL is the source of truth for producer state.
2. Gmail can hold one-to-one replies, but the next action must be recorded back in GHL.
3. Do not bulk-invite producers into Mighty.
4. Do not use `interest:markets` as the whole producer list.
5. Do not add `platform:mighty-invited` until the personal invite is actually sent.
6. Do not add `platform:mighty-active` until the person has joined Mighty.
7. Do not automate anything for `lane:community`, elders, storytellers, or consent-sensitive relationships.

## One producer view

Create or use a GHL smart list named:

```text
Harvest - Producers and shop makers
```

Filter:

```text
project:act-hv
AND any of:
- shop-prospect
- shop-follow-up
- shop-stage-1
- shop-produce
- shop-maker
- shop-food
- shop-consignment
- shop-call-booked
- role:supplier
- source contains "Harvest | Shop"
- source contains "Website - Harvest Shop Interest"
```

Do not include plain `interest:markets` unless it is a second review list.

Create a second review-only smart list:

```text
Harvest - Markets interest, needs human read
```

Filter:

```text
project:act-hv
AND interest:markets
EXCLUDE shop-prospect
EXCLUDE shop-follow-up
EXCLUDE shop-stage-1
EXCLUDE role:supplier
EXCLUDE shop-produce
EXCLUDE shop-maker
EXCLUDE shop-food
EXCLUDE shop-consignment
```

Use that second list for humans to spot possible producers inside member comments. Do not treat it as a shop list.

## Producer states

Use these states in the Shop pipeline or, if the pipeline card is missing, as the contact's next-action note until the card is fixed.

| State | Meaning | GHL action |
| --- | --- | --- |
| New interest | They raised a hand, but no human reply yet | Reply, ask for stage-2 detail or chat |
| Needs reply | They need a personal answer | Owner + due date |
| Chat needed | They look keen enough for a call | Send shop-chat link or offer two times |
| In conversation | We have replied and are working detail | Move card, add next action |
| Stage-2 detail needed | Need product, timing, volume, food-safety, consignment fit | Ask the five questions |
| Shelf candidate | Product and timing look real | Start Square / label / food-safety handoff |
| Not now | Warm, but not for first shelf | Park with reason and date |

## Current action queue

### Reply now

These people have no personal reply visible in Gmail and only workflow/system messages in GHL.

| Person | Why | Next action |
| --- | --- | --- |
| Wendy Hawksworth | Member comment: "A welcoming space" | Reply warmly, ask if she wants garden/shop/workshop updates |
| Karl and Stephanie | Met at the Milk Crate Man, want low-key involvement and art ideas | Reply personally, invite art/workshop conversation |
| Rowena Blackburn | Garden, events, markets interest | Reply, offer garden next-step and markets list |
| Carolyn | Wants to know what is happening at the site | Reply with simple current state and one question |
| Craig Whiting | Regen ag, excess food, happy to lend a hand | Reply, ask what produce/help is real first |
| Serge | Shop EOI, made goods | Reply, ask stage-2 detail |
| Catriona Harding | Shop/contact interest, produce and cooking equipment context | Reply, ask what produce/equipment and best phone time |

### Handled, then invite

| Person | Evidence | Next action |
| --- | --- | --- |
| Leeza Stratford | Nicholas replied 2026-06-25 and Leeza replied back with permission/context | Invite to Mighty after the right first post is pinned in `The Shop Makers` |

## Draft replies

Use these in GHL Conversations where there is a GHL thread. Use Gmail only for true one-to-one maker outreach, then record a GHL note.

### Wendy

Subject if email is needed:

```text
The Harvest
```

Body:

```text
Hi Wendy,

Thanks for the note.

"A welcoming space" is the right measure for us. The place is still rough, but that is what we are trying to build: a garden, a table, and a few practical ways for neighbours to keep coming back.

Over the next few weeks we will be sorting the next garden days, shop shelf conversations, and a few small workshop ideas.

If one of those feels like your lane, reply with one word: garden, shop, workshop, or help.

Ben
The Harvest, Witta
```

### Karl and Stephanie

Subject:

```text
Good to meet you at The Harvest
```

Body:

```text
Hi Karl and Stephanie,

Lovely to meet you by the Milk Crate Man.

Low-key is a good way in. The place does not need people to perform interest at it. It needs people who can come close, notice what is there, and help shape the next small thing.

Art ideas are very welcome. We are slowly sorting the garden, the shop shelf, and the making/workshop side of the place.

If you are up for it, send me one or two lines on the kind of art or making you would like to see happen here. It can be rough.

We are also testing a small inside room for people who want to help shape the next version. I can send you an invite once I know where you would best fit.

Ben
The Harvest, Witta
```

### Rowena

Subject:

```text
Garden first
```

Body:

```text
Hi Rowena,

Thanks for putting your hand up.

Garden first feels right. The events and markets will grow from that, but the garden is the first place where people can come back and do something real with their hands.

We are sorting the next work days and the first simple shop-shelf conversations now.

If you want first notice on the garden side, reply with "garden" and I will keep you close to that thread.

Ben
The Harvest, Witta
```

### Carolyn

Subject:

```text
What is happening at The Harvest
```

Body:

```text
Hi Carolyn,

Thanks for joining the list.

The short version: The Harvest is a community garden and creative gathering place taking shape in Witta. The first pieces are the garden, the shop shelf for local growers and makers, and small work days where people can help shape the place.

It is not finished. That is the point.

We will send notes as the next dates are ready. If there is a particular lane you want to hear about first, reply with garden, shop, workshop, or help.

Ben
The Harvest, Witta
```

### Craig

Subject:

```text
Conondale, food, and hands
```

Body:

```text
Hi Craig,

Thanks for the generous note.

Regen ag, excess food, and a willingness to lend a hand are all very close to what The Harvest needs next.

Two possible lanes jump out.

One is garden and work days: hands in the soil, practical jobs, learning from each other.

The other is the shop shelf: a simple shared shelf for what people around Witta, Maleny, and Conondale grow or make.

What kind of excess food are you likely to have, and roughly when? No need for a polished answer. A rough sense is enough.

Ben
The Harvest, Witta
```

### Serge

Subject:

```text
Your shop note
```

Body:

```text
Hi Serge,

Thanks for putting in the shop note.

The robot sent the receipt, but a human should have followed it. Sorry that lagged.

We are shaping the first shelf now. It will start small: local produce, made goods, shelf-stable food, and things that can sit clearly under the maker's name.

Can you send me three quick details?

1. What would you like to put on the shelf?
2. When could you have the first small batch ready?
3. Is there any food-safety, storage, or packaging issue we should know about?

Once we have that, we can work out whether this is a quick chat or a later shelf.

Ben
The Harvest, Witta
```

### Catriona

Subject:

```text
Your Harvest shop note
```

Body:

```text
Hi Catriona,

Thanks for the shop note, and for the extra thought about cooking equipment.

I am sorry the human reply has taken longer than the receipt.

We are sorting the first version of the shop shelf now. It starts small: local produce, made goods, shelf-stable food, and useful things with a clear maker or grower behind them.

Could you send me the rough shape of what you had in mind?

- what you might grow or bring
- when it might be ready
- whether it needs fridge, packaging, or food-safety checks
- the best time to call if a quick conversation is easier

Ben
The Harvest, Witta
```

### Leeza Mighty invite

Send only after the right first post is pinned in `The Shop Makers`.

Subject:

```text
Come into the Harvest inside room
```

Body:

```text
Hi Leeza,

Thanks again for playing, creating, and letting us use the work.

We are testing a small inside room for The Harvest before we invite the wider list. It is where the practical things can stay close: maker questions, shelf ideas, materials, workshop thoughts, and the next useful thing to do.

Come in here:
[Mighty invite link]

Start with Start Here, then go to The Shop Makers.

No pressure to post a lot. One useful question or one small offer is enough.

Ben
The Harvest, Witta
```

## Producer re-engagement template

Use one-to-one. Personalise the first sentence. Do not send this as a blast.

Subject options:

```text
A shelf for what you make in Witta
The Harvest shop: room on the shelf?
A spot on the Witta shelf for [maker/product]?
```

Body:

```text
Hi [first name],

I am writing because of [your honey / your jewellery / your veg / the work you showed us].

We are opening the first version of the shop at The Harvest in Witta, on Jinibara Country. A shared shelf for what people around here grow and make.

The model is simple: consignment, maker keeps ownership until it sells, and when it sells the maker keeps about 75 to 80 percent. The shop keeps the rest for card fees and the work of running the shelf.

It will start small. Weekend windows first. Real names on the shelf. No fee to be part of it.

If you are interested, reply with what you would put on the shelf and roughly when you could start. A rough answer is fine.

Ben
The Harvest, Witta
```

## Mighty movement

Mighty is not the producer database. GHL is.

Mighty is the room for the first people who need to talk to each other.

Use this sequence:

1. Person replies or has a clear shop/garden/workshop signal.
2. Human reads the context.
3. GHL note records the intent.
4. GHL tag mirrors the lane:
   - `pod:shop-makers`
   - `pod:garden`
   - `pod:events`
   - `signal:help-offered`
   - `signal:asked-question`
5. Personal Mighty invite goes out.
6. Add `platform:mighty-invited`.
7. When they join, add `platform:mighty-active`.

First producer cohort target:

| Space | People | First action |
| --- | --- | --- |
| The Shop Makers | Leeza, Serge if yes, Catriona if yes, Rebecca, Monita, Lachie | Reply to "What are you making, growing, preserving, baking, or carrying?" |
| Garden Crew | Craig if yes, Rowena if yes | Reply to "What needs hands this week?" |
| Community Notice Board or Questions Wall | Karl and Stephanie if they want the art/workshop lane | Post one practical question or idea |

Do not invite everyone with `interest:markets`. Most of them only asked to hear about markets.

## Monday sweep

Do this in order.

1. Open `Harvest - Producers and shop makers`.
2. Work the explicit EOI set first: Leeza, Serge, Catriona.
3. Reply to the seven waiting people above.
4. For each reply, add a GHL note:

```text
2026-06-27 producer/Mighty sweep: personal reply sent. Next action: [reply / chat / Mighty invite / wait]. Owner: [name]. Due: [date].
```

5. Move or create the Shop pipeline card where there is real producer intent.
6. Only after the person replies, add `pod:*`, `signal:*`, or `platform:*`.
7. Read out loud:
   - active producers in conversation
   - chats needed
   - Mighty invites sent
   - shelf candidates

## Blockers

- The GHL API returned zero Shop pipeline opportunities in this check even though the Shop pipeline exists. Verify the GHL UI before assuming the board is empty.
- `shop-call-booked` is zero because there are no shop-chat appointments yet and the shop-chat booked workflow is missing.
- Fixed 2026-06-29: Suzie/Joey GHL users exist and the shop-chat calendar is assigned to them.
- Fixed 2026-06-29: duplicate Mighty `Start Here` space removed.
- Watch: Mighty still has missing/renamed expected spaces: `What's On`, `Questions Wall`, `Ask a Steward`.
- Exact consignment split still needs Standard Ledger confirmation before printing the final shop pledge percent.
