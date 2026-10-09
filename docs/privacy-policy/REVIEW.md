# Follent.net privacy policy review — 9 October 2026

**Unpublished, incomplete draft. No deployment authorised or performed.** This is a factual and checklist review, not legal certification. Material gaps remain. The proposed public wording is in [policy.html](policy.html); this document contains the evidence, validation and owner questions separately.

## Read and preview

```sh
node docs/privacy-policy/preview.mjs
node scripts/serve.mjs --dir .qa/privacy-review --port 4173
```

Open `http://127.0.0.1:4173/privacy-policy/`. Stop any other server on that port first. The draft uses the existing document layout, fonts, colours, paragraph width, navigation and focus styles. Contents links and numbered clauses are ordinary HTML and work without JavaScript.

This separate generator writes only `.qa/privacy-review`, using the engine's protected build output path. Normal `npm run build` does **not** include the rewrite. Preview forms and analytics are disabled, every page is noindex, robots disallows crawling and the review sitemap has no URLs. These are indexing controls, not authentication: keep this local; do not upload it to a public preview host. There is no production activation switch in this task.

The page slug is `privacy-policy`, preserving the live historical `/privacy-policy/` URL. Normal and review builds use that address, including footer/form links, canonical metadata, sitemap generation and Essential package selection. The former unpublished repository route `/privacy/` has been replaced at the owner's request. No production redirect was added. The review generator replaces the brief notice only in its local output; a later approved content integration should retain the established route.

## Evidence and limits

Sources were consulted on 9 October 2026. Provider statements describe published services, not an audit of this account. No credentials, private submissions or provider dashboards were accessed. No enquiry, email or notification test was sent.

| ID | Evidence | What it establishes |
| --- | --- | --- |
| E1 | [Historical Follent policy](https://follent.net/privacy-policy/) | Retrieved page contains WordPress-style text and a shop/cart header. Its statements are historical, not proof that those features currently work. |
| E2 | [IJM Australia reference](https://ijm.org.au/privacy-policy/) | The accessible trailing-slash version contains numbered sections and clauses. Used for organisation only. The no-slash URL returned 403; the accessible version is an older indexed rendering. The additional Purpose, Approach, Context & Authority and Policy Statement headings follow the user's requested format. No IJM business practices or wording were copied. |
| E3 | [OAIC policy guide](https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/more-guidance/guide-to-developing-an-app-privacy-policy) | Content and usability checklist; distinguishes a policy from collection notices. |
| E4 | [APP text](https://www.oaic.gov.au/privacy/australian-privacy-principles/read-the-australian-privacy-principles) and [APP 1 guidelines](https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-1-app-1-open-and-transparent-management-of-personal-information) | Basis for the clause-by-clause matrix below. |
| E5 | [OAIC small-business guidance](https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/small-business) | Turnover alone does not settle coverage; exceptions and formal opt-in need assessment. |
| E6 | [Formspark policy](https://www.formspark.io/legal/privacy-policy/) and [subprocessors](https://www.formspark.io/legal/subprocessors/) | Published handling, retention and countries; both state an effective date of 22 August 2026. See the provider assessment below. |
| E7 | [Formspark Formtrack documentation](https://documentation.formspark.io/integration/utm-parameters.html) | Attribution library purpose; exact local field and loading behaviour checked against source and existing tests. |
| E8 | [OAIC complaint guidance](https://www.oaic.gov.au/privacy/privacy-complaints/lodge-a-privacy-complaint-with-us) | External complaint route, subject to jurisdiction and eligibility. No invented Follent complaint deadline. |
| E9 | Owner's reply in this task | Entity name FOLLENT, JAMES ROBERT JACK; ABN 26 510 530 608; privacy@follent.net; under $3 million turnover; best-practice intent. Not an independent ABR lookup, mailbox-delivery check or proof of formal opt-in. |
| E10 | `config/site.json`, `scripts/build.mjs`, `src/pages/content.mjs`, `src/layouts/document.mjs`, `assets/js/{site,form,form-provider,analytics}.js`, README and client setup documents | Replacement-site architecture, fields, feature gates and generated behaviour. Does not establish off-site business practices or live-domain deployment. |

The live homepage could not be retrieved reliably in this review. Browser execution, network/cookie behaviour, account access, purchases and provider delivery on the old live site were not verified. The draft describes the replacement business-services site in this repository; it must not be placed over the old live site's policy while that site's different data flows remain in use. No old records were inspected, migrated or deleted.

### Operator and statutory coverage

The central configuration records the owner's supplied legal name, ABN and privacy address. The policy uses the owner's exact requested opening: “Follent.net is operated by James Follent. In this Privacy Policy, ‘we’, ‘us’ and ‘our’ refer to James Follent.” Its scope is Follent.net only. The policy body omits the ABN; the shared footer/schema retain the ABN the owner supplied as belonging to the current operator. An independent ABR lookup was attempted but could not be retrieved. No other business or proposed company is identified as operator. Both privacy approval and launch approval flags remain false; retention remains empty.

The owner reports turnover below $3 million and wishes to follow best practice. E5 describes a small-business exemption with exceptions, including certain health services, personal-information trading, Commonwealth contracting, related covered bodies and other specified activities. Formal opt-in is another route to coverage. Neither an exemption nor statutory coverage can be concluded without checking these facts. Voluntary best-practice wording is not a formal opt-in application. The draft makes no assertion of full compliance, exemption or statutory coverage. Confirm any binding APP code and applicable external dispute scheme before publication.

### Current replacement-site data flows

| Feature | Verified repository state | Boundary or unresolved fact |
| --- | --- | --- |
| Operator/privacy contact | Owner-supplied details recorded centrally | Verify mailbox receives requests; no assumed postal address, company or privacy officer. |
| Native enquiry form | Growth; Formspark HTTPS endpoint supplied; privacy approval false; retention empty; HTML fieldset disabled | Configured is not active. Neither default nor review build can submit. The endpoint's ownership and dashboard setup were not checked. |
| Form fields | Required: `name`, `email`, `message`, `consent=yes`. Optional: `business_name`, `phone`, `website`, `need`, `package`, `timeline` | Hidden/disabled empty website field is omitted for a new website. No upload or payment fields. |
| Additional submitted fields | Native: `_gotcha`, `_redirect`, `_error`, `_append=false`; enhanced transport removes redirect controls, keeps honeypot and attribution | Separate success/error paths; response acceptance alone does not prove email delivery. Enhanced requests omit credentials and referrer. Native path uses the document referrer policy. |
| Campaign attribution | `formtrackEnabled=true`, but actual loading requires an active Growth form; currently absent | Seven Contact-URL parameters listed in 5.2. No cross-page persistence or manual referrer inference. Future activation adds the unpkg network request and sends labels with enquiries. |
| Spam protection | Honeypot exists; Turnstile key blank; no CAPTCHA script loaded | Formspark dashboard filtering and OOPSpam settings unknown. Do not describe either as verified active. |
| Analytics | GA ID blank, no GA script or consent storage active | Optional implementation supports opt-in, DNT/GPC and localStorage preference. This capability is not evidence of live analytics. If enabled later, rewrite 5.1 and verify GA settings/cookies/retention, countries and withdrawal behaviour. Do not call analytics anonymous. |
| Hosting/security | Static files, self-hosted fonts; generated restrictive CSP, framing/MIME/referrer/permissions headers | Cloudflare Pages is the documented deployment target, not verified hosting on the live domain. Actual request logging, cookies, country settings and retention unknown. No live HTTPS/header guarantees made. |
| Comments, Gravatar, image uploads, accounts | No implementation or active script in replacement source | Historical policy does not prove old live functionality is active or inactive. |
| Ecommerce/payments | None in replacement engine | Historical shop header remains a migration concern. No ecommerce added; no scope extended to another business. |
| Embedded media/marketing | No iframe, third-party media embed, advertising or newsletter integration in replacement source | Mailbox campaigns, purchased lists, referrals and off-site marketing cannot be ruled out by source inspection. |
| AI/decisions | Copy describes AI-assisted production with human review; no personal-information AI request or significant automated-decision feature in inspected frontend | No verified evidence of enquiry/client data being sent to AI tools. Omit an AI practice section; ask owner about actual tools and off-site use. |

### Formspark assessment before activation

E6 says submitted fields are stored and forwarded. It also describes IP address, approximate location and request metadata. Notification addresses, routing, connected tools and the business mailbox are account-specific and unverified.

Published retention: content until customer deletion, then 30-day recovery; IP/location and filtered submissions 12 months (filtered items visible for 30 days); exports seven days; server logs seven days; email delivery records 24 months. The provider says some 12-month limits are manually applied. These are not Follent retention periods or verified deletion outcomes. Backup expiry and Follent mailbox/export copies remain unknown.

E6 identifies Belgium as the operator location, AWS storage/email infrastructure in Ireland and Hetzner IP-location processing in Germany. OOPSpam can receive submission content, email and IP in the United States when enabled; the published table gives no transfer safeguard for that vendor. Other listed vendors concern errors, dashboard use, billing or optional connections: do not label them all enquiry recipients. Confirm applicable flows, contracts and safeguards; do not infer Australian APP 8 compliance from European transfer labels. Overseas processing/storage and legal disclosure require separate assessment of actual access and control.

## OAIC validation table

Required rows below are requirements **for an APP entity**. Coverage for this operator is unresolved. “Covered” means the identified draft topic or local presentation is addressed, not that operational/legal compliance has been certified. Clause numbers refer to policy.html. Recommendations and operations are labelled separately.

| OAIC requirement or recommendation | Policy section/clause | Supporting evidence | Status | Action required |
| --- | --- | --- | --- | --- |
| APP 1.3 — clear, current management policy (required) | Whole draft; revision date; 9 | E3–E4; E9–E10 | Needs owner confirmation | Resolve holdings, retention, disclosures and practices before publication; date is drafting date, not approval. |
| APP 1.4(a) — kinds collected and held (required) | 2.1–2.3 | Form markup and owner privacy email | Needs owner confirmation | Inventory existing email, client, enquiry and complaint records; identify third-party or sensitive holdings. |
| APP 1.4(b) — how collected (required) | 2; 5.2–5.3 | Disabled form, E7, local scripts | Needs owner confirmation | Confirm email/referral/public-source collection and live hosting metadata; insert any actual automatic collection. |
| APP 1.4(b) — how held (required) | 3; 4.3 | E6; static architecture | Gap | Add actual mailbox/storage providers, access controls, backups, retention and deletion arrangements. Provider capabilities alone are insufficient. |
| APP 1.4(c) — purposes of collection, holding, use and disclosure (required) | 4; 5 | Form purpose/consent markup; proposed privacy-request workflow | Needs owner confirmation | Confirm every actual recipient, contractor and record-holding purpose, any linking of records and legal disclosures. |
| APP 1.4(d) — access and correction (required) | 7.1–7.2; 8.1 | E9 supplies contact; E4 informs proposed process | Needs owner confirmation | Test mailbox; adopt request handling and proportionate identity checks, including representatives and refusal explanations. |
| APP 1.4(e) — complaints about APPs/binding code and handling (required) | 8.1–8.3 | E4, E8; owner contact | Needs owner confirmation | Adopt proposed acknowledgement/review/outcome process; determine coverage, any code and external scheme. Make no response-time promise without a supported procedure. |
| APP 1.4(f) — likely overseas recipients (required) | 6 | E6 plus inactive form gate | Needs owner confirmation | Establish actual hosting/email/provider disclosures; disabled form does not establish no overseas handling elsewhere. |
| APP 1.4(g) — likely recipient countries where practicable (required) | 6.2–6.3 | E6 provider locations | Gap | Confirm settings and recipient countries for the business; a provider list is not a complete Follent disclosure list. |
| APP 1.5 — free, appropriate availability (required operation) | 8.4; HTML page, contents/footer | Local preview; E4 | Gap | Publication deliberately withheld. After approval, make the final policy available at preserved URL and test live navigation without login/payment. |
| APP 1.6 — requested format (required operation) | 8.4 | E9 contact; proposed plain-text/large-print response | Needs owner confirmation | Establish who handles requests and can supply accessible formats; wording alone does not provide the service. |
| APP 1.2 — privacy procedures and systems (required operation, contextual) | Supports 3, 7–9 | E4; incomplete business settings | Gap | Assign responsibility; document access, security, deletion, complaints, vendor review and incident handling. |
| APP 5 collection notices (separate requirement where applicable) | 9.2; existing form consent | E3–E4; form markup | Gap | Policy link/checkbox alone does not establish an adequate notice. Before activation, review identity/contact, purpose, required fields, non-provision consequences, usual recipients, access/complaints and overseas information at collection. |
| Specificity/relevance (recommendation) | 1–6 | E1 versus E10 | Covered | WordPress assumptions removed; exact configured fields and active/inactive distinction retained. Expand only for confirmed practices. |
| Plain language and audience testing (recommendation) | Whole draft | Short numbered paragraphs; original Australian English | Needs owner confirmation | Ask a typical customer to read it; technical campaign labels are named because they can accompany enquiries. Automated checks are not comprehension testing. |
| Navigation and layered explanation (recommendation) | Approach; contents; nine statements | Semantic HTML; local browser checks | Covered | Preserve anchor links and headings in final integration. |
| Accessible/mobile presentation (recommendation; technical practice) | Whole page | Existing prose styles; local QA below | Covered | Manual screen-reader, real-device and alternative-format checks still required; automated coverage is limited. |
| Anonymous/pseudonymous choices (recommendation; APP 2 where applicable) | 1.2 | No visitor login; form name is free text | Needs owner confirmation | Confirm general-question practice and identity needs for agreements/records. Browsing without a name does not mean no server metadata. |
| Retention, disposal and backups (recommendation; APP 11 where applicable) | 3 | Retention configuration blank; E6 only | Gap | Set an actual schedule and deletion process per record type; validate backup expiry and legal obligations. Do not insert an invented period. |
| Marketing preferences (recommendation; other duties may apply) | 4.2; 7.3 | No subscription field/tool; E9 contact | Needs owner confirmation | Verify off-site marketing; adopt suppression handling and functioning unsubscribe mechanisms for any actual campaigns. |
| Privacy governance/currency (recommendation) | 9 | Dated draft; feature gates | Needs owner confirmation | Assign a reviewer and review trigger before enabling services; update to actual publication/revision date later. |
| Credit reporting, donor practices, vulnerable-group programmes (only if relevant) | Not included | No such functions in inspected replacement scope | Not applicable | Reassess if owner identifies an actual relevant practice; no borrowed IJM disclosures. |
| Significant automated decisions/AI (only if relevant and verified) | Not included | No verified personal-information decision flow in source | Needs owner confirmation | Confirm off-site AI and automation use and assess any applicable transparency duties; do not add hypothetical AI statements. |

## Owner confirmations still needed

1. **Coverage:** besides the reported turnover, do any OAIC small-business exceptions apply, has there been formal opt-in, and is there a binding code or complaint scheme? Best-practice intent is recorded separately.
2. **Providers and delivery:** who receives Formspark notifications, which mailbox provider is used, who has access, and are any forwards, autoresponders, spam services, webhooks or integrations enabled? Confirm account ownership using settings, not private submissions. Confirm `privacy@follent.net` is monitored and working.
3. **Retention/security:** what happens to enquiries, correspondence, project records, logs, exports, spam and backups? Supply actual deletion/review practices, required legal retention and access controls. Which countries can providers/support staff access them from?
4. **Live and legacy handling:** which hosting/logging/cookie services actually run on the live domain? What old records remain? Are there off-site referrals, lists, marketing, contractors, data sharing or AI processing of personal information that the code does not show?
5. **Operational commitments:** approve and implement the proposed access/correction, identity verification, complaint, preference and alternative-format processes in 3.3 and 7–9. These clauses are proposals, not verified evidence of an existing business process.

The identity, ABN, privacy email and stated turnover/best-practice preference have already been supplied; do not ask for them again. No request for approval to publish is made in this task.

## Checks and completion record

Completed locally on 9 October 2026 with Node 24.14.1, headless Chrome and the repository's existing optional QA tools:

| Check | Result |
| --- | --- |
| `npm test` | All six existing tests pass, including package gates and form transport. Initial sandbox EPERM was resolved by running the same command with local process/write permission. |
| `npm run build`, then `npm run check` | Ten normal pages; zero check failures. The draft is absent from `dist`. Form disabled. |
| Package variant checks | Essential three pages, Professional ten and Growth ten; zero failures in each. After the route correction, fresh `.qa/privacy-essential`, `.qa/privacy-professional` and `.qa/privacy-growth` outputs were checked immediately because OneDrive had converted the earlier privacy directories into reparse links that the existing checker skips. |
| `node scripts/browser-qa.mjs` | Forty page/width checks, zero pages with axe violations, eight mocked behaviour scenarios pass. Source social PNG regenerated without a Git content change; normal build rerun afterwards. |
| `node docs/privacy-policy/preview.mjs`, then `node scripts/check.mjs --dir .qa/privacy-review` | Ten review pages at the corrected `privacy-policy` slug; zero failures; canonical and local links checked. |
| HTML validator | Recommended rules pass for all normal and review pages with the repository's existing rule configuration. |
| `node docs/privacy-policy/check.mjs` | 320/390/768/1440px: no overflow, zero axe WCAG A/AA through 2.2 or best-practice violations, one h1, nine contents targets and 28 sequential clauses. Exact operator wording, privacy-policy route/canonical, footer navigation, keyboard skip link, no-JS content/navigation, disabled form, no external requests and no browser/CSP errors verified. |
| Visual review | Full-page and readable viewport screenshots reviewed at phone/desktop sizes; established typography, spacing and reading width preserved. No global CSS changes. |
| Lighthouse 13.5.0, initial mobile local draft | Performance 100, Accessibility 100, Best Practices 100, SEO 66; LCP 1.7 seconds, CLS 0. SEO is reduced by the intentional noindex/crawl block. This audit preceded the exact operator-wording correction; browser/accessibility checks were rerun afterwards. Those safeguards were retained; no production performance claim is made. |
| `git diff --check` | Pass. No pricing, production dependency, approval-flag or production redirect changes. |

The default port 4173 was already occupied, so the existing server was left alone. The review server for this task uses `http://127.0.0.1:4183/privacy-policy/`. For a fresh session, use the preview commands above; substitute `--port 4183` if needed. Browser checks start and stop their own server on port 4182.

Additional reproduction commands (optional tools already installed under `.qa/tools`, as documented in QA_REPORT):

```sh
node docs/privacy-policy/check.mjs
node .qa/tools/node_modules/html-validate/bin/html-validate.mjs ".qa/privacy-review/**/*.html"
node .qa/tools/node_modules/lighthouse/cli/index.js http://127.0.0.1:4183/privacy-policy/ --chrome-flags=--headless --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=.qa/lighthouse-privacy-policy.json --quiet
```

Machine evidence is in `.qa/privacy-policy-results.json`, `.qa/browser-results.json`, `.qa/lighthouse-privacy-policy.json` and `.qa/screenshots/privacy-policy-*.png`. Generated review output and evidence are ignored by Git; the draft source, generator, check script and this review document are retained.

Remaining limitations: owner confirmations above; no live form delivery/storage/deletion validation, mailbox receipt test, deployed headers/redirect checks, manual screen-reader or real-device test. No launch was authorised, so `check:launch` and production cutover were not performed. The rewrite remains excluded from normal builds and must be revised if forms or tracking are enabled. Automated evidence does not establish legal compliance or operational adoption of the proposed commitments.
