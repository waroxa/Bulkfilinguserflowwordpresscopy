/**
 * NYLTA Bulk Filing Portal - Admin JavaScript
 */

jQuery(document).ready(function($) {
    
    // Date picker for analytics filters
    $('.nylta-datepicker').datepicker({
        dateFormat: 'yy-mm-dd'
    });
    
    // Confirmation for critical actions
    $('.nylta-admin-confirm').on('click', function(e) {
        if (!confirm('Are you sure you want to perform this action?')) {
            e.preventDefault();
        }
    });
    
    // Auto-save pricing settings
    var pricingTimeout;
    $('.nylta-pricing-input').on('input', function() {
        clearTimeout(pricingTimeout);
        $('.nylta-save-indicator').text('Unsaved changes...').css('color', '#dc3232');
        
        pricingTimeout = setTimeout(function() {
            $('.nylta-save-indicator').text('Auto-saving...').css('color', '#0073aa');
        }, 1000);
    });
    
    // Email template preview
    $('.nylta-preview-template').on('click', function(e) {
        e.preventDefault();
        
        var templateContent = $(this).closest('form').find('[name="body"]').val();
        var subject = $(this).closest('form').find('[name="subject"]').val();
        
        var previewWindow = window.open('', 'Email Preview', 'width=800,height=600');
        previewWindow.document.write('<html><head><title>' + subject + '</title></head><body>');
        previewWindow.document.write('<h1>' + subject + '</h1>');
        previewWindow.document.write(templateContent);
        previewWindow.document.write('</body></html>');
    });
    
    // Export to CSV
    $('.nylta-export-csv').on('click', function(e) {
        e.preventDefault();
        
        var submissionId = $(this).data('submission-id');
        window.location.href = ajaxurl + '?action=nylta_export_csv&submission_id=' + submissionId + '&nonce=' + nylta_admin_ajax.nonce;
    });
    
    // Chart.js for analytics (if available)
    if (typeof Chart !== 'undefined' && $('.nylta-revenue-chart').length) {
        // Revenue chart implementation would go here
        console.log('Charts ready for implementation');
    }
});
