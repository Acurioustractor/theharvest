# Email deliverability strategy: getting GHL emails to the inbox

Written 2026-06-13. Goal: stop Harvest and ACT emails landing in junk, and give every send the best chance of the inbox.

## The short version

Junk vs inbox comes down to three levers, in order of impact.

1. **Authentication.** The receiving server must be able to prove the email really came from you. That means SPF, DKIM, and DMARC set up and aligned to the domain in your From address. This is the single biggest fix and the most common reason mail gets junked.
2. **Reputation.** The sending domain and IP build a track record over time. A brand-new or rarely-used domain has no reputation, so warm it up and send to people who actually open and reply first.
3. **Complaints and hygiene.** Keep spam complaints under 0.1%, give people an easy unsubscribe, and only mail people who asked to hear from you.

The five moves that matter for us, in order:

1. Set up a dedicated, authenticated sending domain in GoHighLevel (Mailgun under the hood), rather than sending through the shared LeadConnector domain.
2. Send Harvest member comms from a Harvest address, not act.place. Recipients recognise it, and it builds a Harvest-specific reputation.
3. Publish DMARC, starting at monitor-only.
4. Make the From address match the verified domain exactly, and keep a real reply-to.
5. Warm up: send to the ~80 engaged members first, keep the list clean, test every big send before it goes.

## Why this matters even at our size

The hard Gmail, Yahoo, and Microsoft rules apply to "bulk" senders, defined as more than 5,000 messages a day. We are well under that, so we are not bound by the strict bulk thresholds yet.

The trap is assuming that means we are fine. The receivers use the same authentication and reputation signals to place mail at every volume. An unauthenticated email from a small sender still gets junked. So we should meet the bulk standard now, while the list is small and easy to get right.

Current state of the rules:

- Google and Yahoo require SPF, DKIM, and DMARC for bulk senders, with the From domain aligned to SPF or DKIM, one-click unsubscribe, and a spam complaint rate under 0.3% (aim under 0.1%). These have been enforced and tightened through late 2025.
- Microsoft Outlook began enforcing the same for high-volume senders on 5 May 2025. Non-compliant mail is rejected outright with error 550 5.7.15, not just sent to junk.

## Recommended sender identity

Today we send from hi@act.place, and the Harvest sending domain is not verified. Two things to fix.

**Send from a Harvest address, on a dedicated subdomain.** For Harvest member comms, send from something like hello@theharvestwitta.com.au, with the actual sending handled on a dedicated subdomain such as send.theharvestwitta.com.au. Reasons:

- Recognition. Members trust an email from The Harvest more than from act.place. Recognition lowers complaints, which protects the inbox.
- Reputation isolation. A subdomain keeps marketing reputation separate from person-to-person mail. If a campaign ever draws complaints, it does not drag down your ability to reach someone from hi@act.place.
- Clean alignment. A purpose-built subdomain authenticates cleanly without touching the Google Workspace setup on the root domain.

Keep act.place for ACT parent comms, set up the same way on its own subdomain if and when needed. One GHL location can hold more than one verified sending domain, and you pick the From per send.

If you would rather not split brands yet, the fallback is to properly authenticate act.place and keep sending from there. It still works. It is just less recognisable to Harvest members and mixes reputations.

## The DNS records to add

GoHighLevel generates the exact values when you add a dedicated domain (the DKIM key and tracking host are unique to your account). The shape is always the same. On the sending subdomain you will add:

- **SPF** (TXT). Authorises Mailgun to send. Value: `v=spf1 include:mailgun.org ~all`
- **DKIM** (TXT). The signing key. GHL/Mailgun give you the exact selector and key, for example a record at `smtp._domainkey.send.theharvestwitta.com.au`. Paste their value verbatim.
- **Tracking** (CNAME). For open and click tracking, for example `email.send.theharvestwitta.com.au` pointing to a Mailgun host they specify.
- **MX** (two records) on the subdomain, for bounce handling: `mxa.mailgun.org` and `mxb.mailgun.org`.

Then, once, on the organisation domain:

- **DMARC** (TXT) at `_dmarc.theharvestwitta.com.au`. Start in monitor-only mode so nothing breaks while you watch the reports:

  `v=DMARC1; p=none; rua=mailto:dmarc@theharvestwitta.com.au; fo=1; adkim=r; aspf=r; pct=100`

  After two to four weeks of clean reports, tighten to `p=quarantine`, and later `p=reject`. You need a mailbox or a DMARC reporting service at the rua address to read the reports.

### Two footguns

- **Only one SPF record per domain.** If a domain already has an SPF record (act.place almost certainly does, for Google Workspace), do not add a second. Merge the includes into the one record, for example `v=spf1 include:_spf.google.com include:mailgun.org ~all`. Two SPF records is an automatic fail. Using a dedicated subdomain sidesteps this, because the subdomain gets its own clean SPF.
- **The From address must match the verified domain.** If DKIM and SPF verify `send.theharvestwitta.com.au` but you send From `hi@act.place`, DMARC alignment fails. Match them.

## GoHighLevel setup steps

1. In the A Curious Tractor sub-account, go to Settings, then Email Services, then Dedicated Domain (the dedicated sending domain / DNS flow).
2. Add the subdomain (for example `send.theharvestwitta.com.au`).
3. GHL shows the exact SPF, DKIM, tracking CNAME, and MX records. Add them in the DNS host for theharvestwitta.com.au.
4. Add the DMARC record on the root domain as above.
5. Back in GHL, click verify. It can take from minutes to a few hours for DNS to propagate.
6. Set the default From name and address to the Harvest identity, with a real reply-to that a human checks.

Note: GoHighLevel's shared LeadConnector domain does not strictly require DMARC, because mail goes out on their shared domain. That is the path that gets you junked, because you are borrowing a shared reputation and your branding does not align. The dedicated domain is the fix.

## Warm-up, list, and content

- **Warm up gradually.** A new sending domain has no reputation. Start with your most engaged people. The ~80 members who opted in and will open and reply are the ideal first audience. Grow volume over a couple of weeks rather than blasting a big list on day one.
- **Only mail people who asked.** Members opted in, so consent is clean. Do not import cold lists onto this domain.
- **Keep complaints low.** Make the unsubscribe obvious, honour it immediately, and do not mail people who have gone quiet for months.
- **Content hygiene.** Avoid all-caps or heavy punctuation in subject lines, keep a sensible text-to-link ratio, include a plain-text version (GHL does this), and include your real-world contact details in the footer.
- **Australian Spam Act 2003.** For Australian senders the law requires consent, clear sender identification, and a working unsubscribe. We meet all three with an opted-in member list and the GHL unsubscribe footer. Keep it that way.

## How to verify (current state and after setup)

I could not read your live DNS from this environment, so here is how to check it. Run these in Terminal on your Mac:

```
dig +short TXT act.place
dig +short TXT _dmarc.act.place
dig +short MX act.place
dig +short TXT theharvestwitta.com.au
dig +short TXT _dmarc.theharvestwitta.com.au
dig +short MX theharvestwitta.com.au
```

Then the two tools that matter:

- **mxtoolbox.com** to confirm SPF, DKIM, and DMARC resolve correctly.
- **mail-tester.com** before any real send: send the campaign to the address it gives you, and it scores authentication and content out of 10. Aim for 10/10.

I can also read the live records for you through the browser and tell you exactly what is missing, then walk the GHL dedicated-domain setup step by step.
