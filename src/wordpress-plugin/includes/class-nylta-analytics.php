<?php
/**
 * Analytics Class
 */

if (!defined('ABSPATH')) {
    exit;
}

class NYLTA_Analytics {
    
    /**
     * Get revenue analytics
     */
    public static function get_revenue_analytics($period = 'all') {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_submissions';
        
        $where = self::get_period_where_clause($period);
        
        $query = "SELECT 
                    COUNT(*) as total_submissions,
                    SUM(total_amount) as total_revenue,
                    SUM(base_amount) as base_revenue,
                    SUM(discount_amount) as total_discounts,
                    AVG(total_amount) as avg_submission_value,
                    SUM(total_clients) as total_clients
                  FROM $table 
                  WHERE payment_status = 'paid' $where";
        
        return $wpdb->get_row($query);
    }
    
    /**
     * Get revenue by tier
     */
    public static function get_revenue_by_tier($period = 'all') {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_submissions';
        
        $where = self::get_period_where_clause($period);
        
        $query = "SELECT 
                    pricing_tier,
                    COUNT(*) as count,
                    SUM(total_amount) as revenue,
                    AVG(total_amount) as avg_value
                  FROM $table 
                  WHERE payment_status = 'paid' $where
                  GROUP BY pricing_tier";
        
        return $wpdb->get_results($query);
    }
    
    /**
     * Get monthly revenue trend
     */
    public static function get_monthly_revenue() {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_submissions';
        
        $query = "SELECT 
                    DATE_FORMAT(payment_date, '%Y-%m') as month,
                    COUNT(*) as submissions,
                    SUM(total_amount) as revenue,
                    SUM(total_clients) as clients
                  FROM $table 
                  WHERE payment_status = 'paid'
                  GROUP BY month
                  ORDER BY month DESC
                  LIMIT 12";
        
        return $wpdb->get_results($query);
    }
    
    /**
     * Get submission status breakdown
     */
    public static function get_status_breakdown() {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_submissions';
        
        $query = "SELECT 
                    status,
                    COUNT(*) as count,
                    SUM(total_amount) as potential_revenue
                  FROM $table 
                  GROUP BY status";
        
        return $wpdb->get_results($query);
    }
    
    /**
     * Get abandoned submissions (draft for > 7 days)
     */
    public static function get_abandoned_submissions() {
        global $wpdb;
        $submissions_table = $wpdb->prefix . 'nylta_submissions';
        $firms_table = $wpdb->prefix . 'nylta_firms';
        
        $query = "SELECT s.*, f.firm_name, f.contact_email
                  FROM $submissions_table s
                  LEFT JOIN $firms_table f ON s.firm_id = f.id
                  WHERE s.status = 'draft'
                  AND s.created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)
                  ORDER BY s.created_at DESC";
        
        return $wpdb->get_results($query);
    }
    
    /**
     * Get top firms by volume
     */
    public static function get_top_firms($limit = 10) {
        global $wpdb;
        $submissions_table = $wpdb->prefix . 'nylta_submissions';
        $firms_table = $wpdb->prefix . 'nylta_firms';
        
        $query = $wpdb->prepare(
            "SELECT 
                f.id,
                f.firm_name,
                f.firm_type,
                COUNT(s.id) as submission_count,
                SUM(s.total_amount) as total_revenue,
                SUM(s.total_clients) as total_clients
            FROM $firms_table f
            LEFT JOIN $submissions_table s ON f.id = s.firm_id
            WHERE s.payment_status = 'paid'
            GROUP BY f.id
            ORDER BY total_revenue DESC
            LIMIT %d",
            $limit
        );
        
        return $wpdb->get_results($query);
    }
    
    /**
     * Get early bird statistics
     */
    public static function get_early_bird_stats() {
        global $wpdb;
        $firms_table = $wpdb->prefix . 'nylta_firms';
        
        $count = $wpdb->get_var(
            "SELECT COUNT(*) FROM $firms_table WHERE is_early_bird = 1"
        );
        
        $limit = intval(NYLTA_Database::get_setting('early_bird_limit', 25));
        
        return array(
            'count' => intval($count),
            'limit' => $limit,
            'remaining' => max(0, $limit - $count)
        );
    }
    
    /**
     * Helper: Get period WHERE clause
     */
    private static function get_period_where_clause($period) {
        switch ($period) {
            case 'today':
                return "AND DATE(payment_date) = CURDATE()";
            case 'week':
                return "AND payment_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
            case 'month':
                return "AND payment_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
            case 'year':
                return "AND payment_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
            default:
                return "";
        }
    }
    
    /**
     * Get conversion rate
     */
    public static function get_conversion_rate() {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_submissions';
        
        $total = $wpdb->get_var("SELECT COUNT(*) FROM $table");
        $completed = $wpdb->get_var("SELECT COUNT(*) FROM $table WHERE status = 'completed'");
        
        if ($total == 0) {
            return 0;
        }
        
        return ($completed / $total) * 100;
    }
}
