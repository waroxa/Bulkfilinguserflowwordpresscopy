<?php
/**
 * Email Management Class
 */

if (!defined('ABSPATH')) {
    exit;
}

class NYLTA_Email {
    
    /**
     * Send email using template
     */
    public static function send_template_email($to, $template_key, $variables = array()) {
        $template = self::get_template($template_key);
        
        if (!$template) {
            return false;
        }
        
        $subject = self::replace_variables($template->subject, $variables);
        $body = self::replace_variables($template->body, $variables);
        
        // Add NYLTA signature
        $body .= self::get_email_signature();
        
        $headers = array('Content-Type: text/html; charset=UTF-8');
        
        return wp_mail($to, $subject, $body, $headers);
    }
    
    /**
     * Get email template
     */
    public static function get_template($template_key) {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_email_templates';
        
        return $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table WHERE template_key = %s",
            $template_key
        ));
    }
    
    /**
     * Get all email templates
     */
    public static function get_all_templates() {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_email_templates';
        
        return $wpdb->get_results("SELECT * FROM $table ORDER BY template_name");
    }
    
    /**
     * Update email template
     */
    public static function update_template($template_id, $data) {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_email_templates';
        
        return $wpdb->update(
            $table,
            $data,
            array('id' => $template_id)
        );
    }
    
    /**
     * Replace variables in template
     */
    private static function replace_variables($content, $variables) {
        foreach ($variables as $key => $value) {
            $content = str_replace('{{' . $key . '}}', $value, $content);
        }
        return $content;
    }
    
    /**
     * Get email signature with logo
     */
    private static function get_email_signature() {
        return '
            <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #00274E;">
                <img src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp" alt="NYLTA.com" style="height: 50px; margin-bottom: 15px;">
                <p style="color: #666; font-size: 14px; margin: 5px 0;">
                    <strong>NYLTA.com Bulk Filing Portal</strong><br>
                    New York LLC Transparency Act Compliance System<br>
                    Professional Filing Services for CPAs, Attorneys & Compliance Professionals
                </p>
                <p style="color: #999; font-size: 12px; margin-top: 20px;">
                    This is an automated message from NYLTA.com. Please do not reply to this email.
                </p>
            </div>
        ';
    }
    
    /**
     * Send submission confirmation
     */
    public static function send_submission_confirmation($submission_id) {
        $submission = NYLTA_Submissions::get_submission($submission_id);
        $firm = self::get_firm($submission->firm_id);
        
        $variables = array(
            'firm_name' => $firm->firm_name,
            'submission_number' => $submission->submission_number,
            'total_clients' => $submission->total_clients,
            'total_amount' => number_format($submission->total_amount, 2),
            'confirmation_number' => $submission->confirmation_number
        );
        
        return self::send_template_email(
            $firm->contact_email,
            'submission_confirmation',
            $variables
        );
    }
    
    /**
     * Send payment confirmation
     */
    public static function send_payment_confirmation($submission_id) {
        $submission = NYLTA_Submissions::get_submission($submission_id);
        $firm = self::get_firm($submission->firm_id);
        
        $variables = array(
            'firm_name' => $firm->firm_name,
            'submission_number' => $submission->submission_number,
            'total_amount' => number_format($submission->total_amount, 2),
            'payment_date' => date('F j, Y', strtotime($submission->payment_date)),
            'payment_method' => $submission->payment_method
        );
        
        return self::send_template_email(
            $firm->contact_email,
            'payment_confirmation',
            $variables
        );
    }
    
    /**
     * Send welcome email
     */
    public static function send_welcome_email($firm_id) {
        $firm = self::get_firm($firm_id);
        
        $variables = array(
            'firm_name' => $firm->firm_name,
            'contact_name' => $firm->contact_name
        );
        
        return self::send_template_email(
            $firm->contact_email,
            'welcome_email',
            $variables
        );
    }
    
    /**
     * Get firm data
     */
    private static function get_firm($firm_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'nylta_firms';
        
        return $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table WHERE id = %d",
            $firm_id
        ));
    }
}
