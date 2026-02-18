<?php
/**
 * AJAX Handlers
 */

if (!defined('ABSPATH')) {
    exit;
}

// AJAX: Create firm registration
add_action('wp_ajax_nylta_create_firm', 'nylta_ajax_create_firm');

function nylta_ajax_create_firm() {
    check_ajax_referer('nylta_ajax_nonce', 'nonce');
    
    if (!is_user_logged_in()) {
        wp_send_json_error(array('message' => 'You must be logged in'));
    }
    
    global $wpdb;
    $table = $wpdb->prefix . 'nylta_firms';
    
    $user_id = get_current_user_id();
    
    // Check if firm already exists for this user
    $existing = $wpdb->get_var($wpdb->prepare(
        "SELECT id FROM $table WHERE user_id = %d",
        $user_id
    ));
    
    $is_early_bird = NYLTA_Pricing::is_early_bird_available() ? 1 : 0;
    
    $data = array(
        'user_id' => $user_id,
        'firm_name' => sanitize_text_field($_POST['firm_name']),
        'firm_type' => sanitize_text_field($_POST['firm_type']),
        'license_number' => sanitize_text_field($_POST['license_number']),
        'contact_name' => sanitize_text_field($_POST['contact_name']),
        'contact_email' => sanitize_email($_POST['contact_email']),
        'contact_phone' => sanitize_text_field($_POST['contact_phone']),
        'address_street' => sanitize_text_field($_POST['address_street']),
        'address_city' => sanitize_text_field($_POST['address_city']),
        'address_state' => sanitize_text_field($_POST['address_state']),
        'address_zip' => sanitize_text_field($_POST['address_zip']),
        'authorization_confirmed' => 1,
        'is_early_bird' => $is_early_bird
    );
    
    if ($existing) {
        $wpdb->update($table, $data, array('id' => $existing));
        $firm_id = $existing;
    } else {
        $wpdb->insert($table, $data);
        $firm_id = $wpdb->insert_id;
        
        // Send welcome email
        NYLTA_Email::send_welcome_email($firm_id);
    }
    
    // Create new submission
    $submission_id = NYLTA_Submissions::create_submission($firm_id);
    
    wp_send_json_success(array(
        'firm_id' => $firm_id,
        'submission_id' => $submission_id,
        'is_early_bird' => $is_early_bird
    ));
}

// AJAX: Upload CSV
add_action('wp_ajax_nylta_upload_csv', 'nylta_ajax_upload_csv');

function nylta_ajax_upload_csv() {
    check_ajax_referer('nylta_ajax_nonce', 'nonce');
    
    if (!is_user_logged_in()) {
        wp_send_json_error(array('message' => 'You must be logged in'));
    }
    
    if (!isset($_FILES['csv_file'])) {
        wp_send_json_error(array('message' => 'No file uploaded'));
    }
    
    $submission_id = intval($_POST['submission_id']);
    
    $file = $_FILES['csv_file'];
    
    // Handle upload
    if (!function_exists('wp_handle_upload')) {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
    }
    
    $upload_overrides = array('test_form' => false);
    $movefile = wp_handle_upload($file, $upload_overrides);
    
    if ($movefile && !isset($movefile['error'])) {
        $result = NYLTA_CSV::import_to_submission($submission_id, $movefile['file']);
        
        // Delete temporary file
        @unlink($movefile['file']);
        
        if ($result['success']) {
            wp_send_json_success($result);
        } else {
            wp_send_json_error($result);
        }
    } else {
        wp_send_json_error(array('message' => $movefile['error']));
    }
}

// AJAX: Add client manually
add_action('wp_ajax_nylta_add_client', 'nylta_ajax_add_client');

function nylta_ajax_add_client() {
    check_ajax_referer('nylta_ajax_nonce', 'nonce');
    
    if (!is_user_logged_in()) {
        wp_send_json_error(array('message' => 'You must be logged in'));
    }
    
    $submission_id = intval($_POST['submission_id']);
    
    $client_data = array(
        'company_name' => sanitize_text_field($_POST['company_name']),
        'ein' => sanitize_text_field($_POST['ein']),
        'address_street' => sanitize_text_field($_POST['address_street']),
        'address_city' => sanitize_text_field($_POST['address_city']),
        'address_state' => sanitize_text_field($_POST['address_state']),
        'address_zip' => sanitize_text_field($_POST['address_zip']),
        'is_exempt' => isset($_POST['is_exempt']) ? 1 : 0,
        'exemption_reason' => sanitize_text_field($_POST['exemption_reason'])
    );
    
    $client_id = NYLTA_Submissions::add_client($submission_id, $client_data);
    
    if ($client_id) {
        wp_send_json_success(array('client_id' => $client_id));
    } else {
        wp_send_json_error(array('message' => 'Failed to add client'));
    }
}

// AJAX: Add beneficial owner
add_action('wp_ajax_nylta_add_beneficial_owner', 'nylta_ajax_add_beneficial_owner');

function nylta_ajax_add_beneficial_owner() {
    check_ajax_referer('nylta_ajax_nonce', 'nonce');
    
    if (!is_user_logged_in()) {
        wp_send_json_error(array('message' => 'You must be logged in'));
    }
    
    $client_id = intval($_POST['client_id']);
    
    $owner_data = array(
        'owner_type' => sanitize_text_field($_POST['owner_type']),
        'first_name' => sanitize_text_field($_POST['first_name']),
        'last_name' => sanitize_text_field($_POST['last_name']),
        'date_of_birth' => sanitize_text_field($_POST['date_of_birth']),
        'ssn_last4' => sanitize_text_field($_POST['ssn_last4']),
        'address_street' => sanitize_text_field($_POST['address_street']),
        'address_city' => sanitize_text_field($_POST['address_city']),
        'address_state' => sanitize_text_field($_POST['address_state']),
        'address_zip' => sanitize_text_field($_POST['address_zip']),
        'identification_type' => sanitize_text_field($_POST['identification_type']),
        'identification_number' => sanitize_text_field($_POST['identification_number'])
    );
    
    $result = NYLTA_Submissions::add_beneficial_owner($client_id, $owner_data);
    
    if ($result) {
        wp_send_json_success();
    } else {
        wp_send_json_error(array('message' => 'Failed to add beneficial owner'));
    }
}

// AJAX: Calculate pricing
add_action('wp_ajax_nylta_calculate_pricing', 'nylta_ajax_calculate_pricing');

function nylta_ajax_calculate_pricing() {
    check_ajax_referer('nylta_ajax_nonce', 'nonce');
    
    $num_clients = intval($_POST['num_clients']);
    $is_early_bird = isset($_POST['is_early_bird']) ? (bool)$_POST['is_early_bird'] : false;
    
    $pricing = NYLTA_Pricing::calculate_pricing($num_clients, $is_early_bird);
    
    wp_send_json_success($pricing);
}

// AJAX: Complete submission
add_action('wp_ajax_nylta_complete_submission', 'nylta_ajax_complete_submission');

function nylta_ajax_complete_submission() {
    check_ajax_referer('nylta_ajax_nonce', 'nonce');
    
    if (!is_user_logged_in()) {
        wp_send_json_error(array('message' => 'You must be logged in'));
    }
    
    $submission_id = intval($_POST['submission_id']);
    $submission = NYLTA_Submissions::get_submission($submission_id);
    
    // Calculate final pricing
    $pricing = NYLTA_Pricing::calculate_pricing(
        $submission->total_clients,
        $submission->is_early_bird
    );
    
    // Update submission with pricing
    NYLTA_Submissions::update_submission($submission_id, array(
        'pricing_tier' => $pricing['tier'],
        'base_amount' => $pricing['base_amount'],
        'discount_amount' => $pricing['discount_amount'],
        'total_amount' => $pricing['total_amount']
    ));
    
    // Complete submission with payment data
    $payment_data = array(
        'payment_method' => sanitize_text_field($_POST['payment_method'])
    );
    
    $confirmation_number = NYLTA_Submissions::complete_submission($submission_id, $payment_data);
    
    // Increment early bird count if applicable
    if ($submission->is_early_bird) {
        NYLTA_Pricing::increment_early_bird_count();
    }
    
    // Send confirmation emails
    NYLTA_Email::send_submission_confirmation($submission_id);
    NYLTA_Email::send_payment_confirmation($submission_id);
    
    wp_send_json_success(array(
        'confirmation_number' => $confirmation_number,
        'submission_number' => $submission->submission_number
    ));
}

// AJAX: Get submission data
add_action('wp_ajax_nylta_get_submission', 'nylta_ajax_get_submission');

function nylta_ajax_get_submission() {
    check_ajax_referer('nylta_ajax_nonce', 'nonce');
    
    if (!is_user_logged_in()) {
        wp_send_json_error(array('message' => 'You must be logged in'));
    }
    
    $submission_id = intval($_POST['submission_id']);
    $submission = NYLTA_Submissions::get_submission($submission_id);
    $clients = NYLTA_Submissions::get_submission_clients($submission_id);
    
    wp_send_json_success(array(
        'submission' => $submission,
        'clients' => $clients
    ));
}
