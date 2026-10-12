# GTM and Formspark conversion setup

Source implementation: 12 October 2026. These instructions target Follent's existing GA4 property, not Google Ads. Repository changes do not publish a container, deploy the website or prove Google receipt.

The owner subsequently authorised Chrome dashboard setup and publication: [dated dashboard evidence](DASHBOARD_EVIDENCE.md) records published Version 2, key-event registration and one synthetic local enquiry received in GA4 DebugView. Website source deployment remains separate.

## Website behaviour

`analytics.tagManagerId: "GTM-5F9LKZC"` selects GTM on all normal Professional/Growth output pages, including utility pages. The shared layout places the local loader immediately after the head charset. It loads the async GTM container only after analytics opt-in. Essential and explicit/Cloudflare Pages previews omit the loader and Google permissions. DNT/GPC prevent activation even with a saved allow preference.

The standard unconditional inline snippet and noscript iframe are not pasted: the iframe would bypass the existing opt-in preference and inline code is unnecessary under the CSP. Native no-JavaScript form submissions continue without conversion tracking. Advertising consent remains denied; do not add advertising tags under the analytics-only choice.

After Formspark HTTP acceptance, enhanced submission pushes this data-layer event (plus a callback and 800 ms timeout):

```js
{ event: 'generate_lead', package: 'growth' }
```

Only the declared public select choice is included; empty choice becomes `unspecified`. The form waits for dispatch or the timeout, then redirects to `/success/`. Validation failures, honeypot rejection and provider/network failures emit no lead. A blocked GTM script still allows successful enquiries. HTTP acceptance does not prove inbox delivery. A success-page view is not a verified submission and must not be a conversion trigger.

## Configure the GTM workspace

Inspect existing tags first, particularly GA4 and form/click triggers. Modify existing equivalents instead of adding duplicate Google tags or conversion events. The website no longer loads direct GA4 when `tagManagerId` is populated.

1. Open container **GTM-5F9LKZC**. Create three **Data Layer Variables**, Version 2: names `DLV - page_location`, `DLV - page_referrer`, `DLV - package`; data-layer keys `page_location`, `page_referrer`, `package` respectively.
2. Create or update a **Google tag** with tag ID **G-K54S78JQ7L**. Set configuration parameters `page_location = {{DLV - page_location}}` and `page_referrer = {{DLV - page_referrer}}`. Use **Initialization – All Pages**. Require additional consent **analytics_storage**. GTM itself is loaded only after opt-in; the consent update is queued before the container starts.
3. Create a **Custom Event** trigger named `Formspark accepted lead`, event name **generate_lead**, exact match, all custom events. This follows the website's provider-acceptance hook. Do not use GTM's Form Submission or submit-button click trigger.
4. Create or update a **Google Analytics: GA4 Event** tag. Measurement ID **G-K54S78JQ7L**, event name **generate_lead**, event parameter `package = {{DLV - package}}`. Also set `page_location` and `page_referrer` to the sanitised variables above so events do not default to a query-bearing URL. Attach only the accepted-lead trigger and require **analytics_storage**.
5. In the GA4 web stream, review Enhanced Measurement: disable **Form interactions** to avoid counting automatic `form_submit` events as accepted leads. Review/disable other unnecessary automatic events and avoid any configuration that sends full URLs or enquiry values. In GA4 Admin → Data display → Events, mark **generate_lead** as a **key event** (create the event entry if it has not arrived yet). Do not mark `form_submit` or success-page views as accepted-enquiry key events.
6. Preview and test the workspace before publishing it. Use only Google/GA4 tags supported by the existing narrowly scoped CSP. Custom HTML, advertising or other providers require a separate privacy/security review; do not enable unsafe-inline/eval or broad origins to make them work.

Google documents [GA4 tags in GTM](https://support.google.com/tagmanager/answer/9442095), [custom event triggers](https://support.google.com/tagmanager/answer/7679219), [basic consent mode](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic), [GTM consent checks](https://support.google.com/tagmanager/answer/10718549) and [marking key events](https://support.google.com/analytics/answer/13128484). Container configuration is required to preserve the site's sanitised URL behaviour; data-layer values alone do not override a misconfigured tag. The existing Google permissions cover the loader and Analytics collection. [Google's CSP guidance](https://developers.google.com/tag-platform/security/guides/csp) lists further permissions for optional advertising, service-worker and preview features; these remain disabled/blocked here. Review actual deployed requests before enabling additional features.

## Verify before declaring tracking live

Local browser QA intercepts provider and Google requests; no real enquiry or Google hit is sent. Use `node scripts/browser-qa.mjs` and `--fixture garden` as documented in [QA_REPORT](../../QA_REPORT.md). Node tests additionally cover DNT/GPC, stored consent, direct GA fallback, payload filtering and timeout behaviour.

After an authorised deployment and container publication, use Tag Assistant on the deployed production build. A preview build deliberately cannot load GTM. Verify no Google request before consent or after decline, and no direct `gtag/js` loader alongside GTM. Allow analytics and check sanitised page variables. With clearly labelled non-sensitive test details, submit once and confirm one `generate_lead` event/tag firing after acceptance, zero on invalid/failed attempts, and the success redirect. Preview tooling can require temporary debugging permissions; do not broaden production CSP globally. Verify the event in GA4 DebugView/Realtime and independently verify Formspark storage/notification delivery. Reopening `/success/` must not count another conversion.

Native submissions, declined analytics, privacy signals, ad blockers, slow/failed tag loading and network loss can prevent measurement. The timeout bounds navigation delay; it cannot guarantee delivery to Google. Provider submissions remain the source for actual enquiry counts. Google Ads conversion setup is separate and needs its conversion ID/label plus an appropriate advertising-consent design; these are not supplied or configured here.
