# Follent.net migration URL map

**Stage 2 technical mapping prepared 22 October 2026; owner migration review approved in chat on 22 October 2026.** The [Stage 1 archive acceptance](migration/wordpress-archive/STAGE1_REPORT.md) supersedes the former proposed Shopify redirect strategy for this launch. Earlier local post inventories, export runbooks and the wine plan are preserved in the working tree as future-publication evidence; they do not approve redirects to Hidden Shopify drafts. The committed public inventory accompanies the Stage 1 report.

The original uncommitted map was preserved privately before editing. Source inventory covers 33 published WordPress URLs (11 posts, 13 pages, nine products), supplemented by attachment URLs and media resources found in the captured public content. All 231 exact media destinations returned 200 on 22 October. All mapped content returned 200 in the final Stage 1 crawl. This is a verified known-URL inventory; Search Console/backlink discovery may reveal additional URLs later.

## Route decisions

| Path | Launch behaviour | Historical content |
| --- | --- | --- |
| / | New business homepage | Archive root |
| /services/ | New business services | Same path on archive |
| /privacy-policy/ | New business privacy policy | Same path on archive |
| /pricing/, /how-it-works/, /about/, /contact/ | New business routes | No archive redirect |
| /success/, /form-error/, /404.html | New utility routes | No archive redirect |
| /cart/, /checkout/, /my-account/ | Genuine 404 on Pages | Archive endpoints intentionally blocked |
| Unknown paths/taxonomies/aliases | Genuine 404 until verified mapping is reviewed | No blanket redirect |

## Exact redirects

These technically reviewed entries are the single source in config/site.json and generate Pages _redirects. The owner approved these route decisions in chat; launch.migrationReviewed is now true. No Bulk Redirect duplicate, catch-all, Shopify-draft target, chain or apex loop is installed.

| Old path | Verified archive target | Status |
| --- | --- | --- |
| /5-tips-for-tasting-wine/ | https://archive.follent.net/5-tips-for-tasting-wine/ | 301 |
| /about-me/ | https://archive.follent.net/about-me/ | 301 |
| /avant-garde-pinot-noir-southern-highlands-2024/ | https://archive.follent.net/avant-garde-pinot-noir-southern-highlands-2024/ | 301 |
| /canva-filter-code-5d6c75644e006432/ | https://archive.follent.net/canva-filter-code-5d6c75644e006432/ | 301 |
| /crafting-a-delightful-dry-cider-at-home-with-pink-lady-apple-juice/ | https://archive.follent.net/crafting-a-delightful-dry-cider-at-home-with-pink-lady-apple-juice/ | 301 |
| /every-bottle-tells-a-story-be-part-of-ours/ | https://archive.follent.net/every-bottle-tells-a-story-be-part-of-ours/ | 301 |
| /hinterhof-hills-shiraz-riverland-2024/ | https://archive.follent.net/hinterhof-hills-shiraz-riverland-2024/ | 301 |
| /instagram-links/ | https://archive.follent.net/instagram-links/ | 301 |
| /mcguigan-zero-rose-wine-review/ | https://archive.follent.net/mcguigan-zero-rose-wine-review/ | 301 |
| /non-alcoholic-sangria-recipe/ | https://archive.follent.net/non-alcoholic-sangria-recipe/ | 301 |
| /pink-moscato-riverland-2024/ | https://archive.follent.net/pink-moscato-riverland-2024/ | 301 |
| /product/3-lessons-i-learned-from-starting-a-podcast-pdf/ | https://archive.follent.net/product/3-lessons-i-learned-from-starting-a-podcast-pdf/ | 301 |
| /product/citronella-soy-wax-candle-copy/ | https://archive.follent.net/product/citronella-soy-wax-candle-copy/ | 301 |
| /product/coconut-lime-soy-wax-candle/ | https://archive.follent.net/product/coconut-lime-soy-wax-candle/ | 301 |
| /product/fresh-linen-fragrant-candle-medium/ | https://archive.follent.net/product/fresh-linen-fragrant-candle-medium/ | 301 |
| /product/prosecco-pear-candle/ | https://archive.follent.net/product/prosecco-pear-candle/ | 301 |
| /product/tropical-candle/ | https://archive.follent.net/product/tropical-candle/ | 301 |
| /product/vanilla-caramel-soy-wax-candle/ | https://archive.follent.net/product/vanilla-caramel-soy-wax-candle/ | 301 |
| /product/wild-mulberry-soy-wax-candle/ | https://archive.follent.net/product/wild-mulberry-soy-wax-candle/ | 301 |
| /product/woodland-realm-soy-wax-candle/ | https://archive.follent.net/product/woodland-realm-soy-wax-candle/ | 301 |
| /red-wine-suggestions-2022/ | https://archive.follent.net/red-wine-suggestions-2022/ | 301 |
| /southern-highlands-honey-harmony-mead/ | https://archive.follent.net/southern-highlands-honey-harmony-mead/ | 301 |
| /st-hallett-faith-barossa-shiraz-2014/ | https://archive.follent.net/st-hallett-faith-barossa-shiraz-2014/ | 301 |
| /terms-conditions/ | https://archive.follent.net/terms-conditions/ | 301 |
| /thank-you/ | https://archive.follent.net/thank-you/ | 301 |
| /velvet-russian-caravan-upside-down-chocolate-cake/ | https://archive.follent.net/velvet-russian-caravan-upside-down-chocolate-cake/ | 301 |
| /wine-blog/ | https://archive.follent.net/wine-blog/ | 301 |
| /wp-content/uploads/2020/03/42694946-1-f.jpg | https://archive.follent.net/wp-content/uploads/2020/03/42694946-1-f.jpg | 301 |
| /wp-content/uploads/2020/03/42708834-1-f.jpg | https://archive.follent.net/wp-content/uploads/2020/03/42708834-1-f.jpg | 301 |
| /wp-content/uploads/2020/03/42708858-1-f-100x100.jpg | https://archive.follent.net/wp-content/uploads/2020/03/42708858-1-f-100x100.jpg | 301 |
| /wp-content/uploads/2020/03/42708858-1-f-150x150.jpg | https://archive.follent.net/wp-content/uploads/2020/03/42708858-1-f-150x150.jpg | 301 |
| /wp-content/uploads/2020/03/42708858-1-f-300x300.jpg | https://archive.follent.net/wp-content/uploads/2020/03/42708858-1-f-300x300.jpg | 301 |
| /wp-content/uploads/2020/03/42708858-1-f-324x324.jpg | https://archive.follent.net/wp-content/uploads/2020/03/42708858-1-f-324x324.jpg | 301 |
| /wp-content/uploads/2020/03/42708858-1-f-416x416.jpg | https://archive.follent.net/wp-content/uploads/2020/03/42708858-1-f-416x416.jpg | 301 |
| /wp-content/uploads/2020/03/42708858-1-f.jpg | https://archive.follent.net/wp-content/uploads/2020/03/42708858-1-f.jpg | 301 |
| /wp-content/uploads/2020/03/42708971-1-f-100x100.jpg | https://archive.follent.net/wp-content/uploads/2020/03/42708971-1-f-100x100.jpg | 301 |
| /wp-content/uploads/2020/03/42708971-1-f-150x150.jpg | https://archive.follent.net/wp-content/uploads/2020/03/42708971-1-f-150x150.jpg | 301 |
| /wp-content/uploads/2020/03/42708971-1-f-300x300.jpg | https://archive.follent.net/wp-content/uploads/2020/03/42708971-1-f-300x300.jpg | 301 |
| /wp-content/uploads/2020/03/42708971-1-f-324x324.jpg | https://archive.follent.net/wp-content/uploads/2020/03/42708971-1-f-324x324.jpg | 301 |
| /wp-content/uploads/2020/03/42708971-1-f-416x416.jpg | https://archive.follent.net/wp-content/uploads/2020/03/42708971-1-f-416x416.jpg | 301 |
| /wp-content/uploads/2020/03/42708971-1-f.jpg | https://archive.follent.net/wp-content/uploads/2020/03/42708971-1-f.jpg | 301 |
| /wp-content/uploads/2020/03/Candle_Care_Guide.pdf | https://archive.follent.net/wp-content/uploads/2020/03/Candle_Care_Guide.pdf | 301 |
| /wp-content/uploads/2020/03/JF_Collection.png | https://archive.follent.net/wp-content/uploads/2020/03/JF_Collection.png | 301 |
| /wp-content/uploads/2020/03/JF_Collection_Square.png | https://archive.follent.net/wp-content/uploads/2020/03/JF_Collection_Square.png | 301 |
| /wp-content/uploads/2020/03/cropped-JF_Collection_Square-1.png | https://archive.follent.net/wp-content/uploads/2020/03/cropped-JF_Collection_Square-1.png | 301 |
| /wp-content/uploads/2020/03/cropped-JF_Collection_Square-180x180.png | https://archive.follent.net/wp-content/uploads/2020/03/cropped-JF_Collection_Square-180x180.png | 301 |
| /wp-content/uploads/2020/03/cropped-JF_Collection_Square-192x192.png | https://archive.follent.net/wp-content/uploads/2020/03/cropped-JF_Collection_Square-192x192.png | 301 |
| /wp-content/uploads/2020/03/cropped-JF_Collection_Square-270x270.png | https://archive.follent.net/wp-content/uploads/2020/03/cropped-JF_Collection_Square-270x270.png | 301 |
| /wp-content/uploads/2020/03/cropped-JF_Collection_Square-32x32.png | https://archive.follent.net/wp-content/uploads/2020/03/cropped-JF_Collection_Square-32x32.png | 301 |
| /wp-content/uploads/2020/03/cropped-JF_Collection_Square.png | https://archive.follent.net/wp-content/uploads/2020/03/cropped-JF_Collection_Square.png | 301 |
| /wp-content/uploads/2020/03/wine-tasting_1518174566-300x200.jpg | https://archive.follent.net/wp-content/uploads/2020/03/wine-tasting_1518174566-300x200.jpg | 301 |
| /wp-content/uploads/2020/03/wine-tasting_1518174566-416x277.jpg | https://archive.follent.net/wp-content/uploads/2020/03/wine-tasting_1518174566-416x277.jpg | 301 |
| /wp-content/uploads/2020/03/wine-tasting_1518174566-768x512.jpg | https://archive.follent.net/wp-content/uploads/2020/03/wine-tasting_1518174566-768x512.jpg | 301 |
| /wp-content/uploads/2020/03/wine-tasting_1518174566.jpg | https://archive.follent.net/wp-content/uploads/2020/03/wine-tasting_1518174566.jpg | 301 |
| /wp-content/uploads/2020/04/Add-a-heading-1024x576.png | https://archive.follent.net/wp-content/uploads/2020/04/Add-a-heading-1024x576.png | 301 |
| /wp-content/uploads/2020/04/Add-a-heading-1536x864.png | https://archive.follent.net/wp-content/uploads/2020/04/Add-a-heading-1536x864.png | 301 |
| /wp-content/uploads/2020/04/Add-a-heading-300x169.png | https://archive.follent.net/wp-content/uploads/2020/04/Add-a-heading-300x169.png | 301 |
| /wp-content/uploads/2020/04/Add-a-heading-416x234.png | https://archive.follent.net/wp-content/uploads/2020/04/Add-a-heading-416x234.png | 301 |
| /wp-content/uploads/2020/04/Add-a-heading-768x432.png | https://archive.follent.net/wp-content/uploads/2020/04/Add-a-heading-768x432.png | 301 |
| /wp-content/uploads/2020/04/Add-a-heading.png | https://archive.follent.net/wp-content/uploads/2020/04/Add-a-heading.png | 301 |
| /wp-content/uploads/2020/04/Circle-JF-Collection-1.png | https://archive.follent.net/wp-content/uploads/2020/04/Circle-JF-Collection-1.png | 301 |
| /wp-content/uploads/2020/04/Circle-JF-Collection.png | https://archive.follent.net/wp-content/uploads/2020/04/Circle-JF-Collection.png | 301 |
| /wp-content/uploads/2020/04/cropped-Circle-JF-Collection-1.png | https://archive.follent.net/wp-content/uploads/2020/04/cropped-Circle-JF-Collection-1.png | 301 |
| /wp-content/uploads/2020/05/3-Lessons-I-Learned-From-Starting-A-Podcast-1-e1588486176630-100x100.png | https://archive.follent.net/wp-content/uploads/2020/05/3-Lessons-I-Learned-From-Starting-A-Podcast-1-e1588486176630-100x100.png | 301 |
| /wp-content/uploads/2020/05/3-Lessons-I-Learned-From-Starting-A-Podcast-1-e1588486176630-150x150.png | https://archive.follent.net/wp-content/uploads/2020/05/3-Lessons-I-Learned-From-Starting-A-Podcast-1-e1588486176630-150x150.png | 301 |
| /wp-content/uploads/2020/05/3-Lessons-I-Learned-From-Starting-A-Podcast-1-e1588486176630-300x300.png | https://archive.follent.net/wp-content/uploads/2020/05/3-Lessons-I-Learned-From-Starting-A-Podcast-1-e1588486176630-300x300.png | 301 |
| /wp-content/uploads/2020/05/3-Lessons-I-Learned-From-Starting-A-Podcast-1-e1588486176630-324x324.png | https://archive.follent.net/wp-content/uploads/2020/05/3-Lessons-I-Learned-From-Starting-A-Podcast-1-e1588486176630-324x324.png | 301 |
| /wp-content/uploads/2020/05/3-Lessons-I-Learned-From-Starting-A-Podcast-1-e1588486176630-416x416.png | https://archive.follent.net/wp-content/uploads/2020/05/3-Lessons-I-Learned-From-Starting-A-Podcast-1-e1588486176630-416x416.png | 301 |
| /wp-content/uploads/2020/05/3-Lessons-I-Learned-From-Starting-A-Podcast-1-e1588486176630-80x80.png | https://archive.follent.net/wp-content/uploads/2020/05/3-Lessons-I-Learned-From-Starting-A-Podcast-1-e1588486176630-80x80.png | 301 |
| /wp-content/uploads/2020/05/3-Lessons-I-Learned-From-Starting-A-Podcast-1-e1588486176630.png | https://archive.follent.net/wp-content/uploads/2020/05/3-Lessons-I-Learned-From-Starting-A-Podcast-1-e1588486176630.png | 301 |
| /wp-content/uploads/2020/05/42694939-1-sz-100x100.jpg | https://archive.follent.net/wp-content/uploads/2020/05/42694939-1-sz-100x100.jpg | 301 |
| /wp-content/uploads/2020/05/42694939-1-sz-1024x1024.jpg | https://archive.follent.net/wp-content/uploads/2020/05/42694939-1-sz-1024x1024.jpg | 301 |
| /wp-content/uploads/2020/05/42694939-1-sz-150x150.jpg | https://archive.follent.net/wp-content/uploads/2020/05/42694939-1-sz-150x150.jpg | 301 |
| /wp-content/uploads/2020/05/42694939-1-sz-300x300.jpg | https://archive.follent.net/wp-content/uploads/2020/05/42694939-1-sz-300x300.jpg | 301 |
| /wp-content/uploads/2020/05/42694939-1-sz-324x324.jpg | https://archive.follent.net/wp-content/uploads/2020/05/42694939-1-sz-324x324.jpg | 301 |
| /wp-content/uploads/2020/05/42694939-1-sz-416x416.jpg | https://archive.follent.net/wp-content/uploads/2020/05/42694939-1-sz-416x416.jpg | 301 |
| /wp-content/uploads/2020/05/42694939-1-sz-768x768.jpg | https://archive.follent.net/wp-content/uploads/2020/05/42694939-1-sz-768x768.jpg | 301 |
| /wp-content/uploads/2020/05/42694939-1-sz-80x80.jpg | https://archive.follent.net/wp-content/uploads/2020/05/42694939-1-sz-80x80.jpg | 301 |
| /wp-content/uploads/2020/05/42694939-1-sz.jpg | https://archive.follent.net/wp-content/uploads/2020/05/42694939-1-sz.jpg | 301 |
| /wp-content/uploads/2020/05/Eucalyptus-Mint-Candle.png | https://archive.follent.net/wp-content/uploads/2020/05/Eucalyptus-Mint-Candle.png | 301 |
| /wp-content/uploads/2020/05/Fresh-Linen-Fragrant-Candle-100x100.png | https://archive.follent.net/wp-content/uploads/2020/05/Fresh-Linen-Fragrant-Candle-100x100.png | 301 |
| /wp-content/uploads/2020/05/Fresh-Linen-Fragrant-Candle-1024x1024.png | https://archive.follent.net/wp-content/uploads/2020/05/Fresh-Linen-Fragrant-Candle-1024x1024.png | 301 |
| /wp-content/uploads/2020/05/Fresh-Linen-Fragrant-Candle-150x150.png | https://archive.follent.net/wp-content/uploads/2020/05/Fresh-Linen-Fragrant-Candle-150x150.png | 301 |
| /wp-content/uploads/2020/05/Fresh-Linen-Fragrant-Candle-300x300.png | https://archive.follent.net/wp-content/uploads/2020/05/Fresh-Linen-Fragrant-Candle-300x300.png | 301 |
| /wp-content/uploads/2020/05/Fresh-Linen-Fragrant-Candle-324x324.png | https://archive.follent.net/wp-content/uploads/2020/05/Fresh-Linen-Fragrant-Candle-324x324.png | 301 |
| /wp-content/uploads/2020/05/Fresh-Linen-Fragrant-Candle-416x416.png | https://archive.follent.net/wp-content/uploads/2020/05/Fresh-Linen-Fragrant-Candle-416x416.png | 301 |
| /wp-content/uploads/2020/05/Fresh-Linen-Fragrant-Candle-768x768.png | https://archive.follent.net/wp-content/uploads/2020/05/Fresh-Linen-Fragrant-Candle-768x768.png | 301 |
| /wp-content/uploads/2020/05/Fresh-Linen-Fragrant-Candle.png | https://archive.follent.net/wp-content/uploads/2020/05/Fresh-Linen-Fragrant-Candle.png | 301 |
| /wp-content/uploads/2020/05/Prosecco-Pear-Candle-100x100.png | https://archive.follent.net/wp-content/uploads/2020/05/Prosecco-Pear-Candle-100x100.png | 301 |
| /wp-content/uploads/2020/05/Prosecco-Pear-Candle-1024x1024.png | https://archive.follent.net/wp-content/uploads/2020/05/Prosecco-Pear-Candle-1024x1024.png | 301 |
| /wp-content/uploads/2020/05/Prosecco-Pear-Candle-150x150.png | https://archive.follent.net/wp-content/uploads/2020/05/Prosecco-Pear-Candle-150x150.png | 301 |
| /wp-content/uploads/2020/05/Prosecco-Pear-Candle-300x300.png | https://archive.follent.net/wp-content/uploads/2020/05/Prosecco-Pear-Candle-300x300.png | 301 |
| /wp-content/uploads/2020/05/Prosecco-Pear-Candle-324x324.png | https://archive.follent.net/wp-content/uploads/2020/05/Prosecco-Pear-Candle-324x324.png | 301 |
| /wp-content/uploads/2020/05/Prosecco-Pear-Candle-416x416.png | https://archive.follent.net/wp-content/uploads/2020/05/Prosecco-Pear-Candle-416x416.png | 301 |
| /wp-content/uploads/2020/05/Prosecco-Pear-Candle-768x768.png | https://archive.follent.net/wp-content/uploads/2020/05/Prosecco-Pear-Candle-768x768.png | 301 |
| /wp-content/uploads/2020/05/Prosecco-Pear-Candle.png | https://archive.follent.net/wp-content/uploads/2020/05/Prosecco-Pear-Candle.png | 301 |
| /wp-content/uploads/2020/05/Toasted-Vanilla-Candle.png | https://archive.follent.net/wp-content/uploads/2020/05/Toasted-Vanilla-Candle.png | 301 |
| /wp-content/uploads/2020/05/Tropical-Candle-100x100.png | https://archive.follent.net/wp-content/uploads/2020/05/Tropical-Candle-100x100.png | 301 |
| /wp-content/uploads/2020/05/Tropical-Candle-1024x1024.png | https://archive.follent.net/wp-content/uploads/2020/05/Tropical-Candle-1024x1024.png | 301 |
| /wp-content/uploads/2020/05/Tropical-Candle-150x150.png | https://archive.follent.net/wp-content/uploads/2020/05/Tropical-Candle-150x150.png | 301 |
| /wp-content/uploads/2020/05/Tropical-Candle-300x300.png | https://archive.follent.net/wp-content/uploads/2020/05/Tropical-Candle-300x300.png | 301 |
| /wp-content/uploads/2020/05/Tropical-Candle-324x324.png | https://archive.follent.net/wp-content/uploads/2020/05/Tropical-Candle-324x324.png | 301 |
| /wp-content/uploads/2020/05/Tropical-Candle-416x416.png | https://archive.follent.net/wp-content/uploads/2020/05/Tropical-Candle-416x416.png | 301 |
| /wp-content/uploads/2020/05/Tropical-Candle-768x768.png | https://archive.follent.net/wp-content/uploads/2020/05/Tropical-Candle-768x768.png | 301 |
| /wp-content/uploads/2020/05/Tropical-Candle.png | https://archive.follent.net/wp-content/uploads/2020/05/Tropical-Candle.png | 301 |
| /wp-content/uploads/2020/11/IMG_9785-Enhanced-200x300.jpg | https://archive.follent.net/wp-content/uploads/2020/11/IMG_9785-Enhanced-200x300.jpg | 301 |
| /wp-content/uploads/2020/11/IMG_9785-Enhanced-scaled.jpg | https://archive.follent.net/wp-content/uploads/2020/11/IMG_9785-Enhanced-scaled.jpg | 301 |
| /wp-content/uploads/2021/03/James-Follent-LR-BLACK-300x94.png | https://archive.follent.net/wp-content/uploads/2021/03/James-Follent-LR-BLACK-300x94.png | 301 |
| /wp-content/uploads/2021/03/James-Follent-LR-BLACK-416x130.png | https://archive.follent.net/wp-content/uploads/2021/03/James-Follent-LR-BLACK-416x130.png | 301 |
| /wp-content/uploads/2021/03/James-Follent-LR-BLACK.png | https://archive.follent.net/wp-content/uploads/2021/03/James-Follent-LR-BLACK.png | 301 |
| /wp-content/uploads/2021/05/1-1-100x100.png | https://archive.follent.net/wp-content/uploads/2021/05/1-1-100x100.png | 301 |
| /wp-content/uploads/2021/05/1-1-1229x1536.png | https://archive.follent.net/wp-content/uploads/2021/05/1-1-1229x1536.png | 301 |
| /wp-content/uploads/2021/05/1-1-150x150.png | https://archive.follent.net/wp-content/uploads/2021/05/1-1-150x150.png | 301 |
| /wp-content/uploads/2021/05/1-1-240x300.png | https://archive.follent.net/wp-content/uploads/2021/05/1-1-240x300.png | 301 |
| /wp-content/uploads/2021/05/1-1-324x324.png | https://archive.follent.net/wp-content/uploads/2021/05/1-1-324x324.png | 301 |
| /wp-content/uploads/2021/05/1-1-416x520.png | https://archive.follent.net/wp-content/uploads/2021/05/1-1-416x520.png | 301 |
| /wp-content/uploads/2021/05/1-1-768x960.png | https://archive.follent.net/wp-content/uploads/2021/05/1-1-768x960.png | 301 |
| /wp-content/uploads/2021/05/1-1-819x1024.png | https://archive.follent.net/wp-content/uploads/2021/05/1-1-819x1024.png | 301 |
| /wp-content/uploads/2021/05/1-1.png | https://archive.follent.net/wp-content/uploads/2021/05/1-1.png | 301 |
| /wp-content/uploads/2021/05/1-100x100.png | https://archive.follent.net/wp-content/uploads/2021/05/1-100x100.png | 301 |
| /wp-content/uploads/2021/05/1-1024x1024.png | https://archive.follent.net/wp-content/uploads/2021/05/1-1024x1024.png | 301 |
| /wp-content/uploads/2021/05/1-150x150.png | https://archive.follent.net/wp-content/uploads/2021/05/1-150x150.png | 301 |
| /wp-content/uploads/2021/05/1-300x300.png | https://archive.follent.net/wp-content/uploads/2021/05/1-300x300.png | 301 |
| /wp-content/uploads/2021/05/1-324x324.png | https://archive.follent.net/wp-content/uploads/2021/05/1-324x324.png | 301 |
| /wp-content/uploads/2021/05/1-416x416.png | https://archive.follent.net/wp-content/uploads/2021/05/1-416x416.png | 301 |
| /wp-content/uploads/2021/05/1-768x768.png | https://archive.follent.net/wp-content/uploads/2021/05/1-768x768.png | 301 |
| /wp-content/uploads/2021/05/1.png | https://archive.follent.net/wp-content/uploads/2021/05/1.png | 301 |
| /wp-content/uploads/2021/05/2-1-100x100.png | https://archive.follent.net/wp-content/uploads/2021/05/2-1-100x100.png | 301 |
| /wp-content/uploads/2021/05/2-1-1229x1536.png | https://archive.follent.net/wp-content/uploads/2021/05/2-1-1229x1536.png | 301 |
| /wp-content/uploads/2021/05/2-1-150x150.png | https://archive.follent.net/wp-content/uploads/2021/05/2-1-150x150.png | 301 |
| /wp-content/uploads/2021/05/2-1-240x300.png | https://archive.follent.net/wp-content/uploads/2021/05/2-1-240x300.png | 301 |
| /wp-content/uploads/2021/05/2-1-324x324.png | https://archive.follent.net/wp-content/uploads/2021/05/2-1-324x324.png | 301 |
| /wp-content/uploads/2021/05/2-1-416x520.png | https://archive.follent.net/wp-content/uploads/2021/05/2-1-416x520.png | 301 |
| /wp-content/uploads/2021/05/2-1-768x960.png | https://archive.follent.net/wp-content/uploads/2021/05/2-1-768x960.png | 301 |
| /wp-content/uploads/2021/05/2-1-819x1024.png | https://archive.follent.net/wp-content/uploads/2021/05/2-1-819x1024.png | 301 |
| /wp-content/uploads/2021/05/2-1.png | https://archive.follent.net/wp-content/uploads/2021/05/2-1.png | 301 |
| /wp-content/uploads/2021/05/2-100x100.png | https://archive.follent.net/wp-content/uploads/2021/05/2-100x100.png | 301 |
| /wp-content/uploads/2021/05/2-1024x1024.png | https://archive.follent.net/wp-content/uploads/2021/05/2-1024x1024.png | 301 |
| /wp-content/uploads/2021/05/2-150x150.png | https://archive.follent.net/wp-content/uploads/2021/05/2-150x150.png | 301 |
| /wp-content/uploads/2021/05/2-300x300.png | https://archive.follent.net/wp-content/uploads/2021/05/2-300x300.png | 301 |
| /wp-content/uploads/2021/05/2-324x324.png | https://archive.follent.net/wp-content/uploads/2021/05/2-324x324.png | 301 |
| /wp-content/uploads/2021/05/2-416x416.png | https://archive.follent.net/wp-content/uploads/2021/05/2-416x416.png | 301 |
| /wp-content/uploads/2021/05/2-768x768.png | https://archive.follent.net/wp-content/uploads/2021/05/2-768x768.png | 301 |
| /wp-content/uploads/2021/05/2.png | https://archive.follent.net/wp-content/uploads/2021/05/2.png | 301 |
| /wp-content/uploads/2021/05/20210502-_MG_5628-scaled.jpg | https://archive.follent.net/wp-content/uploads/2021/05/20210502-_MG_5628-scaled.jpg | 301 |
| /wp-content/uploads/2021/05/20210502-_MG_5632-scaled.jpg | https://archive.follent.net/wp-content/uploads/2021/05/20210502-_MG_5632-scaled.jpg | 301 |
| /wp-content/uploads/2021/05/20210502-_MG_5635-scaled.jpg | https://archive.follent.net/wp-content/uploads/2021/05/20210502-_MG_5635-scaled.jpg | 301 |
| /wp-content/uploads/2021/05/20210502-_MG_5636-scaled.jpg | https://archive.follent.net/wp-content/uploads/2021/05/20210502-_MG_5636-scaled.jpg | 301 |
| /wp-content/uploads/2021/05/20210502-_MG_5639-scaled.jpg | https://archive.follent.net/wp-content/uploads/2021/05/20210502-_MG_5639-scaled.jpg | 301 |
| /wp-content/uploads/2021/07/How-to-make-Non-Alcoholic-Sangria-1-1024x576.png | https://archive.follent.net/wp-content/uploads/2021/07/How-to-make-Non-Alcoholic-Sangria-1-1024x576.png | 301 |
| /wp-content/uploads/2021/07/How-to-make-Non-Alcoholic-Sangria-1-1536x864.png | https://archive.follent.net/wp-content/uploads/2021/07/How-to-make-Non-Alcoholic-Sangria-1-1536x864.png | 301 |
| /wp-content/uploads/2021/07/How-to-make-Non-Alcoholic-Sangria-1-300x169.png | https://archive.follent.net/wp-content/uploads/2021/07/How-to-make-Non-Alcoholic-Sangria-1-300x169.png | 301 |
| /wp-content/uploads/2021/07/How-to-make-Non-Alcoholic-Sangria-1-416x234.png | https://archive.follent.net/wp-content/uploads/2021/07/How-to-make-Non-Alcoholic-Sangria-1-416x234.png | 301 |
| /wp-content/uploads/2021/07/How-to-make-Non-Alcoholic-Sangria-1-768x432.png | https://archive.follent.net/wp-content/uploads/2021/07/How-to-make-Non-Alcoholic-Sangria-1-768x432.png | 301 |
| /wp-content/uploads/2021/07/How-to-make-Non-Alcoholic-Sangria-1.png | https://archive.follent.net/wp-content/uploads/2021/07/How-to-make-Non-Alcoholic-Sangria-1.png | 301 |
| /wp-content/uploads/2022/01/CITRONELLA-100x100.png | https://archive.follent.net/wp-content/uploads/2022/01/CITRONELLA-100x100.png | 301 |
| /wp-content/uploads/2022/01/CITRONELLA-1024x1024.png | https://archive.follent.net/wp-content/uploads/2022/01/CITRONELLA-1024x1024.png | 301 |
| /wp-content/uploads/2022/01/CITRONELLA-150x150.png | https://archive.follent.net/wp-content/uploads/2022/01/CITRONELLA-150x150.png | 301 |
| /wp-content/uploads/2022/01/CITRONELLA-300x300.png | https://archive.follent.net/wp-content/uploads/2022/01/CITRONELLA-300x300.png | 301 |
| /wp-content/uploads/2022/01/CITRONELLA-324x324.png | https://archive.follent.net/wp-content/uploads/2022/01/CITRONELLA-324x324.png | 301 |
| /wp-content/uploads/2022/01/CITRONELLA-416x416.png | https://archive.follent.net/wp-content/uploads/2022/01/CITRONELLA-416x416.png | 301 |
| /wp-content/uploads/2022/01/CITRONELLA-768x768.png | https://archive.follent.net/wp-content/uploads/2022/01/CITRONELLA-768x768.png | 301 |
| /wp-content/uploads/2022/01/CITRONELLA.png | https://archive.follent.net/wp-content/uploads/2022/01/CITRONELLA.png | 301 |
| /wp-content/uploads/2022/01/COCONUT-LIME-100x100.png | https://archive.follent.net/wp-content/uploads/2022/01/COCONUT-LIME-100x100.png | 301 |
| /wp-content/uploads/2022/01/COCONUT-LIME-1024x1024.png | https://archive.follent.net/wp-content/uploads/2022/01/COCONUT-LIME-1024x1024.png | 301 |
| /wp-content/uploads/2022/01/COCONUT-LIME-150x150.png | https://archive.follent.net/wp-content/uploads/2022/01/COCONUT-LIME-150x150.png | 301 |
| /wp-content/uploads/2022/01/COCONUT-LIME-300x300.png | https://archive.follent.net/wp-content/uploads/2022/01/COCONUT-LIME-300x300.png | 301 |
| /wp-content/uploads/2022/01/COCONUT-LIME-324x324.png | https://archive.follent.net/wp-content/uploads/2022/01/COCONUT-LIME-324x324.png | 301 |
| /wp-content/uploads/2022/01/COCONUT-LIME-416x416.png | https://archive.follent.net/wp-content/uploads/2022/01/COCONUT-LIME-416x416.png | 301 |
| /wp-content/uploads/2022/01/COCONUT-LIME-768x768.png | https://archive.follent.net/wp-content/uploads/2022/01/COCONUT-LIME-768x768.png | 301 |
| /wp-content/uploads/2022/01/COCONUT-LIME.png | https://archive.follent.net/wp-content/uploads/2022/01/COCONUT-LIME.png | 301 |
| /wp-content/uploads/2022/01/VANILLA-CARAMEL-100x100.png | https://archive.follent.net/wp-content/uploads/2022/01/VANILLA-CARAMEL-100x100.png | 301 |
| /wp-content/uploads/2022/01/VANILLA-CARAMEL-1024x1024.png | https://archive.follent.net/wp-content/uploads/2022/01/VANILLA-CARAMEL-1024x1024.png | 301 |
| /wp-content/uploads/2022/01/VANILLA-CARAMEL-150x150.png | https://archive.follent.net/wp-content/uploads/2022/01/VANILLA-CARAMEL-150x150.png | 301 |
| /wp-content/uploads/2022/01/VANILLA-CARAMEL-300x300.png | https://archive.follent.net/wp-content/uploads/2022/01/VANILLA-CARAMEL-300x300.png | 301 |
| /wp-content/uploads/2022/01/VANILLA-CARAMEL-324x324.png | https://archive.follent.net/wp-content/uploads/2022/01/VANILLA-CARAMEL-324x324.png | 301 |
| /wp-content/uploads/2022/01/VANILLA-CARAMEL-416x416.png | https://archive.follent.net/wp-content/uploads/2022/01/VANILLA-CARAMEL-416x416.png | 301 |
| /wp-content/uploads/2022/01/VANILLA-CARAMEL-768x768.png | https://archive.follent.net/wp-content/uploads/2022/01/VANILLA-CARAMEL-768x768.png | 301 |
| /wp-content/uploads/2022/01/VANILLA-CARAMEL.png | https://archive.follent.net/wp-content/uploads/2022/01/VANILLA-CARAMEL.png | 301 |
| /wp-content/uploads/2022/01/WILD-MULBERRY-100x100.png | https://archive.follent.net/wp-content/uploads/2022/01/WILD-MULBERRY-100x100.png | 301 |
| /wp-content/uploads/2022/01/WILD-MULBERRY-1024x1024.png | https://archive.follent.net/wp-content/uploads/2022/01/WILD-MULBERRY-1024x1024.png | 301 |
| /wp-content/uploads/2022/01/WILD-MULBERRY-150x150.png | https://archive.follent.net/wp-content/uploads/2022/01/WILD-MULBERRY-150x150.png | 301 |
| /wp-content/uploads/2022/01/WILD-MULBERRY-300x300.png | https://archive.follent.net/wp-content/uploads/2022/01/WILD-MULBERRY-300x300.png | 301 |
| /wp-content/uploads/2022/01/WILD-MULBERRY-324x324.png | https://archive.follent.net/wp-content/uploads/2022/01/WILD-MULBERRY-324x324.png | 301 |
| /wp-content/uploads/2022/01/WILD-MULBERRY-416x416.png | https://archive.follent.net/wp-content/uploads/2022/01/WILD-MULBERRY-416x416.png | 301 |
| /wp-content/uploads/2022/01/WILD-MULBERRY-768x768.png | https://archive.follent.net/wp-content/uploads/2022/01/WILD-MULBERRY-768x768.png | 301 |
| /wp-content/uploads/2022/01/WILD-MULBERRY.png | https://archive.follent.net/wp-content/uploads/2022/01/WILD-MULBERRY.png | 301 |
| /wp-content/uploads/2024/01/20240118_100606421_iOS-1152x1536.png | https://archive.follent.net/wp-content/uploads/2024/01/20240118_100606421_iOS-1152x1536.png | 301 |
| /wp-content/uploads/2024/01/20240118_100606421_iOS-1536x2048.png | https://archive.follent.net/wp-content/uploads/2024/01/20240118_100606421_iOS-1536x2048.png | 301 |
| /wp-content/uploads/2024/01/20240118_100606421_iOS-225x300.png | https://archive.follent.net/wp-content/uploads/2024/01/20240118_100606421_iOS-225x300.png | 301 |
| /wp-content/uploads/2024/01/20240118_100606421_iOS-416x555.png | https://archive.follent.net/wp-content/uploads/2024/01/20240118_100606421_iOS-416x555.png | 301 |
| /wp-content/uploads/2024/01/20240118_100606421_iOS-768x1024.png | https://archive.follent.net/wp-content/uploads/2024/01/20240118_100606421_iOS-768x1024.png | 301 |
| /wp-content/uploads/2024/01/20240118_100606421_iOS.png | https://archive.follent.net/wp-content/uploads/2024/01/20240118_100606421_iOS.png | 301 |
| /wp-content/uploads/2024/01/20240118_100805887_iOS-1152x1536.png | https://archive.follent.net/wp-content/uploads/2024/01/20240118_100805887_iOS-1152x1536.png | 301 |
| /wp-content/uploads/2024/01/20240118_100805887_iOS-1536x2048.png | https://archive.follent.net/wp-content/uploads/2024/01/20240118_100805887_iOS-1536x2048.png | 301 |
| /wp-content/uploads/2024/01/20240118_100805887_iOS-225x300.png | https://archive.follent.net/wp-content/uploads/2024/01/20240118_100805887_iOS-225x300.png | 301 |
| /wp-content/uploads/2024/01/20240118_100805887_iOS-416x555.png | https://archive.follent.net/wp-content/uploads/2024/01/20240118_100805887_iOS-416x555.png | 301 |
| /wp-content/uploads/2024/01/20240118_100805887_iOS-768x1024.png | https://archive.follent.net/wp-content/uploads/2024/01/20240118_100805887_iOS-768x1024.png | 301 |
| /wp-content/uploads/2024/01/20240118_100805887_iOS.png | https://archive.follent.net/wp-content/uploads/2024/01/20240118_100805887_iOS.png | 301 |
| /wp-content/uploads/2024/01/20240118_101542046_iOS-1152x1536.png | https://archive.follent.net/wp-content/uploads/2024/01/20240118_101542046_iOS-1152x1536.png | 301 |
| /wp-content/uploads/2024/01/20240118_101542046_iOS-1536x2048.png | https://archive.follent.net/wp-content/uploads/2024/01/20240118_101542046_iOS-1536x2048.png | 301 |
| /wp-content/uploads/2024/01/20240118_101542046_iOS-225x300.png | https://archive.follent.net/wp-content/uploads/2024/01/20240118_101542046_iOS-225x300.png | 301 |
| /wp-content/uploads/2024/01/20240118_101542046_iOS-416x555.png | https://archive.follent.net/wp-content/uploads/2024/01/20240118_101542046_iOS-416x555.png | 301 |
| /wp-content/uploads/2024/01/20240118_101542046_iOS-768x1024.png | https://archive.follent.net/wp-content/uploads/2024/01/20240118_101542046_iOS-768x1024.png | 301 |
| /wp-content/uploads/2024/01/20240118_101542046_iOS.png | https://archive.follent.net/wp-content/uploads/2024/01/20240118_101542046_iOS.png | 301 |
| /wp-content/uploads/2024/01/20240122_062053155_iOS-1152x1536.png | https://archive.follent.net/wp-content/uploads/2024/01/20240122_062053155_iOS-1152x1536.png | 301 |
| /wp-content/uploads/2024/01/20240122_062053155_iOS-1536x2048.png | https://archive.follent.net/wp-content/uploads/2024/01/20240122_062053155_iOS-1536x2048.png | 301 |
| /wp-content/uploads/2024/01/20240122_062053155_iOS-225x300.png | https://archive.follent.net/wp-content/uploads/2024/01/20240122_062053155_iOS-225x300.png | 301 |
| /wp-content/uploads/2024/01/20240122_062053155_iOS-416x555.png | https://archive.follent.net/wp-content/uploads/2024/01/20240122_062053155_iOS-416x555.png | 301 |
| /wp-content/uploads/2024/01/20240122_062053155_iOS-768x1024.png | https://archive.follent.net/wp-content/uploads/2024/01/20240122_062053155_iOS-768x1024.png | 301 |
| /wp-content/uploads/2024/01/20240122_062053155_iOS.png | https://archive.follent.net/wp-content/uploads/2024/01/20240122_062053155_iOS.png | 301 |
| /wp-content/uploads/2024/01/IMG_8866-1152x1536.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8866-1152x1536.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8866-1536x2048.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8866-1536x2048.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8866-225x300.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8866-225x300.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8866-416x555.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8866-416x555.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8866-768x1024.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8866-768x1024.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8866-scaled.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8866-scaled.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8868-1152x1536.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8868-1152x1536.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8868-1536x2048.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8868-1536x2048.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8868-225x300.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8868-225x300.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8868-416x555.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8868-416x555.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8868-768x1024.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8868-768x1024.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8868-scaled.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8868-scaled.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8870-100x100.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8870-100x100.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8870-1024x1024.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8870-1024x1024.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8870-150x150.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8870-150x150.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8870-1536x1536.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8870-1536x1536.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8870-2048x2048.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8870-2048x2048.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8870-300x300.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8870-300x300.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8870-324x324.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8870-324x324.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8870-416x416.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8870-416x416.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8870-768x768.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8870-768x768.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8870-scaled.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8870-scaled.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8874-1152x1536.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8874-1152x1536.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8874-1536x2048.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8874-1536x2048.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8874-225x300.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8874-225x300.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8874-416x555.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8874-416x555.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8874-768x1024.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8874-768x1024.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_8874-scaled.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_8874-scaled.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_9032-1152x1536.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_9032-1152x1536.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_9032-1536x2048.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_9032-1536x2048.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_9032-225x300.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_9032-225x300.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_9032-416x555.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_9032-416x555.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_9032-768x1024.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_9032-768x1024.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_9032-scaled.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_9032-scaled.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_9105-1152x1536.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_9105-1152x1536.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_9105-1536x2048.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_9105-1536x2048.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_9105-225x300.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_9105-225x300.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_9105-416x555.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_9105-416x555.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_9105-768x1024.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_9105-768x1024.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_9105-scaled.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_9105-scaled.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_9129-1152x1536.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_9129-1152x1536.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_9129-1536x2048.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_9129-1536x2048.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_9129-225x300.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_9129-225x300.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_9129-416x555.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_9129-416x555.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_9129-768x1024.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_9129-768x1024.jpg | 301 |
| /wp-content/uploads/2024/01/IMG_9129-scaled.jpg | https://archive.follent.net/wp-content/uploads/2024/01/IMG_9129-scaled.jpg | 301 |
| /wp-content/uploads/woocommerce-placeholder.png | https://archive.follent.net/wp-content/uploads/woocommerce-placeholder.png | 301 |

## Approval, deployment and recovery

Review the exact mappings and the route decisions before setting launch.migrationReviewed. Verify the generated rules on the actual Pages hostname, including query preservation and genuine missing-route 404s. Keep config.redirects as the sole path-redirect layer; www canonicalisation is a separately scoped Cloudflare rule.

Preserve Flywheel hosting, the archive, backups, mail and verification records. At cutover register apex/www through Pages before applying DNS changes. Retain Flywheel apex/www aliases until Pages acceptance, then remove only those aliases. Before alias removal rollback restores recorded apex/www DNS and disables conflicting new redirects; afterward re-add Flywheel aliases first.

Publishing Shopify drafts and replacing an archive target with a verified final equivalent require separate work. Do not send wine/product traffic to the business homepage.
