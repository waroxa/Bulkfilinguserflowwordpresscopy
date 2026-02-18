<?php
/**
 * Email Templates List View
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap nylta-admin">
    <div class="nylta-header">
        <img src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp" alt="NYLTA.com" class="nylta-logo">
        <div class="nylta-header-content">
            <h1>Email Template Management</h1>
            <p>Customize automated email templates with NYLTA branding</p>
        </div>
    </div>

    <div class="nylta-card">
        <h2>Available Email Templates</h2>
        
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Template Name</th>
                    <th>Template Key</th>
                    <th>Subject</th>
                    <th>Variables</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($templates)): ?>
                    <tr>
                        <td colspan="5">No email templates found.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($templates as $template): ?>
                        <tr>
                            <td><strong><?php echo esc_html($template->template_name); ?></strong></td>
                            <td><code><?php echo esc_html($template->template_key); ?></code></td>
                            <td><?php echo esc_html($template->subject); ?></td>
                            <td>
                                <?php 
                                $vars = explode(',', $template->variables);
                                foreach ($vars as $var):
                                ?>
                                    <code style="background: #f0f0f0; padding: 2px 6px; margin: 2px; display: inline-block; font-size: 11px;">
                                        {{<?php echo trim($var); ?>}}
                                    </code>
                                <?php endforeach; ?>
                            </td>
                            <td>
                                <a href="<?php echo admin_url('admin.php?page=nylta-emails&edit=' . $template->template_key); ?>" 
                                   class="button button-primary">
                                    Edit Template
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <!-- Email Signature Preview -->
    <div class="nylta-card">
        <h2>Standard Email Signature</h2>
        <p>All emails automatically include this professional signature with the NYLTA.com logo:</p>
        
        <div style="border: 2px solid #ddd; padding: 30px; background: #f9f9f9; max-width: 600px; margin-top: 20px;">
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
        </div>
    </div>

    <!-- Template Variable Reference -->
    <div class="nylta-card">
        <h2>Template Variable Reference</h2>
        <p>Use these variables in your email templates. They will be automatically replaced with actual data:</p>
        
        <table class="wp-list-table widefat">
            <thead>
                <tr>
                    <th>Variable</th>
                    <th>Description</th>
                    <th>Example Output</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>{{firm_name}}</code></td>
                    <td>Name of the firm</td>
                    <td>Smith & Associates CPA</td>
                </tr>
                <tr>
                    <td><code>{{contact_name}}</code></td>
                    <td>Contact person's name</td>
                    <td>John Smith</td>
                </tr>
                <tr>
                    <td><code>{{submission_number}}</code></td>
                    <td>Unique submission identifier</td>
                    <td>NYLTA-2025-ABC123XY</td>
                </tr>
                <tr>
                    <td><code>{{total_clients}}</code></td>
                    <td>Number of clients in submission</td>
                    <td>25</td>
                </tr>
                <tr>
                    <td><code>{{total_amount}}</code></td>
                    <td>Total amount (formatted)</td>
                    <td>8,955.00</td>
                </tr>
                <tr>
                    <td><code>{{confirmation_number}}</code></td>
                    <td>Payment confirmation number</td>
                    <td>CONF-XYZ789ABC456</td>
                </tr>
                <tr>
                    <td><code>{{payment_date}}</code></td>
                    <td>Date of payment</td>
                    <td>November 13, 2025</td>
                </tr>
                <tr>
                    <td><code>{{payment_method}}</code></td>
                    <td>Payment method used</td>
                    <td>ACH</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
