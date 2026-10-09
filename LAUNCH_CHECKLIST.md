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
- [ ] Run build, tests, generated checks and launch check; validate HTML and JSON-LD.
- [ ] Review all pages at phone, tablet and desktop sizes, navigation without JavaScript, contrast, focus, touch targets, reduced motion and alt text.
- [ ] Check unique titles/descriptions, canonical URLs, social image, sitemap, robots and pricing consistency.
- [ ] Measure Lighthouse performance/accessibility/best-practices/SEO; investigate scores below 95.

## Domain cutover — manual, after migration review

- [ ] Confirm hosting type: Follent's current deployment is Workers Static Assets. Follow README's Workers instructions for dev; use the Pages-specific items below only for Pages projects. Verify the deployed commit, explicit preview flag, headers and custom 404s before cutover.
- [ ] For interim dev, choose Pages Git integration (not Workers/Wrangler), main, `npm run build -- --preview`, `dist`, Node 22; register dev in Pages before adding its CNAME. Preserve old-site and mail DNS.
- [ ] Verify dev noindex headers/HTML, blocked crawling and disabled forms/analytics; deploy normal dist, not unpublished privacy-review output.
- [ ] At approved cutover, remove `--preview`, redeploy and inspect production output before routing the apex. Decide whether dev should move to a preview branch or separate staging project.
- [ ] Connect GitHub to Cloudflare Pages: `main`, `npm run build`, `dist`, Node 22.
- [ ] Test a branch preview; ensure noindex and disabled enquiries/analytics.
- [ ] Preserve DNS email records; add the custom domain through Pages and verify SSL.
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
- [ ] Retire the old site only after reviewed cutover acceptance; retain backups securely.
