<?php
/**
 * Submissions Management Class
 */

if (!defined('ABSPATH')) {
    exit;
}

class NYLTA_Submissions {
    
    /**
     * Create a new submission
     */
    public static function create_submission($firm_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_submissions';
        
        $submission_number = self::generate_submission_number();
        
        $wpdb->insert(
            $table,
            array(
                'firm_id' => $firm_id,
                'submission_number' => $submission_number,
                'status' => 'draft',
                'step_completed' => 1
            ),
            array('%d', '%s', '%s', '%d')
        );
        
        return $wpdb->insert_id;
    }
    
    /**
     * Generate unique submission number
     */
    private static function generate_submission_number() {
        return 'NYLTA-' . date('Y') . '-' . strtoupper(wp_generate_password(8, false));
    }
    
    /**
     * Get submission by ID
     */
    public static function get_submission($submission_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_submissions';
        
        return $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table WHERE id = %d",
            $submission_id
        ));
    }
    
    /**
     * Get submissions by firm
     */
    public static function get_firm_submissions($firm_id, $status = null) {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_submissions';
        
        if ($status) {
            return $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM $table WHERE firm_id = %d AND status = %s ORDER BY created_at DESC",
                $firm_id,
                $status
            ));
        } else {
            return $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM $table WHERE firm_id = %d ORDER BY created_at DESC",
                $firm_id
            ));
        }
    }
    
    /**
     * Update submission
     */
    public static function update_submission($submission_id, $data) {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_submissions';
        
        return $wpdb->update(
            $table,
            $data,
            array('id' => $submission_id),
            null,
            array('%d')
        );
    }
    
    /**
     * Add client to submission
     */
    public static function add_client($submission_id, $client_data) {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_clients';
        
        $client_data['submission_id'] = $submission_id;
        
        $wpdb->insert($table, $client_data);
        
        // Update submission client counts
        self::update_submission_counts($submission_id);
        
        return $wpdb->insert_id;
    }
    
    /**
     * Add beneficial owner
     */
    public static function add_beneficial_owner($client_id, $owner_data) {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_beneficial_owners';
        
        $owner_data['client_id'] = $client_id;
        
        return $wpdb->insert($table, $owner_data);
    }
    
    /**
     * Get clients for submission
     */
    public static function get_submission_clients($submission_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_clients';
        
        return $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table WHERE submission_id = %d",
            $submission_id
        ));
    }
    
    /**
     * Get beneficial owners for client
     */
    public static function get_client_beneficial_owners($client_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_beneficial_owners';
        
        return $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table WHERE client_id = %d",
            $client_id
        ));
    }
    
    /**
     * Update submission client counts
     */
    public static function update_submission_counts($submission_id) {
        global $wpdb;
        $clients_table = $wpdb->prefix . 'nylta_clients';
        $submissions_table = $wpdb->prefix . 'nylta_submissions';
        
        $counts = $wpdb->get_row($wpdb->prepare(
            "SELECT 
                COUNT(*) as total_clients,
                SUM(CASE WHEN is_exempt = 1 THEN 1 ELSE 0 END) as total_exempt,
                SUM(CASE WHEN is_exempt = 0 THEN 1 ELSE 0 END) as total_non_exempt
            FROM $clients_table 
            WHERE submission_id = %d",
            $submission_id
        ));
        
        $wpdb->update(
            $submissions_table,
            array(
                'total_clients' => $counts->total_clients,
                'total_exempt' => $counts->total_exempt,
                'total_non_exempt' => $counts->total_non_exempt
            ),
            array('id' => $submission_id),
            array('%d', '%d', '%d'),
            array('%d')
        );
    }
    
    /**
     * Complete submission
     */
    public static function complete_submission($submission_id, $payment_data) {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_submissions';
        
        $confirmation_number = 'CONF-' . strtoupper(wp_generate_password(12, false));
        
        $wpdb->update(
            $table,
            array(
                'status' => 'completed',
                'payment_status' => 'paid',
                'payment_method' => $payment_data['payment_method'],
                'payment_date' => current_time('mysql'),
                'confirmation_number' => $confirmation_number,
                'submitted_at' => current_time('mysql')
            ),
            array('id' => $submission_id)
        );
        
        return $confirmation_number;
    }
    
    /**
     * Get all submissions (admin)
     */
    public static function get_all_submissions($limit = 100, $offset = 0, $status = null) {
        global $wpdb;
        $submissions_table = $wpdb->prefix . 'nylta_submissions';
        $firms_table = $wpdb->prefix . 'nylta_firms';
        
        $where = $status ? $wpdb->prepare("WHERE s.status = %s", $status) : "";
        
        $query = "SELECT s.*, f.firm_name, f.contact_email 
                  FROM $submissions_table s
                  LEFT JOIN $firms_table f ON s.firm_id = f.id
                  $where
                  ORDER BY s.created_at DESC
                  LIMIT %d OFFSET %d";
        
        return $wpdb->get_results($wpdb->prepare($query, $limit, $offset));
    }
    
    /**
     * Get submission statistics
     */
    public static function get_statistics() {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_submissions';
        
        $stats = $wpdb->get_row(
            "SELECT 
                COUNT(*) as total_submissions,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
                SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid,
                SUM(total_clients) as total_clients_filed,
                SUM(total_amount) as total_revenue
            FROM $table"
        );
        
        return $stats;
    }
}
