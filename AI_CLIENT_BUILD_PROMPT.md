# Client customisation prompt

Copy the following prompt and provide the listed materials. Human approval is required before launch.

---

Customise this static website reference template for the client below. Inspect the repository, configuration, README and CLIENT_SETUP before changing anything. Preserve its dependency-free build, shared layouts, static HTML output, progressive enhancement, accessible navigation and replaceable form layer. Work incrementally and report missing facts instead of inventing them.

## Inputs

- Selected package: [Essential / Professional / Growth]
- Discovery transcript: [attach or paste]
- Verified business/legal details, ABN and contact channels: [details]
- Existing website and approved migration inventory: [URL/export/map]
- Services and customer priorities: [details]
- Service areas and approved address: [details]
- Competitors for context, without copying their content: [URLs]
- Brand assets, colours, logo and font permissions: [assets]
- Approved photographs and usage rights: [assets]
- Page allowance, inclusions, revision rounds and support: [signed scope]
- Booking system, form requirements and approved integration scope: [details]
- Privacy/retention wording and contact: [approved text]
- Domain, Google IDs and public form endpoint/site key: [public configuration only]

## Work

1. Map client needs to the selected package; identify gaps before adding out-of-scope work.
2. Update central configuration, page copy, approved assets, metadata, schema and navigation. Remove Follent-specific pricing and reference content unless the client actually sells those services.
   First follow CLIENT_SETUP's safe reset of inherited integrations and approvals. Use explicit preview mode until client review; never retain Follent's endpoint or Google IDs. Review the selected schema type rather than assuming the current ProfessionalService type suits the client.
3. Essential: one scrolling content page, supplied copy and contact/booking links, no hosted form. Professional: agreed multi-page scope, human-reviewed copy and local SEO, no hosted form. Growth: agreed pages, native enquiry capture and only agreed integration hooks.
4. Retain semantic HTML, keyboard focus, contrast, reduced motion, performance and useful error states. No essential content may depend on JavaScript.
   Preserve the shared mobile-first type/spacing roles, form-first reading order and in-flow analytics preferences. Supply the client's approved general contact alternative for challenge failure. Adapt compact/full commercial content to their business; retain Essential's complete one-page sections. Use the extended browser/UI checks documented in QA_REPORT for final responsive verification.
5. Keep provider transport separate from presentation. Do not add a database, ecommerce, heavy framework or automation-platform dependency without a concrete approved need. Never commit secrets or credentials.
6. Use factual proof only. Mark missing details and request human review of business claims, scope and privacy. Do not set approval flags on behalf of the client.
7. Prepare reviewed redirects, deployment instructions and the launch checklist. Do not change DNS, replace the existing live site or publish production before authorised cutover.
8. Run the appropriate tests, link/metadata checks, `npm run check:docs`, browser layout checks, form success/failure tests and Lighthouse/accessibility review. Use README for current commands/hosting, CLIENT_SETUP for cloning and LAUNCH_CHECKLIST for human launch decisions; keep dated evidence separate from current deployment claims. Report observed results and remaining blockers honestly.

Deliver the customised source, generated preview, changed configuration summary, test evidence and outstanding human decisions. The client must approve factual copy, design, privacy and migration before launch.

Follow CLIENT_SETUP for the policy entry/client scaffold and README for commands/hosting. Replace business-specific policy facts and review actual output, not just configuration. Keep the client policy selection and replace its scaffold before asking the owner to approve collection. Consult `docs/architecture/REVIEW.md` for dated findings and `TASKS.md` for current completion status.
