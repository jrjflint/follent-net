# Workers configuration evidence

Inspection: 12 October 2026, authorised Chrome Cloudflare session. The owner approved adding `--preview` to Previews Base's build command; it was saved and verified after reload. The subsequent automatic build exposed a separate existing-branch setting; the owner then approved correcting that too, and the saved value was verified after reload. No build retry or manual deployment was triggered. Earlier review observations remain historical.

## Observed account settings

| Setting | Observation |
| --- | --- |
| Application | `follent-net`, static-assets-only Worker; no application runtime/bindings |
| Repository / production branch | `jrjflint/follent-net` / `main` |
| Production build / deploy / root | `npm run build -- --preview` / `npx wrangler deploy` / `/` |
| Preview builds | Enabled; `improvements/template-reuse` triggers builds |
| Preview build / upload / root | Initially `npm run build` / `npx wrangler preview` / `/`; approved build-command correction is now `npm run build -- --preview` |
| Domains | `dev.follent.net` custom domain; `follent-net.james-follent.workers.dev`; no route patterns shown |
| Runtime / observability | Compatibility date `2026-10-06`; production Workers Logs enabled, traces disabled |
| Build variables | None shown; credential values were not needed or copied into repository evidence |

Production build `0a7643d6-d6b8-4aeb-8735-3d4dd871baf7` corresponds to `main` commit `a6937e99bb70ec7f3bf027b35f93e63ca4b70e9f`. Logs show Node 22.23.3, Wrangler 4.149.0, explicit preview safeguards and 42 static files from `dist`. Wrangler generated an untracked config in its build checkout: name/date/observability and assets directory, without explicit HTML/404 options; it also proposed replacing the npm preview command. Those generated edits are not reproducible source and must not replace this repository's local preview server.

Branch build `952f9594-d5b7-4277-9289-65deac2b3485` corresponds to T10 commit `ea2cb52a69d95c0525e74fbc84bd43916a2987bf`. Its normal build completed, then the upload failed because `wrangler preview` requires a `previews` block. The branch dashboard showed failed T02–T10 builds and no last deployment. This proves pushes trigger builds; it does not prove a safe hosted preview. No retry was triggered.

## Prepared source configuration

`wrangler.jsonc` uses the observed Worker name, compatibility date, logging, workers.dev and existing dev custom domain. It contains only static assets from `dist`, a required empty `previews` block, and explicit `auto-trailing-slash` / `404-page` handling. The latter makes the generated custom 404 an explicit contract; it is a proposed improvement, not an observed current deployed setting. Legacy version preview URLs remain disabled. No apex, mail, runtime script, secret, integration binding or new domain is configured.

The configuration is Follent deployment customisation. Pages clients remove it; Workers clients replace name/routes with their own reviewed values. Keep deployment tooling optional and separate: tested Wrangler **4.149.0**, requiring Node 22+, invoked with `npx --yes wrangler@4.149.0`. No engine dependency or npm preview override is added. Future production deployment remains separately authorised and must recheck domain persistence and served responses.

## Approved preview safeguard

The owner approved changing only **Settings → Builds → Previews Base → Build command** to `npm run build -- --preview`. The value persisted after saving/reloading; preview upload/root and production settings remain as observed. The missing-block fix would otherwise allow a normal build containing active collection settings to publish as a preview. Workers dashboard preview labels do not pass this engine's explicit flag; Pages environment detection does not apply.

This account change was separately authorised after the local work was made reviewable. Connected Git pushes may now produce branch previews using the corrected command. Verify `build-info.json` preview true/forms false/Analytics false, no Formtrack script, disabled native fieldset, noindex headers/HTML, blocked robots and custom 404 before claiming a successful hosted preview. Existing failed builds do not establish those properties.

### Existing-branch exception found after push

Checkpoint `586ad590919dff60f4407f3982fb9fbd31b8e313` was pushed and remote-verified. Automatic build `4f95b255-e4a9-487e-a7df-bfc78a084e9c` ran `npm run build`, despite the saved base command. It created preview version `c03fdffb`. Read-only GETs of version and branch-alias `build-info.json` return HTTP 200 with `preview: false`, `formEnabled: true`, `analyticsEnabled: true`. The hosted preview check correctly failed; no page scripts or enquiry were executed by these GETs.

The existing preview's **Settings → Builds → Build configuration** has its own Build command still set to `npm run build`. The base correction did not update that existing setting. Required resolution: change this branch-specific command to `npm run build -- --preview`, then let the next authorised source push build a replacement and verify served safeguards. The owner subsequently approved this branch-specific correction. It was saved, awaited to completion and verified after reload as `npm run build -- --preview`; its upload/root settings remain unchanged. A documentation push will produce the replacement preview for verification. The production Worker/domain was not deployed by this checkpoint; it was a connected branch preview.

## Local verification

The pinned configured `deploy --dry-run` reads 42 files from `dist` and exits without upload; its generated no-op wrapper is Wrangler infrastructure, not a custom application Worker. `wrangler dev --local` on port 4191 parses five header rules and zero redirect rules. `node scripts/worker-qa.mjs` passes nine preview pages, noindex/security headers, disabled collection, clean folder redirects, generated custom 404/status, canonical sitemap, blocked crawling, font caching and source-config exclusion. Requests are read-only and local. Port 4190 was rejected by Node Fetch's restricted-port list; 4191 resolves that tooling issue. The general preview sitemap retains canonical production URLs; only the separate privacy review fixture has an empty sitemap.

Official guidance checked 12 October 2026: [build/preview commands](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/), [preview configuration](https://developers.cloudflare.com/workers/previews/configuration/), [SSG/custom 404](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/), [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/), [asset headers](https://developers.cloudflare.com/workers/static-assets/headers/). These support the configuration/procedure, not current DNS, SSL, deployed headers/redirects or integration delivery. No production deploy, DNS change or live enquiry was made; the only account edits were the separately approved base and branch preview build commands.
