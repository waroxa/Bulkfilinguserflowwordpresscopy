<?php
/**
 * CSV Import/Export Class
 */

if (!defined('ABSPATH')) {
    exit;
}

class NYLTA_CSV {
    
    /**
     * Generate CSV template
     */
    public static function generate_template() {
        $headers = array(
            'Company Name',
            'EIN (Format: 12-3456789)',
            'Street Address',
            'City',
            'State',
            'ZIP Code',
            'Is Exempt (Yes/No)',
            'Exemption Reason (if applicable)'
        );
        
        $sample_row = array(
            'Sample Corporation LLC',
            '12-3456789',
            '123 Main Street',
            'New York',
            'NY',
            '10001',
            'No',
            ''
        );
        
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=nylta-client-upload-template.csv');
        header('Pragma: no-cache');
        header('Expires: 0');
        
        $output = fopen('php://output', 'w');
        
        fputcsv($output, $headers);
        fputcsv($output, $sample_row);
        
        fclose($output);
        exit;
    }
    
    /**
     * Parse uploaded CSV file
     */
    public static function parse_csv($file_path) {
        $clients = array();
        $errors = array();
        
        if (!file_exists($file_path)) {
            return array('success' => false, 'error' => 'File not found');
        }
        
        $file = fopen($file_path, 'r');
        
        if (!$file) {
            return array('success' => false, 'error' => 'Unable to open file');
        }
        
        // Skip header row
        $headers = fgetcsv($file);
        
        $row_number = 1;
        
        while (($data = fgetcsv($file)) !== false) {
            $row_number++;
            
            // Validate row has minimum required fields
            if (count($data) < 2) {
                $errors[] = "Row $row_number: Insufficient data";
                continue;
            }
            
            $client = array(
                'company_name' => sanitize_text_field($data[0]),
                'ein' => sanitize_text_field($data[1]),
                'address_street' => isset($data[2]) ? sanitize_text_field($data[2]) : '',
                'address_city' => isset($data[3]) ? sanitize_text_field($data[3]) : '',
                'address_state' => isset($data[4]) ? sanitize_text_field($data[4]) : '',
                'address_zip' => isset($data[5]) ? sanitize_text_field($data[5]) : '',
                'is_exempt' => isset($data[6]) && strtolower($data[6]) === 'yes' ? 1 : 0,
                'exemption_reason' => isset($data[7]) ? sanitize_text_field($data[7]) : ''
            );
            
            // Validate required fields
            $validation = self::validate_client_data($client, $row_number);
            
            if ($validation['valid']) {
                $clients[] = $client;
            } else {
                $errors = array_merge($errors, $validation['errors']);
            }
        }
        
        fclose($file);
        
        return array(
            'success' => true,
            'clients' => $clients,
            'errors' => $errors,
            'total_rows' => $row_number - 1,
            'valid_rows' => count($clients),
            'error_rows' => count($errors)
        );
    }
    
    /**
     * Validate client data
     */
    private static function validate_client_data($client, $row_number) {
        $errors = array();
        
        // Validate company name
        if (empty($client['company_name'])) {
            $errors[] = "Row $row_number: Company name is required";
        }
        
        // Validate EIN format
        if (!self::validate_ein($client['ein'])) {
            $errors[] = "Row $row_number: Invalid EIN format (should be XX-XXXXXXX)";
        }
        
        // Validate state code
        if (!empty($client['address_state']) && strlen($client['address_state']) !== 2) {
            $errors[] = "Row $row_number: State should be 2-letter code";
        }
        
        // Validate exemption
        if ($client['is_exempt'] && empty($client['exemption_reason'])) {
            $errors[] = "Row $row_number: Exemption reason required for exempt clients";
        }
        
        return array(
            'valid' => empty($errors),
            'errors' => $errors
        );
    }
    
    /**
     * Validate EIN format
     */
    private static function validate_ein($ein) {
        // EIN format: XX-XXXXXXX
        return preg_match('/^\d{2}-\d{7}$/', $ein);
    }
    
    /**
     * Export submission data to CSV
     */
    public static function export_submission($submission_id) {
        $submission = NYLTA_Submissions::get_submission($submission_id);
        $clients = NYLTA_Submissions::get_submission_clients($submission_id);
        
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=nylta-submission-' . $submission->submission_number . '.csv');
        header('Pragma: no-cache');
        header('Expires: 0');
        
        $output = fopen('php://output', 'w');
        
        // Headers
        $headers = array(
            'Company Name',
            'EIN',
            'Street Address',
            'City',
            'State',
            'ZIP',
            'Status',
            'Exemption Reason'
        );
        
        fputcsv($output, $headers);
        
        // Data rows
        foreach ($clients as $client) {
            $row = array(
                $client->company_name,
                $client->ein,
                $client->address_street,
                $client->address_city,
                $client->address_state,
                $client->address_zip,
                $client->is_exempt ? 'Exempt' : 'Non-Exempt',
                $client->exemption_reason
            );
            
            fputcsv($output, $row);
        }
        
        fclose($output);
        exit;
    }
    
    /**
     * Import clients from CSV to submission
     */
    public static function import_to_submission($submission_id, $file_path) {
        $result = self::parse_csv($file_path);
        
        if (!$result['success']) {
            return $result;
        }
        
        $imported = 0;
        
        foreach ($result['clients'] as $client_data) {
            $client_id = NYLTA_Submissions::add_client($submission_id, $client_data);
            
            if ($client_id) {
                $imported++;
            }
        }
        
        return array(
            'success' => true,
            'imported' => $imported,
            'errors' => $result['errors'],
            'total_rows' => $result['total_rows']
        );
    }
}
