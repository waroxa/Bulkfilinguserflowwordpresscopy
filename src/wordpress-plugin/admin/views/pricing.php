<?php
/**
 * Pricing Settings View
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap nylta-admin">
    <div class="nylta-header">
        <img src="https://assets.cdn.filesafe.space/fXXJzwVf8OtANDf2M4VP/media/68dd88ec5fb5bdcbae5f6494.webp" alt="NYLTA.com" class="nylta-logo">
        <div class="nylta-header-content">
            <h1>Pricing Management</h1>
            <p>Configure volume-based pricing tiers and discounts</p>
        </div>
    </div>

    <?php settings_errors('nylta_messages'); ?>

    <form method="post" action="">
        <?php wp_nonce_field('nylta_pricing_update'); ?>

        <!-- Warning Notice -->
        <div class="notice notice-warning">
            <p><strong>Important:</strong> Pricing changes take effect immediately for all new submissions. Existing submissions will retain their original pricing.</p>
        </div>

        <!-- Pricing Tiers -->
        <div class="nylta-pricing-grid">
            <!-- Tier 1 -->
            <div class="nylta-card">
                <h2>Tier 1 - Small Volume</h2>
                <p class="description">For smaller filings (<?php echo $tiers['tier1']['min']; ?>-<?php echo $tiers['tier1']['max']; ?> clients)</p>
                
                <table class="form-table">
                    <tr>
                        <th><label for="tier1_min">Minimum Clients</label></th>
                        <td><input type="number" id="tier1_min" name="tier1_min" value="<?php echo $tiers['tier1']['min']; ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label for="tier1_max">Maximum Clients</label></th>
                        <td><input type="number" id="tier1_max" name="tier1_max" value="<?php echo $tiers['tier1']['max']; ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label for="tier1_price">Price per Filing ($)</label></th>
                        <td><input type="number" step="0.01" id="tier1_price" name="tier1_price" value="<?php echo $tiers['tier1']['price']; ?>" class="regular-text"></td>
                    </tr>
                </table>
            </div>

            <!-- Tier 2 -->
            <div class="nylta-card">
                <h2>Tier 2 - Medium Volume</h2>
                <p class="description">For medium filings (<?php echo $tiers['tier2']['min']; ?>-<?php echo $tiers['tier2']['max']; ?> clients)</p>
                
                <table class="form-table">
                    <tr>
                        <th><label for="tier2_min">Minimum Clients</label></th>
                        <td><input type="number" id="tier2_min" name="tier2_min" value="<?php echo $tiers['tier2']['min']; ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label for="tier2_max">Maximum Clients</label></th>
                        <td><input type="number" id="tier2_max" name="tier2_max" value="<?php echo $tiers['tier2']['max']; ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label for="tier2_price">Price per Filing ($)</label></th>
                        <td><input type="number" step="0.01" id="tier2_price" name="tier2_price" value="<?php echo $tiers['tier2']['price']; ?>" class="regular-text"></td>
                    </tr>
                </table>
            </div>

            <!-- Tier 3 -->
            <div class="nylta-card">
                <h2>Tier 3 - Large Volume</h2>
                <p class="description">For large filings (<?php echo $tiers['tier3']['min']; ?>-<?php echo $tiers['tier3']['max']; ?> clients)</p>
                
                <table class="form-table">
                    <tr>
                        <th><label for="tier3_min">Minimum Clients</label></th>
                        <td><input type="number" id="tier3_min" name="tier3_min" value="<?php echo $tiers['tier3']['min']; ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label for="tier3_max">Maximum Clients</label></th>
                        <td><input type="number" id="tier3_max" name="tier3_max" value="<?php echo $tiers['tier3']['max']; ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label for="tier3_price">Price per Filing ($)</label></th>
                        <td><input type="number" step="0.01" id="tier3_price" name="tier3_price" value="<?php echo $tiers['tier3']['price']; ?>" class="regular-text"></td>
                    </tr>
                </table>
            </div>

            <!-- Tier 4 -->
            <div class="nylta-card">
                <h2>Tier 4 - Enterprise Volume</h2>
                <p class="description">For enterprise filings (<?php echo $tiers['tier4']['min']; ?>+ clients)</p>
                
                <table class="form-table">
                    <tr>
                        <th><label for="tier4_min">Minimum Clients</label></th>
                        <td><input type="number" id="tier4_min" name="tier4_min" value="<?php echo $tiers['tier4']['min']; ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <div class="notice notice-info inline">
                                <p><strong>Custom Pricing:</strong> Enterprise clients (151+ filings) receive custom quotes based on volume and specific requirements.</p>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Early Bird Discount -->
        <div class="nylta-card nylta-early-bird-card">
            <h2>Early Bird Discount</h2>
            <p class="description">Limited-time promotional discount for the first firms to sign up and complete payment</p>
            
            <table class="form-table">
                <tr>
                    <th><label for="early_bird_discount">Discount Percentage (%)</label></th>
                    <td><input type="number" step="0.1" id="early_bird_discount" name="early_bird_discount" value="<?php echo NYLTA_Database::get_setting('early_bird_discount', 10); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="early_bird_limit">Number of Firms</label></th>
                    <td><input type="number" id="early_bird_limit" name="early_bird_limit" value="<?php echo NYLTA_Database::get_setting('early_bird_limit', 25); ?>" class="regular-text"></td>
                </tr>
            </table>

            <div class="nylta-early-bird-status">
                <p><strong>Current Status:</strong> <?php echo $early_bird['count']; ?> of <?php echo $early_bird['limit']; ?> early bird slots claimed</p>
                <div class="nylta-progress-bar">
                    <div class="nylta-progress-fill" style="width: <?php echo ($early_bird['count'] / $early_bird['limit']) * 100; ?>%"></div>
                </div>
            </div>
        </div>

        <!-- Pricing Preview Examples -->
        <div class="nylta-card">
            <h2>Pricing Preview Examples</h2>
            <p class="description">See how the current pricing affects different filing volumes</p>
            
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>Volume</th>
                        <th>Tier</th>
                        <th>Base Amount</th>
                        <th>Early Bird Discount</th>
                        <th>Final Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                    $examples = array(5, 50, 100);
                    foreach ($examples as $num_clients):
                        $pricing = NYLTA_Pricing::calculate_pricing($num_clients, true);
                    ?>
                        <tr>
                            <td><?php echo $num_clients; ?> Clients</td>
                            <td><?php echo strtoupper($pricing['tier']); ?></td>
                            <td>$<?php echo number_format($pricing['base_amount'], 2); ?></td>
                            <td>-$<?php echo number_format($pricing['discount_amount'], 2); ?> (<?php echo $pricing['discount_percent']; ?>%)</td>
                            <td><strong>$<?php echo number_format($pricing['total_amount'], 2); ?></strong></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <!-- Save Button -->
        <p class="submit">
            <button type="submit" name="nylta_update_pricing" class="button button-primary button-large">
                <span class="dashicons dashicons-saved" style="margin-top: 3px;"></span>
                Save Pricing Changes
            </button>
        </p>
    </form>
</div>

<style>
.nylta-pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}

.nylta-early-bird-card {
    border-left: 4px solid #FFD700;
}

.nylta-early-bird-status {
    margin-top: 20px;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 4px;
}
</style>
