# Mobile-first UI review and implementation backlog

15 October 2026 · Original source reviewed: `357df60` · Status: all 16 tasks implemented and verified locally; live integration/release checks remain separate.

## Implementation progress — 15 October 2026

The original audit/backlog below is retained as the before-change baseline. The owner approved all 16 tasks and `james@follent.net` as the public enquiry/recovery address. Implementation preserves the brand, existing commercial values, provider payload, package/privacy gates and static architecture. No deployment or live provider change is implied.

- Batch 1: 28 tests, normal build/output and documentation checks pass.
- Batch 2: larger functional text/shared spacing pass 70 reference responsive checks with zero axe violations and eight mocked behaviour scenarios. This checkpoint precedes the form-first composition and final hero adjustments.
- Batch 3 (UI-03/UI-09/UI-10): form-first Contact, in-flow preferences and compact explicit verification pass the focused lifecycle checks, including blocked/slow API recovery, expiry/error/timeout retries, pending duplicate protection, accepted/rejected transport and a real 20-second abort on an intercepted request. No live enquiry was sent.
- Batch 4 (UI-04/UI-05/UI-06/UI-07/UI-08/UI-13): native Pricing/package anchors, compact multi-page Home, complete Essential content, reordered About, readable grids and menu behaviour are implemented. Commercial tests confirm shared prices/page allowances and full detail preservation. Source artwork is unchanged.
- Batch 5 (UI-12/UI-14/UI-15/UI-16): touch/focus/state refinements, seven-width coverage and performance baselines are implemented. Functional type exceptions are confined to decorative miniature artwork. Enlarged-text testing exposed and repaired min-content grid, long-price-note and decorative-rotation overflow without global overflow hiding.

### Final local outcomes

At 390×844, fonts ready and preferences dismissed: Home **8,953px**, compared with 11,248px (**20.4% shorter**); hero **978px**, within the 1,000px target; first Contact input **Y=655px**, compared with 1,405px. Input text is 16px and the mocked widget footprint is 150px wide. Pricing is **9,502px**, compared with 8,904px: larger readable type and targets increase its height, while local anchors provide direct access to detail. This is not a claim that every page became shorter.

Final verification covers 30 Node tests, the normal ten-page output, all three package variants, HTML/documentation checks, 70 reference/56 garden layouts with zero axe violations and eight/two behaviour scenarios, and eight reusable form-shell layouts/twelve scenarios. The maintained `scripts/ui-qa.mjs` adds 21 measured layouts, fourteen boundary checks and ten scenario groups: enlarged text/reflow, emulated forced colours/reduced motion, menu/landscape, preferences, blocked API, slow/late API, verification states and duplicate/rejection/acceptance, actual transport abort, and no-JS/disabled previews. Every external request in these UI suites is intercepted. The approved email appears in the form, footer, supporting context and error/recovery paths.

Lighthouse 13.5.0 Home/Contact on a separate local **indexable, collection-disabled fixture** scores 100/100/100/100 (Performance/Accessibility/Best Practices/SEO), LCP 1.7s and CLS 0 on each page. The explicit preview separately scores 100/100/100/66 because noindex intentionally excludes it from search; that safeguard was retained. Neither fixture measures a real Turnstile challenge or opted-in GTM container. The indexable fixture changes only ignored test configuration; source privacy/launch approvals were not changed.

Evidence: `.qa/ui-results.json`, `.qa/browser-results.json`, `.qa/browser-garden-results.json`, `.qa/form-shell-results.json`, `.qa/screenshots/ui-*`, `.qa/lighthouse-home.json`, `.qa/lighthouse-contact.json` and separate `.qa/lighthouse-ui-preview-*` reports. Forced colours were emulated locally; physical-device/iOS zoom, actual screen-reader/system-colour review, real widget/provider validation, current notification delivery and production field performance remain explicit release checks. No commit, push, hosting, DNS or provider-dashboard change was performed.

## Top 5 mobile UX improvements

1. **Bring the Contact form forward (UI-09).** At 390px the first field begins about 1,405px down the page. Put the short introduction and form before supporting material in document order.
2. **Make enquiry availability and recovery truthful (UI-11, UI-10).** The normal Growth form is enabled, but the sidebar/footer say the preview cannot receive enquiries. Verification errors refer to contact links that are absent. Fix the shared message and obtain an approved direct fallback channel.
3. **Reduce repeated decision content on Home (UI-06, UI-07).** Home is about 11,248px tall at 390px; its package section alone is 3,172px. Use concise catalogue summaries and deliberate links to full interior-page detail.
4. **Make functional text comfortable to read (UI-01).** Phone hero buttons use 10.72px labels, fields use 13.6px text and footer legal text is 9.6px. Increase functional type while retaining the brand fonts.
5. **Stop analytics preferences covering actions (UI-03).** The fixed notice covers 156px, about 23% of a 667px-tall viewport. At 768px it covers the homepage's second project action in the initial viewport.

Also resolve UI-10 before visual polish: a 300px Turnstile footprint simulation expands the Contact page to 360px at a 320px viewport. The baseline pages with external services stubbed do not overflow. No site-wide P0 failure, unusable navigation or severe automated accessibility violation was established. Challenge-unavailable/no-JavaScript enquiry recovery is a confirmed conditional dead end in the current configuration; treat it as a P1 release prerequisite.

## A. UI review summary

The existing identity is coherent: ivory surfaces, restrained Bordeaux actions, a noir footer, Libre Baskerville headings and Montserrat body text. Static HTML, ordinary links, native controls, visible keyboard focus and small browser scripts provide a sound foundation. The observed problems do not justify a framework or brand replacement.

Mobile information priority needs improvement. Decorative art, contextual copy and repeated commercial detail stack ahead of the next action. Contact places the complete sidebar before the form. Home repeats full package information also available on Pricing and Services, followed by substantial reference, process, managed-service and FAQ sections. Much secondary and functional text is small for its importance.

### Scope and evidence

- Read repository instructions, README, client setup/prompt, configuration, manifest/page composition, commercial/generic partials, enquiry definitions/shell/transport, navigation/analytics scripts, CSS, privacy renderer and current assets.
- Rendered a local normal Growth build at `http://127.0.0.1:4173`. Covered Home, Services, Pricing, Process, About, Contact, Privacy, Success, Form error and 404.
- Inspected all ten routes at **320, 375, 390, 430, 768, 1024 and 1440 CSS pixels**, height 844px: **70 baseline layouts**. Separately checked a short 390×667 viewport. These are browser viewport checks, not physical-device results.
- Captured full pages at 390px, representative initial viewports at other widths and component details; inspected screenshots alongside DOM measurements.
- Axe checked all ten routes at 390/768/1440px: **30 combinations, zero violations**. Automated coverage does not certify WCAG conformance.
- Checked menu open/Escape/focus restoration, blocked challenge, native required validation, conditional existing-website behaviour, package query selection, pending state, HTTP 422/network recovery and accepted-submission redirect. Three synthetic POSTs were fulfilled/aborted locally; none reached Formspark.

Every external request was intercepted. Real Turnstile, Formtrack and GTM were not executed. Cloudflare dimensions were verified against its [official widget documentation](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/#widget-sizes) and simulated locally. Deployment, real challenge acceptance, storage/email delivery, iOS focus zoom, screen readers and current production performance remain unverified.

Ignored, session-specific evidence: `.qa/ui-review/results.json`, `detail-results.json`, screenshots, generated `site/`, and runners `.qa/ui-audit.mjs` / `.qa/ui-audit-details.mjs`. These do not ship or constitute a maintained regression suite.

### Measured baseline

Rounded CSS pixels, fonts loaded, FAQs closed, external scripts stubbed. Page height is evidence of composition, not a number to minimise regardless of usefulness.

| Width | Home height | Pricing height | First Contact input: document Y | Input width |
| ---: | ---: | ---: | ---: | ---: |
| 320 | 12,065 | 9,684 | 1,518 | 240 |
| 375 | 11,396 | 9,021 | 1,405 | 295 |
| 390 | 11,248 | 8,904 | 1,405 | 310 |
| 430 | 10,898 | 8,836 | 1,254 | 350 |
| 768 | 8,464 | 6,643 | 1,273 | 303 |
| 1024 | 7,404 | 5,681 | 754 | 234 |
| 1440 | 7,523 | 5,835 | 854 | 307 |

### Component findings

| Area | Strengths | Observed friction / disposition |
| --- | --- | --- |
| Header/navigation | Wordmark/Menu fit narrow widths; links work without JS. Toggle, Escape and focus return work. Desktop changes at 851px. | Primary action is inside the closed phone menu. Menu wording stays identical while open. Outside click leaves it open; refinement, not an accessibility failure. Keep a simple disclosure. UI-04. |
| Hero | Clear CTA labels, honestly labelled CSS study, no hero image download. | Five heading lines at 390px; hero about 1,246px tall. Miniature illustration adds substantial height. Paired action labels wrap at 320px. UI-01/UI-05/UI-15. |
| Cards/sections | Restrained borders, clear prices, transparent Professional recommendation. | Small feature text and repeated full cards slow comparison. Home pricing consumes almost four screens. Managed plans keep three columns at 768px. UI-06/UI-07/UI-13. |
| Interior pages | Semantic headings and native FAQ details; generally constrained paragraphs. | About puts a 260px decorative wordmark before its practical explanation. Pricing has no local section navigation. Privacy already has contents navigation; do not remove legal content merely to reduce length. UI-07/UI-08. |
| Forms | Required labels, consent, autofill, email/tel/url types, 48px controls, one column ≤600px, pending protection and input-preserving errors. | First field is late; nine business fields precede consent. Controls use 13.6px type. The website field precedes the selector controlling it. Verification recovery/width need work. UI-01/UI-09/UI-10/UI-11. |
| Footer | Coherent dark treatment, light keyboard outline, useful navigation/legal identity. | 30px link height, 9.6px legal text, two narrow phone columns and a false no-enquiry message. UI-01/UI-11/UI-12. |
| States/accessibility | Hover treatment, 3px focus outline, skip link, reduced motion and live status. Pending disables; errors retain details and focus status. | No shared pressed/busy visual treatment. Checkbox itself is 20px but its label is clickable; bounds alone do not prove a target-size failure. No automated contrast violation found. UI-12/UI-15. |
| Images/performance | No content image configured; CSS reference artwork. Future image markup has dimensions/lazy loading. Two self-hosted WOFF2 files use swap. | Future image markup lacks responsive sources; there is no current large content image to replace. Real widget/opted-in tag cost and shift are unmeasured. UI-16. |

Some descendants in the clipped, rotated study extend beyond viewport coordinates. The document scroll width stays within its viewport across all 70 baseline layouts. Do not confuse clipped artwork bounds with page-level overflow, or hide global overflow to conceal a widget defect.

## B. Recommended design direction

Start with one column at 320px, then add columns when content fits at a readable size. Retain the wordmark, palette, two fonts, square buttons, restrained borders, “View packages” and “Start your project”. Use smaller fluid mobile headings and larger functional text. Preserve prominent prices/GST, scope and Professional's recommendation.

Use a small spacing scale in rem: **0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4** (4–64px at the default root). Add larger section spacing only where justified. Maintain approximately 60–70-character paragraph measures on larger screens. Use existing partials, CSS variables, grid/flex and native anchors/details; avoid an application shell, new framework or general CSS rewrite.

The journey should be clear: understand the service → compare the level → start an enquiry. Home introduces, Pricing provides complete detail, Contact begins the conversation promptly. Keep all ordinary content and navigation available as HTML. Keep Essential's complete one-page experience distinct from multi-page summaries.

## C. Prioritised implementation backlog

**P0:** broken/major usability; **P1:** important UX improvement; **P2:** polish/consistency; **P3:** optional enhancement. Effort is relative implementation/verification work, not a schedule. BOTH tasks keep commercial content in content/config and generic behaviour in the engine.

### 1. Foundation / design system

#### UI-01 — Establish readable functional typography

- **Problem:** `.button` is 11.68px, the phone hero override 10.72px, phone `.feature-list` 12.64px, inputs 13.6px and footer legal text 9.6px.
- **Proposed change:** Introduce a few semantic type tokens. Aim for 16px body/controls and 14px functional secondary copy/actions. Keep smaller exceptions for nonessential decorative annotations only; retain the font files and tune line height/measure.
- **Mobile behaviour:** Controls remain ≥16px; action labels do not shrink to force a paired row. Prices, consent and support notes remain comfortable without zooming. Verify iOS focus zoom on a real device before claiming it solved.
- **Desktop behaviour:** Retain prominent serif headings and restrained metadata; constrain paragraphs instead of reducing body size.
- **Files/components likely affected:** [site.css](../../assets/css/site.css): `:root`, `.small`, `.button`, `.feature-list`, `.field label`, inputs, `.footer-bottom`.
- **Acceptance criteria:** Computed controls ≥16px; actions/labels/functional secondary text ≥14px at all seven widths. No clipped text/new horizontal scroll; usable at 200% text. Document decorative exceptions.
- **Priority:** P1. **Effort:** Medium. **Scope:** ENGINE. **Dependencies:** none.

#### UI-02 — Consolidate spacing incrementally

- **Problem:** CSS mixes numerous section/grid values, including 100/88/80/72/70/68/60/58/56px, with repeated desktop-to-mobile overrides.
- **Proposed change:** Add the small scale above and semantic gutter/section-space tokens. Migrate touched components first, using fluid padding and stack spacing. Keep deliberate exceptions and square corners.
- **Mobile behaviour:** Start with 20px outer gutters, 16–24px inner padding where feasible and roughly 40–60px section rhythm. Avoid nested padding that starves controls/widgets.
- **Desktop behaviour:** Increase breathing room progressively without widening body text indefinitely.
- **Files/components likely affected:** [site.css](../../assets/css/site.css): `.container`, `.section`, `.section-heading`, `.closing`, `.contact-panel`, grid gaps.
- **Acceptance criteria:** Touched patterns use documented spacing roles; no mechanical replacement across the whole stylesheet. Compare Home/Contact/Pricing at all widths and larger text after UI-01.
- **Priority:** P2. **Effort:** Medium. **Scope:** ENGINE. **Dependencies:** UI-01 scale.

### 2. Global layout

#### UI-03 — Prevent analytics preferences covering content

- **Problem:** Fixed `.analytics-notice` reserves no space. Its 156px phone panel covers key content on short screens; at 768px it overlaps the second hero CTA.
- **Proposed change:** Prefer a visible document-flow preference region near the header, or reserve equivalent space if fixed. Keep accessible Allow/Decline controls and the existing nonmodal consent model.
- **Mobile behaviour:** Both choices fit at 320px and 200% text; no covered menu, field or focused control. Avoid a new full-screen modal.
- **Desktop behaviour:** Use a compact aligned content region without covering the copy column.
- **Files/components likely affected:** [document.mjs](../../src/layouts/document.mjs), [site.css](../../assets/css/site.css): `.analytics-notice`; [analytics.js](../../assets/js/analytics.js).
- **Acceptance criteria:** Fresh visits at 390×667, 390×844 and 768×844 show no overlay obstruction. Preserve allow/deny/reopen/storage-failure/DNT/GPC behaviour, zero Google load before opt-in and preview/package containment.
- **Priority:** P1. **Effort:** Medium. **Scope:** ENGINE. **Dependencies:** UI-01/UI-02 sizing.

### 3. Header and navigation

#### UI-04 — Clarify mobile menu state

- **Problem:** Menu wording does not change when expanded. The project CTA follows four links in a roughly 294px-high disclosure. Outside click leaves it open, though navigation otherwise works.
- **Proposed change:** Show Menu/Close wording with expanded state; keep the project action prominent in the disclosure. Consider outside-click closure as a small enhancement. Preserve document flow, reading order, link/Escape closure and the nonsticky header.
- **Mobile behaviour:** Wordmark and ≥44px toggle fit at 320px. Do not squeeze a third action beside them; retain the page CTA. Long menus scroll with the document in short landscape views.
- **Desktop behaviour:** Keep horizontal links/project button and clear stale open state at the breakpoint.
- **Files/components likely affected:** [document.mjs](../../src/layouts/document.mjs), [site.js](../../assets/js/site.js), header/menu rules in [site.css](../../assets/css/site.css).
- **Acceptance criteria:** Label/state agree; Escape restores focus; destination selection closes. Links work without JS. Check 850/851px and landscape; no hidden focused item after resize, dialog role or unnecessary focus trap.
- **Priority:** P2. **Effort:** Small. **Scope:** ENGINE. **Dependencies:** UI-01; coordinate UI-03.

### 4. Homepage

#### UI-05 — Compress the phone hero without losing its message

- **Problem:** Five heading lines and a 1,246px hero at 390px delay the next section. At 768px the two-column composition constrains copy; at 320px CTA labels wrap.
- **Proposed change:** Use a fluid heading with a smaller phone minimum and natural wrapping. Prioritise offer/actions, then bounded artwork. Use one column until both copy and artwork have useful width.
- **Mobile behaviour:** Stack actions when readable labels cannot fit. Keep both labels/destinations before artwork. Aim for hero height ≤1,000px at 390px, excluding any new in-flow consent region; never clip content or set a fixed height to pass.
- **Desktop behaviour:** Retain the editorial two-column layout when space allows, with controlled proportions.
- **Files/components likely affected:** [content.mjs](../../src/pages/content.mjs): `home()`, `designStudy()`; [site.css](../../assets/css/site.css): hero/study rules.
- **Acceptance criteria:** Exact tagline and CTA labels remain; no overlap/squeeze at 320–430px or 200% text. Check 600/601 and 850/851px. The height is a design target, not permission to delete content.
- **Priority:** P1. **Effort:** Medium. **Scope:** BOTH. **Dependencies:** UI-01/UI-02; coordinate UI-15.

#### UI-06 — Give Home a concise route to complete detail

- **Problem:** Home is about 11.2kpx at 390px and repeats full package cards from Pricing/Services. Reference/future-work content adds 1,173px; managed summaries add 1,139px before FAQs/final action.
- **Proposed change:** Introduce an explicit compact catalogue presentation: package name, promise, price/GST, key distinction and link to full detail. Link brief process/managed introductions to the complete pages. Relocate substantive detail rather than deleting it. De-emphasise future placeholders while preserving honest reference disclosure.
- **Mobile behaviour:** Three sequential summaries; transparent Professional recommendation and recurring-service context. No carousel, swipe-only comparison or hidden price/scope.
- **Desktop behaviour:** Compact summaries may form three columns without repeating a full feature matrix.
- **Files/components likely affected:** [content.mjs](../../src/pages/content.mjs): `home()`, `examples()`; explicit compact variant in [follent-commercial.mjs](../../src/partials/follent-commercial.mjs); [site.css](../../assets/css/site.css). [offers.mjs](../../src/data/offers.mjs) remains the source of prices/scope.
- **Acceptance criteria:** All prices/GST/distinctions derive from shared values; full detail remains HTML-accessible. Target ≥20% reduction from the 390px Home baseline at UI-01 type sizes, subject to content review. Essential retains its section IDs and complete one-page information because its interior pages are absent.
- **Priority:** P1. **Effort:** Medium. **Scope:** FOLLENT composition with explicit shared presentation support. **Dependencies:** UI-01/UI-02/UI-07.

### 5. Interior/content pages

#### UI-07 — Add useful Pricing wayfinding

- **Problem:** Pricing is about 8,904px tall at 390px. Packages take 2,910px before add-ons/managed plans/FAQs, with no local navigation. Professional's action follows Essential's complete card.
- **Proposed change:** Add semantic local links to Packages, Add-ons, Managed services and Questions, plus package-name anchors where useful. Supply stable article IDs from the existing catalogue. Retain complete cards and balanced recommendation.
- **Mobile behaviour:** Links wrap into comfortable rows or a short list. Jumps reach headings/prices; avoid horizontal tabs or sticky obstructions.
- **Desktop behaviour:** Local links beneath the introduction; retain full comparison columns.
- **Files/components likely affected:** [content.mjs](../../src/pages/content.mjs): `pricing()`; `packageCards()` in [follent-commercial.mjs](../../src/partials/follent-commercial.mjs); [site.css](../../assets/css/site.css).
- **Acceptance criteria:** All anchors exist/work without JS; no duplicate IDs. Keep price/GST/scope/support/actions available and Essential visible. Keyboard/history/back work; package selection still prefills Contact.
- **Priority:** P1. **Effort:** Small. **Scope:** BOTH. **Dependencies:** UI-01/UI-02.

#### UI-08 — Put About's practical explanation before decorative repetition

- **Problem:** Mobile About places a 260px `.about-mark` repeating the header identity before “Practical by design”, after an already tall hero.
- **Proposed change:** Put the introduction first in DOM order and make the mark a smaller supporting element. Preserve business copy/reference context; do not invent portraits, biography or credentials.
- **Mobile behaviour:** Read the explanation immediately after the hero; a compact decorative mark may follow.
- **Desktop behaviour:** A restrained visual may accompany text through grid placement without compromising reading/focus order.
- **Files/components likely affected:** `about()` in [content.mjs](../../src/pages/content.mjs); `.about-mark` and its layout in [site.css](../../assets/css/site.css).
- **Acceptance criteria:** Practical explanation precedes the decorative mark in source/phone reading order. No copy/metadata loss. Aim for mark height ≤160px at 390px unless review demonstrates a need for more.
- **Priority:** P2. **Effort:** Small. **Scope:** FOLLENT. **Dependencies:** UI-01/UI-02.

### 6. Forms

#### UI-09 — Start enquiries promptly and organise optional detail

- **Problem:** Sidebar material precedes the form; first input Y≈1,405px at 390px. Nine business fields appear before consent, and the help-type controller follows its dependent website field.
- **Proposed change:** Compose short introduction → native form → supporting information in DOM order. Clearly group optional context; put the help-type selector before website without renaming provider fields/choices. Avoid adding a multi-step interface to this intake.
- **Mobile behaviour:** Single column on phones. Make required name/email/message and optional context clear. Use UI-01 sizing and normal autofill keyboards; avoid duplicate introductory headings before data entry.
- **Desktop behaviour:** Add supporting sidebar and paired short fields only where labels/values fit; form remains first in meaningful DOM order, message/consent full-width.
- **Files/components likely affected:** `contact()` in [content.mjs](../../src/pages/content.mjs), [enquiry.mjs](../../src/data/enquiry.mjs), [enquiry-form.mjs](../../src/partials/enquiry-form.mjs), contact/form CSS in [site.css](../../assets/css/site.css).
- **Acceptance criteria:** First input Y≤844px at 390×844 and ≤950px at 320×844, consent dismissed/fonts ready. Treat these as proposed targets; at 200% text prioritise reflow over forcing the number. Preserve field contracts, consent, autocomplete, condition/query choice, native redirects, honeypot and disabled previews. Mock services for layout checks.
- **Priority:** P1. **Effort:** Medium. **Scope:** BOTH. **Dependencies:** UI-01/UI-02/UI-11.

#### UI-10 — Fit Turnstile and explain verification recovery

- **Problem:** The shell uses default sizing. Nominal phone field widths are 240px at 320px and 295px at 375px. Cloudflare documents normal 300×65px, flexible minimum 300px, compact 150×140px. A 300px simulation produces page overflow at 320px. A blocked script gives only “Please complete the spam verification”; no-JS text references absent contact links.
- **Proposed change:** Use supported compact sizing where normal cannot fit; flexible alone does not solve this. Reserve the footprint. Add accessible loading/unavailable/expiry guidance and deliberate retry where needed through external-script callbacks compatible with CSP. Reuse UI-11's approved direct fallback; keep server/provider verification authoritative.
- **Mobile behaviour:** Widget/recovery fit 320/375px without clipping. Slow/blocked/expired verification explains next steps and retains data. No-JS notice provides a real alternative once supplied.
- **Desktop behaviour:** Keep consistent normal/compact presentation; resizing must not repeatedly reset a completed challenge or mount duplicates.
- **Files/components likely affected:** [enquiry-form.mjs](../../src/partials/enquiry-form.mjs), [form.js](../../assets/js/form.js), [document.mjs](../../src/layouts/document.mjs), [site.css](../../assets/css/site.css), focused browser QA.
- **Acceptance criteria:** Check default/compact/loading/error/expired/blocked states, keyboard use and page width at all seven widths. Test simulated footprint and a real permitted widget separately. Preserve `cf-turnstile-response`; never report success without provider acceptance. No secrets or weakened CSP. Real storage/notification verification remains a separate integration test.
- **Priority:** P1. **Effort:** Medium. **Scope:** ENGINE. **Dependencies:** UI-11 fallback, UI-01/UI-02/UI-09 layout.

### 7. Footer

#### UI-11 — Render truthful contact availability throughout the site

- **Problem:** `contactDetails(site)` claims the preview cannot receive enquiries whenever direct channels are empty, regardless of form capability. It appears twice on Contact and in the footer; Form error also inherits it. Normal Growth is enabled while general email/phone/booking are empty. A privacy mailbox is not an approved sales fallback.
- **Proposed change:** Distinguish missing direct channels from disabled collection in the shared helper. Pass necessary capability context and link to an active enquiry form where useful. Obtain an owner-verified general email/phone/booking route in central config for challenge failure. Avoid self-links as sole recovery on Contact/Form error; do not invent or repurpose contact details.
- **Mobile behaviour:** Give footer contact text adequate width, preferably a single-column sequence after Explore. Error/no-JS states expose the approved alternative, or state its absence accurately.
- **Desktop behaviour:** Preserve three footer columns where they fit, with the same capability logic.
- **Files/components likely affected:** `contactDetails()` in [components.mjs](../../src/partials/components.mjs); call sites in [document.mjs](../../src/layouts/document.mjs), [content.mjs](../../src/pages/content.mjs), [enquiry-form.mjs](../../src/partials/enquiry-form.mjs); [site.json](../../config/site.json), footer CSS.
- **Acceptance criteria:** Active Growth never claims all enquiries are disabled. Essential/Professional/preview/external/empty-channel variants remain truthful without enabling capabilities. Approved fallback works from blocked verification/no-JS/Form error; this contact-value dependency remains open until the owner supplies it.
- **Priority:** P1. **Effort:** Medium. **Scope:** BOTH. **Dependencies:** owner-supplied general channel for full recovery; shared wording fix can proceed independently.

### 8. Accessibility

#### UI-12 — Improve touch comfort and preserve focus visibility

- **Problem:** Footer links are 30px high and checkbox 20px square, less comfortable than primary controls. Label hit areas and inline-link exceptions mean these bounds alone do not establish WCAG failures.
- **Proposed change:** Give standalone navigation/utility controls ≥44px hit areas and generous consent-label spacing. Keep its privacy link independently usable; retain contrast and visible outlines.
- **Mobile behaviour:** Thumb-friendly separation; no overlay hides focused controls. Assess the actual label target rather than only the checkbox square.
- **Desktop behaviour:** Preserve keyboard focus, light footer outlines and skip-link behaviour without turning every text link into a large button.
- **Files/components likely affected:** [site.css](../../assets/css/site.css): footer links, `.checkbox-label`, focus/skip-link rules; [enquiry-form.mjs](../../src/partials/enquiry-form.mjs) only if markup needs adjustment.
- **Acceptance criteria:** Standalone controls ≥44×44px where practical; assess inline-link exceptions separately. Keyboard, 200% text and 400% reflow leave controls visible. Preserve semantic labels/headings; use axe plus separately recorded screen-reader checks.
- **Priority:** P2. **Effort:** Small. **Scope:** ENGINE. **Dependencies:** UI-01/UI-03/UI-04/UI-11.

### 9. Responsive behaviour

#### UI-13 — Let feature content determine grid breakpoints

- **Problem:** Managed summary/detail keep three columns down to 601px; at 768px each is about 216px with frequent feature wrapping and small type. Broad desktop defaults require repeated overrides.
- **Proposed change:** Change affected grids to single-column defaults. Keep managed detail in one readable column until three columns support roughly 18rem each at UI-01 type sizes; use an intermediate layout only if it improves scanning. Coordinate hero changes with UI-05. Preserve working service/process layouts unless increased type exposes problems.
- **Mobile behaviour:** One column on phones/constrained tablets; avoid splitting one feature list into an awkward column reading sequence.
- **Desktop behaviour:** Restore three columns when they fit; align actions without fixed text heights that clip.
- **Files/components likely affected:** [site.css](../../assets/css/site.css): managed/package grids and 600/850/1100px overrides; commercial markup only if grouping needs it.
- **Acceptance criteria:** Check 600/601, 768, 850/851, 1024 and 1440px at the new type sizes: no clipping, forced word breaks or page scroll. Logical list order. Check all package variants and garden; no business-specific values enter shared CSS.
- **Priority:** P2. **Effort:** Medium. **Scope:** ENGINE. **Dependencies:** UI-01/UI-02/UI-05.

#### UI-14 — Extend repeatable QA to the requested mobile matrix

- **Problem:** Maintained browser QA checks 320/390/768/1440px, omitting 375/430/1024 and edited-breakpoint boundaries. Transport fixtures clear Turnstile; script stubs cannot reveal widget-width issues.
- **Proposed change:** Add an explicit extended viewport mode and focused widget-footprint/recovery scenarios. Keep routine checks fast, mock submissions and store results under ignored `.qa`. Separate provider integration evidence.
- **Mobile behaviour:** Cover four phone widths, a short view, open menu, visible preferences and form-error states. Measure actual document overflow rather than clipped artwork bounds.
- **Desktop behaviour:** Cover 768/1024/1440, edited breakpoints and resizing an open phone menu.
- **Files/components likely affected:** [browser-qa.mjs](../../scripts/browser-qa.mjs), [form-shell-qa.mjs](../../scripts/form-shell-qa.mjs), [QA_REPORT.md](../../QA_REPORT.md).
- **Acceptance criteria:** Repeatable extended matrix includes disabled previews, alternate client, missing-token block, widget footprint and recoverable errors. Artwork byte-identical; no real POST; failures identify route/width/state. Do not suppress failures to make screenshots pass.
- **Priority:** P1. **Effort:** Small. **Scope:** ENGINE tooling. **Dependencies:** begin immediately; extend alongside UI-10.

### 10. Visual polish

#### UI-15 — Remove misleading decoration and unify action states

- **Problem:** Static study shows `01 / 03` without a carousel, and its miniature CTA is artwork. Functional buttons have hover/focus but no shared pressed/busy treatment; pending changes text/disables without a distinct visual style.
- **Proposed change:** Remove the apparent slide count or replace with a truthful label. Keep the illustration decorative and distinct from live controls. Add restrained active/disabled/busy treatments using existing tokens; no extra animation or new visual system.
- **Mobile behaviour:** Actual CTAs dominate; smaller UI-05 artwork clearly reads as illustration. Sending/error labels remain readable without unexpected geometry changes.
- **Desktop behaviour:** Retain editorial artwork/current hover character; states work for mouse and keyboard.
- **Files/components likely affected:** `designStudy()` in [content.mjs](../../src/pages/content.mjs); study/button rules in [site.css](../../assets/css/site.css); [form.js](../../assets/js/form.js) only if an explicit state attribute helps.
- **Acceptance criteria:** No implied carousel remains; artwork retains `aria-hidden`/honest visual label. Default/hover/active/disabled/busy controls retain clear contrast/focus. Reduced motion and provider acceptance/error semantics unchanged.
- **Priority:** P2. **Effort:** Small. **Scope:** BOTH. **Dependencies:** UI-01/UI-05/UI-10.

### 11. Performance-related UX

#### UI-16 — Record a mobile performance guard before adding media

- **Problem:** Lightweight first-party assets are already a strength; this audit stubs third parties, so cannot establish live widget/opted-in GTM cost or shift. No evidence supports a major asset rewrite.
- **Proposed change:** Record fresh Home/Contact mobile lab results in a safe disabled-collection build, then separately on an authorised configured integration origin. Use existing Lighthouse tooling; measure challenge/consent shifts explicitly. Add responsive sources only when an approved real project image exists; retain dimensions/loading rules.
- **Mobile behaviour:** No input/submit jump when verification appears. Font swap/preferences preserve readable controls. Avoid adding video, heavy backgrounds, extra font families/weights or JS-rendered content.
- **Desktop behaviour:** Reuse the asset set rather than adding heavier decorative downloads for large screens.
- **Files/components likely affected:** [lighthouse-qa.mjs](../../scripts/lighthouse-qa.mjs), [QA_REPORT.md](../../QA_REPORT.md), font hints in [document.mjs](../../src/layouts/document.mjs), future image markup in [content.mjs](../../src/pages/content.mjs).
- **Acceptance criteria:** Report environment/page/build/consent mode, scores, LCP/CLS and limitations; no old score presented as current. Retain approximately 95+ category targets with honest measured exceptions. Font files currently total 71,828 bytes and CSS 21,822 before compression; observed baselines, not guaranteed network budgets. No new production dependencies/tracking.
- **Priority:** P3. **Effort:** Small for baseline checks; scope later image work separately. **Scope:** ENGINE verification; FOLLENT assets when supplied. **Dependencies:** UI-03/UI-05/UI-10; authorised origin for live-script measurement.

## D. Suggested implementation order

| Batch | Tasks | Purpose / dependency |
| --- | --- | --- |
| 1 — truthful enquiry journey | UI-11 shared message/contact request; initial UI-14 cases | Fix false copy and capture behaviour. Owner supplies a general fallback; unrelated work can proceed meanwhile. |
| 2 — readable foundation | UI-01, UI-02 | Establish text/spacing before judging layout fit; compare each changed component. |
| 3 — conversion path | UI-09, UI-10, UI-03 | Bring the form forward, fit/recover verification and stop overlay obstruction. Complete fallback depends on UI-11. |
| 4 — discovery | UI-07, UI-05, UI-06, UI-04 | Pricing anchors precede compact Home links. Review Essential separately. |
| 5 — refinement | UI-08, UI-13, UI-12, UI-15 | Content priority, intermediate grids, targets and visual states. |
| 6 — final evidence | Complete UI-14, then UI-16 | Recheck packages/alternate business; measure rather than forecast scores. |

Use small reviewable changes, typically one task or tightly coupled pair per commit. This backlog authorises no deployment, production cutover, provider setting change or approval flag. Preserve prices, support, scope, facts, privacy and migration safeguards.

## E. QA checklist after implementation

### Build and package integrity

- [ ] Run `npm test`, `npm run build`, `npm run check`, `npm run check:docs`.
- [ ] Check test-generated variants with `node scripts/check.mjs --dir .qa/essential` and corresponding `.qa/professional` / `.qa/growth` paths.
- [ ] Essential section destinations/detail remain; Professional has links only; Growth has intended native/external capture. Previews disable forms, Turnstile, Analytics and Formtrack.
- [ ] Preserve URLs, titles/descriptions, canonical/social metadata, sitemap/robots/schema, generated security headers/redirects and source artwork. Prices remain shared AUD ex GST with current scope/support periods.

### Viewports and content

- [ ] Review 320/375/390/430/768/1024/1440px, edited-breakpoint boundaries, 390×667 and landscape.
- [ ] Check fresh visit/preferences resolved/reopened, menu open/closed, expanded FAQs, disabled preview, pending/error/success and blocked/slow/expired challenge.
- [ ] No horizontal scrolling, clipping, small-label squeeze, broken price/GST wraps or covered focus. Do not hide global overflow to pass.
- [ ] Compare Contact first-field and Home/hero baselines/targets without cutting required information or shrinking text.
- [ ] Check long identities/URLs/package options, native select menus and larger text. Future images retain dimensions, useful crop/alt and responsive sources.

### Navigation and accessibility

- [ ] Keyboard: skip link, menu, contents, package actions, FAQs, consent, controls, footer and analytics settings. Visible focus/return after Escape and resize.
- [ ] Ordinary content/links work without JS; challenge-required forms expose a truthful direct alternative.
- [ ] Check 200% text, 400% reflow, reduced motion and forced colours. Manually review screen-reader landmarks/headings/expanded state/labels/status announcements.
- [ ] Check real target areas/spacing, including labels and inline exceptions. Run axe and the documented HTML validator; retain manual findings even when automated checks pass.

### Enquiry and privacy

- [ ] Mock services for required validation, input types/autofill, controller order, allowed query values, pending protection/timeouts, provider/network failure, retained input and accepted redirect.
- [ ] Preserve native `_redirect`, separate `_error`, `_append=false`, honeypot, consent and `cf-turnstile-response`. No personal enquiry data in URLs/analytics.
- [ ] Verify widget footprint and loading/error/expiry guidance; test supported real presentation separately. A mock token does not prove server validation.
- [ ] Preserve opt-in/DNT/GPC and post-acceptance conversion containing only the declared public selection.
- [ ] On a separately authorised integration origin, submit labelled nonsensitive data and confirm storage/notifications independently. Local success/HTTP 200 does not prove delivery.

### Performance and release

- [ ] Run relevant maintained browser checks, reference and `--fixture garden`; form-shell checks for shell/transport changes. Preserve tracked artwork.
- [ ] Use `npm run preview` at `http://127.0.0.1:4173`; run existing Lighthouse tooling for affected pages in a safe build. Record mode/environment/limitations.
- [ ] Measure actual third-party loading separately; ensure challenge space/font loading do not shift the active control. No unnecessary dependencies/scripts.
- [ ] Keep real-device/screen-reader/deployed-header/redirect/provider/account/performance evidence distinct. Follow launch checklist only for an authorised launch.

## F. Original audit completion and limitations

The original audit created the review/backlog only; application markup, CSS, configuration, pricing and behaviour were unchanged at that checkpoint. That audit completed 70 layouts, 30 axe checks, screenshots, menu/form scenarios and a widget simulation. The implementation progress above supersedes its source-change/performance status while preserving its before-change findings. Neither checkpoint establishes live deployment behaviour or a complete assistive-technology audit.
