<?php
/**
 * Admin Interface Class
 */

if (!defined('ABSPATH')) {
    exit;
}

class NYLTA_Admin {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'handle_admin_actions'));
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            'NYLTA Bulk Filing',
            'NYLTA Filing',
            'manage_options',
            'nylta-bulk-filing',
            array($this, 'render_dashboard_page'),
            'dashicons-clipboard',
            30
        );
        
        add_submenu_page(
            'nylta-bulk-filing',
            'Dashboard',
            'Dashboard',
            'manage_options',
            'nylta-bulk-filing',
            array($this, 'render_dashboard_page')
        );
        
        add_submenu_page(
            'nylta-bulk-filing',
            'Submissions',
            'Submissions',
            'manage_options',
            'nylta-submissions',
            array($this, 'render_submissions_page')
        );
        
        add_submenu_page(
            'nylta-bulk-filing',
            'Analytics',
            'Analytics',
            'manage_options',
            'nylta-analytics',
            array($this, 'render_analytics_page')
        );
        
        add_submenu_page(
            'nylta-bulk-filing',
            'Pricing Settings',
            'Pricing',
            'manage_options',
            'nylta-pricing',
            array($this, 'render_pricing_page')
        );
        
        add_submenu_page(
            'nylta-bulk-filing',
            'Email Templates',
            'Email Templates',
            'manage_options',
            'nylta-emails',
            array($this, 'render_emails_page')
        );
        
        add_submenu_page(
            'nylta-bulk-filing',
            'Email Marketing',
            'Email Marketing',
            'manage_options',
            'nylta-marketing',
            array($this, 'render_marketing_page')
        );
    }
    
    /**
     * Handle admin actions
     */
    public function handle_admin_actions() {
        if (!isset($_GET['page']) || strpos($_GET['page'], 'nylta-') !== 0) {
            return;
        }
        
        if (!current_user_can('manage_options')) {
            return;
        }
        
        // Handle CSV template download
        if (isset($_GET['action']) && $_GET['action'] === 'download_template') {
            check_admin_referer('nylta_download_template');
            NYLTA_CSV::generate_template();
        }
        
        // Handle pricing updates
        if (isset($_POST['nylta_update_pricing'])) {
            check_admin_referer('nylta_pricing_update');
            $this->handle_pricing_update();
        }
        
        // Handle email template updates
        if (isset($_POST['nylta_update_email_template'])) {
            check_admin_referer('nylta_email_template_update');
            $this->handle_email_template_update();
        }
    }
    
    /**
     * Handle pricing update
     */
    private function handle_pricing_update() {
        $settings = array(
            'tier1_min', 'tier1_max', 'tier1_price',
            'tier2_min', 'tier2_max', 'tier2_price',
            'tier3_min', 'tier3_max', 'tier3_price',
            'tier4_min', 'early_bird_discount', 'early_bird_limit'
        );
        
        foreach ($settings as $setting) {
            if (isset($_POST[$setting])) {
                NYLTA_Database::update_setting($setting, sanitize_text_field($_POST[$setting]));
            }
        }
        
        add_settings_error('nylta_messages', 'nylta_message', 'Pricing settings updated successfully.', 'success');
    }
    
    /**
     * Handle email template update
     */
    private function handle_email_template_update() {
        $template_id = intval($_POST['template_id']);
        
        $data = array(
            'subject' => sanitize_text_field($_POST['subject']),
            'body' => wp_kses_post($_POST['body'])
        );
        
        NYLTA_Email::update_template($template_id, $data);
        
        add_settings_error('nylta_messages', 'nylta_message', 'Email template updated successfully.', 'success');
    }
    
    /**
     * Render dashboard page
     */
    public function render_dashboard_page() {
        $stats = NYLTA_Submissions::get_statistics();
        $early_bird = NYLTA_Analytics::get_early_bird_stats();
        $recent_submissions = NYLTA_Submissions::get_all_submissions(10);
        
        include NYLTA_PLUGIN_DIR . 'admin/views/dashboard.php';
    }
    
    /**
     * Render submissions page
     */
    public function render_submissions_page() {
        $status_filter = isset($_GET['status']) ? sanitize_text_field($_GET['status']) : null;
        $submissions = NYLTA_Submissions::get_all_submissions(100, 0, $status_filter);
        
        include NYLTA_PLUGIN_DIR . 'admin/views/submissions.php';
    }
    
    /**
     * Render analytics page
     */
    public function render_analytics_page() {
        $revenue_analytics = NYLTA_Analytics::get_revenue_analytics();
        $tier_revenue = NYLTA_Analytics::get_revenue_by_tier();
        $monthly_revenue = NYLTA_Analytics::get_monthly_revenue();
        $top_firms = NYLTA_Analytics::get_top_firms();
        $abandoned = NYLTA_Analytics::get_abandoned_submissions();
        
        include NYLTA_PLUGIN_DIR . 'admin/views/analytics.php';
    }
    
    /**
     * Render pricing page
     */
    public function render_pricing_page() {
        $tiers = NYLTA_Pricing::get_all_tiers();
        $early_bird = NYLTA_Analytics::get_early_bird_stats();
        
        include NYLTA_PLUGIN_DIR . 'admin/views/pricing.php';
    }
    
    /**
     * Render emails page
     */
    public function render_emails_page() {
        if (isset($_GET['edit'])) {
            $template = NYLTA_Email::get_template(sanitize_text_field($_GET['edit']));
            include NYLTA_PLUGIN_DIR . 'admin/views/email-edit.php';
        } else {
            $templates = NYLTA_Email::get_all_templates();
            include NYLTA_PLUGIN_DIR . 'admin/views/emails.php';
        }
    }
    
    /**
     * Render marketing page (redirect to RewardLion)
     */
    public function render_marketing_page() {
        include NYLTA_PLUGIN_DIR . 'admin/views/marketing.php';
    }
}
