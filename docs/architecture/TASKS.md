# Template improvement backlog

Created 12 October 2026. Task status and verification appear under each item; unmarked tasks remain **open**. Finding IDs refer to [REVIEW.md](REVIEW.md). P0 addresses unsafe cloning/operational instructions; P1 recurring reuse obstacles; P2 maintenance. No task authorises publication, DNS changes or live submissions.

Execution instruction, 12 October: the owner authorised deferring Cloudflare branch-build verification and T07 until the end. Work proceeds on `improvements/template-reuse`, with a verified commit/push between tasks. Revised order: T01 → T02 → T06 → T03 → T04 → T05 → T08 → T09 → T10 → T07. Pushes are authorised despite unverified Cloudflare branch behaviour; this is not evidence of safe hosted preview settings or permission to change hosting/DNS.

Every code task must run `npm test`, `npm run build`, `npm run check`, relevant package-output checks and regression tests for its actual failure. Preserve URLs/pricing/package boundaries, security/consent and native form transport. Update docs alongside implementation. Browser checks must mock submissions; use T08's non-writing mode once implemented.

## T01 — Safe client starting configuration

**Completed 12 October 2026.** Added the safe example and six normal/preview package builds in regression coverage. Seven Node tests pass; normal build/check, all reference package checks, example preview/output check and documentation checks pass. Follent config remains unchanged. Example content/pricing/assets still require adaptation; safe configuration does not approve publication. Remote push verification is the completion checkpoint for this task commit.

**P0 · ENGINE + FOLLENT · F1 · Dependencies: none**

Add `config/client.example.json` with synthetic identity, empty endpoint/site key/external URL/Google IDs, Formtrack off, all review flags false, empty retention/redirects. Preserve Follent config. Document copying the example into the client's config before replacing facts; no automatic provisioning or approval.

**Interface:** existing `--config`, no new loader. **Acceptance:** every package from the example keeps integrations off and emits no Follent IDs; preview is noindex. Unfinished synthetic content is not publishable. Add an activation regression for safe cloning. **Verify:** baseline plus `node scripts/build.mjs --config config/client.example.json --out .qa/client-example --preview` and `node scripts/check.mjs --dir .qa/client-example`; independently inspect identity/privacy/copy.

## T02 — One explicit privacy rendering path

Implementation uses explicit `privacy.policy` (`follent` or `client`, omitted means client) and a source-level `clientPolicyIsDraft` marker so the default scaffold cannot receive collection approval. Contact/retention are config inputs; business-specific prose remains content. The duplicated HTML snapshot is retired and the review generator no longer replaces pages. Follent approval/integration flags are unchanged; central retention now matches the latest confirmed numbered wording. Verification and checkpoint status follow once all checks pass.

**Completed 12 October 2026.** Nine Node tests pass, including real normal-build rendering, escaped retention/contact, clone non-inheritance and approval rejection. Normal build/output and reference package checks pass. Dedicated policy QA passes 320/390/768/1440px, 28 clauses, keyboard/no-JS/print and zero axe/browser errors or external requests. Normal and preview privacy HTML validation passes after fixing preview whitespace; mobile screenshot inspected. Documentation checks pass. Business/provider operations and publication remain unverified owner checks. Remote push verification is the task commit's completion checkpoint.

**P0 · ENGINE + FOLLENT · F2 · Dependencies: none**

Make normal Follent privacy call the reviewed numbered renderer, preserving nine statements/28 clauses and route. Complete factual review before publication. Use consistent approved contact/retention inputs; detailed legal/business wording stays in content. Never make Follent MFA/CRM/provider assertions another client's defaults. Review generator must use the normal renderer instead of replacing its page; generate/check the snapshot or retire it with updated links.

**Interface:** existing page render/context, authoritative policy content. **Acceptance:** normal/preview contact, operator and retention agree except truthful capability differences; clone contact changes leave no Follent email; clone instructions require replacing operator/provider/practice copy. Tests prove normal output, not only review output. Do not flip approval flags. **Verify:** baseline, `node docs/privacy-policy/preview.mjs`, `node docs/privacy-policy/check.mjs`, normal HTML inspection and documented HTML validator.

## T03 — Separate commercial sections from generic helpers

Implementation moves Follent sections into `follent-commercial.mjs`, leaves generic helpers independent, and supplies catalogue/process/FAQ arrays from pages. Page returns are formatted by outer section boundaries with no output whitespace changes. Verification compares all 23 package HTML files byte-for-byte against pre-task output; isolated gardening render blocks any Follent offers/projects import.

**Completed 12 October 2026.** Thirteen Node tests pass, including isolated generic rendering and supplied-data commercial sections. Normal build/check, all package checks and docs pass. All 23 package HTML files are byte-identical before/after; pricing/metadata/markup are preserved, so no visual/browser rerun or tracked artwork regeneration was necessary. Windows loader file-URL handling was corrected before final tests. No config/asset changes. Remote push verification is the completion checkpoint.

**P1 · ENGINE + FOLLENT · F3 · Dependencies: none**

Keep button/intro/contact helpers generic. Move cards, managed plans, scope notes, add-ons, process/FAQ and website-specific closing copy into a Follent commercial module. Pass offer data explicitly; generic modules must not import Follent offers/projects. Format long page render functions by section without changing markup. No CMS/content framework.

**Interface:** internal imports/renderer arguments. **Acceptance:** a gardening page uses generic layout/helpers without commercial catalogue imports; Follent HTML/metadata/price/selector behaviour remains equivalent. **Verify:** baseline, catalogue regression, synthetic non-commercial render and mocked responsive checks for any markup change.

## T04 — Central page/navigation manifest

Implementation declares packages, navigation order/packages, Essential sections, utility status and enquiry-script metadata in pageDefinitions. Build/context accept an explicit pages array. Shared helpers derive selection/navigation/routes; all page rendering and section/CTA checks happen before output deletion. Required Home/privacy/404 and active-form success/error routes preserve the current utility contract.

**Completed 12 October 2026.** Seventeen Node tests pass, including different-business page addition/removal, all-package link/fragment checks, invalid/duplicate/traversal manifests, missing sections/CTA targets and preserved previous output. Enquiry scripts follow metadata on a renamed fixture page. Normal build/check, reference package checks and docs pass. All 23 reference HTML files remain byte-identical; no browser/artwork regeneration or config/asset changes were needed. Remote push verification is the completion checkpoint.

**P1 · ENGINE + FOLLENT · F4 · Dependencies: T03**

Extend existing definitions with navigation placement/order, supported packages and Essential section destination. Derive selection/navigation/aliases rather than maintaining separate lists. Validate unique safe slugs, render functions and resolvable nav/section targets before writes. Preserve current utility output initially, including Professional success/error pages; changing that requires separate scope approval.

**Interface:** page metadata/context routes; preserve public paths/redirects. **Acceptance:** removing a page needs one manifest edit plus copy/links, with no dangling navigation; duplicate/traversal slugs and missing targets fail before writes; Essential fragments work. Commercial page allowances stay human-reviewed. **Verify:** baseline, add/remove-page fixtures, invalid manifests and all package link/fragment checks.

## T05 — Adaptable business schema

**Completed 12 October 2026.** Optional schemaType validates simple tokens; Follent explicitly retains ProfessionalService and the client example uses Organization. Nineteen tests pass, including omitted/explicit compatibility, invalid inputs and generated client identity/no invented address/rating. Normal/package/client output and docs checks pass; all 23 Follent HTML files are byte-identical. Official Schema.org pages were checked; deprecated ProfessionalService remains only for compatibility pending factual review. Remote push verification is the completion checkpoint.

**P1 · ENGINE · F5 · Dependencies: T06**

Add optional public `schemaType`, defaulting to existing ProfessionalService for compatibility; explicitly keep that value for Follent and use conservative Organization in the client example. Validate a simple Schema.org type token and require factual human selection. Preserve omission of unknown address/rating details. Fixed font/icon/social paths remain manual customisation, documented in setup.

**Interface:** one config field consumed by `schemaFor`. **Acceptance:** explicit type renders, invalid input fails, Follent graph unchanged, synthetic Organization has correct identity/domain and no invented address. **Verify:** baseline and default/explicit/invalid-type JSON-LD tests; no rich-result eligibility claim.

## T06 — Configuration validation and build provenance

Implementation adds explicit config checks, repository-relative config paths and SHA-256 provenance. Bytes are read/validated/hashed once before output replacement. Launch checks require matching/current recorded config or explicit legacy config; ordinary structural checks remain compatible. Synthetic approvals exist only in ignored test fixtures.

**Completed 12 October 2026.** Eleven Node tests pass, covering malformed groups/fields, string flags, invalid emails/URLs/redirects, preservation of previous output, correct custom-config launch checks, stale/mismatched provenance and explicit legacy input. Normal build/check, all reference package checks and documentation checks pass. No Follent config, real approval flags, tracking settings or assets changed. Remote push verification is the task commit's completion checkpoint.

**P1 · ENGINE · F6 · Dependencies: none**

Validate required groups with readable field errors, review flags as booleans, privacy email format and optional/redirect values before deleting generated output. Record relative config path in build-info; make launch checks use it, allow explicit `--config`, reject disagreement. No credentials/private facts in build-info.

**Interface:** validation errors, build-info provenance, checker `--config`. **Acceptance:** string `"false"` cannot enable approval; invalid privacy email fails; malformed config preserves prior output/source; custom build launch check uses its config. Older output lacking provenance needs explicit config for launch checks with useful guidance; ordinary structural checks remain compatible. **Verify:** baseline, invalid-field cases, custom/mismatched-config launch checks and output-preservation regression.

## T07 — Reproducible Workers deployment

**In progress, 12 October 2026; replacement hosted verification pending.** [Account/build evidence](WORKERS.md) verifies Worker/repository, commands, Node/tool versions, domains/date/assets-only operation and branch triggers. Explicit static config fixes the missing previews block and pins folder/custom-404 behaviour. Wrangler 4.149.0 deploy dry-run reads 42 assets; local emulation/QA passes nine preview pages and routing/security/crawling/disabled-collection checks. Twenty-four tests, normal/reference/garden package output and docs checks pass. The owner approved correcting Previews Base's build command to include `--preview`; it persisted after reload. Source checkpoint `586ad59` was pushed and remote-verified. Its automatic preview build still used the existing branch's separate `npm run build` setting; hosted metadata reports preview false/forms true/Analytics true. The owner then approved correcting that separate branch command; it was saved and verified after reload. The hosted acceptance criterion remains open pending the replacement preview from the evidence push. No production deploy, manual retry or live enquiry. Source preserves npm preview and separate optional tooling.

**P0 · ENGINE + FOLLENT · F7 · Dependencies: none; verified account details required**

Read-only inspect authorised Cloudflare project commands, worker name, asset/404 routing and domains. Record unknowns. Add minimal explicit Wrangler static-assets config matching verified settings, with dist and no custom runtime Worker. Keep deployment tooling separate from dependency-free build; document supported version/Node settings. Keep explicit `--preview` for staging/branches because auto-detection is Pages-specific.

**Interface:** deployment config/commands only. **Acceptance:** dry-run packages correct output/custom 404 mode, preview disabled gates/HTML/headers/robots verified, no dependency on untracked auto-config. Separate Pages guide does not imply Follent must migrate. **Verify:** baseline, configured Wrangler dry-run, preview output checks. Real deployed headers/redirects/domains need separately authorised deployment verification; no settings invented if inspection is unavailable.

## T08 — Reusable QA and non-writing browser mode

Implementation adds a six-page different-business fixture (three Essential pages), independent privacy/metadata and no reference integration IDs, separates Follent field/price assertions and derives QA routes/counts from manifests. Ordinary browser checks intercept external traffic and assert artwork bytes/mtime unchanged. Export is explicit via social-only, with an optional .qa review destination; garden does not claim native intake coverage before T09.

**Completed 12 October 2026.** Twenty Node tests pass. Default reference browser QA passes 40 responsive checks/eight behaviour scenarios; garden passes 24/two, both with zero axe/script violations and unchanged artwork bytes/mtime. Explicit artwork export to `.qa/social-export.png` succeeds without touching source branding. The source image SHA-256 remains 5CF8E9C4726E5BE0A6C0D87CE8545AFAA4F378AFB5DF5D06E3E454EDA144E6A4. Normal/package/garden output and docs checks pass. No real provider request was allowed. Remote push verification is the completion checkpoint.

**P1 · ENGINE + FOLLENT · F8 · Dependencies: T01, T04, T06**

Separate generic capability/transport tests from Follent price/copy expectations. Add a different-business fixture with own pages/metadata/privacy. Make artwork export explicit via existing `--social-only`; ordinary browser QA must not rewrite tracked branding. Derive routes/counts from manifest/build capabilities.

**Interface:** optional QA config/flags; retain documented report paths. **Acceptance:** routine QA leaves tracked assets unchanged, mocks enquiry requests, covers reference and clone, catches inherited identity/integration/practice assertions. Explicit artwork export remains supported. **Verify:** baseline, both fixtures, before/after `git diff -- assets/images/social.png`, mocked browser QA.

## T09 — Client-specific intake over a reusable form shell

Implementation extracts native fields/controls into enquiry-form.mjs with Follent definitions in data/enquiry.mjs and independent garden choices. Query/conditional fields are optional; analytics selections are restricted to declared selects and refer to the submitted value even if the user edits while pending. Both producer/consumer use siteTrack. Follent field IDs, package values and provider transport remain unchanged; normal/preview gates remain in force. Isolated enabled UI-state fixtures use only a dummy endpoint with all external traffic intercepted, not real approvals or live delivery.

**Completed 12 October 2026.** Twenty-two Node tests, normal/package output checks and both browser fixtures pass: reference 40 layouts/eight scenarios, garden 32/two, zero axe/script violations. Dedicated shell QA passes eight layouts/twelve mocked enhanced/native/validation/error/pending/blocked-tracking scenarios. HTML validation passes normal Contact and both shell fixtures after naming the existing Contact sidebar. Reference rendering preserves text, fields, prices and controls; intended differences are explicit form metadata and sidebar accessible-name attributes. Source branding, config and provider transport are unchanged. No live enquiry or delivery claim. Remote push verification is the completion checkpoint.

**P1 · ENGINE + FOLLENT · F9 · Dependencies: T03, T08**

Extract stable consent/spam/redirect/status controls from website-service intake options. Supply Follent package/need choices from business content with ordinary ES-module fields. Make conditional website-field behaviour explicit and optional. Rename internal Analytics bridge to a neutral name, updating producer/consumer together. Preserve Follent payload field names/package IDs and isolated provider transport.

**Interface:** internal renderer/enhancement inputs and Analytics hook. **Acceptance:** gardening intake has no Follent options/missing-element errors; Follent payload/query selection unchanged; native, blocked tracking, pending/duplicate/error/input retention safe. **Verify:** baseline and both mocked invalid/success/error/double-click/no-JS/blocked-tracking fixtures; no live notifications without separate authorisation.

## T10 — Documentation consistency check

Implementation adds scripts/check-docs.mjs and `npm run check:docs`, checks local inline/reference links and simple heading/explicit-ID fragments, and verifies npm script names in executable examples. External URLs and ignored artifact links are excluded; reports remain dated evidence. Authoritative responsibilities are linked from guides and launch instructions, and superseded Contact/privacy findings are labelled rather than rewritten as past successes. No automatic scraping or documentation rewriting.

**Completed 12 October 2026.** Twenty-four Node tests pass, including valid encoded/space/Unicode paths, repeated-heading fragments, explicit IDs, reference links, ignored artifacts and CLI success; missing path/fragment/script/reference and outside-repository links cause CLI failure. Normal build/check and reference package checks pass. Repository documentation checks pass with zero failures. No rendered site, business settings, tracked artwork or historical measurements changed; browser/Lighthouse reruns were unnecessary for this documentation/tooling task. Remote push verification is the completion checkpoint.

**P2 · ENGINE + FOLLENT · F10 · Dependencies: none; extend after T02/T07/T08**

Add dependency-free relative Markdown path/fragment and npm-command checks, excluding external links and ignored evidence appropriately. Keep README authoritative for engine/hosting, CLIENT_SETUP for cloning, AGENTS for constraints, checklist for manual launch and reports for dated evidence. Link official platform guidance with review dates; no automatic scraping/rewriting.

**Interface:** `npm run check:docs` and Node checker. **Acceptance:** broken local link/nonexistent npm script fails; valid paths/fragments pass; historical evidence is dated and current deployment claims require supporting observations. **Verify:** command and positive/negative fixtures plus manual reconciliation after each dependent change.

## Order

T01/T02 first; T07 independently when account evidence is available. Then T03/T06 → T04/T05 → T08 → T09. T10 is independent and extends as interfaces change. Keep changes individually reviewable. No framework conversion, ecommerce, automatic deployment, DNS cutover or publication of synthetic copy.
