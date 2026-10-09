# Follent.net migration URL map

**Status: inventory pending; no live migration redirects have been approved.** The local workspace was empty and the live site could not be retrieved during planning. There is no WordPress export or verified list of old URLs available in this repository.

Before removing anything, export the WordPress/WooCommerce content and media, collect sitemap URLs, Search Console top pages, analytics landing pages and known backlinks. Record canonical paths, page purpose and relevant content/assets. Back up the existing hosting and DNS configuration, including mail records.

| OLD URL | NEW URL | REDIRECT REQUIRED? | NOTES |
| --- | --- | --- | --- |
| TODO: inventory existing homepage | https://follent.net/ | Review | Homepage positioning changes to website services; no same-URL redirect needed. |
| TODO: existing service/about/contact URLs | TODO: best matching new page | Review | Retain useful copy/assets only after accuracy and permission review. |
| TODO: individual wine product URLs | TODO: verified equivalent on https://chateaufollent.com.au/ | Review | Only redirect to an equivalent product/category where relevant. Verify target exists. |
| TODO: shop/category URLs | TODO: verified matching Château Follent category | Review | Do not send unrelated product URLs to the Follent.net homepage. |
| TODO: cart/checkout/account URLs | No replacement by default | Review | These capabilities are not in the new site. Consider 404/410 after review; Pages' static custom 404 is provided. A true 410 needs an edge rule/Worker if chosen. |

## Approval and implementation

1. Complete the inventory, preserve useful assets, and verify destinations.
2. Review every mapping, duplicates, chains and loops. Record unmapped URLs and an intentional removal response.
3. Add approved mappings to `config/site.json` under `redirects`, with `from`, `to`, `status` (301/302) and `reviewed: true`.
4. Build `_redirects`; test it on Cloudflare Pages. Use domain-level Cloudflare rules for www/apex redirects. No automatic ecommerce catch-all is provided.
5. Set `launch.migrationReviewed` only when the completed map has been reviewed. Retain backups and rollback instructions before manual DNS cutover.
6. Keep the old site until cutover acceptance; monitor indexed pages, 404s and enquiries after launch.
