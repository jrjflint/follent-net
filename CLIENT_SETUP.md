# Create a client website from this template

## 1. Duplicate and decide the package

Duplicate the repository into the client's own GitHub repository. Rename it, keep `main` as the production branch and remove the original remote if copying a local checkout. Use Node 22+. Before building, copy `config/client.example.json` over `config/site.json`, or into a client config selected with `--config`. The example has no active integrations or approvals; its `.example` domain and visible preview labels are placeholders, never production facts.

Set `package` in `config/site.json` to `essential`, `professional` or `growth`. Essential emits one scrolling main page; Professional/Growth emit the six core pages. Privacy and 404 are utility pages; Growth also uses the success/error experience. The five/eight-page commercial allowance is for agreed main content pages; trim or add entries in `pageDefinitions` to match the client's signed scope. Do not carry a six-page reference implementation into a five-page client agreement without adjusting it.

**Before any client build:** use the client example rather than Follent's active config. Verify endpoint/site key/external URL, both Google IDs, retention and redirects are empty and Formtrack/privacy/launch flags are false. Replace privacy contact, legal identity, ABN, contacts and domain with verified client values. Build with `--preview` until review is complete. Never serve an identity-only copy with Follent's endpoint or Analytics ID. Example configuration is only a safe starting point: it does not replace Follent copy, offers, assets or provider disclosures.

Professional and Growth currently generate ten total pages, including success/error utilities in both. Essential generates three. These observed counts are reference output, not client page allowances; see [T04](docs/architecture/TASKS.md#t04--central-pagenavigation-manifest).

## 2. Replace identity and assets

- Update business name, legal name, tagline, description, ABN if appropriate, canonical domain and copyright year.
- Supply verified phone/email, service area and address. Do not publish a residential address unless explicitly approved. An empty street address produces no invented physical address schema.
- Update `primaryCTA`, `secondaryCTA`, existing booking link, social URLs and Google Business Profile URL. HTTPS is required for external form links; shared contact links support email and telephone.
- Update brand colours. The initial ivory/noir/Bordeaux palette is an intentional 60–30–10 balance, not a mandatory palette for every client. Recheck contrast if colours change.
- Replace the typographic `wordmark` or extend the shared header/footer for an approved logo with explicit dimensions and accessible text. Replace `assets/icons/favicon.svg`.
- Replace `assets/images/social.png` with a 1200×630 branded image. The optional QA tool can export the generated social artwork with `node scripts/browser-qa.mjs --social-only` after installing its local QA tools as described in QA_REPORT.md.
- Add approved images in `assets/images/`. Use responsive sources, dimensions and sensible compression. Keep licence/permission records. Remove unneeded original assets.

## 3. Replace content and modules

`src/pages/content.mjs` contains the page copy and `src/data/offers.mjs` the Follent service/pricing content. These must be adapted to the client's actual business. Changing configuration does not rewrite their offer. Remove Follent pricing, project examples, AI-process descriptions and website-service managed plans where irrelevant.

Use `src/partials/components.mjs` for generic button/intro/contact helpers. Remove or replace imports/calls to `src/partials/follent-commercial.mjs` when the client does not sell Follent services. That module takes explicit catalogue/process/FAQ arrays; it does not load offers on behalf of shared layouts. Do not copy Follent managed-plan or closing copy as another business's offer.

Reuse the shared layout, section components, fonts, accessible navigation, form shell and SEO generation. Remove unused modules and update the page manifest/copy/CTA links together. Essential destinations are `essentialSection` IDs in the manifest, so retain those IDs or change the declared targets and homepage content together. Add pages with unique safe `slug`, `nav`, `title`, `description`, `render`, and explicit `packages`. Optional `navigation: { order, packages }` controls header/footer placement; `utility: true` distinguishes supporting pages and `enquiryForm: true` enables enquiry scripts where appropriate. See README for the complete manifest contract. Do not edit engine route lists to customise client navigation.

Only publish approved facts. Do not invent reviews, outcomes, awards or business credentials. Replace proof placeholders with verified work and permission-cleared descriptions. Human review is required for AI-assisted copy.

## 4. Set search and integrations

Update unique titles/descriptions in page definitions, the social image and location copy. Set `schemaType` to an appropriate verified Schema.org type; the client example uses Organization, while omission retains the reference's legacy ProfessionalService type. Token validation does not verify vocabulary membership or suitability. Do not add a local-business address without verified details. The build generates canonicals, sitemap, robots and breadcrumbs. FAQ content is visible, but FAQ rich-result markup is deliberately not added to this ordinary service website.

Configure Google Analytics/Search Console and optional Growth lead capture using README instructions. Reset optional `analytics.tagManagerId` to empty/omit it when cloning; never inherit Follent's GTM container. If using GTM, configure the client's own container using [GTM setup](docs/analytics/GTM_SETUP.md), including sanitised page variables and consent checks. A container replaces direct GA loading; tags still need dashboard configuration. Essential/Professional must not acquire a hosted form by accident. Confirm provider notifications, quotas, recurring costs and external workflow scope. Never put secrets in browser code.

For each Growth client, create their own Formspark form and replace `form.endpoint`; never retain Follent's endpoint. Choose `form.formtrackEnabled` explicitly: it is enabled for Follent and defaults off when omitted. It adds attribution only from the Contact URL, with no cross-page storage. Review this collection in the client's privacy notice. The module and its CDN CSP permission are absent when the form is disabled, the package is not Growth, the provider is external, or the build is a Cloudflare preview.

Supply a monitored general enquiry email/phone/booking option before enabling a challenge; do not retain Follent's email or repurpose a client's privacy address without approval. Optional Turnstile uses the shared compact verification module, separate status and recoverable retry; secrets remain in Formspark. Keep the form before supporting context in document order, required/optional labels and input types intact. Native capture still requires the same Growth/privacy gates; a client with no direct contact channel needs an explicitly reviewed recovery limitation.

After privacy approval and activation, submit a clearly labelled test enquiry to the client's form. Verify business fields (including `business_name`), package, notifications/storage, success behaviour and campaign attribution using the sample URL in README. Check `ref` and `referrer` as query parameters, plus empty/absent campaign values. Native enquiries still work if Formtrack is unavailable; attribution requires its script to load before submission. Use local mocked tests before activation and never infer email delivery from a successful HTTP response.

For an external advanced form, use `provider: "external"` plus an HTTPS `externalURL`. For a different native backend, change both HTML submission metadata and the isolated provider transport. Update privacy and CSP to match actual providers. Avoid introducing a CRM, automation SDK or Zapier dependency into the visual template.

For straightforward native intake, supply client definitions to `enquiryForm(ctx, intake)` in `src/partials/enquiry-form.mjs`. Replace Follent's `src/data/enquiry.mjs` labels/choices or create client content data, then compose it from the client page. Optional queryField/analyticsField require select fields; condition references a field/controller and the value that hides an empty field. A client need not have website/package fields. Keep the reserved consent/spam/status/redirect controls, provider transport and actual privacy review; never enable real collection merely to test new fields.

## 5. Review privacy and migration

Provide actual privacy/retention wording and a contact address. Set `privacy.approved`, `launch.businessDetailsReviewed` and `launch.migrationReviewed` only after the corresponding reviews. If no prior site exists, record that in the URL map and mark the migration review complete. Archive client site content and a URL inventory before any replacement. Approved redirects are explicit config entries:

```json
{ "from": "/old-service/", "to": "/services/", "status": 301, "reviewed": true }
```

Review targets and loops. Do not redirect unrelated deleted URLs to the homepage. Do not use the reference Follent ecommerce destination for a different client's migration.

## 6. Build, QA and launch

Follent currently uses Workers Static Assets; follow [the current Workers instructions](README.md#cloudflare-workers-deployment-current-follent-setup) for that deployment. The following Pages procedure is an alternative for client projects using Pages. Both serve the same generated static site; do not mix their domain registration or deployment settings.

Follow [README's Cloudflare Pages instructions](README.md#cloudflare-pages-deployment). Choose **Pages → Connect to Git**, rather than the Workers screen with Wrangler commands. For an interim domain use main, framework None, `npm run build -- --preview`, output `dist`, repository root and `NODE_VERSION=22`. Register the subdomain through Pages before adding its CNAME; preserve existing-site and mail DNS. The explicit preview flag disables enquiries/analytics and indexing on main. After launch review, switch to `npm run build`, redeploy and connect the final domain. Keep independent staging on a preview branch or separate project afterward.

Remove Follent's `wrangler.jsonc` from a Pages client clone. For a deliberately chosen Workers clone, replace its Worker name and dev-domain route with the client's reviewed values and inspect both production and preview build commands. Do not deploy to Follent's Worker/domain. See README for the separate Workers procedure and optional pinned tooling; the shared npm preview command remains the local engine server.

```sh
npm run build
npm test
npm run check
npm run check:docs
npm run check:launch
npm run preview
```

Review real phones and desktop browsers, keyboard navigation, form delivery, spelling, GST amounts and every CTA. Run Lighthouse and accessibility checks on the final configured site; changing fonts, photos or scripts can change results. Use [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) and the selected hosting procedure. Pages is the default for new client projects; Workers is the recorded Follent setup. Connect the approved domain manually only after launch authorisation, and monitor enquiries/search indexing.

Custom `--config` builds record their config path/hash in build-info. `node scripts/check.mjs --dir .qa/your-build --launch` checks that recorded config, not Follent's default. Rebuild after config changes. Explicit `--config` must match provenance; legacy output needs explicit config. Never set review flags merely to pass these checks.

Privacy uses one entry in `src/pages/privacy-policy.mjs`. Keep `privacy.policy: "client"` from the safe example. Replace `clientPrivacy` with this business's reviewed policy and mark `clientPolicyIsDraft=false` only after replacing the scaffold. This source marker does not grant collection approval; `privacy.approved` still requires owner review. Set contact/retention in config and verify generated output. Do not select the Follent policy or publish its Microsoft/Twenty/MFA/operator assertions for another client. No engine edits are needed to replace the client content.
