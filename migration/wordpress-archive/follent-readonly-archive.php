<?php
/**
 * Plugin Name: Follent Read-only Archive
 * Description: Preserves historical content while disabling public submissions and commerce.
 * Version: 1.0.1
 */
if (!defined('ABSPATH')) { exit; }
function follent_archive_deny() {
    nocache_headers();
    wp_die('This is a read-only archive. Orders, payments and submissions are closed.', 'Read-only archive', array('response' => 403));
}
add_action('init', function () {
    $script = basename(isset($_SERVER['SCRIPT_NAME']) ? $_SERVER['SCRIPT_NAME'] : '');
    $method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';
    $action = isset($_REQUEST['action']) && is_string($_REQUEST['action']) ? $_REQUEST['action'] : 'login';
    $path = isset($_SERVER['REQUEST_URI']) ? strtok($_SERVER['REQUEST_URI'], '?') : '';
    if ($script === 'index.php' && isset($_GET['rest_route']) && $_GET['rest_route'] === '/flywheel/v1/direct-login') { return; }
    if (strpos($path, '/wc-api/') !== false) { follent_archive_deny(); }
    if (isset($_REQUEST['wc-api']) || isset($_REQUEST['wc-ajax']) || isset($_REQUEST['add-to-cart']) || $script === 'xmlrpc.php') {
        follent_archive_deny();
    }
    if (current_user_can('manage_options')) { return; }
    if ($script === 'wp-login.php') {
        if ($action !== 'login') { follent_archive_deny(); }
        return;
    }
    if (!in_array($method, array('GET', 'HEAD', 'OPTIONS'), true) || $script === 'admin-ajax.php' || $script === 'admin-post.php') {
        follent_archive_deny();
    }
}, -999);
add_action('template_redirect', function () {
    if (function_exists('is_checkout') && (is_checkout() || is_cart() || is_account_page())) { follent_archive_deny(); }
    $path = isset($_SERVER['REQUEST_URI']) ? strtok($_SERVER['REQUEST_URI'], '?') : '';
    if (strpos($path, '/wc-api/') !== false) { follent_archive_deny(); }
}, -999);
add_filter('woocommerce_is_purchasable', '__return_false', PHP_INT_MAX);
add_filter('woocommerce_variation_is_purchasable', '__return_false', PHP_INT_MAX);
add_filter('woocommerce_available_payment_gateways', function () { return array(); }, PHP_INT_MAX);
add_filter('woocommerce_loop_add_to_cart_link', '__return_empty_string', PHP_INT_MAX);
add_filter('comments_open', '__return_false', PHP_INT_MAX);
add_filter('pings_open', '__return_false', PHP_INT_MAX);
add_filter('pre_option_users_can_register', '__return_zero');
add_filter('pre_option_woocommerce_enable_myaccount_registration', function () { return 'no'; });
add_filter('wp_headers', function ($headers) {
    $headers['X-Robots-Tag'] = 'noindex, follow';
    return $headers;
}, PHP_INT_MAX);
add_filter('wp_robots', function ($robots) {
    unset($robots['index']); $robots['noindex'] = true; $robots['follow'] = true; return $robots;
}, PHP_INT_MAX);
add_filter('wpseo_robots_array', function ($robots) {
    $robots['index'] = 'noindex'; $robots['follow'] = 'follow'; return $robots;
}, PHP_INT_MAX);
add_filter('robots_txt', function () { return "User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n"; }, PHP_INT_MAX);
function follent_archive_notice() {
    static $shown = false;
    if ($shown) { return; } $shown = true;
    echo '<aside aria-label="Archive notice" style="background:#f2f0ea;color:#0a0a0c;padding:1rem;text-align:center;border-bottom:2px solid #4a002e">Historical archive of the previous Follent.net website. Content is retained for reference. Orders, payments and submissions are closed.</aside>';
}
add_action('wp_body_open', 'follent_archive_notice', -999);
add_action('wp_footer', 'follent_archive_notice', -999);

add_filter('rest_pre_dispatch', function ($result, $server, $request) {
    if ($request->get_route() === '/flywheel/v1/direct-login') { return $result; }
    if (!current_user_can('manage_options') && !in_array($request->get_method(), array('GET', 'HEAD', 'OPTIONS'), true)) {
        return new WP_Error('follent_archive_readonly', 'This is a read-only archive. Submissions are closed.', array('status' => 403));
    }
    return $result;
}, -999, 3);
