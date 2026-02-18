<?php
/**
 * Database Management Class
 */

if (!defined('ABSPATH')) {
    exit;
}

class NYLTA_Database {
    
    /**
     * Create database tables
     */
    public static function create_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        
        // Firms table
        $table_firms = $wpdb->prefix . 'nylta_firms';
        $sql_firms = "CREATE TABLE $table_firms (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) NOT NULL,
            firm_name varchar(255) NOT NULL,
            firm_type varchar(50) NOT NULL,
            license_number varchar(100),
            contact_name varchar(255) NOT NULL,
            contact_email varchar(255) NOT NULL,
            contact_phone varchar(20),
            address_street varchar(255),
            address_city varchar(100),
            address_state varchar(2),
            address_zip varchar(10),
            authorization_confirmed tinyint(1) DEFAULT 0,
            is_early_bird tinyint(1) DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY user_id (user_id)
        ) $charset_collate;";
        
        // Submissions table
        $table_submissions = $wpdb->prefix . 'nylta_submissions';
        $sql_submissions = "CREATE TABLE $table_submissions (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            firm_id bigint(20) NOT NULL,
            submission_number varchar(50) NOT NULL,
            status varchar(50) NOT NULL DEFAULT 'draft',
            step_completed int(2) DEFAULT 1,
            total_clients int(11) DEFAULT 0,
            total_exempt int(11) DEFAULT 0,
            total_non_exempt int(11) DEFAULT 0,
            pricing_tier varchar(20),
            base_amount decimal(10,2) DEFAULT 0,
            discount_amount decimal(10,2) DEFAULT 0,
            total_amount decimal(10,2) DEFAULT 0,
            payment_status varchar(50) DEFAULT 'pending',
            payment_method varchar(50),
            payment_date datetime,
            confirmation_number varchar(100),
            submitted_at datetime,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY submission_number (submission_number),
            KEY firm_id (firm_id),
            KEY status (status)
        ) $charset_collate;";
        
        // Clients table
        $table_clients = $wpdb->prefix . 'nylta_clients';
        $sql_clients = "CREATE TABLE $table_clients (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            submission_id bigint(20) NOT NULL,
            company_name varchar(255) NOT NULL,
            ein varchar(20) NOT NULL,
            address_street varchar(255),
            address_city varchar(100),
            address_state varchar(2),
            address_zip varchar(10),
            is_exempt tinyint(1) DEFAULT 0,
            exemption_reason varchar(100),
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY submission_id (submission_id)
        ) $charset_collate;";
        
        // Beneficial Owners table
        $table_owners = $wpdb->prefix . 'nylta_beneficial_owners';
        $sql_owners = "CREATE TABLE $table_owners (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            client_id bigint(20) NOT NULL,
            owner_type varchar(50) NOT NULL,
            first_name varchar(100) NOT NULL,
            last_name varchar(100) NOT NULL,
            date_of_birth date,
            ssn_last4 varchar(4),
            address_street varchar(255),
            address_city varchar(100),
            address_state varchar(2),
            address_zip varchar(10),
            identification_type varchar(50),
            identification_number varchar(100),
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY client_id (client_id)
        ) $charset_collate;";
        
        // Settings table
        $table_settings = $wpdb->prefix . 'nylta_settings';
        $sql_settings = "CREATE TABLE $table_settings (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            setting_key varchar(100) NOT NULL,
            setting_value longtext,
            PRIMARY KEY (id),
            UNIQUE KEY setting_key (setting_key)
        ) $charset_collate;";
        
        // Email Templates table
        $table_email_templates = $wpdb->prefix . 'nylta_email_templates';
        $sql_email_templates = "CREATE TABLE $table_email_templates (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            template_name varchar(100) NOT NULL,
            template_key varchar(50) NOT NULL,
            subject varchar(255) NOT NULL,
            body longtext NOT NULL,
            variables text,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY template_key (template_key)
        ) $charset_collate;";
        
        // Execute table creation
        dbDelta($sql_firms);
        dbDelta($sql_submissions);
        dbDelta($sql_clients);
        dbDelta($sql_owners);
        dbDelta($sql_settings);
        dbDelta($sql_email_templates);
    }
    
    /**
     * Insert default settings
     */
    public static function insert_default_settings() {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_settings';
        
        $default_settings = array(
            'tier1_min' => 1,
            'tier1_max' => 25,
            'tier1_price' => 358.20,
            'tier2_min' => 26,
            'tier2_max' => 75,
            'tier2_price' => 389.00,
            'tier3_min' => 76,
            'tier3_max' => 150,
            'tier3_price' => 375.00,
            'tier4_min' => 151,
            'early_bird_discount' => 10,
            'early_bird_limit' => 25,
            'early_bird_count' => 0
        );
        
        foreach ($default_settings as $key => $value) {
            $wpdb->replace(
                $table,
                array(
                    'setting_key' => $key,
                    'setting_value' => $value
                ),
                array('%s', '%s')
            );
        }
        
        // Insert default email templates
        self::insert_default_email_templates();
    }
    
    /**
     * Insert default email templates
     */
    private static function insert_default_email_templates() {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_email_templates';
        
        $templates = array(
            array(
                'template_name' => 'Submission Confirmation',
                'template_key' => 'submission_confirmation',
                'subject' => 'NYLTA Bulk Filing Submission Confirmed - {{submission_number}}',
                'body' => '<h2>Submission Confirmed</h2><p>Dear {{firm_name}},</p><p>Your bulk filing submission <strong>{{submission_number}}</strong> has been successfully received and processed.</p><p><strong>Submission Details:</strong></p><ul><li>Total Clients: {{total_clients}}</li><li>Total Amount: ${{total_amount}}</li><li>Confirmation Number: {{confirmation_number}}</li></ul><p>Thank you for using NYLTA.com Bulk Filing Portal.</p>',
                'variables' => 'firm_name,submission_number,total_clients,total_amount,confirmation_number'
            ),
            array(
                'template_name' => 'Payment Confirmation',
                'template_key' => 'payment_confirmation',
                'subject' => 'Payment Received - NYLTA Bulk Filing {{submission_number}}',
                'body' => '<h2>Payment Confirmed</h2><p>Dear {{firm_name}},</p><p>We have received your payment for submission {{submission_number}}.</p><p><strong>Payment Details:</strong></p><ul><li>Amount Paid: ${{total_amount}}</li><li>Payment Date: {{payment_date}}</li><li>Payment Method: {{payment_method}}</li></ul><p>Your filings are now being processed.</p>',
                'variables' => 'firm_name,submission_number,total_amount,payment_date,payment_method'
            ),
            array(
                'template_name' => 'Welcome Email',
                'template_key' => 'welcome_email',
                'subject' => 'Welcome to NYLTA Bulk Filing Portal',
                'body' => '<h2>Welcome to NYLTA.com</h2><p>Dear {{firm_name}},</p><p>Thank you for registering with the NYLTA Bulk Filing Portal. We are pleased to support your compliance needs.</p><p>You can now begin filing NYLTA reports on behalf of your clients through our streamlined 6-step process.</p><p>If you have any questions, please contact our support team.</p>',
                'variables' => 'firm_name,contact_name'
            )
        );
        
        foreach ($templates as $template) {
            $wpdb->insert($table, $template);
        }
    }
    
    /**
     * Get setting value
     */
    public static function get_setting($key, $default = null) {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_settings';
        
        $value = $wpdb->get_var($wpdb->prepare(
            "SELECT setting_value FROM $table WHERE setting_key = %s",
            $key
        ));
        
        return $value !== null ? $value : $default;
    }
    
    /**
     * Update setting value
     */
    public static function update_setting($key, $value) {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_settings';
        
        return $wpdb->replace(
            $table,
            array(
                'setting_key' => $key,
                'setting_value' => $value
            ),
            array('%s', '%s')
        );
    }
}
