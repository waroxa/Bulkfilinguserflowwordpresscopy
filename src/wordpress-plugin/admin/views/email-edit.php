<?php
/**
 * Email Template Edit View
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap nylta-admin">
    <div class="nylta-header">
        <img src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp" alt="NYLTA.com" class="nylta-logo">
        <div class="nylta-header-content">
            <h1>Edit Email Template</h1>
            <p><?php echo esc_html($template->template_name); ?></p>
        </div>
    </div>

    <?php settings_errors('nylta_messages'); ?>

    <form method="post" action="">
        <?php wp_nonce_field('nylta_email_template_update'); ?>
        <input type="hidden" name="template_id" value="<?php echo $template->id; ?>">

        <div class="nylta-card">
            <h2>Template Details</h2>
            
            <table class="form-table">
                <tr>
                    <th><label for="template_name">Template Name</label></th>
                    <td>
                        <input type="text" id="template_name" value="<?php echo esc_attr($template->template_name); ?>" 
                               class="regular-text" disabled>
                        <p class="description">Template name cannot be changed</p>
                    </td>
                </tr>
                <tr>
                    <th><label for="template_key">Template Key</label></th>
                    <td>
                        <code><?php echo esc_html($template->template_key); ?></code>
                        <p class="description">Used internally to identify this template</p>
                    </td>
                </tr>
            </table>
        </div>

        <div class="nylta-card">
            <h2>Email Content</h2>
            
            <table class="form-table">
                <tr>
                    <th><label for="subject">Subject Line</label></th>
                    <td>
                        <input type="text" id="subject" name="subject" 
                               value="<?php echo esc_attr($template->subject); ?>" 
                               class="large-text" required>
                        <p class="description">The email subject line. You can use template variables like {{firm_name}}</p>
                    </td>
                </tr>
                <tr>
                    <th><label for="body">Email Body</label></th>
                    <td>
                        <?php 
                        wp_editor($template->body, 'body', array(
                            'textarea_rows' => 15,
                            'media_buttons' => false,
                            'teeny' => false,
                            'tinymce' => array(
                                'toolbar1' => 'formatselect,bold,italic,underline,bullist,numlist,link,unlink',
                                'toolbar2' => ''
                            )
                        )); 
                        ?>
                        <p class="description">
                            HTML content of the email. Use template variables like {{firm_name}}, {{submission_number}}, etc.
                        </p>
                    </td>
                </tr>
            </table>
        </div>

        <div class="nylta-card">
            <h2>Available Variables</h2>
            <p>You can use these variables in both the subject line and email body:</p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
                <?php 
                $vars = explode(',', $template->variables);
                foreach ($vars as $var):
                ?>
                    <code style="background: #f0f0f0; padding: 8px 12px; border-radius: 3px; cursor: pointer;" 
                          onclick="navigator.clipboard.writeText('{{<?php echo trim($var); ?>}}');"
                          title="Click to copy">
                        {{<?php echo trim($var); ?>}}
                    </code>
                <?php endforeach; ?>
            </div>
            <p class="description" style="margin-top: 15px;">Click any variable to copy it to your clipboard</p>
        </div>

        <div class="nylta-card">
            <h2>Email Preview</h2>
            <p>Preview how the email will look with the NYLTA signature:</p>
            
            <div style="border: 2px solid #ddd; padding: 30px; background: #fff; max-width: 700px; margin-top: 20px;">
                <div id="email-preview-content">
                    <!-- Preview will be generated here -->
                    <div><?php echo wpautop($template->body); ?></div>
                    
                    <!-- NYLTA Signature -->
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #00274E;">
                        <img src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp" 
                             alt="NYLTA.com" style="height: 50px; margin-bottom: 15px;">
                        <p style="color: #666; font-size: 14px; margin: 5px 0;">
                            <strong>NYLTA.com Bulk Filing Portal</strong><br>
                            New York LLC Transparency Act Compliance System<br>
                            Professional Filing Services for CPAs, Attorneys & Compliance Professionals
                        </p>
                        <p style="color: #999; font-size: 12px; margin-top: 20px;">
                            This is an automated message from NYLTA.com. Please do not reply to this email.
                        </p>
                    </div>
                </div>
            </div>
            
            <p style="margin-top: 15px;">
                <button type="button" class="button nylta-preview-template">
                    Open Full Preview in New Window
                </button>
            </p>
        </div>

        <p class="submit">
            <button type="submit" name="nylta_update_email_template" class="button button-primary button-large">
                <span class="dashicons dashicons-saved" style="margin-top: 3px;"></span>
                Save Email Template
            </button>
            <a href="<?php echo admin_url('admin.php?page=nylta-emails'); ?>" class="button button-large">
                Cancel
            </a>
        </p>
    </form>
</div>

<script>
jQuery(document).ready(function($) {
    // Live preview update
    function updatePreview() {
        var body = $('#body').val();
        if (typeof tinymce !== 'undefined' && tinymce.get('body')) {
            body = tinymce.get('body').getContent();
        }
        $('#email-preview-content > div').first().html(body);
    }
    
    // Update preview when TinyMCE changes
    if (typeof tinymce !== 'undefined') {
        tinymce.on('AddEditor', function(e) {
            e.editor.on('change keyup', updatePreview);
        });
    }
    
    // Update preview on textarea change (fallback)
    $('#body').on('change keyup', updatePreview);
});
</script>
