<?php
/**
 * Submissions Management View
 */

if (!defined('ABSPATH')) {
    exit;
}

$current_status = isset($_GET['status']) ? $_GET['status'] : 'all';
?>

<div class="wrap nylta-admin">
    <div class="nylta-header">
        <img src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp" alt="NYLTA.com" class="nylta-logo">
        <div class="nylta-header-content">
            <h1>Submission Management</h1>
            <p>View and manage all bulk filing submissions</p>
        </div>
    </div>

    <!-- Status Filter -->
    <div class="nylta-card">
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="<?php echo admin_url('admin.php?page=nylta-submissions'); ?>" 
               class="button <?php echo $current_status === 'all' ? 'button-primary' : ''; ?>">
                All Submissions
            </a>
            <a href="<?php echo admin_url('admin.php?page=nylta-submissions&status=completed'); ?>" 
               class="button <?php echo $current_status === 'completed' ? 'button-primary' : ''; ?>">
                Completed
            </a>
            <a href="<?php echo admin_url('admin.php?page=nylta-submissions&status=draft'); ?>" 
               class="button <?php echo $current_status === 'draft' ? 'button-primary' : ''; ?>">
                Draft
            </a>
            <a href="<?php echo admin_url('admin.php?page=nylta-submissions&status=pending'); ?>" 
               class="button <?php echo $current_status === 'pending' ? 'button-primary' : ''; ?>">
                Pending
            </a>
        </div>
    </div>

    <!-- Submissions Table -->
    <div class="nylta-card">
        <h2>
            <?php 
            if ($current_status === 'all') {
                echo 'All Submissions';
            } else {
                echo ucfirst($current_status) . ' Submissions';
            }
            ?>
        </h2>

        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Submission #</th>
                    <th>Firm Name</th>
                    <th>Contact Email</th>
                    <th>Clients</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($submissions)): ?>
                    <tr>
                        <td colspan="9">No submissions found.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($submissions as $submission): ?>
                        <tr>
                            <td>
                                <strong><?php echo esc_html($submission->submission_number); ?></strong>
                                <?php if ($submission->confirmation_number): ?>
                                    <br><small>Conf: <?php echo esc_html($submission->confirmation_number); ?></small>
                                <?php endif; ?>
                            </td>
                            <td><?php echo esc_html($submission->firm_name); ?></td>
                            <td>
                                <a href="mailto:<?php echo esc_attr($submission->contact_email); ?>">
                                    <?php echo esc_html($submission->contact_email); ?>
                                </a>
                            </td>
                            <td>
                                <?php echo number_format($submission->total_clients); ?>
                                <?php if ($submission->total_clients > 0): ?>
                                    <br>
                                    <small>
                                        Exempt: <?php echo $submission->total_exempt; ?> | 
                                        Non-Exempt: <?php echo $submission->total_non_exempt; ?>
                                    </small>
                                <?php endif; ?>
                            </td>
                            <td>
                                <?php if ($submission->total_amount > 0): ?>
                                    <strong>$<?php echo number_format($submission->total_amount, 2); ?></strong>
                                    <?php if ($submission->discount_amount > 0): ?>
                                        <br><small style="color: #FFD700;">
                                            Discount: -$<?php echo number_format($submission->discount_amount, 2); ?>
                                        </small>
                                    <?php endif; ?>
                                <?php else: ?>
                                    -
                                <?php endif; ?>
                            </td>
                            <td>
                                <span class="nylta-status nylta-status-<?php echo esc_attr($submission->status); ?>">
                                    <?php echo ucfirst($submission->status); ?>
                                </span>
                                <?php if ($submission->status === 'draft'): ?>
                                    <br><small>Step <?php echo $submission->step_completed; ?>/6</small>
                                <?php endif; ?>
                            </td>
                            <td>
                                <?php if ($submission->payment_status): ?>
                                    <span class="nylta-status nylta-status-<?php echo esc_attr($submission->payment_status); ?>">
                                        <?php echo ucfirst($submission->payment_status); ?>
                                    </span>
                                    <?php if ($submission->payment_method): ?>
                                        <br><small><?php echo esc_html($submission->payment_method); ?></small>
                                    <?php endif; ?>
                                <?php else: ?>
                                    -
                                <?php endif; ?>
                            </td>
                            <td>
                                <?php echo date('M j, Y', strtotime($submission->created_at)); ?>
                                <?php if ($submission->submitted_at): ?>
                                    <br><small>Submitted: <?php echo date('M j', strtotime($submission->submitted_at)); ?></small>
                                <?php endif; ?>
                            </td>
                            <td>
                                <a href="<?php echo admin_url('admin.php?page=nylta-submissions&action=view&id=' . $submission->id); ?>" 
                                   class="button button-small">
                                    View Details
                                </a>
                                <?php if ($submission->total_clients > 0): ?>
                                    <br>
                                    <a href="#" class="button button-small nylta-export-csv" 
                                       data-submission-id="<?php echo $submission->id; ?>"
                                       style="margin-top: 5px;">
                                        Export CSV
                                    </a>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>
