# Stage 2 Pages launch report

Date: 22 October 2026 (Australia/Sydney). Status: **Stage 2 accepted; apex cutover and Flywheel alias cleanup complete**.

Final acceptance recorded 22 October 2026, 20:26 AEDT.

The [Stage 1 archive](wordpress-archive/STAGE1_REPORT.md) remains hosted on Flywheel. This stage affects FOLLENT hosting/configuration and a small shared ENGINE loading correction.

## Deployed source and project

| Item | Verified value |
| --- | --- |
| Repository | jrjflint/follent-net |
| Pages project | follent-net |
| Project ID | 1ab60ab8-8c22-4c86-8d5a-b2980969406a |
| Production branch / framework / root | main / None / repository root |
| Production build / output / Node | npm run build / dist / NODE_VERSION=22 in both environments |
| Reviewed deployed source | 923ba6bed809bdfb973bb863db07e9e70532b55c |
| Production deployment | a399e64e-4545-4977-9d47-e11ca92a81b8 |
| Production domains | https://follent.net/ and www.follent.net, both active |
| Separate Pages staging | https://staging.follent-net.pages.dev |
| Staging deployment | cf5a3a5d-d6c2-4d00-b0f5-066a54dcde77 |

Preparation commit 0a930186290ccdf2a02cc8d9c08abdac8f2d3009 added the approved archive mappings and moved root Wrangler configuration to [historical evidence](../docs/architecture/WORKERS_CONFIG_2026-10-22.jsonc). The deployed commit corrected late mobile navigation/consent layout shifts. Documentation-only commit 33b73aa records preparation evidence and was intentionally skipped by CI; the deployed source remains the reviewed code commit above.

Existing uncommitted migration work was preserved. Its original URL map is saved in ignored .qa/stage2-recovery. No private exports, credentials, customer/order records or generated deployment output were committed.

Fresh builds pass under approved filesystem execution. Restricted execution cannot unlink generated output; no broad filesystem ACL changes were made.

## Reviews and preservation

The owner confirmed legal name, ABN, Sydney service area, public project/privacy contacts, absence of public phone/street address, package pricing and managed-service pricing in chat on 22 October. The owner also approved the [route decisions and exact mappings](../migration-url-map.md). Only after those confirmations were businessDetailsReviewed and migrationReviewed enabled. Existing privacy approval and retention wording were retained.

The existing Worker continues to serve dev.follent.net with preview-safe output. Its build trigger now selects workers-retained instead of main, preserving the deployed Worker while Pages receives main pushes. No Worker, preview containment rule or unrelated jamesfollent Pages project was deleted or changed. Restore the former Worker trigger selection only with its historical source configuration and explicit preview build.

## Cutover and DNS

- Registered apex and www through Pages Custom Domains before changing DNS.
- Apex DNS changed at **19:37:43 Sydney**; www at **19:37:46 Sydney** on 22 October. Both former Flywheel A records are now proxied CNAME records to follent-net.pages.dev.
- Both custom domains report active verification and certificate validation. A transient HTTP 522 was observed while Pages domain activation propagated; subsequent fresh HTTPS checks pass.
- Added exact-host www canonicalisation: ruleset 22219f5e39824df4ae22785548a20046, rule 62d0c67526b740ebab46cfb3eb8db060. Expression matches only www.follent.net and redirects to HTTPS apex while preserving path/query. Archive cannot match this expression.
- Owner confirmed ftp unused and requested its Flywheel destination retained independently. Its proxied CNAME now targets follent.flywheelsites.com; no FTP protocol connection was tested.
- Archive remains a proxied CNAME to follent.flywheelsites.com with valid HTTPS and noindex.
- DNS comparison confirms **only apex, www and ftp changed**. Mail, verification, archive and all other records remain unchanged. Zone SSL remains **Full (strict)**.
- Purged affected entry URLs and all 258 exact legacy apex URLs. A cached Flywheel image initially returned 200; after the targeted purge every legacy path returns its expected 301.
- Chrome retained a previous Flywheel permanent redirect for the plain homepage. Fresh HTTP checks pass; the owner subsequently confirmed the new business homepage loads after clearing cached images/files. An agent-controlled Chrome tab still retained the earlier redirect; this does not contradict the fresh HTTPS results or owner confirmation. Final-domain Contact loads in Chrome and completes spam verification.

Private recovery/settings snapshots and DNS comparison are in ignored secrets/archive-migration-2026-10-22. Detailed public-response evidence and screenshots are in ignored .qa/stage2-recovery.

## Verification results

| Check | Observed result |
| --- | --- |
| Tests | 30 passed |
| Build / generated / documentation / launch checks | Passed |
| HTML validation | Passed |
| Reference browser QA | 40 responsive page checks, zero pages with axe violations, eight behaviour scenarios |
| Garden fixture QA | 32 responsive page checks, zero pages with axe violations, two behaviour scenarios |
| Initial Pages staging | Explicit preview build: noindex headers/HTML, blocked robots, disabled forms/analytics |
| Independent branch preview | Same reviewed source: preview true, forms false, analytics false, noindex header |
| Legacy redirects on apex | All 258 pass: 27 content and 231 media paths to matching archive paths |
| Query handling | Legacy and www tests preserve queries |
| Main pages/privacy | Seven pages return 200 with HTTPS-apex canonicals and index, follow |
| Success/error/missing | Appropriate noindex; unknown path returns custom HTML with HTTP 404 |
| Commerce removal | Cart, checkout and my-account return genuine 404 on new site |
| Security/mixed content | Expected CSP, MIME, framing, referrer and permissions headers; no mixed src/action resources detected |
| HTTP/apex/www | HTTP apex -> HTTPS apex; HTTP/HTTPS www -> HTTPS apex in one redirect; HTTPS apex has no redirect |
| Archive isolation | Homepage and nested wine-blog URL remain HTTPS 200 without apex loops |
| Sitemap | https://follent.net/sitemap.xml submitted in Search Console: Success, seven discovered pages |

Live Pages mobile Lighthouse after the shared loading correction: Home **99/100/100/100**, Contact **100/100/100/100** (Performance/Accessibility/Best Practices/SEO), Contact CLS 0. Before correction Contact Performance was 83 with CLS 0.355. Preview SEO 66 was expected from noindex and was not bypassed.

The first apex audit found automatic Cloudflare RUM beacon injection blocked by CSP, reducing Best Practices to 92. The existing Follent zone rum setting was on; it is now off. Fresh HTML confirms the injected beacon is absent. CSP was not weakened; opted-in Google analytics remain available. After propagation and the affected homepage purge, the final apex audits pass: Home 99/100/100/100 and Contact 100/100/100/100.

An intermediate local audit mixed retained preview-server headers with normal files and is excluded from production conclusions. Lab scores do not establish real-device, screen-reader or production field performance.

## Enquiry and analytics evidence

Formspark aHeuOMHHg shows active notifications to james@follent.net and the existing Gmail member, automatic spam filtering and Turnstile. Autoresponder/external automation integrations remain unconfigured; no live automation is claimed.

Managed Turnstile covers follent.net and its subdomains, dev.follent.net and the Pages project hostname. Its secret was not read, exported or committed.

The owner explicitly approved the exact initial synthetic payload and recipients. FOLLENT-LAUNCH-20261022-01 reached clean Pages /success/ and is stored exactly once, ID 1ViEsnZZ72CQN6zAIBYZ3, at 18:18 Sydney. The owner subsequently confirmed receipt at james@follent.net. This is independent notification evidence, separate from provider acceptance/storage; mailbox headers were not inspected.

The owner explicitly approved one live analytics opt-in. Before clicking, Chrome displayed the consent prompt; after clicking it closed and DOM script inspection showed the configured GTM-5F9LKZC and GA4 G-K54S78JQ7L loaders. Published GTM contains that measurement ID. Unit/browser suites cover no Google request before opt-in, decline, DNT/GPC, sanitised URLs and restricted conversion payloads. The same live test session then used Change analytics preference and Decline; it reloaded with only local analytics.js/site.js and no Google loaders. This proves opt-in and withdrawal behaviour, not a newly observed GA4 dashboard event.

The owner explicitly approved the separate final-domain test FOLLENT-LAUNCH-20261022-02. It reached https://follent.net/success/ and is stored exactly once in Formspark, ID L6x08Yd1cxVSDRfGc55PW, at 19:56 Sydney. The owner confirmed that its notification arrived at james@follent.net. No duplicate test was sent; receipt is owner-attested rather than inferred from acceptance/storage.

## Final acceptance and rollback

**All Stage 2 launch acceptance gates pass.** Apex serves the reviewed business site through Pages; www canonicalises correctly; valid HTTPS, production indexing, security headers, legacy redirects and custom 404 are verified; real final-domain enquiry acceptance, storage and owner-confirmed inbox delivery succeed. The WordPress archive remains intact.

After those gates passed, removed only www.follent.net and follent.net aliases from Flywheel at approximately 20:18 Sydney. The dashboard confirms archive.follent.net is primary with Simple SSL; the temporary follent.flywheelsites.com hostname remains. Hosting, backups, archive content and administrator access were retained.

Flywheel briefly labelled archive SSL Not Enabled and some content requests returned 502/timeouts during its post-alias reconfiguration. The supported Add SSL action re-enabled Simple SSL for the retained hostname. Direct-origin HTTPS passed with ordinary certificate validation and public HTTPS passed under Cloudflare Full (strict). The final 33-route archive crawl passes: 30 content 200 with notice/noindex, three intentional commerce/account 403, zero detected old-apex or mixed-resource references. Twelve representative archive media URLs return 200. A repeat apex sweep confirms all 258 redirects still pass.

Flywheel displays a temporary one-hour cooldown on additional SSL requests after activation; this is not a failure of the active archive certificate, and no additional certificate request is required. Local TLS inspection means local certificate issuer/expiry metadata is not treated as authoritative upstream certificate evidence.

Rollback now requires re-adding apex/www aliases to Flywheel first, restoring their recorded A records to 151.101.194.159, and disabling only the new www redirect. Verify the archive and apex behaviour afterward. Restore data only for actual content/database loss. Do not cancel archive hosting.

Final account snapshot confirms Pages custom domains active, reviewed deployed commit 923ba6bed809bdfb973bb863db07e9e70532b55c, Full (strict), automatic RUM off and the existing preview-containment WAF ruleset unchanged at version 1. Private evidence is in stage2-final-account.json under the ignored recovery directory.

## Monitoring

Search Console domain access is verified; the pre-cutover baseline showed 24 indexed and 29 not indexed pages with no Core Web Vitals field data. Sitemap discovery is not proof of indexing.

Immediate checks are recorded above. Rechecks are due **23 October 2026 around 19:40 Sydney** and **29 October 2026 around 19:40 Sydney**: apex/www/archive HTTPS, redirects and missing URLs, enquiries/provider quota, consent, Search Console sitemap/indexing and real-device performance. Future checks have not been performed or automatically scheduled.

Flywheel cancellation, archive retirement, Shopify publication and Worker deletion remain excluded. Automatic review blocks on exact test payloads and live opt-in were resolved through explicit owner approval; rejected preservation/encoding edits were replaced by targeted validated changes.
