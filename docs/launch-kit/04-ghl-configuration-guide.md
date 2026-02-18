# Go High Level Configuration Guide — The Harvest

Step-by-step setup for pipelines, workflows, smart lists, and automations in GHL.

---

## 1. Pipelines

### Pipeline: Community
Tracks general community engagement from first contact to champion.

| Stage | Description | Trigger |
|-------|-------------|---------|
| **New** | Just signed up / submitted something | Auto: new contact created |
| **Engaged** | Opened emails, clicked links, attended event | Auto: email engagement or event check-in |
| **Connected** | Regular participant, knows people | Manual move |
| **Champion** | Advocates, brings others, contributes | Manual move |

**Setup in GHL:**
1. Go to Opportunities → Pipelines → Create Pipeline
2. Name: "Community"
3. Add stages: New, Engaged, Connected, Champion
4. Set "New" as default stage

### Pipeline: Residency
Tracks residency applications through the process.

| Stage | Description |
|-------|-------------|
| **Applied** | Application received |
| **Reviewing** | Team is reviewing |
| **Interview** | Scheduled conversation |
| **Accepted** | Confirmed residency |
| **Waitlisted** | Good fit, no current slot |
| **In Residence** | Currently on site |
| **Alumni** | Completed residency |

### Pipeline: Business Partners
Tracks local business relationships.

| Stage | Description |
|-------|-------------|
| **Interested** | Expressed interest / signed up for info session |
| **Info Session** | Attended or scheduled |
| **In Discussion** | Active conversation about partnership |
| **Partner** | Active partnership |

---

## 2. Smart Lists

Create these smart lists for segmented communication:

| List Name | Filter Criteria |
|-----------|----------------|
| **Newsletter Subscribers** | Tag contains `newsletter` |
| **Website Signups** | Tag contains `website-signup` |
| **Event Interested** | Tag contains `interest-events` |
| **Workshop Interested** | Tag contains `interest-workshops` |
| **Food & Kitchen** | Tag contains `interest-food` |
| **Market Interested** | Tag contains `interest-markets` |
| **Community Minded** | Tag contains `interest-community` |
| **Volunteers** | Tag contains `interest-volunteer` |
| **Garden & Sustainability** | Tag contains `interest-garden` OR `interest-sustainability` |
| **Residency Applicants** | Tag contains `residency-applicant` |
| **Business Contacts** | Tag contains `business-interest` |
| **Story Contributors** | Tag contains `story-feature` |
| **Idea Submitters** | Tag contains `community-idea` |

**Setup:** Contacts → Smart Lists → Create List → Add filters by tag.

---

## 3. Workflows (Automations)

### Workflow: Welcome Sequence
**Trigger:** Tag added = `website-signup`
**Actions:** 5-email drip sequence (see `02-welcome-drip-sequence.md`)
**Exit:** Tag `welcome-complete` added OR contact unsubscribes

### Workflow: Residency Application Received
**Trigger:** Tag added = `residency-applicant`
**Actions:**
1. Send confirmation email: "We've received your application"
2. Wait 1 day
3. Internal notification to team (email or Slack)
4. Create opportunity in Residency pipeline, stage: Applied
5. Add tag `residency-notified`

**Confirmation email content:**
> Subject: We got your application
>
> Thanks for applying, {{contact.first_name}}. We've received your residency application and our team will review it within the next two weeks. We'll be in touch to set up a conversation.
>
> In the meantime, read more about what we're building: [The Compendium](https://theharvestwitta.com.au/compendium)

### Workflow: Business Interest Received
**Trigger:** Tag added = `business-interest`
**Actions:**
1. Send confirmation email: "Thanks for your interest"
2. Create opportunity in Business Partners pipeline, stage: Interested
3. Internal notification
4. Wait 3 days
5. If no manual contact made → send follow-up with info session dates

### Workflow: Idea Submitted
**Trigger:** Tag added = `community-idea`
**Actions:**
1. Send thank-you email: "Your idea is on the board"
2. Internal notification
3. Add to task list for weekly review

**Thank-you email content:**
> Subject: Your idea is on the board
>
> Hey {{contact.first_name}},
>
> Thanks for sharing your idea with us. Every good thing at The Harvest starts with someone saying "what if we..." — and you just did that.
>
> We review ideas weekly and we'll get back to you if we want to explore it further. Even if we can't action it right now, it goes into the pot. The good ones have a way of surfacing.
>
> The Harvest Team

### Workflow: Event Reminder
**Trigger:** Opportunity stage moved to "Registered" in Events pipeline (future)
**Actions:**
1. Send confirmation: "You're registered"
2. Wait until 2 days before event → send reminder
3. Wait until day after event → send feedback request
4. Add tag `event-attended`

### Workflow: Re-engagement
**Trigger:** Contact has not opened email in 60 days
**Conditions:** Tag contains `newsletter`, does NOT contain `do-not-reengage`
**Actions:**
1. Send re-engagement email: "Still with us?"
2. Wait 7 days
3. If opened → add tag `re-engaged`
4. If not opened → add tag `inactive`

**Re-engagement email content:**
> Subject: Still with us?
>
> Hey {{contact.first_name}},
>
> We noticed it's been a while since you opened one of our emails. No hard feelings — inboxes are busy places.
>
> Here's what's been happening at The Harvest:
> - [Latest update or event]
> - [New story or feature]
> - [Upcoming opportunity]
>
> If you'd rather not hear from us, no worries — just unsubscribe below. Otherwise, we'll keep sharing what's growing.
>
> The Harvest Team

---

## 4. Contact Tags Strategy

### Source Tags (auto-applied)
- `newsletter` — subscribed to newsletter
- `website-signup` — signed up via website
- `contact-form` — used contact form
- `website-submission` — submitted any form

### Interest Tags (from InterestSelector)
- `interest-events`
- `interest-workshops`
- `interest-markets`
- `interest-venue`
- `interest-garden`
- `interest-food`
- `interest-community`
- `interest-volunteer`
- `interest-membership`
- `interest-sustainability`

### Engagement Tags (from community-submit)
- `residency-applicant` + `residency-{type}`
- `community-idea` + `idea-{type}`
- `business-interest` + `biz-{type}`
- `workshop-suggestion`
- `story-feature`

### Lifecycle Tags (workflow-applied)
- `welcome-complete` — finished welcome sequence
- `re-engaged` — came back from inactive
- `inactive` — hasn't engaged in 60+ days
- `event-attended` — attended at least one event

---

## 5. Social Media Setup

### Connect Accounts
1. GHL → Marketing → Social Planner → Settings
2. Connect: Facebook Page, Instagram Business, Google Business Profile
3. Set default posting times (see `03-social-media-posts.md`)

### Recurring Content Calendar
| Day | Content Type | Source |
|-----|-------------|--------|
| Tuesday | Community news / updates | Team |
| Thursday | Local business feature | `enterprises.json` data |
| Saturday | Community story / spotlight | Stories page / submissions |
| As needed | Event announcements | Events data |

### Automation Ideas
- When a new story is published on the site → draft a social post (manual approval)
- When a new event is approved → create social post for 1 week before
- Monthly: auto-generate "This month at The Harvest" summary post draft

---

## 6. Reporting Dashboard

### Key Metrics to Track
1. **New contacts per week** (by source)
2. **Welcome sequence completion rate**
3. **Interest tag distribution** (what are people most interested in?)
4. **Residency applications per month**
5. **Business interest submissions**
6. **Email open rate** (benchmark: 25%+)
7. **Event registration → attendance rate**

### Setup in GHL
1. Dashboard → Reporting → Custom Dashboard
2. Add widgets for:
   - Contact growth (line chart, weekly)
   - Tag distribution (pie chart)
   - Pipeline stage counts (funnel)
   - Email performance (open/click rates)

---

## 7. Environment Variables Required

These must be set in Supabase Edge Function secrets:

```
GHL_API_KEY=<your GHL API key>
GHL_LOCATION_ID=<your GHL location ID>
```

Current location ID (from webhook handler): `agzsSZWgovjwgpcoASWG`

### To set secrets:
```bash
supabase secrets set GHL_API_KEY=<key>
supabase secrets set GHL_LOCATION_ID=<location_id>
```

---

## 8. Webhook Configuration

### GHL → Supabase webhook
1. In GHL: Settings → Webhooks → Add Webhook
2. URL: `https://tednluwflfhxyucgwigh.supabase.co/functions/v1/ghl-webhook`
3. Events to subscribe:
   - Contact Created
   - Contact Updated
   - Contact Deleted
   - Opportunity Created
   - Opportunity Updated
   - Opportunity Stage Changed

This enables bidirectional sync — contacts created on the website flow to GHL, and changes in GHL flow back to Supabase for the admin dashboard.
