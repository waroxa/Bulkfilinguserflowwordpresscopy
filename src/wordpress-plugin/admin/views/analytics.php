<?php
/**
 * Analytics View
 */

if (!defined('ABSPATH')) {
    exit;
}

$conversion_rate = NYLTA_Analytics::get_conversion_rate();
?>

<div class="wrap nylta-admin">
    <div class="nylta-header">
        <img src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp" alt="NYLTA.com" class="nylta-logo">
        <div class="nylta-header-content">
            <h1>Analytics & Insights</h1>
            <p>Comprehensive analytics and performance tracking</p>
        </div>
    </div>

    <!-- Revenue Analytics -->
    <div class="nylta-card">
        <h2>Revenue Overview</h2>
        <div class="nylta-stats-grid">
            <div class="nylta-stat-card">
                <div class="nylta-stat-content">
                    <h3>$<?php echo number_format($revenue_analytics->total_revenue, 2); ?></h3>
                    <p>Total Revenue</p>
                </div>
            </div>
            <div class="nylta-stat-card">
                <div class="nylta-stat-content">
                    <h3><?php echo number_format($revenue_analytics->total_submissions); ?></h3>
                    <p>Paid Submissions</p>
                </div>
            </div>
            <div class="nylta-stat-card">
                <div class="nylta-stat-content">
                    <h3>$<?php echo number_format($revenue_analytics->avg_submission_value, 2); ?></h3>
                    <p>Avg Submission Value</p>
                </div>
            </div>
            <div class="nylta-stat-card">
                <div class="nylta-stat-content">
                    <h3><?php echo number_format($revenue_analytics->total_clients); ?></h3>
                    <p>Total Clients Filed</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Revenue by Tier -->
    <div class="nylta-card">
        <h2>Revenue by Tier</h2>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Tier</th>
                    <th>Submissions</th>
                    <th>Total Revenue</th>
                    <th>Avg Value</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($tier_revenue)): ?>
                    <tr>
                        <td colspan="4">No revenue data available.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($tier_revenue as $tier): ?>
                        <tr>
                            <td><strong><?php echo strtoupper($tier->pricing_tier); ?></strong></td>
                            <td><?php echo number_format($tier->count); ?></td>
                            <td>$<?php echo number_format($tier->revenue, 2); ?></td>
                            <td>$<?php echo number_format($tier->avg_value, 2); ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <!-- Monthly Revenue Trend -->
    <div class="nylta-card">
        <h2>Monthly Revenue Trend</h2>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Submissions</th>
                    <th>Clients</th>
                    <th>Revenue</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($monthly_revenue)): ?>
                    <tr>
                        <td colspan="4">No monthly data available.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($monthly_revenue as $month_data): ?>
                        <tr>
                            <td><?php echo date('F Y', strtotime($month_data->month . '-01')); ?></td>
                            <td><?php echo number_format($month_data->submissions); ?></td>
                            <td><?php echo number_format($month_data->clients); ?></td>
                            <td><strong>$<?php echo number_format($month_data->revenue, 2); ?></strong></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <!-- Top Firms -->
    <div class="nylta-card">
        <h2>Top Firms by Revenue</h2>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Firm Name</th>
                    <th>Type</th>
                    <th>Submissions</th>
                    <th>Clients</th>
                    <th>Total Revenue</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($top_firms)): ?>
                    <tr>
                        <td colspan="5">No firm data available.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($top_firms as $firm): ?>
                        <tr>
                            <td><strong><?php echo esc_html($firm->firm_name); ?></strong></td>
                            <td><?php echo esc_html($firm->firm_type); ?></td>
                            <td><?php echo number_format($firm->submission_count); ?></td>
                            <td><?php echo number_format($firm->total_clients); ?></td>
                            <td><strong>$<?php echo number_format($firm->total_revenue, 2); ?></strong></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <!-- Abandoned Submissions -->
    <div class="nylta-card">
        <h2>Abandoned Submissions (Draft > 7 Days)</h2>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Submission #</th>
                    <th>Firm Name</th>
                    <th>Email</th>
                    <th>Step Completed</th>
                    <th>Days Abandoned</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($abandoned)): ?>
                    <tr>
                        <td colspan="6">No abandoned submissions found.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($abandoned as $submission): 
                        $days_abandoned = floor((time() - strtotime($submission->created_at)) / (60 * 60 * 24));
                    ?>
                        <tr>
                            <td><?php echo esc_html($submission->submission_number); ?></td>
                            <td><?php echo esc_html($submission->firm_name); ?></td>
                            <td><?php echo esc_html($submission->contact_email); ?></td>
                            <td>Step <?php echo $submission->step_completed; ?> / 6</td>
                            <td><?php echo $days_abandoned; ?> days</td>
                            <td>
                                <a href="mailto:<?php echo esc_attr($submission->contact_email); ?>" class="button button-small">
                                    Send Reminder
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <!-- Conversion Rate -->
    <div class="nylta-card">
        <h2>Conversion Metrics</h2>
        <div style="max-width: 400px;">
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span><strong>Conversion Rate</strong></span>
                    <span><strong><?php echo number_format($conversion_rate, 1); ?>%</strong></span>
                </div>
                <div style="height: 30px; background: #e0e0e0; border-radius: 4px; overflow: hidden;">
                    <div style="height: 100%; background: linear-gradient(90deg, #00274E 0%, #FFD700 100%); width: <?php echo $conversion_rate; ?>%;"></div>
                </div>
            </div>
            <p style="color: #666; font-size: 14px;">
                Percentage of started submissions that are completed and paid.
            </p>
        </div>
    </div>
</div>
