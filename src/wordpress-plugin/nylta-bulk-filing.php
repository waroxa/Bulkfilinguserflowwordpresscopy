<?php
/**
 * Plugin Name: NYLTA Bulk Filing Portal
 * Plugin URI: https://nylta.com
 * Description: Comprehensive bulk filing system for NYLTA.com designed for CPAs, attorneys, and compliance professionals to file NYLTA reports on behalf of multiple clients.
 * Version: 1.0.0
 * Author: NYLTA.com
 * Author URI: https://nylta.com
 * License: GPL v2 or later
 * Text Domain: nylta-bulk-filing
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('NYLTA_VERSION', '1.0.0');
define('NYLTA_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('NYLTA_PLUGIN_URL', plugin_dir_url(__FILE__));
define('NYLTA_PLUGIN_FILE', __FILE__);

// Include required files
require_once NYLTA_PLUGIN_DIR . 'includes/class-nylta-database.php';
require_once NYLTA_PLUGIN_DIR . 'includes/class-nylta-pricing.php';
require_once NYLTA_PLUGIN_DIR . 'includes/class-nylta-submissions.php';
require_once NYLTA_PLUGIN_DIR . 'includes/class-nylta-analytics.php';
require_once NYLTA_PLUGIN_DIR . 'includes/class-nylta-email.php';
require_once NYLTA_PLUGIN_DIR . 'includes/class-nylta-csv.php';
require_once NYLTA_PLUGIN_DIR . 'includes/nylta-rest-api.php';
require_once NYLTA_PLUGIN_DIR . 'admin/class-nylta-admin.php';
require_once NYLTA_PLUGIN_DIR . 'includes/nylta-shortcodes.php';
require_once NYLTA_PLUGIN_DIR . 'includes/nylta-ajax-handlers.php';

/**
 * Main Plugin Class
 */
class NYLTA_Bulk_Filing {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        // Activation hook
        register_activation_hook(__FILE__, array($this, 'activate'));
        
        // Deactivation hook
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
        
        // Initialize plugin
        add_action('plugins_loaded', array($this, 'init'));
        
        // Enqueue scripts and styles
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
    }
    
    /**
     * Plugin activation
     */
    public function activate() {
        NYLTA_Database::create_tables();
        NYLTA_Database::insert_default_settings();
        flush_rewrite_rules();
    }
    
    /**
     * Plugin deactivation
     */
    public function deactivate() {
        flush_rewrite_rules();
    }
    
    /**
     * Initialize plugin
     */
    public function init() {
        // Initialize admin
        if (is_admin()) {
            NYLTA_Admin::get_instance();
        }
        
        // Load text domain
        load_plugin_textdomain('nylta-bulk-filing', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    /**
     * Enqueue frontend assets
     */
    public function enqueue_frontend_assets() {
        wp_enqueue_style('nylta-frontend', NYLTA_PLUGIN_URL . 'assets/css/frontend.css', array(), NYLTA_VERSION);
        wp_enqueue_script('nylta-frontend', NYLTA_PLUGIN_URL . 'assets/js/frontend.js', array('jquery'), NYLTA_VERSION, true);
        
        // Localize script with AJAX URL and nonce
        wp_localize_script('nylta-frontend', 'nylta_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('nylta_ajax_nonce')
        ));
    }
    
    /**
     * Enqueue admin assets
     */
    public function enqueue_admin_assets($hook) {
        // Only load on our admin pages
        if (strpos($hook, 'nylta-bulk-filing') === false) {
            return;
        }
        
        wp_enqueue_style('nylta-admin', NYLTA_PLUGIN_URL . 'assets/css/admin.css', array(), NYLTA_VERSION);
        wp_enqueue_script('nylta-admin', NYLTA_PLUGIN_URL . 'assets/js/admin.js', array('jquery', 'jquery-ui-datepicker'), NYLTA_VERSION, true);
        
        wp_localize_script('nylta-admin', 'nylta_admin_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('nylta_admin_nonce')
        ));
    }
}

// Initialize the plugin
function nylta_bulk_filing() {
    return NYLTA_Bulk_Filing::get_instance();
}

// Start the plugin
nylta_bulk_filing();