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

**P0 · ENGINE + FOLLENT · F2 · Dependencies: none**

Make normal Follent privacy call the reviewed numbered renderer, preserving nine statements/28 clauses and route. Complete factual review before publication. Use consistent approved contact/retention inputs; detailed legal/business wording stays in content. Never make Follent MFA/CRM/provider assertions another client's defaults. Review generator must use the normal renderer instead of replacing its page; generate/check the snapshot or retire it with updated links.

**Interface:** existing page render/context, authoritative policy content. **Acceptance:** normal/preview contact, operator and retention agree except truthful capability differences; clone contact changes leave no Follent email; clone instructions require replacing operator/provider/practice copy. Tests prove normal output, not only review output. Do not flip approval flags. **Verify:** baseline, `node docs/privacy-policy/preview.mjs`, `node docs/privacy-policy/check.mjs`, normal HTML inspection and documented HTML validator.

## T03 — Separate commercial sections from generic helpers

**P1 · ENGINE + FOLLENT · F3 · Dependencies: none**

Keep button/intro/contact helpers generic. Move cards, managed plans, scope notes, add-ons, process/FAQ and website-specific closing copy into a Follent commercial module. Pass offer data explicitly; generic modules must not import Follent offers/projects. Format long page render functions by section without changing markup. No CMS/content framework.

**Interface:** internal imports/renderer arguments. **Acceptance:** a gardening page uses generic layout/helpers without commercial catalogue imports; Follent HTML/metadata/price/selector behaviour remains equivalent. **Verify:** baseline, catalogue regression, synthetic non-commercial render and mocked responsive checks for any markup change.

## T04 — Central page/navigation manifest

**P1 · ENGINE + FOLLENT · F4 · Dependencies: T03**

Extend existing definitions with navigation placement/order, supported packages and Essential section destination. Derive selection/navigation/aliases rather than maintaining separate lists. Validate unique safe slugs, render functions and resolvable nav/section targets before writes. Preserve current utility output initially, including Professional success/error pages; changing that requires separate scope approval.

**Interface:** page metadata/context routes; preserve public paths/redirects. **Acceptance:** removing a page needs one manifest edit plus copy/links, with no dangling navigation; duplicate/traversal slugs and missing targets fail before writes; Essential fragments work. Commercial page allowances stay human-reviewed. **Verify:** baseline, add/remove-page fixtures, invalid manifests and all package link/fragment checks.

## T05 — Adaptable business schema

**P1 · ENGINE · F5 · Dependencies: T06**

Add optional public `schemaType`, defaulting to existing ProfessionalService for compatibility; explicitly keep that value for Follent and use conservative Organization in the client example. Validate a simple Schema.org type token and require factual human selection. Preserve omission of unknown address/rating details. Fixed font/icon/social paths remain manual customisation, documented in setup.

**Interface:** one config field consumed by `schemaFor`. **Acceptance:** explicit type renders, invalid input fails, Follent graph unchanged, synthetic Organization has correct identity/domain and no invented address. **Verify:** baseline and default/explicit/invalid-type JSON-LD tests; no rich-result eligibility claim.

## T06 — Configuration validation and build provenance

**P1 · ENGINE · F6 · Dependencies: none**

Validate required groups with readable field errors, review flags as booleans, privacy email format and optional/redirect values before deleting generated output. Record relative config path in build-info; make launch checks use it, allow explicit `--config`, reject disagreement. No credentials/private facts in build-info.

**Interface:** validation errors, build-info provenance, checker `--config`. **Acceptance:** string `"false"` cannot enable approval; invalid privacy email fails; malformed config preserves prior output/source; custom build launch check uses its config. Older output lacking provenance needs explicit config for launch checks with useful guidance; ordinary structural checks remain compatible. **Verify:** baseline, invalid-field cases, custom/mismatched-config launch checks and output-preservation regression.

## T07 — Reproducible Workers deployment

**P0 · ENGINE + FOLLENT · F7 · Dependencies: none; verified account details required**

Read-only inspect authorised Cloudflare project commands, worker name, asset/404 routing and domains. Record unknowns. Add minimal explicit Wrangler static-assets config matching verified settings, with dist and no custom runtime Worker. Keep deployment tooling separate from dependency-free build; document supported version/Node settings. Keep explicit `--preview` for staging/branches because auto-detection is Pages-specific.

**Interface:** deployment config/commands only. **Acceptance:** dry-run packages correct output/custom 404 mode, preview disabled gates/HTML/headers/robots verified, no dependency on untracked auto-config. Separate Pages guide does not imply Follent must migrate. **Verify:** baseline, configured Wrangler dry-run, preview output checks. Real deployed headers/redirects/domains need separately authorised deployment verification; no settings invented if inspection is unavailable.

## T08 — Reusable QA and non-writing browser mode

**P1 · ENGINE + FOLLENT · F8 · Dependencies: T01, T04, T06**

Separate generic capability/transport tests from Follent price/copy expectations. Add a different-business fixture with own pages/metadata/privacy. Make artwork export explicit via existing `--social-only`; ordinary browser QA must not rewrite tracked branding. Derive routes/counts from manifest/build capabilities.

**Interface:** optional QA config/flags; retain documented report paths. **Acceptance:** routine QA leaves tracked assets unchanged, mocks enquiry requests, covers reference and clone, catches inherited identity/integration/practice assertions. Explicit artwork export remains supported. **Verify:** baseline, both fixtures, before/after `git diff -- assets/images/social.png`, mocked browser QA.

## T09 — Client-specific intake over a reusable form shell

**P1 · ENGINE + FOLLENT · F9 · Dependencies: T03, T08**

Extract stable consent/spam/redirect/status controls from website-service intake options. Supply Follent package/need choices from business content with ordinary ES-module fields. Make conditional website-field behaviour explicit and optional. Rename internal Analytics bridge to a neutral name, updating producer/consumer together. Preserve Follent payload field names/package IDs and isolated provider transport.

**Interface:** internal renderer/enhancement inputs and Analytics hook. **Acceptance:** gardening intake has no Follent options/missing-element errors; Follent payload/query selection unchanged; native, blocked tracking, pending/duplicate/error/input retention safe. **Verify:** baseline and both mocked invalid/success/error/double-click/no-JS/blocked-tracking fixtures; no live notifications without separate authorisation.

## T10 — Documentation consistency check

**P2 · ENGINE + FOLLENT · F10 · Dependencies: none; extend after T02/T07/T08**

Add dependency-free relative Markdown path/fragment and npm-command checks, excluding external links and ignored evidence appropriately. Keep README authoritative for engine/hosting, CLIENT_SETUP for cloning, AGENTS for constraints, checklist for manual launch and reports for dated evidence. Link official platform guidance with review dates; no automatic scraping/rewriting.

**Interface:** `npm run check:docs` and Node checker. **Acceptance:** broken local link/nonexistent npm script fails; valid paths/fragments pass; historical evidence is dated and current deployment claims require supporting observations. **Verify:** command and positive/negative fixtures plus manual reconciliation after each dependent change.

## Order

T01/T02 first; T07 independently when account evidence is available. Then T03/T06 → T04/T05 → T08 → T09. T10 is independent and extends as interfaces change. Keep changes individually reviewable. No framework conversion, ecommerce, automatic deployment, DNS cutover or publication of synthetic copy.
