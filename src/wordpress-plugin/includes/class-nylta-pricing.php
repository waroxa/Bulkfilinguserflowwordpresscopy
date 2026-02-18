<?php
/**
 * Pricing Calculation Class
 */

if (!defined('ABSPATH')) {
    exit;
}

class NYLTA_Pricing {
    
    /**
     * Calculate pricing for a submission
     */
    public static function calculate_pricing($num_clients, $is_early_bird = false) {
        $tier = self::get_pricing_tier($num_clients);
        $base_price = self::get_tier_price($tier);
        
        $base_amount = $num_clients * $base_price;
        $discount_amount = 0;
        
        // Apply early bird discount if applicable
        if ($is_early_bird) {
            $early_bird_discount = floatval(NYLTA_Database::get_setting('early_bird_discount', 10));
            $discount_amount = $base_amount * ($early_bird_discount / 100);
        }
        
        $total_amount = $base_amount - $discount_amount;
        
        return array(
            'tier' => $tier,
            'base_price' => $base_price,
            'base_amount' => $base_amount,
            'discount_percent' => $is_early_bird ? $early_bird_discount : 0,
            'discount_amount' => $discount_amount,
            'total_amount' => $total_amount
        );
    }
    
    /**
     * Get pricing tier based on number of clients
     */
    public static function get_pricing_tier($num_clients) {
        $tier1_max = intval(NYLTA_Database::get_setting('tier1_max', 25));
        $tier2_max = intval(NYLTA_Database::get_setting('tier2_max', 75));
        $tier3_max = intval(NYLTA_Database::get_setting('tier3_max', 150));
        
        if ($num_clients <= $tier1_max) {
            return 'tier1';
        } elseif ($num_clients <= $tier2_max) {
            return 'tier2';
        } elseif ($num_clients <= $tier3_max) {
            return 'tier3';
        } else {
            return 'tier4';
        }
    }
    
    /**
     * Get price for a specific tier
     */
    public static function get_tier_price($tier) {
        $setting_key = $tier . '_price';
        
        $default_prices = array(
            'tier1' => 358.20,
            'tier2' => 389.00,
            'tier3' => 375.00,
            'tier4' => 0 // Custom pricing
        );
        
        $default = isset($default_prices[$tier]) ? $default_prices[$tier] : 0;
        
        return floatval(NYLTA_Database::get_setting($setting_key, $default));
    }
    
    /**
     * Get all pricing tiers
     */
    public static function get_all_tiers() {
        return array(
            'tier1' => array(
                'name' => 'Small Volume',
                'min' => intval(NYLTA_Database::get_setting('tier1_min', 1)),
                'max' => intval(NYLTA_Database::get_setting('tier1_max', 25)),
                'price' => floatval(NYLTA_Database::get_setting('tier1_price', 358.20))
            ),
            'tier2' => array(
                'name' => 'Medium Volume',
                'min' => intval(NYLTA_Database::get_setting('tier2_min', 26)),
                'max' => intval(NYLTA_Database::get_setting('tier2_max', 75)),
                'price' => floatval(NYLTA_Database::get_setting('tier2_price', 389.00))
            ),
            'tier3' => array(
                'name' => 'Large Volume',
                'min' => intval(NYLTA_Database::get_setting('tier3_min', 76)),
                'max' => intval(NYLTA_Database::get_setting('tier3_max', 150)),
                'price' => floatval(NYLTA_Database::get_setting('tier3_price', 375.00))
            ),
            'tier4' => array(
                'name' => 'Enterprise Volume',
                'min' => intval(NYLTA_Database::get_setting('tier4_min', 151)),
                'max' => null,
                'price' => 'Custom'
            )
        );
    }
    
    /**
     * Check if early bird discount is available
     */
    public static function is_early_bird_available() {
        $limit = intval(NYLTA_Database::get_setting('early_bird_limit', 25));
        $count = intval(NYLTA_Database::get_setting('early_bird_count', 0));
        
        return $count < $limit;
    }
    
    /**
     * Increment early bird counter
     */
    public static function increment_early_bird_count() {
        $count = intval(NYLTA_Database::get_setting('early_bird_count', 0));
        NYLTA_Database::update_setting('early_bird_count', $count + 1);
    }
    
    /**
     * Format currency
     */
    public static function format_currency($amount) {
        return '$' . number_format($amount, 2);
    }
}
