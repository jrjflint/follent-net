# Google dashboard verification — 12 October 2026

The owner requested Chrome configuration, testing and container publication. This affects Follent's Google account settings; it does not deploy website source or change hosting/DNS.

## Configured and published

Container `GTM-5F9LKZC` was initially empty with no workspace changes. Added Google tag `G-K54S78JQ7L` on Initialization – All Pages, a GA4 Event tag named `GA4 - Formspark accepted lead`, one exact `generate_lead` custom-event trigger, and three Version 2 Data Layer Variables (`package`, `page_location`, `page_referrer`). Both tags require `analytics_storage`. Page and event tags use sanitised URL variables. No advertising or ecommerce tags were added.

GA4 property `375168878` (Follent.net - GA4, account `60474566`) now registers `generate_lead` as a key event using the Create with code option. No URL-derived duplicate event rule was created. Existing purchase/ecommerce-related account history was preserved; it is not a new engine capability.

The reviewed container was published at approximately 10:18 pm Australia/Sydney as [Version 2 — GA4 and accepted Formspark enquiries](https://tagmanager.google.com/#/versions/accounts/6003143304/containers/39940469/versions/2). Published status and six added workspace items were verified in Chrome. The eight variables listed by the version include five pre-existing built-in variables and the three new variables.

## Actual test evidence

Tag Assistant connected to the normal local build at `http://127.0.0.1:4173/contact/`. Google activation required analytics opt-in; the hosted `dev.follent.net` preview was not modified or used for tracking. No CSP exceptions were added. The popup did not accept mouse input reliably, so keyboard input and a separate normal Chrome tab were used for consent/testing.

One synthetic Formspark enquiry was sent to Follent's configured endpoint. It used a reserved example email address and a message explicitly labelled TEST ONLY with no reply or project action requested. Formspark acceptance led to `/success/`. Tag Assistant recorded one `generate_lead` event with `package: growth`, the GA4 tag succeeded, and Hit Details showed the Google Analytics collection destination and a Contact page URL without query parameters. No enquiry name, email or message appeared as event parameters. Reloading the success page did not add a lead event.

GA4 DebugView initially lagged; after refresh and processing it showed `generate_lead` once with the green key-event indicator. Receipt was verified before publication. This proves local-browser provider acceptance and Google receipt for that synthetic event, not production-domain deployment, provider inbox delivery or future measurement completeness. Decline/DNT/GPC, provider error and mock timeout checks remain covered by the repository tests documented in QA_REPORT.

Screenshots are retained in ignored `.qa/gtm-dashboard/published-version.jpg` and `.qa/gtm-dashboard/ga4-receipt.jpg`. The GTM publication page and GA4 DebugView were left available in Chrome. Website source deployment and a deployed-origin check remain separate launch work. Follow [GTM setup](GTM_SETUP.md) for the maintained configuration and [README](../../README.md) for the approved hosting procedure. This session did not change Enhanced Measurement, Google Ads, access permissions or the old site's integrations, and did not verify Formspark storage/inbox delivery.
