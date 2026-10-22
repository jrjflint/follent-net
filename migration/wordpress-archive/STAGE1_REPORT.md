# Stage 1 archive migration acceptance report

Date: 22 October 2026, 17:56 Australia/Sydney (06:56 UTC).
Status: **Stage 1 accepted. Stage 2 has not started.**

This work affects the historical FOLLENT WordPress installation. The reusable business-site ENGINE and its deployment configuration were not changed.

## Accepted state

- Flywheel site `jamesfollent/follent-net` now has **archive.follent.net** as its primary domain, with valid Simple SSL and Force HTTPS enabled. The archive is public; administrator access works.
- Apex and www remain Flywheel aliases during the agreed gap. They redirect to the archive. No www.archive hostname was added.
- Cloudflare proxies the archive A record to the verified Flywheel origin `151.101.194.159`. Flywheel ownership verification TXT is present. Existing zone SSL remains **Full (strict)**. Origin HTTPS was verified directly with normal certificate validation before proxying.
- The archive displays a historical-site notice and sends noindex. Orders, payment initiation, public submissions, comments and registration are closed. Site email remains disabled.
- Historical content, products, customer/order records and administrator access are preserved. Flywheel hosting remains active.

## Recovery evidence

Original primary domain was `follent.net`, with `www.follent.net` and `follent.flywheelsites.com` aliases. DNS export, routing/settings snapshots, exports, screenshots and HTTP evidence are stored privately in ignored `secrets/archive-migration-2026-10-22/`.

| Recovery item | Verification |
| --- | --- |
| Flywheel pre-change checkpoint **523652103** | Completed 22 October 01:57 UTC; description: Stage 1 archive migration - recovery checkpoint before changes - 22 October 2026 |
| Flywheel frozen-state checkpoint **523661074** | Completed 22 October 02:21 UTC, before primary-domain switch |
| Downloaded Flywheel ZIP | 399,526,999 bytes; all 21,088 entry CRCs passed; backup.sql, uploads, plugins and themes present |
| Additional full WordPress export | 855,123,531 bytes; 17,540 entries; database, plugins, themes, uploads and terminal record structurally verified |

Flywheel ZIP SHA-256: `110db405164422f4b3b7a03bd8abe4b78e467afcdafeda7bcfc3ca7636e71355`.

Additional export SHA-256: `52c02416f70c8c365f29c3a3c77c81cc8c8de0de0408955c88d2b44af28f45d0`.

The owner confirmed the downloaded ZIP came from today's requested checkpoint; its filename contains 21 October, potentially reflecting timezone differences. File integrity was independently verified; checkpoint association relies on owner confirmation. These are archive-integrity checks, **not a restoration test**. Private customer/order data is excluded from this report and the committed public inventory.

## Applied controls and URL repair

Installed and activated [Follent Read-only Archive](follent-readonly-archive.php), version 1.0.1. Its [maintenance and rollback instructions](README.md) accompany this report. WordPress search-engine discouragement is enabled. Stripe Gateway, Mailchimp and Mailchimp for WooCommerce are inactive; WooCommerce is retained for historical records and product content.

The guard permits ordinary administrator management and the exact Flywheel direct-login callback, while rejecting public writes, commerce action requests and REST write-method overrides. The initial version blocked Flywheel automatic login; version 1.0.1 corrected that exception. The owner completed a fresh standard archive login successfully.

Flywheel's primary-domain workflow updated site URLs. Remaining stored content and SEO URLs were repaired with official Better Search Replace using dry runs and only the posts, postmeta, Yoast indexable and Yoast SEO links tables. GUID replacement remained off. The first pass changed 220 cells in 171 updates; a subsequent dry run found no remaining matches for that slash-terminated URL. A second narrow pass corrected bare apex references, including the Instagram Store link. The final full crawl confirms zero detected old-apex references. Better Search Replace is now deactivated.

## Acceptance checks

Final full crawl: **22 October 2026, approximately 06:55 UTC**. Detailed timestamped responses are retained privately.

| Check | Observed result |
| --- | --- |
| Published inventory | 11 posts, 13 pages, 9 products: 33 URLs checked |
| Content availability | 30 URLs return 200, each with noindex and archive notice |
| Commerce/account pages | Cart, checkout and my-account return intentional 403 with read-only explanation |
| Links/assets | Zero detected old-apex references or mixed-content src/action resources across all 33 responses |
| Media | 12 representative media URLs return 200 |
| Public writes | Comments, admin AJAX, admin-post, REST checkout and REST method override return 403 |
| Payment/registration entry points | Checkout, add-to-cart, wc-ajax checkout and registration return 403; no payment/order was submitted |
| XML-RPC | Empty POST rejected by host with 422; guard also blocks the script when WordPress dispatch reaches init |
| Search/navigation | Public product search returns 200; browser navigation points to archive content |
| Robots | Physical robots.txt allows ordinary content paths; no site-wide crawl block prevents reading noindex |
| Administrator access | Fresh archive login and subsequent administration verified |
| HTTPS/redirects | Ten HTTP/HTTPS apex, www and archive cases passed with final 200; tested nested path/query preserved |
| Browser homepage | Owner confirms plain archive homepage loads after clearing cached images/files; screenshot retained |

HTTPS apex/www each redirect once to HTTPS archive. HTTP apex/www first canonicalise to HTTPS, then redirect to archive. HTTP archive redirects once to HTTPS archive; HTTPS archive root returns 200 without redirect.

The earlier plain-homepage loop was a stale cached alias redirect. Flywheel support was contacted with explicit owner authorisation and performed a cache purge. Current plain public requests return 200. Browsers that previously cached the permanent redirect may retain it; clearing cached images/files resolved the owner's browser. No certificate validation or SSL setting was weakened.

Automated checks cover the inventoried public routes and representative media/endpoints, rather than every possible plugin extension or media file. Historical theme links to cart/account remain visible but lead to the intentional read-only response. No unresolved critical Stage 1 errors remain.

## Local verification

- `npm test`: 30 tests passed.
- `npm run build`: 10 Growth pages generated.
- `npm run check`: 10 HTML pages, zero failures.
- `npm run check:docs`: passed before this final report; repeated after the report update.

These checks do not establish production business-site form delivery or launch readiness. No business/migration approval flags were changed.

## Rollback and next gate

For routing rollback, make `follent.net` primary in Flywheel again and restore changed DNS/routing from the private snapshot as required. Retain archive controls unless reopening commerce is separately intended. Verify apex HTTPS, nested redirects and administrator access afterward.

For actual content/database recovery, use Flywheel Backups, select the recorded checkpoint and Restore, then verify content and routing. Restore only when necessary; no restoration was performed during this migration.

**Stop at this Stage 1 acceptance report before Stage 2 execution.** The existing Worker/dev site, its containment rules, the unrelated jamesfollent Pages project, mail records and apex/www DNS were untouched. No Pages deployment, Shopify publication, Flywheel cancellation or Worker deletion occurred.

Stage 2 still requires the reviewed deployment commit, exact legacy mappings, factual business and migration reviews, provider/privacy checks and actual enquiry notification delivery. The existing review safeguards remain in place.
