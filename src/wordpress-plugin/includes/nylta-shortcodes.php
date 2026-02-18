<?php
/**
 * Shortcodes for Frontend
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Main bulk filing portal shortcode
 * Usage: [nylta_bulk_filing]
 */
add_shortcode('nylta_bulk_filing', 'nylta_bulk_filing_shortcode');

function nylta_bulk_filing_shortcode($atts) {
    ob_start();
    
    // Check if user is logged in
    if (!is_user_logged_in()) {
        return '<p>Please <a href="' . wp_login_url(get_permalink()) . '">login</a> to access the bulk filing portal.</p>';
    }
    
    $step = isset($_GET['step']) ? intval($_GET['step']) : 0;
    
    if ($step === 0) {
        // Dashboard view
        include NYLTA_PLUGIN_DIR . 'templates/dashboard.php';
    } else {
        // Bulk filing flow
        include NYLTA_PLUGIN_DIR . 'templates/bulk-filing-flow.php';
    }
    
    return ob_get_clean();
}

/**
 * User submissions shortcode
 * Usage: [nylta_submissions]
 */
add_shortcode('nylta_submissions', 'nylta_submissions_shortcode');

function nylta_submissions_shortcode($atts) {
    ob_start();
    
    if (!is_user_logged_in()) {
        return '<p>Please <a href="' . wp_login_url(get_permalink()) . '">login</a> to view your submissions.</p>';
    }
    
    include NYLTA_PLUGIN_DIR . 'templates/my-submissions.php';
    
    return ob_get_clean();
}

/**
 * Member profile shortcode
 * Usage: [nylta_profile]
 */
add_shortcode('nylta_profile', 'nylta_profile_shortcode');

function nylta_profile_shortcode($atts) {
    ob_start();
    
    if (!is_user_logged_in()) {
        return '<p>Please <a href="' . wp_login_url(get_permalink()) . '">login</a> to view your profile.</p>';
    }
    
    include NYLTA_PLUGIN_DIR . 'templates/member-profile.php';
    
    return ob_get_clean();
}
