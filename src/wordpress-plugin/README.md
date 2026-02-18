# NYLTA Bulk Filing Portal - WordPress Plugin

A comprehensive bulk filing system for NYLTA.com designed for CPAs, attorneys, and compliance professionals to file NYLTA reports on behalf of multiple clients.

## Features

### 📋 6-Step Bulk Filing Flow
1. **Firm Registration** - Professional firm details with authorization confirmation
2. **CSV Client Upload** - Bulk client upload with manual entry options and CSV template download
3. **Beneficial Owner Data Collection** - Smart exempt/non-exempt logic with "same applicant for all" toggle
4. **Review Summary** - Comprehensive review with selective payment options
5. **Secure ACH Payment Authorization** - Professional payment processing
6. **Confirmation** - Downloadable receipts and confirmation emails

### 💰 Tiered Pricing System
- **Tier 1 (1-25 clients)**: $358.20 per filing
- **Tier 2 (26-75 clients)**: $389.00 per filing
- **Tier 3 (76-150 clients)**: $375.00 per filing
- **Tier 4 (150+ clients)**: Custom pricing
- **Early Bird Discount**: 10% off for first 25 firms to create account and pay

### 🎨 Professional Design
- **Fonts**: Libre Baskerville (headings), Poppins (body text)
- **Color Scheme**: Navy (#00274E), Yellow (#FFD700), Gray, White
- **Squared buttons** matching NYLTA.com aesthetic
- **Government-like professional appearance**

### 📊 Comprehensive Admin Dashboard
- **Revenue Tracking** with multiple analytics views
- **Submission Management** with status filters
- **Abandoned Forms Monitoring** (drafts > 7 days)
- **Analytics Dashboard** with charts and trends
- **Pricing Controls** - Real-time tier and discount management
- **Email Template Management** with preview functionality
- **Email Marketing** - Integration with RewardLion platform

### 👤 Member Profile System
- Firm information management
- Submission history
- Account settings

## Installation

### Requirements
- WordPress 5.0 or higher
- PHP 7.4 or higher
- MySQL 5.6 or higher

### Step 1: Upload Plugin
1. Download the plugin folder
2. Upload to `/wp-content/plugins/nylta-bulk-filing/`
3. OR upload the ZIP file via WordPress admin

### Step 2: Activate Plugin
1. Go to WordPress Admin → Plugins
2. Find "NYLTA Bulk Filing Portal"
3. Click "Activate"

### Step 3: Database Setup
The plugin will automatically create these database tables on activation:
- `wp_nylta_firms` - Firm registrations
- `wp_nylta_submissions` - Bulk filing submissions
- `wp_nylta_clients` - Client data
- `wp_nylta_beneficial_owners` - Beneficial owner information
- `wp_nylta_settings` - Plugin settings
- `wp_nylta_email_templates` - Email templates

### Step 4: Create Pages
Create the following pages and add shortcodes:

#### Bulk Filing Portal Page
```
[nylta_bulk_filing]
```

#### My Submissions Page
```
[nylta_submissions]
```

#### Member Profile Page
```
[nylta_profile]
```

### Step 5: Configure Settings
1. Go to **NYLTA Filing** → **Pricing**
2. Configure pricing tiers and early bird discount
3. Go to **NYLTA Filing** → **Email Templates**
4. Customize email templates as needed

## Admin Menu Structure

### Dashboard
- Overview statistics
- Recent submissions
- Early bird discount status
- Quick actions

### Submissions
- View all submissions
- Filter by status (draft, completed, pending)
- Export to CSV
- Submission details

### Analytics
- Revenue analytics (today, week, month, year, all-time)
- Revenue by tier
- Monthly revenue trends
- Top firms by volume
- Abandoned submissions tracking
- Conversion rates

### Pricing
- Configure Tier 1-4 pricing
- Set early bird discount percentage
- Set early bird firm limit
- View pricing preview examples
- Real-time pricing updates

### Email Templates
- Submission confirmation template
- Payment confirmation template
- Welcome email template
- Custom template variables
- Preview functionality

### Email Marketing
- Redirects to RewardLion platform
- Email marketing campaign management
- Statistics and analytics

## Shortcodes

### `[nylta_bulk_filing]`
Displays the main bulk filing portal with:
- Landing page dashboard
- 6-step filing flow
- Progress tracking
- Form validation

**Attributes**: None

**Example**:
```
[nylta_bulk_filing]
```

### `[nylta_submissions]`
Displays user's submission history with:
- List of all submissions
- Status indicators
- Submission details
- Download receipts

**Attributes**: None

**Example**:
```
[nylta_submissions]
```

### `[nylta_profile]`
Displays member profile with:
- Firm information
- Contact details
- Account settings
- Edit functionality

**Attributes**: None

**Example**:
```
[nylta_profile]
```

## CSV Upload Format

The CSV template includes these columns:

| Column | Format | Required | Example |
|--------|--------|----------|---------|
| Company Name | Text | Yes | Sample Corporation LLC |
| EIN | XX-XXXXXXX | Yes | 12-3456789 |
| Street Address | Text | No | 123 Main Street |
| City | Text | No | New York |
| State | 2-letter code | No | NY |
| ZIP Code | Text | No | 10001 |
| Is Exempt | Yes/No | Yes | No |
| Exemption Reason | Text | Conditional | (if exempt) |

### Download Template
Users can download the CSV template from within the bulk filing flow (Step 2).

## AJAX Endpoints

The plugin includes these AJAX handlers:

- `nylta_create_firm` - Create/update firm registration
- `nylta_upload_csv` - Upload and parse CSV file
- `nylta_add_client` - Add client manually
- `nylta_add_beneficial_owner` - Add beneficial owner
- `nylta_calculate_pricing` - Calculate pricing preview
- `nylta_complete_submission` - Complete and submit filing
- `nylta_get_submission` - Get submission data

## Email System

### Email Templates

The plugin includes 3 default email templates:

#### 1. Submission Confirmation
**Trigger**: When submission is completed
**Variables**: `{{firm_name}}`, `{{submission_number}}`, `{{total_clients}}`, `{{total_amount}}`, `{{confirmation_number}}`

#### 2. Payment Confirmation
**Trigger**: When payment is processed
**Variables**: `{{firm_name}}`, `{{submission_number}}`, `{{total_amount}}`, `{{payment_date}}`, `{{payment_method}}`

#### 3. Welcome Email
**Trigger**: When firm first registers
**Variables**: `{{firm_name}}`, `{{contact_name}}`

### Email Signature
All emails include NYLTA.com branding with logo:
- NYLTA.com logo image
- Professional footer
- Contact information

## Pricing Logic

### Tier Calculation
```php
// Based on number of clients
1-25 clients → Tier 1
26-75 clients → Tier 2
76-150 clients → Tier 3
151+ clients → Tier 4 (custom)
```

### Early Bird Discount
- Applied to first 25 firms to **create account AND complete payment**
- 10% discount on total bulk filing amount
- Stacks with volume-based tier pricing
- Automatically tracked and limited

### Example Pricing Calculations

**Example 1**: 10 clients, early bird eligible
- Base: 10 × $358.20 = $3,582.00
- Early Bird Discount (10%): -$358.20
- **Total: $3,223.80**

**Example 2**: 50 clients, no early bird
- Base: 50 × $389.00 = $19,450.00
- **Total: $19,450.00**

**Example 3**: 100 clients, early bird eligible
- Base: 100 × $375.00 = $37,500.00
- Early Bird Discount (10%): -$3,750.00
- **Total: $33,750.00**

## Database Schema

### Firms Table (`wp_nylta_firms`)
- Stores firm registration data
- Links to WordPress user
- Tracks early bird eligibility
- Authorization confirmation

### Submissions Table (`wp_nylta_submissions`)
- Submission tracking
- Status management (draft, completed, pending)
- Step progress tracking
- Pricing calculations
- Payment information

### Clients Table (`wp_nylta_clients`)
- Client company information
- EIN and address
- Exempt/non-exempt status
- Links to submission

### Beneficial Owners Table (`wp_nylta_beneficial_owners`)
- Owner personal information
- Owner type (beneficial owner/applicant)
- Identification details
- Links to client

### Settings Table (`wp_nylta_settings`)
- Pricing tier configuration
- Early bird settings
- System-wide settings

### Email Templates Table (`wp_nylta_email_templates`)
- Custom email templates
- Template variables
- Subject and body content

## Security Features

- **AJAX Nonce Verification** on all AJAX requests
- **User Authentication** checks for logged-in users
- **Input Sanitization** on all form data
- **SQL Injection Prevention** using prepared statements
- **XSS Protection** using WordPress escaping functions
- **Admin Capability Checks** for admin features

## Customization

### Modify Pricing
Go to **NYLTA Filing** → **Pricing** and update:
- Tier ranges (min/max clients)
- Price per filing for each tier
- Early bird discount percentage
- Early bird firm limit

### Customize Email Templates
Go to **NYLTA Filing** → **Email Templates**:
- Edit subject lines
- Modify email body (HTML supported)
- Use template variables
- Preview before saving

### Custom CSS
Add custom styles to override default styling:

```css
/* In your theme's style.css */
.nylta-btn-primary {
    background: your-custom-color;
}
```

## Troubleshooting

### Database Tables Not Created
- Deactivate and reactivate the plugin
- Check WordPress database permissions
- Verify PHP version compatibility

### CSV Upload Fails
- Check file upload size limits in php.ini
- Verify CSV format matches template
- Ensure proper EIN format (XX-XXXXXXX)

### Emails Not Sending
- Check WordPress email configuration
- Install SMTP plugin for reliable delivery
- Verify template variables are correct

### Pricing Not Calculating
- Clear browser cache
- Check JavaScript console for errors
- Verify AJAX is working (check nonce)

## Support

For support and questions:
- Email: support@nylta.com
- Website: https://nylta.com
- Documentation: https://nylta.com/docs

## Changelog

### Version 1.0.0 (Initial Release)
- Complete 6-step bulk filing flow
- Tiered pricing system with early bird discount
- CSV upload with validation
- Beneficial owner data collection
- Admin dashboard with analytics
- Email template system
- Member profile management
- RewardLion email marketing integration
- Real-time pricing controls

## License

This plugin is proprietary software for NYLTA.com.
Unauthorized distribution or modification is prohibited.

## Credits

**Developed for**: NYLTA.com
**Version**: 1.0.0
**Author**: NYLTA.com Development Team
