# Follent.net — professional website reference template

A fast, reusable static website for Sydney small-business website services. Static HTML is rendered at build time; content, navigation and SEO work without browser JavaScript. Libre Baskerville and Montserrat are self-hosted. The palette is Limestone Ivory `#F2F0EA`, Noir Follent `#0A0A0C` and Bordeaux Nocturne `#4A002E`.

## Quick start

Requires Node 22 or newer. There are **no production dependencies**, no framework, database or CMS, and no install step.

```sh
npm run build
npm run preview
```

Open http://127.0.0.1:4173. Stop the server with Ctrl+C. Run `npm test` for package-boundary and form-transport checks, `npm run check` for generated link/metadata checks, and `npm run check:launch` for business setup prerequisites.

**Recorded implementation state:** owner-approved form activation and retention were recorded on 9 October 2026. Source configuration still enables Formspark and optional GA4 in normal Growth builds; previews disable collection/tracking. General contact details, Search Console and migration/business launch flags remain incomplete in the repository. [Isolated synthetic testing](docs/form-e2e/REPORT.md) recorded enhanced/native storage and owner-confirmed inbox receipt. These are dated observations, not verification of current deployed-origin collection or production cutover. This review made no DNS or hosting changes.

**T02 implementation, 12 October 2026:** `/privacy-policy/` now uses `src/pages/privacy-policy.mjs` in normal and review builds. Explicit `privacy.policy: "follent"` selects Follent's numbered content; `"client"` (also the omitted-field default) selects the client draft. The Follent selection is rejected for a different business/domain. The client scaffold cannot be approved until replaced in its content module. Contact/retention come from config, and preview text follows disabled capabilities. Earlier integration claims were corrected before this implementation; no deployed commit or dashboard setting is verified by this change. See [privacy review](docs/privacy-policy/REVIEW.md).

## Source structure

```text
config/site.json             Shared business, brand and integration configuration
src/data/offers.mjs           Packages, recurring plans, add-ons, process and FAQs
src/data/projects.mjs         Verified portfolio entries
src/pages/content.mjs         Page content and form markup
src/pages/privacy-policy.mjs  Shared policy entry, Follent content and editable client draft
src/partials/components.mjs   Shared content components
src/partials/follent-commercial.mjs  Business-specific sections with explicit offer inputs
src/layouts/document.mjs      Head, navigation, footer and structured data
src/lib/html.mjs              Escaping and URL helpers
src/lib/pages.mjs             Manifest validation, package selection, navigation and route targets
assets/                      Local CSS, JS, fonts, icons and social image
scripts/build.mjs            Dependency-free static generation
scripts/serve.mjs            Local preview with generated security headers
scripts/check.mjs            Generated site and launch checks
tests/                       Node test runner checks
dist/                        Generated deployment output (ignored by Git)
.qa/                         Disposable test builds, tools and reports (ignored)
```

Edit source, not `dist/`. Every build safely replaces `dist/`. The build supports `--package essential|professional|growth`, `--preview`, `--config path` and `--out .qa/name`. Custom output is restricted to `dist` or children of `.qa` to protect source from accidental deletion.

Configuration files must be inside the repository. Explicit checks in `src/lib/config.mjs` reject malformed groups/types, string-valued review flags, invalid privacy contacts and unreviewed/invalid redirects before output replacement. `build-info.json` records relative `configFile`, SHA-256 `configHash`, package and preview state, without credentials or full config. Launch checks use that config and reject stale bytes/conflicting `--config`. Older output without provenance requires explicit `--config` for launch checks; structural checking remains supported. Rebuild after config edits. `node scripts/check.mjs --dir .qa/client-example --launch --config config/client.example.json` intentionally fails until genuine client launch prerequisites are met.

## Configuration and reusable packages

Business identity, domain, contact links, CTAs, location, analytics and form settings live in `config/site.json`. Empty optional fields are omitted from business schema; a city alone is not presented as a physical street address. Never add private credentials here: this is public source and produces public HTML.

Optional `schemaType` selects the business JSON-LD type. Follent explicitly retains `ProfessionalService`; omitted values preserve that legacy behaviour. New clients start with `Organization`. Validation checks a simple type token only, not that the type exists or suits the business: choose against the client's verified facts and the [Schema.org vocabulary](https://schema.org/Organization). No address, rating or rich-result eligibility is invented. Schema.org marks [ProfessionalService deprecated](https://schema.org/ProfessionalService); the existing Follent graph is preserved in this compatibility task, and any later type change requires factual review.

`package` controls delivered capabilities, not the packages advertised by the Follent business:

| Variant | Generated structure | Hosted form | Analytics |
| --- | --- | --- | --- |
| Essential | Home with section links, privacy and 404 | None | None |
| Professional | Six main pages and supporting pages | None; contact links only | Optional |
| Growth | Six main pages and supporting pages | Optional configured native form | Optional |

The source content sells Follent services. When cloning for a tradesperson, consultant or other business, replace the service/pricing copy and modules rather than publishing Follent offers as their own. Page capacity is a commercial scope limit, not an automatic page generator. See [CLIENT_SETUP.md](CLIENT_SETUP.md).

Generic buttons, section introductions and contact helpers live in `components.mjs` without commercial data imports. Follent cards/managed plans/add-ons/process/FAQ/closing copy live in `follent-commercial.mjs`; the page layer passes the required catalogue arrays explicitly. Another business can use the generic document/helpers without loading Follent offers/projects. Page composition remains ordinary template literals grouped by section, not a content framework.

`pageDefinitions` is the page/navigation manifest: each page declares `packages`, optional `navigation: { order, packages }`, optional `essentialSection`, `utility` and `enquiryForm` along with its existing slug/metadata/render function. Navigation and package selection derive from this data. Enquiry-script placement follows `enquiryForm`, not a Contact slug check. `context(site, { pages })` and `build({ pages })` accept a client manifest without engine edits. Root Home, `/privacy-policy/` and `/404.html` remain required; active native forms need enquiry, success and form-error pages. Manifest and rendered section/CTA targets are checked before output replacement. Changing pages still requires adapting copy/CTA links and reviewing the commercial page allowance; utility output is preserved rather than silently removed.

Start new clients from `config/client.example.json`, not Follent's active `site.json`. For a disposable safe preview: `node scripts/build.mjs --config config/client.example.json --out .qa/client-example --preview`, then `node scripts/check.mjs --dir .qa/client-example`. Empty integrations/approval flags stay disabled even in normal builds. The example's visible placeholders, inherited service copy and branding must be replaced before launch.

The [12 October architecture review](docs/architecture/REVIEW.md) maps reusable/business boundaries and disposable clone results. Its [prioritised task backlog](docs/architecture/TASKS.md) records proposed changes, not existing capabilities. Follow CLIENT_SETUP's safe reset before building a new client; copied Follent approval, endpoint and Google IDs remain active unless reset.

All commercial values are AUD, ex GST. Essential support defaults to **14 days**, Professional to **30 days**, Growth to **90 days**. Growth includes up to **eight pages** and **one initial workflow/integration**; Lead Automation manages up to **two agreed workflows**. The monthly form service is separate from the website build. Third-party costs and usage allowances need confirmation in each proposal. The site does not provision integrations or monthly monitoring automatically.

## Formspark and alternative forms

1. Create a form in Formspark and configure notification recipients, submission storage and spam filtering in its dashboard.
2. Set `form.endpoint` to `https://submit-form.com/YOUR_FORM_ID`. A public form ID is not an API token. Keep all provider API tokens and spam verification secrets outside the repository.
3. Review the selected policy in `src/pages/privacy-policy.mjs`; supply accurate retention wording/contact in config. New clients must replace `clientPrivacy` and set `clientPolicyIsDraft=false` once the scaffold is replaced, then obtain owner review before setting `privacy.approved`. The draft marker describes source readiness, not legal approval. Never select Follent's policy for another business.
4. The form is enabled only for Growth, with a real endpoint and those privacy details. Preview builds disable submission even if production credentials are configured.
5. Formspark's native HTML submission uses `_redirect` for `/success/`, `_error` for `/form-error/`, and `_append=false` to keep personal information out of redirect URLs. JavaScript adds validation, pending state, timeout, duplicate-click protection and recoverable errors. It redirects only after a successful HTTP response.
6. Keep the provider's automatic spam filtering enabled. `_gotcha` provides an additional honeypot. For stronger protection, configure Cloudflare Turnstile in Formspark, store its **secret only in the provider dashboard**, and place its public site key in `form.turnstileSiteKey`. The generated CSP then permits the verification script and frame. Turnstile requires JavaScript; native forms without it still post normally when this optional challenge is not enabled.
7. Set up notification routing and the initial workflow in the chosen external platform. Confirm receipt, storage, notification, acknowledgement and routing using non-sensitive test data. Provider acceptance does not guarantee inbox delivery; monitor it independently.

Provider transport lives in `assets/js/form-provider.js`; visual form markup lives in `src/pages/content.mjs`. Replace the transport and native action/hidden fields together if choosing a different native provider. To use an externally hosted form, set `form.provider` to `external` and supply `form.externalURL` (HTTPS): the native form is replaced with a link. This supports Fillout or an equivalent without tying the template to an embed SDK. If you later need an embed, add it deliberately with its required CSP origins and accessibility review.

### Campaign attribution with Formtrack

`form.formtrackEnabled` is an optional boolean (omitted means off), enabled in Follent's configuration. When an active Growth Formspark form has this flag, the Contact template adds `data-formtrack` and loads `https://unpkg.com/@formspark/formtrack` **once, asynchronously after the form markup**. Generated CSP permits that package entry point and its CDN redirect. Essential, Professional, external-provider, disabled-form and Cloudflare preview builds do not load Formtrack. There is no new runtime dependency or embedded form.

Formtrack reads `ref`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term` and `utm_content` from the **Contact page's URL**, and adds hidden inputs that native POST or the existing AJAX `FormData` includes. `referrer` means a query parameter, not an automatically inferred `document.referrer`. No manual UTM parser, cross-page browser storage or campaign persistence is added. A campaign URL on the homepage will not carry attribution to Contact unless its parameters are also present on the Contact URL.

If JavaScript is disabled, the CDN fails, or the visitor submits before the async script finishes loading, the enquiry still works but attribution may be absent. This is separate from consent-controlled Google Analytics. Attribution stays with the enquiry; `_append=false` keeps it out of success/error redirect URLs and conversion events contain only the package identifier. Do not put personal or sensitive information in campaign URL parameters.

### Submitted fields and selector values

| Field name | Required? | Meaning |
| --- | --- | --- |
| `name` | Yes | Enquirer's name |
| `business_name` | No | Business name; replaces the former `business` field |
| `email` | Yes | Reply address |
| `phone` | No | Contact number |
| `website` | No | Existing website; omitted when the enhancement hides/disables an empty field for a new website |
| `need` | No | Type of website help requested |
| `package` | No | Stable option ID, independent of the displayed price |
| `timeline` | No | Approximate timing |
| `message` | Yes | Project details |
| `consent` | Yes | `yes` when the required checkbox is checked |

Package values are blank (Not sure yet), `essential`, `professional`, `growth`, `managed-lead-capture`, `managed-lead-capture-pro`, `lead-automation` and `custom`. Labels/prices are generated from the shared offer data. Existing website package links keep their values; query preselection also accepts the new IDs. Native POST additionally includes provider control fields and the honeypot; AJAX removes redirect controls but retains spam/attribution fields.

### Safe testing and activation

Do not enable the real endpoint just to test layout or attribution. Use the local fixture checks documented in QA_REPORT, which intercept **every Formspark request** and use the actual public Formtrack script. The repository's real privacy approval and contact/retention details remain untouched.

After supplying and approving those details, rebuild and test a Contact URL such as `/contact/?utm_source=test&utm_medium=cpc&utm_campaign=formspark_test&utm_term=website&utm_content=contact_cta&ref=test&referrer=test`. Send one clearly labelled, non-sensitive test enquiry. Verify the business fields, selected package, campaign values, storage and notification email in Formspark; check spam folders and provider filtering. HTTP acceptance alone is not notification delivery. Record the result before declaring the live integration ready. Turnstile remains optional and requires its separate provider/dashboard setup.

Formspark reference: [documentation](https://documentation.formspark.io/), [UTM/Formtrack](https://documentation.formspark.io/integration/utm-parameters.html), [AJAX](https://documentation.formspark.io/examples/ajax.html), [redirects](https://documentation.formspark.io/customization/redirection.html), [spam protection](https://documentation.formspark.io/setup/spam-protection.html).

## Google and privacy

Follent's GA4 measurement ID is `G-K54S78JQ7L`, configured through `analytics.measurementId`. The existing external module creates the Google tag after consent; do not paste a second inline tag into page templates. Explicit preview builds keep Analytics disabled, including at dev.follent.net when built with `--preview`. Receipt in GA4 must be verified after deployment and opt-in; local mocked tests do not prove live collection. Review the policy against deployed settings before publishing.

Set `analytics.measurementId` to a real GA4 `G-...` ID and `analytics.searchConsoleVerification` to the verification token if using HTML verification. DNS verification is an alternative for Search Console; do that manually. Add the sitemap after verification. Add the approved Google Business Profile URL to the shared config.

GA4 loads only after explicit visitor opt-in, only on Professional/Growth production builds, and respects Do Not Track and Global Privacy Control. Privacy offers a preference reset. Conversion tracking sends only the event and selected package after an accepted enhanced submission, never names, email or message text. Initial page location/referrer omit query strings. Turn off unneeded enhanced-measurement features in the GA dashboard and verify its configured events before launch. Review the privacy notice against actual providers, geographic processing and retention; the draft is not a completed legal review.

## Cloudflare Workers deployment (current Follent setup)

The recorded Follent deployment uses **Workers Static Assets**, serving `dist`, with repository `jrjflint/follent-net` and Worker `follent-net`. These account details are recorded context, not a fresh live check on 12 October 2026. No explicit Wrangler configuration is tracked; reproducible configuration is [backlog T07](docs/architecture/TASKS.md#t07--reproducible-workers-deployment). Workers and Pages have separate settings. Pages remains the default client delivery pattern; do not recreate the recorded Follent deployment on Pages solely to follow that default.

1. In **Workers & Pages → follent-net → Settings → Builds**, use production branch `main`, root `/`, build command `npm run build -- --preview`, and deploy command `npx wrangler deploy` for the interim site. Node 22 is selected by `.nvmrc`. Save settings and trigger a new Git build; the explicit flag is necessary because this engine's automatic Cloudflare branch detection is Pages-specific.
2. Open **Domains → Add Domain** (or **Settings → Domains & Routes → Add → Custom Domain**, depending on dashboard layout) and add `dev.follent.net`. Workers custom domains require an active Cloudflare zone. Cloudflare creates DNS and the certificate; do not manually CNAME dev to workers.dev. Resolve any conflicting dev record first, preserving apex, www and email records.
3. Verify the new deployment at dev: `build-info.json` must report preview true and forms/analytics false; inspect noindex headers, robots, clean page URLs and custom 404 behaviour. The dashboard's Production/Preview labels do not activate the engine's preview flag. Git pushes trigger connected builds; check the deployed commit and build logs rather than assuming a push proves deployment.
4. Wrangler auto-configured static assets from `dist` in the initial Cloudflare build checkout. That does not commit its generated configuration to GitHub. Before production cutover, commit explicit Workers configuration, verify custom-domain persistence, static 404 handling and generated headers/redirects, and preserve the dependency-free site build and local `npm run preview` command.
5. After migration/launch approval, configure the final apex separately, change the build command to `npm run build`, redeploy and verify production output and routing. Keep dev on a separate staging Worker if it must remain independent. Privacy activation and live delivery verification remain separate prerequisites.

References: [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/), [Workers custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).

Platform guidance checked 12 October 2026: [Workers builds](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/) separates build/deploy/preview commands. [Static asset headers](https://developers.cloudflare.com/workers/static-assets/headers/) apply to asset responses, not automatically to responses from custom Worker code. Keep explicit `--preview` for staging/branch builds; verify actual project settings and deployed headers before launch. No dashboard or live domain was rechecked here.

## Cloudflare Pages deployment

### Interim deployment at dev.follent.net

Use **Pages** Git integration. A screen describing a “Worker project” with `npx wrangler deploy` and `npx wrangler preview` is the Workers flow. Return to **Workers & Pages → Create application → Pages → Connect to Git**. If offered, use the “Looking to deploy Pages?” entry point. The Pages screen asks for a production branch and build output directory; no Wrangler deploy/preview command is needed.

1. Authorise GitHub and select `jrjflint/follent-net`. Only committed, pushed source is deployed.
2. Use these interim settings:

   | Setting | Value |
   | --- | --- |
   | Project name | `follent-net`, if available; record its actual hostname |
   | Production branch | `main` |
   | Framework preset | None |
   | Build command | `npm run build -- --preview` |
   | Build output directory | `dist` |
   | Root directory | Leave blank (repository root) |
   | Environment variable | `NODE_VERSION=22` in production and preview environments |

3. Select **Save and Deploy** and check the build log. Explicit `--preview` forces staging safeguards even on main: disabled forms, analytics and Formtrack; HTML/header noindex directives; and blocked crawling. Cloudflare calls main “production”, but this is an interim review build. Noindex is not access control.
4. Test the assigned `https://<actual-project-name>.pages.dev` address, all main pages, `/privacy-policy/`, mobile navigation and the disabled Contact form. Check `build-info.json` reports `preview: true`, `formEnabled: false`, `analyticsEnabled: false`; verify deployed `X-Robots-Tag` and `robots.txt`.
5. Open **Custom domains → Set up a domain**, add `dev.follent.net`, and follow activation instructions **before** adding DNS manually. Cloudflare-managed DNS can create the CNAME after confirmation; otherwise add `CNAME dev → <actual-project-name>.pages.dev` at your current DNS provider. A subdomain does not require moving nameservers. Preserve existing apex, www and mail records.
6. Wait for domain/certificate activation and check `https://dev.follent.net/`. Keep `config.domain` as `https://follent.net`, the final canonical origin. Configure access protection separately if private review is required.
7. Connected pushes trigger builds; verify the actual deployed commit. Deploy `dist` generated with the chosen preview/production command, never `.qa/privacy-review` (a separate policy review fixture).

### Reviewed cutover to follent.net

After migration and launch review, reuse this Pages project. Change the build command to **`npm run build`**, redeploy and verify approved production output before routing the apex. Removing `--preview` removes forced staging safeguards on main; enquiries still require separate privacy/configuration activation. Add apex and www through Pages, preserve mail records, verify SSL and approved redirects, and retain old hosting for rollback. The apex requires Cloudflare nameservers, so review the whole DNS zone before a nameserver migration. Build-setting changes require a new deployment.

If dev and apex both remain attached to the production deployment, they serve the same main build. For independent staging afterward, move dev to a preview branch using Cloudflare's [custom branch alias instructions](https://developers.cloudflare.com/pages/how-to/custom-branch-aliases/), or use a separate project retaining the explicit preview command. Automatic safeguards apply only when `CF_PAGES=1` and `CF_PAGES_BRANCH` is not `main`; Workers or other CI must explicitly use `--preview` for staging/branch builds.

### Standard production settings

1. Create a GitHub repository. Initialise this directory with `git init -b main` if needed; add and commit the source, then add your GitHub remote and push `main`. Do not commit `.env`, `.qa` or `dist`.
2. In Cloudflare, create a **Pages** project, connect GitHub and select the repository. Use framework preset **None**, production branch **main**, build command **`npm run build`**, output directory **`dist`**, root directory blank, and `NODE_VERSION=22`.
3. Test the first deployment on its `pages.dev` address. Non-main Pages builds with the expected `CF_PAGES` variables add noindex and disable forms/analytics. A main build using `npm run build` is indexable with production canonicals; use explicit `--preview` until launch approval. Other hosting requires that explicit flag for staging. Configure access protection separately if required.
4. Review [migration-url-map.md](migration-url-map.md), backups and [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md). Configure and test contact details/forms first. Run `npm run check:launch`.
5. Add `follent.net` through the Pages project's **Custom domains** flow. The apex needs the domain's nameservers on Cloudflare; preserve mail records and unrelated DNS. Follow the dashboard instructions, then verify the issued SSL certificate. No DNS changes are automated by this project.
6. Add `www.follent.net` if required and use a Cloudflare redirect rule to permanently redirect `www` to `https://follent.net`, preserving path and query. The shared `domain` remains the preferred HTTPS apex. Do not use a same-path catch-all rule in `_redirects`: it would risk loops on the canonical host.
7. Turn on HTTPS handling in Cloudflare and test apex, www and HTTP redirects. Only add HSTS after HTTPS and all relevant subdomains have been reviewed. This template does not pre-emptively enable HSTS.
8. Reviewed path mappings in `config.redirects` produce Cloudflare's `_redirects`. Test actual redirect behaviour after deployment; the local preview server does not implement redirect rules.
9. Changes pushed to branches generate previews. Review before merging into `main`; each main push builds production. Keep the previous Pages deployment available for rollback. Roll back the Pages deployment and, if applicable, manually restore the previous domain routing.

Cloudflare reference: [Git integration and dashboard setup](https://developers.cloudflare.com/pages/get-started/git-integration/), [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/), [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/), [headers](https://developers.cloudflare.com/pages/configuration/headers/), [redirects](https://developers.cloudflare.com/pages/configuration/redirects/).

## Security and performance

Generated `_headers` restrict scripts/styles/fonts to local assets; JSON-LD gets content hashes. Formspark, Turnstile and GA origins are permitted only when enabled. No inline executable script or `unsafe-inline` is required. Other headers restrict framing, referrers, MIME sniffing, camera, microphone, geolocation and payments. The preview server applies global headers, omitting HTTPS upgrade on localhost only. Cloudflare path-specific headers and redirects require deployment checks.

There are no remote fonts or essential third-party scripts. The main illustration uses CSS, not a heavy image. Supplied photographs should use appropriately sized AVIF/WebP, width/height, descriptive alt text and lazy loading below the fold. New above-fold hero images should not be lazy-loaded. Keep fonts local with their licences. Regenerate or replace the 1200×630 social PNG when changing branding.

See [QA_REPORT.md](QA_REPORT.md) for measured checks and remaining launch limitations. Lighthouse targets are 95+; scores are observations, not guarantees for an untested deployment or future third-party configuration.
