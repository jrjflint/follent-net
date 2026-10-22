# Launch checklist

## Before deployment

- [ ] Approve page count, package scope, prices in AUD ex GST, recurring services and third-party fees.
- [ ] Verify legal/business details, contact channels, brand assets, content accuracy and permissions.
- [ ] Replace all preview/setup messages and proof placeholders as appropriate.
- [ ] Approve privacy notice, retention and privacy contact; set review flags truthfully.
- [ ] Configure Formspark and optional Turnstile, test storage/notifications/routing, check quota and spam folders.
- [ ] Choose Formtrack setting, review campaign-data disclosure and verify Contact-URL attribution, `ref`/`referrer`, absent parameters and single script loading. Confirm the client's endpoint replaces Follent's when cloning.
- [ ] Confirm success and failure paths, invalid inputs, keyboard operation and native submission without JavaScript where no optional challenge is required.
- [ ] Review optional analytics consent and successful-submission conversion tracking; configure Search Console.
- [ ] Inventory and back up the existing site; approve URL mappings. Do not retire WordPress yet.
- [ ] Run build, tests, generated checks, `npm run check:docs` and launch check; validate HTML and JSON-LD. Follow README for authoritative commands/hosting and CLIENT_SETUP for cloning; dated reports do not prove current deployment state.
- [ ] Review all pages at phone, tablet and desktop sizes, navigation without JavaScript, contrast, focus, touch targets, reduced motion and alt text.
- [ ] Check unique titles/descriptions, canonical URLs, social image, sitemap, robots and pricing consistency.
- [ ] Measure Lighthouse performance/accessibility/best-practices/SEO; investigate scores below 95.

## Domain cutover — manual, after migration review

- [ ] Confirm hosting type and actual account settings. Follent Stage 2 is authorised for Pages; preserve its existing dev Worker. WordPress Stage 1 is accepted on archive.follent.net. Follow the matching README procedure, not both. Verify deployed commit, preview state, headers and custom 404s.
- [ ] For interim staging use `npm run build -- --preview`, `dist` and Node 22; verify noindex headers/HTML, blocked crawling and disabled forms/analytics. Never deploy `.qa/privacy-review`.
- [ ] Workers only: verify `wrangler.jsonc`, separate production/Previews Base build commands and Worker custom domains. Both staging builds require `--preview`; preserve the owner-approved correction in [Workers evidence](docs/architecture/WORKERS.md). Do not add a Pages CNAME; verify deployed routing/headers after an authorised deployment.
- [ ] Pages only: use Git integration, framework None, main, `dist`; register its custom domain through Pages before following its DNS instructions. Automatic non-main safeguards apply only with Pages environment variables; Workers staging requires explicit `--preview`.
- [ ] At approved cutover, remove `--preview`, redeploy and inspect production output before routing the apex. Keep dev.follent.net on its existing Worker; use Pages branch previews for staging.
- [ ] Test a branch preview; ensure noindex and disabled enquiries/analytics.
- [ ] Preserve DNS email records; add custom domains through the chosen platform and verify SSL. No nameserver/domain changes are implied by repository pushes.
- [ ] Configure www-to-apex and HTTP-to-HTTPS handling; verify no loops and preserved paths.
- [ ] Test approved old-path redirects, product destinations and removed URLs on the deployed domain.
- [ ] Verify deployed security headers and enabled third-party functionality.
- [ ] Run an end-to-end enquiry test with approved non-sensitive details; verify actual inbox delivery.
- [ ] Keep the existing site backup and prior deployment available for rollback.

## After launch

- [ ] Confirm domain responses, navigation, form delivery and monitored workflow execution.
- [ ] Submit sitemap and review indexing in Search Console; monitor 404s and redirect errors.
- [ ] Recheck performance on the production domain and a real mobile connection.
- [ ] Confirm analytics consent and conversion events if enabled.
- [ ] Review form quota, spam false positives, provider alerts and notification delivery regularly.
- [ ] After Pages acceptance, remove only apex/www Flywheel aliases; retain archive hosting and backups. Hosting cancellation and archive retirement are excluded.
