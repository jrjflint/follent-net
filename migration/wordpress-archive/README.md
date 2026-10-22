# WordPress archive controls

This plugin belongs only to the historical Flywheel WordPress site. It is not a dependency or component of the static business-site engine and must never be copied into `dist`.

Install the zipped `follent-readonly-archive` directory through WordPress Plugins, then activate it. Retain WooCommerce to preserve historical product pages and administrator access to orders. Keep Stripe Gateway, Mailchimp and Mailchimp for WooCommerce inactive. Do not delete their data.

The plugin rejects public write methods except the standard WordPress login flow; blocks commerce action queries, public AJAX/admin-post submissions, checkout/cart/account pages and registration; closes comments and pings; disables purchasing and payment gateways; adds a visible archive notice and noindex controls. Administrators retain normal management access. Existing host/security controls can reject a request before this plugin runs. Public read-only search remains available.

WordPress Reading Settings also has search-engine discouragement enabled. A physical host robots.txt can take precedence over the plugin robots filter: verify the served file does not block all public content from crawling. Noindex is not access control.

Rollback: deactivate this plugin, restore the prior Reading Settings value and reactivate only the integrations intentionally required. These controls do not edit/delete posts, products, orders or customer records. Do not reactivate commerce merely to roll back hostname routing.

A database/files backup remains mandatory before changing the Flywheel primary domain. Use Flywheel's supported primary-domain workflow; do not manually replace serialized database content. Restore the old primary domain and DNS from the private recovery snapshot if routing fails. A backup restore is needed only for actual data recovery, not every routing rollback.
