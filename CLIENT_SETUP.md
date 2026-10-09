# Create a client website from this template

## 1. Duplicate and decide the package

Duplicate the repository into the client's own GitHub repository. Rename it, keep `main` as the production branch and remove the original remote if copying a local checkout. Use Node 22+.

Set `package` in `config/site.json` to `essential`, `professional` or `growth`. Essential emits one scrolling main page; Professional/Growth emit the six core pages. Privacy and 404 are utility pages; Growth also uses the success/error experience. The five/eight-page commercial allowance is for agreed main content pages; trim or add entries in `pageDefinitions` to match the client's signed scope. Do not carry a six-page reference implementation into a five-page client agreement without adjusting it.

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

Reuse the shared layout, section components, fonts, accessible navigation, form shell and SEO generation. Remove unused modules, then make navigation match the retained pages. Essential links are rewritten to homepage sections; retain matching section IDs or update `context()` when changing the information architecture. Add pages by adding a definition with unique `slug`, `nav`, `title`, `description` and `render`.

Only publish approved facts. Do not invent reviews, outcomes, awards or business credentials. Replace proof placeholders with verified work and permission-cleared descriptions. Human review is required for AI-assisted copy.

## 4. Set search and integrations

Update unique titles/descriptions in page definitions, the social image and location copy. Review `schemaFor()` for the client's appropriate business type; do not use a local-business address without verified details. The build generates canonicals, sitemap, robots and breadcrumbs. FAQ content is visible, but FAQ rich-result markup is deliberately not added to this ordinary service website.

Configure Google Analytics/Search Console and optional Growth lead capture using README instructions. Essential/Professional must not acquire a hosted form by accident. Confirm provider notifications, quotas, recurring costs and external workflow scope. Never put secrets in browser code.

For each Growth client, create their own Formspark form and replace `form.endpoint`; never retain Follent's endpoint. Choose `form.formtrackEnabled` explicitly: it is enabled for Follent and defaults off when omitted. It adds attribution only from the Contact URL, with no cross-page storage. Review this collection in the client's privacy notice. The module and its CDN CSP permission are absent when the form is disabled, the package is not Growth, the provider is external, or the build is a Cloudflare preview.

After privacy approval and activation, submit a clearly labelled test enquiry to the client's form. Verify business fields (including `business_name`), package, notifications/storage, success behaviour and campaign attribution using the sample URL in README. Check `ref` and `referrer` as query parameters, plus empty/absent campaign values. Native enquiries still work if Formtrack is unavailable; attribution requires its script to load before submission. Use local mocked tests before activation and never infer email delivery from a successful HTTP response.

For an external advanced form, use `provider: "external"` plus an HTTPS `externalURL`. For a different native backend, change both HTML submission metadata and the isolated provider transport. Update privacy and CSP to match actual providers. Avoid introducing a CRM, automation SDK or Zapier dependency into the visual template.

## 5. Review privacy and migration

Provide actual privacy/retention wording and a contact address. Set `privacy.approved`, `launch.businessDetailsReviewed` and `launch.migrationReviewed` only after the corresponding reviews. If no prior site exists, record that in the URL map and mark the migration review complete. Archive client site content and a URL inventory before any replacement. Approved redirects are explicit config entries:

```json
{ "from": "/old-service/", "to": "/services/", "status": 301, "reviewed": true }
```

Review targets and loops. Do not redirect unrelated deleted URLs to the homepage. Do not use the reference Follent ecommerce destination for a different client's migration.

## 6. Build, QA and launch

Follent currently uses Workers Static Assets; follow [the current Workers instructions](README.md#cloudflare-workers-deployment-current-follent-setup) for that deployment. The following Pages procedure is an alternative for client projects using Pages. Both serve the same generated static site; do not mix their domain registration or deployment settings.

Follow [README's Cloudflare Pages instructions](README.md#cloudflare-pages-deployment). Choose **Pages → Connect to Git**, rather than the Workers screen with Wrangler commands. For an interim domain use main, framework None, `npm run build -- --preview`, output `dist`, repository root and `NODE_VERSION=22`. Register the subdomain through Pages before adding its CNAME; preserve existing-site and mail DNS. The explicit preview flag disables enquiries/analytics and indexing on main. After launch review, switch to `npm run build`, redeploy and connect the final domain. Keep independent staging on a preview branch or separate project afterward.

```sh
npm run build
npm test
npm run check
npm run check:launch
npm run preview
```

Review real phones and desktop browsers, keyboard navigation, form delivery, spelling, GST amounts and every CTA. Run Lighthouse and accessibility checks on the final configured site; changing fonts, photos or scripts can change results. Use [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md), deploy a separate Cloudflare Pages project, connect the approved domain manually and monitor enquiries and search indexing after launch.

Privacy copy is business-specific in `src/pages/privacy-policy.mjs`. Replace Follent’s operator, email/CRM arrangements, retention and provider disclosures when cloning; configuration alone does not rewrite these facts.
