# Privacy policy review — 9 October 2026

Prepared in the project for review; this is not legal certification. **T02 update, 12 October 2026:** the source audit found the earlier integration claim was false; T02 now connects normal and review builds to the same policy renderer. That source fix is not evidence of publication, provider settings or operational adoption. See [architecture task status](../architecture/TASKS.md#t02--one-explicit-privacy-rendering-path).

## Source and review

`src/pages/privacy-policy.mjs` is authoritative for normal/review rendering. Nine statements/28 clauses and `/privacy-policy/` are preserved for Follent. The duplicated HTML snapshot is retired; inspect generated normal/review HTML instead. Config selects `follent` content or the editable `client` draft and supplies contact/retention. Follent's retained settings remain active; approval flags and integration IDs were not changed. The central retention wording now uses the latest owner-confirmed reasonably-needed/CRM-up-to-seven-years/backup-expiry wording already present in the numbered draft, avoiding the old config promise of automatic deletion.

Run `node docs/privacy-policy/preview.mjs`, then `node scripts/serve.mjs --dir .qa/privacy-review --port 4173`. Review `http://127.0.0.1:4173/privacy-policy/`. The generator now builds the normal renderer directly with disabled forms/Analytics, noindex and an empty sitemap. Do not upload it. Normal Growth has the same numbered policy, configured retention/contact and Analytics preference control; preview text explicitly states disabled services.

## Confirmed facts and limits

- Owner confirms Microsoft-hosted privacy@follent.net and james@follent.net, both monitored, with MFA for email access. No test email was sent.
- Owner confirms self-hosted open-source Twenty CRM, retaining enquiry records as reasonably needed for future business activities up to seven years. This is not Twenty cloud hosting or blanket marketing consent. Hosting location and administrators remain unknown.
- Backups remain until expiry, as previously confirmed by the owner. Expiry schedules and deletion/de-identification procedures remain unverified. Public wording separates retention from deletion requests and avoids an unrestricted deletion promise.
- [ABN Lookup](https://abr.business.gov.au/ABN/View?abn=26510530608), inspected in Chrome on 9 October, confirms active ABN 26 510 530 608, FOLLENT, JAMES ROBERT JACK, Individual/Sole Trader. The existing ABN is retained; a registered business name is not a different operator.
- Configuration enables Growth Formspark endpoint aHeuOMHHg, Formtrack and optional GA4 G-K54S78JQ7L in normal builds. No Turnstile key is configured. Preview safeguards remain. Local configuration does not prove deployed settings.
- [Earlier form evidence](../form-e2e/REPORT.md) distinguishes HTTP acceptance, stored records and owner-confirmed receipt of all three synthetic notifications at james@follent.net. A Google-hosted member notification inbox was also inspected. Records were retained. This revision sends no new live submissions.

## Sources

Reviewed the [OAIC policy guide](https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/guide-to-developing-an-app-privacy-policy), [APP 1 guidance](https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-1-app-1-open-and-transparent-management-of-personal-information), [APP text](https://www.oaic.gov.au/privacy/australian-privacy-principles/read-the-australian-privacy-principles) and [small-business guidance](https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/small-business). The guide was read earlier; a later fetch failed. Under-$3m turnover alone does not establish exemption. Exceptions and any formal opt-in need assessment. The owner chooses APP-informed good practice; the policy makes no exemption, formal opt-in or full-compliance claim.

Provider sources: [Formspark privacy](https://www.formspark.io/legal/privacy-policy/) and [subprocessors](https://www.formspark.io/legal/subprocessors/), [Cloudflare](https://www.cloudflare.com/policies/privacy/), [GitHub](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement), [Microsoft](https://www.microsoft.com/en-us/privacy/privacystatement), [Google](https://policies.google.com/privacy?hl=en). Published locations include Formspark Ireland/Germany and optional US spam screening, Cloudflare US/EEA/global, GitHub and Microsoft US/other operational countries, and Google worldwide servers. These do not establish tenant/CRM geography or every request route. Headquarters are not treated as storage locations. GitHub supports source/deployment and does not receive form contents.

## APP 1 review matrix

Requirements apply legally where the APPs apply; this is also a voluntary review framework. Covered means addressed in proposed copy, not verified operational compliance.

| Item | Status | Evidence / remaining check |
| --- | --- | --- |
| APP 1.3: clear, current policy | Covered | Operator, scope, revision date and actual features described; maintain ongoing review. |
| APP 1.4(a): kinds collected/held | Covered | 2.1–2.3, 3.1 and 5.1–5.3: email, form, CRM, technical data. |
| APP 1.4(b): collection/holding | Needs owner confirmation | Sections 2–3; CRM host, device safeguards and deletion procedure unknown. |
| APP 1.4(c): purposes | Covered | 4.1–4.3: enquiries, proposals, agreed services, relevant business relationships and privacy requests. |
| APP 1.4(d): access/correction | Needs owner confirmation | 7.1–7.2: contact and proportionate checks; adopt retrieval/correction procedure across copies. |
| APP 1.4(e): complaints | Needs owner confirmation | 8.1–8.3: acknowledgement/review/response and OAIC jurisdiction; adopt operational procedure. |
| APP 1.4(f): overseas disclosure | Covered | Section 6 explains possible overseas handling. |
| APP 1.4(g): countries where practicable | Needs owner confirmation | Published countries provided; tenant, CRM and backup locations unverified. |
| APP 1.5: free/appropriate availability | Covered | Static page, footer/form links, no-JS and print; deployed availability unverified. |
| APP 1.6: requested format | Needs owner confirmation | 8.4 offers reasonable alternatives; confirm operational ability. |

No item is declared not applicable based solely on turnover. Remaining evidence gaps stay in these notes, not as public placeholders.

## Owner checks before publication

1. Identify Twenty host, storage/access/backup countries and administrators; verify Microsoft tenant geography and current notification routing.
2. Confirm device locks/encryption and CRM authentication/access. Only confirmed email MFA is stated publicly.
3. Establish retention review, deletion/de-identification and backup expiry steps across Formspark, Microsoft/Google mail and Twenty; confirm request, complaint and alternate-format procedures.
4. Assess Privacy Act coverage/exceptions and review the policy against eventual deployed settings. Existing approval flags do not certify this revised draft.

## Verification

Six Node tests pass; build produces ten pages, output checks report zero failures. Existing mocked browser QA passes 40 responsive checks with no axe violations and eight behaviour scenarios. Dedicated policy QA passes 320/390/768/1440px without overflow or axe violations: exact operator wording, 28 clauses, contents/footer links, keyboard skip link, no-JS navigation and preview form safeguards. No external requests or browser errors occur in the review. Print retains all sections and produces an A4 review PDF.

Local evidence: `.qa/privacy-policy-results.json`, `.qa/browser-results.json`, `.qa/screenshots/privacy-policy-*.png`, `.qa/privacy-policy-print.pdf`. Automated checks do not establish legal compliance, deployed delivery, real-device/screen-reader behaviour or adoption of the proposed operational commitments. No deployment, launch, DNS change or new integration activation was performed.

Privacy-page HTML validation passes. Full-site HTML validation reports one Contact-page `unique-landmark` issue, separate from this policy revision. Mobile and print screenshots were inspected. **Superseded by T09, 12 October 2026:** the Contact sidebar now has an accessible name and normal Contact HTML validation passes; the earlier policy-revision result remains historical evidence.
