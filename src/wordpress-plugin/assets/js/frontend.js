/**
 * NYLTA Bulk Filing Portal - Frontend JavaScript
 */

jQuery(document).ready(function($) {
    
    // CSV Upload Handler
    $('#nylta-csv-upload-form').on('submit', function(e) {
        e.preventDefault();
        
        var formData = new FormData(this);
        formData.append('action', 'nylta_upload_csv');
        formData.append('nonce', nylta_ajax.nonce);
        
        $.ajax({
            url: nylta_ajax.ajax_url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    alert('CSV uploaded successfully! ' + response.data.imported + ' clients imported.');
                    location.reload();
                } else {
                    alert('Error: ' + response.data.message);
                }
            },
            error: function() {
                alert('An error occurred during upload.');
            }
        });
    });
    
    // Add Client Form Handler
    $('#nylta-add-client-form').on('submit', function(e) {
        e.preventDefault();
        
        var formData = $(this).serialize();
        formData += '&action=nylta_add_client&nonce=' + nylta_ajax.nonce;
        
        $.ajax({
            url: nylta_ajax.ajax_url,
            type: 'POST',
            data: formData,
            success: function(response) {
                if (response.success) {
                    alert('Client added successfully!');
                    location.reload();
                } else {
                    alert('Error: ' + response.data.message);
                }
            }
        });
    });
    
    // Pricing Calculator
    function calculatePricing() {
        var numClients = $('#nylta-num-clients').val();
        var isEarlyBird = $('#nylta-is-early-bird').val();
        
        $.ajax({
            url: nylta_ajax.ajax_url,
            type: 'POST',
            data: {
                action: 'nylta_calculate_pricing',
                nonce: nylta_ajax.nonce,
                num_clients: numClients,
                is_early_bird: isEarlyBird
            },
            success: function(response) {
                if (response.success) {
                    var pricing = response.data;
                    $('#nylta-base-amount').text('$' + pricing.base_amount.toFixed(2));
                    $('#nylta-discount-amount').text('$' + pricing.discount_amount.toFixed(2));
                    $('#nylta-total-amount').text('$' + pricing.total_amount.toFixed(2));
                }
            }
        });
    }
    
    // Trigger pricing calculation on load if element exists
    if ($('#nylta-num-clients').length) {
        calculatePricing();
    }
    
    // Exempt checkbox toggle
    $('.nylta-exempt-checkbox').on('change', function() {
        var $exemptionReason = $(this).closest('form').find('.nylta-exemption-reason');
        if ($(this).is(':checked')) {
            $exemptionReason.show();
        } else {
            $exemptionReason.hide();
        }
    });
    
    // EIN Formatter
    $('.nylta-ein-input').on('input', function() {
        var value = $(this).val().replace(/[^0-9]/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '-' + value.substring(2, 9);
        }
        $(this).val(value);
    });
    
    // Confirmation dialog for form submission
    $('.nylta-confirm-submit').on('click', function(e) {
        if (!confirm('Are you sure you want to submit this bulk filing? This action cannot be undone.')) {
            e.preventDefault();
        }
    });
});
