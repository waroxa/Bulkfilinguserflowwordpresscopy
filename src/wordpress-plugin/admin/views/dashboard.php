<?php
/**
 * Admin Dashboard View
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap nylta-admin">
    <div class="nylta-header">
        <img src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp" alt="NYLTA.com" class="nylta-logo">
        <div class="nylta-header-content">
            <h1>NYLTA Bulk Filing Portal - Admin Dashboard</h1>
            <p>New York LLC Transparency Act Compliance System</p>
        </div>
    </div>

    <?php settings_errors('nylta_messages'); ?>

    <!-- Statistics Overview -->
    <div class="nylta-stats-grid">
        <div class="nylta-stat-card">
            <div class="nylta-stat-icon dashicons dashicons-portfolio"></div>
            <div class="nylta-stat-content">
                <h3><?php echo number_format($stats->total_submissions); ?></h3>
                <p>Total Submissions</p>
            </div>
        </div>

        <div class="nylta-stat-card">
            <div class="nylta-stat-icon dashicons dashicons-yes-alt"></div>
            <div class="nylta-stat-content">
                <h3><?php echo number_format($stats->completed); ?></h3>
                <p>Completed</p>
            </div>
        </div>

        <div class="nylta-stat-card">
            <div class="nylta-stat-icon dashicons dashicons-groups"></div>
            <div class="nylta-stat-content">
                <h3><?php echo number_format($stats->total_clients_filed); ?></h3>
                <p>Total Clients Filed</p>
            </div>
        </div>

        <div class="nylta-stat-card nylta-stat-revenue">
            <div class="nylta-stat-icon dashicons dashicons-chart-line"></div>
            <div class="nylta-stat-content">
                <h3>$<?php echo number_format($stats->total_revenue, 2); ?></h3>
                <p>Total Revenue</p>
            </div>
        </div>
    </div>

    <!-- Early Bird Discount Status -->
    <div class="nylta-card">
        <h2>Early Bird Discount Status</h2>
        <div class="nylta-early-bird-status">
            <div class="nylta-progress-bar">
                <div class="nylta-progress-fill" style="width: <?php echo ($early_bird['count'] / $early_bird['limit']) * 100; ?>%"></div>
            </div>
            <p><strong><?php echo $early_bird['count']; ?></strong> of <strong><?php echo $early_bird['limit']; ?></strong> early bird slots claimed</p>
            <p class="nylta-remaining"><?php echo $early_bird['remaining']; ?> slots remaining</p>
        </div>
    </div>

    <!-- Recent Submissions -->
    <div class="nylta-card">
        <div class="nylta-card-header">
            <h2>Recent Submissions</h2>
            <a href="<?php echo admin_url('admin.php?page=nylta-submissions'); ?>" class="button">View All</a>
        </div>

        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Submission #</th>
                    <th>Firm Name</th>
                    <th>Clients</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($recent_submissions)): ?>
                    <tr>
                        <td colspan="6">No submissions found.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($recent_submissions as $submission): ?>
                        <tr>
                            <td><strong><?php echo esc_html($submission->submission_number); ?></strong></td>
                            <td><?php echo esc_html($submission->firm_name); ?></td>
                            <td><?php echo number_format($submission->total_clients); ?></td>
                            <td>$<?php echo number_format($submission->total_amount, 2); ?></td>
                            <td>
                                <span class="nylta-status nylta-status-<?php echo esc_attr($submission->status); ?>">
                                    <?php echo ucfirst($submission->status); ?>
                                </span>
                            </td>
                            <td><?php echo date('M j, Y', strtotime($submission->created_at)); ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <!-- Quick Actions -->
    <div class="nylta-quick-actions">
        <h2>Quick Actions</h2>
        <div class="nylta-actions-grid">
            <a href="<?php echo admin_url('admin.php?page=nylta-submissions'); ?>" class="nylta-action-button">
                <span class="dashicons dashicons-list-view"></span>
                View All Submissions
            </a>
            <a href="<?php echo admin_url('admin.php?page=nylta-analytics'); ?>" class="nylta-action-button">
                <span class="dashicons dashicons-chart-bar"></span>
                View Analytics
            </a>
            <a href="<?php echo admin_url('admin.php?page=nylta-pricing'); ?>" class="nylta-action-button">
                <span class="dashicons dashicons-admin-settings"></span>
                Manage Pricing
            </a>
            <a href="<?php echo admin_url('admin.php?page=nylta-emails'); ?>" class="nylta-action-button">
                <span class="dashicons dashicons-email"></span>
                Email Templates
            </a>
        </div>
    </div>
</div>

<style>
.nylta-admin {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.nylta-header {
    background: #00274E;
    color: white;
    padding: 30px;
    border-bottom: 4px solid #FFD700;
    margin: 0 -20px 30px 0;
    display: flex;
    align-items: center;
    gap: 20px;
}

.nylta-logo {
    height: 60px;
}

.nylta-header-content h1 {
    font-family: 'Libre Baskerville', serif;
    color: white;
    margin: 0;
    font-size: 28px;
}

.nylta-header-content p {
    color: #ccc;
    margin: 5px 0 0 0;
}

.nylta-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.nylta-stat-card {
    background: white;
    border-left: 4px solid #00274E;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.nylta-stat-revenue {
    border-left-color: #FFD700;
}

.nylta-stat-icon {
    font-size: 40px;
    color: #00274E;
    width: 40px;
    height: 40px;
}

.nylta-stat-content h3 {
    font-family: 'Libre Baskerville', serif;
    font-size: 32px;
    margin: 0;
    color: #00274E;
}

.nylta-stat-content p {
    margin: 5px 0 0 0;
    color: #666;
}

.nylta-card {
    background: white;
    padding: 25px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.nylta-card h2 {
    font-family: 'Libre Baskerville', serif;
    color: #00274E;
    margin-top: 0;
}

.nylta-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.nylta-card-header h2 {
    margin: 0;
}

.nylta-early-bird-status {
    max-width: 600px;
}

.nylta-progress-bar {
    height: 30px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 10px;
}

.nylta-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00274E 0%, #FFD700 100%);
    transition: width 0.3s ease;
}

.nylta-remaining {
    color: #FFD700;
    font-weight: bold;
}

.nylta-status {
    padding: 4px 12px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
}

.nylta-status-completed {
    background: #d4edda;
    color: #155724;
}

.nylta-status-draft {
    background: #fff3cd;
    color: #856404;
}

.nylta-status-pending {
    background: #d1ecf1;
    color: #0c5460;
}

.nylta-quick-actions h2 {
    font-family: 'Libre Baskerville', serif;
    color: #00274E;
}

.nylta-actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

.nylta-action-button {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 20px;
    background: #00274E;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background 0.2s;
}

.nylta-action-button:hover {
    background: #003d73;
    color: white;
}

.nylta-action-button .dashicons {
    font-size: 24px;
    width: 24px;
    height: 24px;
}
</style>
