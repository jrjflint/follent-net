# QA report — 9 October 2026

## Observed results

The website was tested locally in headless Google Chrome on Windows, using Node 24.14.1. The project supports Node 22+. These results cover the supplied preview configuration, with analytics and live enquiries disabled. They do not certify a future deployment or third-party service delivery.

| Main page | Performance | Accessibility | Best practices | SEO | Mobile LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 100 | 100 | 100 | 100 | 1.7 s | 0 |
| Services | 100 | 100 | 100 | 100 | 1.5 s | 0 |
| Pricing | 100 | 100 | 100 | 100 | 1.7 s | 0 |
| Process | 100 | 100 | 100 | 100 | 1.5 s | 0 |
| About | 100 | 100 | 100 | 100 | 1.5 s | 0 |
| Contact | 100 | 100 | 100 | 100 | 1.7 s | 0 |

Lighthouse 13.5.0, default mobile emulation/throttling, localhost preview. Local LCP and CLS are lab measurements, not field Core Web Vitals. Initial heading-order findings on Pricing and Process were corrected and those pages remeasured. Screenshots also informed corrections to desktop menu visibility and restrained Bordeaux usage.

## Checks performed

- **Build/tests:** six Node tests passed, including Essential/Professional/Growth boundaries, native redirect fields, form transport success/HTTP/network failures, protected output-directory handling, conditional Formtrack loading/CSP and the submitted-field/selector contract.
- **Generated output:** all ten reference HTML pages passed internal link/asset/anchor checks, unique title/description checks, canonical and JSON-LD parsing checks. Essential's three output pages and the ten-page Professional/Growth variants passed their own link checks.
- **HTML:** html-validate 11.16.2 recommended rules passed on all reference pages. `long-title` and telephone non-breaking formatting rules are disabled; other recommended rules remain active.
- **Responsive/accessibility:** 40 page-and-width combinations at 320, 390, 768 and 1440 pixels passed horizontal-overflow and single-h1 checks. Axe 4.13.0 found zero violations against WCAG A/AA through 2.2 and its best-practice rules. This does not replace manual assistive-technology testing.
- **Keyboard:** skip link reaches main; mobile menu opens/closes and Escape restores focus. Focus styling and reduced-motion layouts were reviewed.
- **Progressive enhancement:** navigation and primary content remain visible without JavaScript; unconfigured forms are disabled in HTML, not merely through a script.
- **Form behaviour:** mocked success, HTTP error and network failure paths passed; invalid required fields send no request, package query preselection works, errors retain input and focus the status message. Native no-JavaScript POST was tested with mocked success and error redirects, including `_append=false`. No real lead was sent.
- **Analytics:** a local test configuration and mocked GA script confirmed no request before consent or after decline, loading after opt-in, sanitised page location and a conversion event containing only the selected package. Production configuration remains blank.
- **SEO/security:** unique titles, descriptions, canonicals, Open Graph/Twitter metadata, social image, sitemap, robots, business/breadcrumb JSON-LD and CSP script hashes are generated. Local preview serves global security headers. Business details are not fabricated; unavailable address/contact/ABN fields are omitted.
- **Visual:** generated screenshots reviewed for the typography, ivory-led layout and mobile/desktop composition. The illustration is a labelled design study, not claimed client work.

## Reproduce the checks

```sh
npm run build
npm test
npm run check
node scripts/check.mjs --dir .qa/essential
node scripts/check.mjs --dir .qa/professional
node scripts/check.mjs --dir .qa/growth
```

The optional browser tools are deliberately excluded from runtime dependencies. Install pinned QA versions into the ignored directory:

```sh
npm install --prefix .qa/tools --no-save playwright@1.64.0 @axe-core/playwright@4.13.0 lighthouse@13.5.0 html-validate@11.16.2
node scripts/browser-qa.mjs
```

Set `CHROME_PATH` if Chrome is installed elsewhere. Browser QA uses local ports 4175–4177, produces screenshots and JSON evidence under `.qa/`, creates local fixture configurations and mocks all form/GA requests. It regenerates `assets/images/social.png` from configured branding; run `npm run build` after regenerating the image if exporting it separately. For image export alone: `node scripts/browser-qa.mjs --social-only`.

Run `npm run preview` in another terminal, then:

```sh
node .qa/tools/node_modules/html-validate/bin/html-validate.mjs "dist/**/*.html"
node scripts/lighthouse-qa.mjs
```

On Windows the installed `.qa/tools/node_modules/.bin/html-validate.cmd` launcher is also available. Lighthouse supports a page subset, for example `node scripts/lighthouse-qa.mjs pricing how-it-works`. Evidence is in `.qa/browser-results.json`, `.qa/lighthouse-summary.json`, per-page Lighthouse JSON and `.qa/screenshots/`.

## Launch prerequisites and limitations

### Formspark plan re-audit — 9 October 2026

Rechecked the implementation against the supplied plan and current official Formspark attribution/spam guidance. Six Node tests, the production build, all three package link checks, and HTML validation of both the disabled reference site and enabled form fixture passed again. The ten mocked attribution scenarios and four enabled-form responsive/accessibility checks also passed again, with zero axe, script or CSP errors. Full-site browser QA passed 40 responsive page checks and eight behaviour scenarios, including keyboard access and native success/error fallback. A punctuation typo in the form's attribution notice was corrected; prices and configuration were preserved.

The fresh enabled-fixture Contact Lighthouse audit scored 100 in all four categories, with mobile LCP 1.7 seconds. The real Formtrack CDN entry returned 302 and its versioned script returned 200, with no console errors. This was a local lab audit without submission, not live Formspark delivery evidence. Privacy approval remains false, contact/retention fields remain empty, and live submissions remain disabled. The five existing launch-readiness failures remain outstanding. Activation, one clearly labelled live test, dashboard field/attribution confirmation and notification delivery verification are still required before declaring the live connection complete.

### Formspark/Formtrack integration update

The supplied Formspark endpoint is now configured centrally, with `form.formtrackEnabled: true`. Privacy approval/contact/retention values remain incomplete, so **real submissions and Formtrack loading are still disabled** in the supplied preview. No real enquiry was sent and no provider storage or notification delivery is asserted.

The shared wordmark has also been updated to **James Follent**, including generated reference artwork and the social image. The full-site 40-width/page checks passed with the longer name; a small narrow-phone font adjustment was then verified to keep the wordmark and menu on one row at 320px. The business/trading name remains Follent.net.

Ten additional form/attribution scenarios passed using the actual Formtrack 0.1.39 script cached from the public CDN, with every form submission mocked: all seven parameters including encoded Unicode/special values, absent parameters, delayed loading before submission, submitting before loading, blocked script, all eight selector values, HTTP/network failures with repeated-submit protection, native POST when enhancement fails, and native POST without JavaScript. Four enabled-form layouts at 320/390/768/1440px had no axe violations, script errors or CSP errors. These tests also verified required/email/URL validation and successful field mapping, including `business_name`.

An additional Lighthouse 13.5.0 mobile audit of the enabled **local fixture** Contact page scored **100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO**. This audit loaded the real remote Formtrack script: the package URL returned 302 and its versioned script returned 200, with no console errors. It did not submit an enquiry. Evidence is `.qa/lighthouse-contact-formtrack.json`; baseline main-site measurements above remain separate from this fixture audit.

To reproduce the dedicated mocked attribution checks after installing the optional browser tools:

```sh
curl -L --fail https://unpkg.com/@formspark/formtrack -o .qa/formtrack.global.js
node scripts/formtrack-qa.mjs
```

On Windows use `curl.exe` if `curl` is a PowerShell alias. The test serves `.qa/formtrack` on port 4180 and writes `.qa/formtrack-results.json` and enabled-form screenshots. The real endpoint is replaced with a dummy endpoint in this disposable fixture, and every provider request is intercepted. The requested CDN URL is unversioned; retest when its library changes. Actual Formspark receipt and email notifications remain a separate, clearly labelled test **after privacy activation**.

After owner-approved privacy/retention activation on 9 October 2026, `npm run check:launch` reports three outstanding items: migration review, business-detail review and a live contact option. The form/privacy activation checks now pass. This is a launch-readiness failure, not a hidden passing check.

Before cutover, verify actual Formspark receipt/storage/email delivery, spam settings and any Turnstile challenge, real notification routing/workflows, GA/Search Console configuration, final privacy wording and client permissions. Live Turnstile was not tested without credentials. Recheck Lighthouse after enabling third-party services or adding images.

On 9 October 2026, an owner-authorised isolated localhost fixture sent three synthetic tests to the actual Formspark endpoint. Enhanced JSON transport returned HTTP 200; native submission and a same-origin native retest produced correct stored records, with the retest reaching a clean success URL. The owner explicitly confirmed all three matching notifications received at james@follent.net. See [the form evidence report](docs/form-e2e/REPORT.md) for IDs, field comparisons, screenshots, the initial fixture redirect mismatch and evidence limitations. Test records were retained. The owner subsequently approved activation and supplied ordinary retention wording. Normal Growth builds now enable Formspark; preview builds remain disabled. Deployed-origin and launch verification remain separate.

Activation validation: six Node tests pass, ten generated pages check with zero failures, and the updated browser QA passes 40 responsive checks with no axe violations and eight behaviour scenarios. The no-JavaScript check now follows normal build configuration and independently confirms preview submissions stay disabled. The separate full-policy review passes all four viewport/accessibility checks with 28 clauses. The privacy route remains `/privacy-policy/`.

The old WordPress/WooCommerce URL inventory and assets remain unavailable. No live migration redirects are asserted; the generated `_redirects` contains only a comment until reviewed mappings are supplied. DNS, custom-domain SSL, deployed Cloudflare path-specific headers and redirects, Google rich-result eligibility and field performance must be checked after authorised deployment. Real-device, screen-reader and cross-browser reviews remain launch checklist items.
Privacy revision evidence (9 October 2026): six tests, ten-page build/output checks, 40 mocked responsive checks/eight behaviour scenarios and four dedicated policy-review layouts passed. **Correction, 12 October:** normal `/privacy-policy/` still uses the brief renderer; the nine-statement/28-clause policy was tested only in the separate review output. The earlier assertion of normal integration was incorrect. The numbered review copy records owner-confirmed Microsoft mail/MFA and Twenty retention, not the normal brief notice. See `docs/privacy-policy/REVIEW.md` and architecture T02. Earlier HTML validation reported a Contact `unique-landmark` issue; no new browser/HTML-validation run is claimed here.

Architecture review (12 October 2026): six Node tests, normal ten-page build/check and test-generated package checks pass (3/10/10). Safe synthetic gardening clones pass structural checks (3/10/10); copied-settings preview passes (10), with forms/Analytics/Formtrack disabled and noindex output. Copying only identity keeps Follent integrations active; resetting them does not replace website-service copy/pricing/schema. No live submissions, browser/Lighthouse rerun or tracked social-image generation was performed. Evidence and all open implementation tasks: `docs/architecture/REVIEW.md` and `TASKS.md`; ignored `.qa/architecture/results.json` stores local results.
