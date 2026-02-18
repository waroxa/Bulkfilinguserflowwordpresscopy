<?php
/**
 * REST API Endpoints
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register REST API routes
 */
add_action('rest_api_init', 'nylta_register_rest_routes');

function nylta_register_rest_routes() {
    // Get pricing tiers
    register_rest_route('nylta/v1', '/pricing', array(
        'methods' => 'GET',
        'callback' => 'nylta_rest_get_pricing',
        'permission_callback' => '__return_true'
    ));
    
    // Get early bird status
    register_rest_route('nylta/v1', '/early-bird', array(
        'methods' => 'GET',
        'callback' => 'nylta_rest_get_early_bird',
        'permission_callback' => '__return_true'
    ));
}

/**
 * Get pricing tiers (Tiers 1-3 only, no Tier 4)
 */
function nylta_rest_get_pricing() {
    $tiers = array(
        'tier1' => array(
            'name' => 'Small Batch Processing',
            'label' => 'Tier 1',
            'popular' => true,
            'min' => intval(NYLTA_Database::get_setting('tier1_min', 1)),
            'max' => intval(NYLTA_Database::get_setting('tier1_max', 25)),
            'price' => floatval(NYLTA_Database::get_setting('tier1_price', 358.20)),
            'originalPrice' => 398.00,
            'features' => array(
                '1-25 company filings',
                'Automated validation',
                'Individual PDF receipts',
                'Standard email support'
            )
        ),
        'tier2' => array(
            'name' => 'Medium Volume Filing',
            'label' => 'Tier 2',
            'popular' => false,
            'min' => intval(NYLTA_Database::get_setting('tier2_min', 26)),
            'max' => intval(NYLTA_Database::get_setting('tier2_max', 75)),
            'price' => floatval(NYLTA_Database::get_setting('tier2_price', 389.00)),
            'originalPrice' => 398.00,
            'features' => array(
                '26-75 company filings',
                '2.3% per-filing savings',
                'Batch export capabilities',
                'Priority email support'
            )
        ),
        'tier3' => array(
            'name' => 'High Volume Filing',
            'label' => 'Tier 3',
            'popular' => false,
            'min' => intval(NYLTA_Database::get_setting('tier3_min', 76)),
            'max' => intval(NYLTA_Database::get_setting('tier3_max', 150)),
            'price' => floatval(NYLTA_Database::get_setting('tier3_price', 375.00)),
            'originalPrice' => 398.00,
            'features' => array(
                '76-150 company filings',
                '5.8% per-filing savings',
                'Advanced reporting tools',
                'Dedicated phone support'
            )
        )
    );
    
    return new WP_REST_Response($tiers, 200);
}

/**
 * Get early bird discount status
 */
function nylta_rest_get_early_bird() {
    $discount = floatval(NYLTA_Database::get_setting('early_bird_discount', 10));
    $limit = intval(NYLTA_Database::get_setting('early_bird_limit', 25));
    $count = intval(NYLTA_Database::get_setting('early_bird_count', 0));
    
    return new WP_REST_Response(array(
        'available' => $count < $limit,
        'discount' => $discount,
        'limit' => $limit,
        'count' => $count,
        'remaining' => max(0, $limit - $count)
    ), 200);
}
