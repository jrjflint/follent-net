# Stage 2 Pages launch report

Date: 22 October 2026 (Australia/Sydney). Status: **in progress; no apex/www cutover**.

Stage 1 is accepted; see [archive report](wordpress-archive/STAGE1_REPORT.md).

## Source and project

- Base commit: 0a9afd0b1fddff98f8e791536bebd0422bc5e1f8. Existing migration work is preserved, including the former map in ignored .qa/stage2-recovery.
- Pages project: follent-net; ID 1ab60ab8-8c22-4c86-8d5a-b2980969406a; hostname https://follent-net.pages.dev.
- Git integration: jrjflint/follent-net; production branch main; framework None; root repository; output dist; NODE_VERSION=22 in both environments.
- Initial build: npm run build -- --preview. Automatic builds initially paused until the reviewed source is published.
- Root wrangler.jsonc removed from Pages source; [historical configuration](../docs/architecture/WORKERS_CONFIG_2026-10-22.jsonc) retained. Existing Worker, dev hostname and containment rules remain.
- Fresh builds pass using approved filesystem execution. Restricted execution cannot unlink generated output; this is an environment permission restriction, not a read-only source file. No broad filesystem ACL changes were made.

## Mapping and review gates

[Exact URL map](../migration-url-map.md) now uses the verified archive, preserves new routes and privacy, excludes commerce/account destinations and leaves unknown URLs as 404s. Media destinations: 231 verified 200 responses; source/response evidence in ignored .qa/stage2-recovery/media-verification.json.

Owner confirmed the listed factual business details and approved all route decisions in chat on 22 October 2026. Business-details and migration review flags are now true. Privacy retains its previously recorded approval; current provider dashboard, Turnstile hostname, consent and actual enquiry notification delivery still need verification. No launch safeguard will be bypassed.

## Pending verification and cutover

Record reviewed/deployed commit IDs, test/browser/HTML/Lighthouse results, deployed headers/redirects/404s and preview safeguards here. Then obtain factual and migration reviews, verify integrations and production output before registering apex/www. Preserve archive, mail and unrelated records; review ftp dependency. Only remove Flywheel apex/www aliases after Pages acceptance.

Stage 2 is not accepted. No Pages custom domains or apex/www DNS changes have been made.

Worker preservation: automatic Worker builds now select only workers-retained, separating them from main. The deployed Worker/domain and containment remain untouched. Restore the original main trigger selection only with the historical Wrangler source and explicit preview build.

## Verified staging and production preparation

Owner confirmed staging homepage loads in Chrome. Initial preview deployment fb8594fb-fe27-4772-8d49-8c07f5d41fca served commit 0a930186290ccdf2a02cc8d9c08abdac8f2d3009 with forms/analytics disabled, HTML/header noindex and blocked robots. All 258 exact redirects passed on Pages, including a query-preservation check; unknown paths served the custom 404 with HTTP 404.

Owner confirmed factual details and approved route decisions before source approval flags were enabled. Source commits: 0a930186290ccdf2a02cc8d9c08abdac8f2d3009 (Pages/redirect preparation), then 923ba6bed809bdfb973bb863db07e9e70532b55c (first-paint layout correction). Production Pages build command is now npm run build; deployment a399e64e-4545-4977-9d47-e11ca92a81b8 successfully serves the latter commit. This production output is initially reviewed on Pages before apex DNS changes.

Automatic non-main safeguards were independently deployed on staging: cf5a3a5d-d6c2-4d00-b0f5-066a54dcde77, alias https://staging.follent-net.pages.dev, same source commit.

Tests: 30 passed; generated checks, docs and launch checks pass; HTML validation passes. Reference browser QA: 40 responsive page checks, zero pages with axe violations, eight behaviour scenarios. Garden fixture: 32 responsive page checks, zero pages with axe violations, two behaviour scenarios. Mocked external-service checks do not establish actual notification delivery.

Live Pages mobile Lighthouse after the shared layout fix: Home 99/100/100/100, Contact 100/100/100/100 (Performance/Accessibility/Best Practices/SEO); Contact CLS 0. Before the fix Contact measured 83 Performance with CLS 0.355. Preview SEO 66 is expected from noindex and was not bypassed. An intermediate local run mixed retained preview-server headers with normal files and is excluded from production conclusions.

## Provider and operational checks

- Formspark aHeuOMHHg: active notifications to james@follent.net and the existing Gmail member; automatic spam filtering on; Turnstile enabled; autoresponder and external automation integrations remain unconfigured. No new automation is claimed.
- Turnstile managed widget covers follent.net (including subdomains), dev.follent.net and the Pages project hostname. Its secret was not read, exported or committed.
- Published GTM container contains configured GA4 measurement ID. Unit/browser tests verify opt-in, decline, DNT/GPC and restricted conversion payloads; current live inbox/Google receipt are distinct checks.
- Owner explicitly approved one exact synthetic test payload and recipients. Marker FOLLENT-LAUNCH-20261022-01 reached clean Pages /success/ and is stored once in Formspark, ID 1ViEsnZZ72CQN6zAIBYZ3, at 18:18 Sydney. Inbox confirmation remains pending.
- Search Console domain property is accessible: baseline overview shows 24 indexed / 29 not indexed pages, no Core Web Vitals field data. These are pre-cutover historical-site figures.
- Owner confirmed ftp unused and requested its Flywheel destination be preserved independently. CNAME now points to follent.flywheelsites.com, retaining proxy state; no FTP protocol connection was tested.
- Fresh pre-cutover DNS/ruleset/SSL/project snapshot is stored privately. Archive is currently a proxied CNAME to follent.flywheelsites.com in the account, remains HTTPS 200/noindex; it is preserved. dev still serves its original preview-safe Worker output.

## Monitoring dates

Immediate launch verification must be recorded after cutover. Follow-up checks are due 23 October and 29 October 2026 (Australia/Sydney): apex/www/archive HTTPS, redirects/404s, enquiries/provider quota, consent and Search Console indexing/sitemap. Future checks have not been performed or scheduled by this report.

Automatic approval review initially blocked a generic test submission until the exact payload/recipients were owner-approved; one approved test was then sent. Two local edit commands were rejected for preservation/encoding risk; safer targeted edits were used and validated. No rejected action was bypassed.
