# NYLTA Bulk Filing Portal - WordPress Installation Guide

## 📋 Quick Start Installation

### Step 1: Upload Plugin Files
1. Download the `nylta-bulk-filing` folder
2. Upload to `/wp-content/plugins/` on your WordPress server
3. Verify the structure looks like: `/wp-content/plugins/nylta-bulk-filing/nylta-bulk-filing.php`

### Step 2: Activate the Plugin
1. Log in to WordPress Admin
2. Navigate to **Plugins** → **Installed Plugins**
3. Find **NYLTA Bulk Filing Portal**
4. Click **Activate**

✅ The plugin will automatically create all necessary database tables and insert default settings!

### Step 3: Create Required Pages

Create these 3 pages in WordPress:

#### Page 1: Bulk Filing Portal (Main Portal)
- **Page Title**: Bulk Filing Portal
- **Slug**: bulk-filing
- **Content**: `[nylta_bulk_filing]`
- **Template**: Default or Full Width

#### Page 2: My Submissions
- **Page Title**: My Submissions
- **Slug**: my-submissions
- **Content**: `[nylta_submissions]`
- **Template**: Default or Full Width

#### Page 3: Member Profile
- **Page Title**: Member Profile
- **Slug**: member-profile
- **Content**: `[nylta_profile]`
- **Template**: Default or Full Width

### Step 4: Configure Admin Settings

1. Go to **NYLTA Filing** → **Pricing**
2. Review and adjust pricing tiers if needed:
   - Tier 1 (1-25): $358.20
   - Tier 2 (26-75): $389.00
   - Tier 3 (76-150): $375.00
   - Tier 4 (151+): Custom
   - Early Bird: 10% discount for first 25 firms

3. Go to **NYLTA Filing** → **Email Templates**
4. Review and customize the 3 email templates

### Step 5: Add to WordPress Menu

1. Go to **Appearance** → **Menus**
2. Add the pages to your main navigation:
   - Bulk Filing Portal
   - My Submissions
   - Member Profile (typically in account dropdown)

---

## 🔐 User Access Configuration

### Option A: Require Login (Recommended)
The shortcodes automatically check if users are logged in. Non-logged-in users will see a login prompt.

### Option B: Public Access (Not Recommended)
If you need public access, modify the shortcode checks in `/includes/nylta-shortcodes.php`

### Create User Roles
WordPress default roles work fine:
- **Administrator**: Full access to admin dashboard
- **Subscriber**: Can use bulk filing portal (logged-in users)

---

## 🎨 Design Customization

### Fonts (Already Configured)
The plugin automatically loads:
- **Libre Baskerville** (headings)
- **Poppins** (body text)

### Colors (Already Configured)
- Navy: `#00274E`
- Yellow: `#FFD700`
- Gray: `#666666`
- White: `#FFFFFF`

### Custom CSS Override
Add to your theme's `style.css` or Customizer → Additional CSS:

```css
/* Override button colors */
.nylta-btn-primary {
    background: #your-custom-color !important;
}

/* Override header */
.nylta-portal-header {
    background: #your-custom-color !important;
}
```

---

## 📧 Email Configuration

### SMTP Setup (Highly Recommended)
WordPress default email can be unreliable. Install an SMTP plugin:

1. **WP Mail SMTP** (recommended)
2. **Easy WP SMTP**
3. **Post SMTP**

Configure with your email service provider.

### Test Emails
After SMTP setup:
1. Go to **NYLTA Filing** → **Email Templates**
2. Edit a template
3. Use the preview function
4. Complete a test submission to verify emails send

---

## 💾 Database Tables Created

The plugin creates these tables (prefix `wp_`):

| Table Name | Purpose |
|------------|---------|
| `wp_nylta_firms` | Firm registrations |
| `wp_nylta_submissions` | Bulk filing submissions |
| `wp_nylta_clients` | Client companies |
| `wp_nylta_beneficial_owners` | Beneficial owner data |
| `wp_nylta_settings` | Plugin settings |
| `wp_nylta_email_templates` | Email templates |

### View Tables
Use phpMyAdmin or database plugin to view tables.

---

## 🔌 Required WordPress Capabilities

### Server Requirements
- **PHP**: 7.4 or higher
- **MySQL**: 5.6 or higher
- **WordPress**: 5.0 or higher
- **Memory Limit**: 128MB minimum (256MB recommended)
- **Upload Size**: 10MB minimum (for CSV uploads)

### PHP Extensions
- mysqli
- json
- mbstring
- fileinfo

---

## 📁 File Upload Configuration

### Increase Upload Limits (for CSV files)

Edit `wp-config.php` and add:
```php
@ini_set('upload_max_size', '10M');
@ini_set('post_max_size', '10M');
@ini_set('max_execution_time', '300');
```

Or edit `.htaccess`:
```
php_value upload_max_filesize 10M
php_value post_max_size 10M
php_value max_execution_time 300
php_value max_input_time 300
```

---

## 🛡️ Security Hardening

### 1. Restrict Admin Access
Add to `wp-config.php`:
```php
define('DISALLOW_FILE_EDIT', true);
```

### 2. SSL Certificate
Ensure your site has SSL (https://) for secure data transmission.

### 3. Regular Backups
Use a backup plugin:
- UpdraftPlus
- BackupBuddy
- VaultPress

### 4. Security Plugin
Install:
- Wordfence Security
- Sucuri Security
- iThemes Security

---

## 🧪 Testing the Installation

### Test Checklist

#### ✅ Frontend Tests
1. Visit bulk filing portal page (not logged in) → Should show login prompt
2. Log in as a user
3. Visit bulk filing portal → Should show dashboard
4. Click "Start New Bulk Filing" → Should start Step 1
5. Complete firm registration → Should proceed to Step 2
6. Upload CSV or add client manually → Should work
7. Complete all 6 steps → Should receive confirmation

#### ✅ Admin Tests
1. Go to **NYLTA Filing** → **Dashboard**
2. Verify statistics are visible
3. Go to **Submissions** → Should list test submission
4. Go to **Analytics** → Should show data
5. Go to **Pricing** → Modify a price → Save → Should work
6. Go to **Email Templates** → Edit → Save → Should work
7. Go to **Email Marketing** → Should redirect to RewardLion

#### ✅ Email Tests
1. Complete a test submission
2. Check email inbox for:
   - Welcome email
   - Submission confirmation
   - Payment confirmation

---

## 🐛 Troubleshooting

### Problem: Database tables not created
**Solution**: 
1. Deactivate the plugin
2. Reactivate the plugin
3. Check database permissions

### Problem: Shortcode shows raw code
**Solution**:
1. Verify plugin is activated
2. Check page is not in HTML mode (use Visual editor)
3. Ensure shortcode is typed correctly: `[nylta_bulk_filing]`

### Problem: CSV upload fails
**Solution**:
1. Check PHP upload limits (see File Upload Configuration)
2. Verify CSV format matches template
3. Check server error logs

### Problem: Emails not sending
**Solution**:
1. Install SMTP plugin
2. Configure email settings
3. Test with WP Mail SMTP test email feature

### Problem: Styling looks broken
**Solution**:
1. Clear browser cache
2. Clear WordPress cache (if using cache plugin)
3. Check if CSS files are loading (inspect browser console)

### Problem: AJAX not working
**Solution**:
1. Check JavaScript console for errors
2. Verify jQuery is loaded
3. Check AJAX URL is correct in page source

---

## 📊 Default Data Inserted

### Pricing Settings
- Tier 1 (1-25): $358.20
- Tier 2 (26-75): $389.00
- Tier 3 (76-150): $375.00
- Tier 4 (151+): Custom
- Early Bird Discount: 10%
- Early Bird Limit: 25 firms

### Email Templates
1. **Submission Confirmation**
2. **Payment Confirmation**
3. **Welcome Email**

---

## 🔄 Updating the Plugin

### Manual Update
1. Deactivate the plugin
2. Delete old plugin folder (or rename it for backup)
3. Upload new version
4. Reactivate the plugin

### Database Migration
The plugin checks version on activation. Future updates will handle migrations automatically.

---

## 🚀 Going Live Checklist

Before launching to production:

- [ ] SSL certificate installed and working
- [ ] SMTP email configured and tested
- [ ] All 3 pages created with correct shortcodes
- [ ] Pages added to navigation menu
- [ ] Pricing configured correctly
- [ ] Email templates customized
- [ ] Test submission completed successfully
- [ ] Emails received successfully
- [ ] Admin dashboard tested
- [ ] Security plugin installed
- [ ] Backup system configured
- [ ] Early bird discount set correctly (10%, 25 firms)
- [ ] Payment processing configured (if applicable)
- [ ] User registration/login working
- [ ] Mobile responsive design verified

---

## 📞 Support

### Documentation
- Full README.md in plugin folder
- Inline code comments for developers

### Technical Support
- Email: support@nylta.com
- Website: https://nylta.com

### Developer Resources
- Plugin structure follows WordPress coding standards
- All functions prefixed with `nylta_`
- Uses WordPress Database API (wpdb)
- AJAX handlers in `/includes/nylta-ajax-handlers.php`
- Admin views in `/admin/views/`

---

## 🎯 Next Steps After Installation

1. **Configure Payment Processing** (if not yet implemented)
   - Add payment gateway integration
   - Test payment flow

2. **Customize Email Templates**
   - Add your branding
   - Adjust wording as needed

3. **Set Up Analytics Tracking**
   - Google Analytics on pages
   - Track conversion funnels

4. **Create User Documentation**
   - How-to guides for CPAs/attorneys
   - CSV format instructions
   - FAQ page

5. **Marketing Setup**
   - Configure RewardLion integration
   - Set up email campaigns

---

## 📝 Additional Notes

### CSV Template Download
Users can download the CSV template from Step 2 of the bulk filing flow. The template includes:
- Sample data
- Correct format
- Column headers

### EIN Format
The system expects EIN format: `XX-XXXXXXX` (e.g., `12-3456789`)
JavaScript auto-formats as users type.

### Early Bird Discount Logic
- First 25 **firms** to create account AND pay
- 10% discount on total amount
- Automatically tracked in database
- Admin can modify limit and percentage

### Submission Flow
1. Firm Registration
2. CSV Upload / Manual Entry
3. Beneficial Owner Data
4. Review & Summary
5. Payment Authorization
6. Confirmation & Receipts

---

## ✅ Installation Complete!

Your NYLTA Bulk Filing Portal is now ready to use!

Visit your Bulk Filing Portal page and test the complete flow.

**Happy Filing! 🎉**
