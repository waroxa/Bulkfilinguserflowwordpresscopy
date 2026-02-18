import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as payments from './payments.tsx';
import * as submissions from './submissions.tsx';
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Enable CORS for all origins
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Enable request logging
app.use('*', logger(console.log));

// Initialize Supabase client for auth
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// ========================
// AUDIT LOGGING SYSTEM
// ========================
interface AuditLogEntry {
  timestamp: string;
  action: string;
  contactId?: string;
  userId?: string;
  firmName?: string;
  email?: string;
  success: boolean;
  requestBody?: any;
  responseStatus?: number;
  responseBody?: string;
  errorMessage?: string;
  metadata?: any;
}

// Save audit log to KV store
async function saveAuditLog(entry: AuditLogEntry) {
  try {
    const logKey = `audit:highlevel:${Date.now()}:${Math.random().toString(36).substring(7)}`;
    await kv.set(logKey, entry);
    console.log('📝 Audit log saved:', logKey);
  } catch (error) {
    console.error('❌ Failed to save audit log:', error);
  }
}

// Email sending function with credentials
async function sendApprovalEmail(email: string, firstName: string, firmName: string, username: string, temporaryPassword: string) {
  const dashboardLink = `https://${Deno.env.get('SUPABASE_URL')?.replace('https://', '')}/bulk-filing`;
  
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: ui-sans-serif, system-ui, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #00274E; border-bottom: 4px solid #fbbf24; padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-family: 'Libre Baskerville', serif; }
    .content { padding: 30px; background: #ffffff; }
    .button { display: inline-block; padding: 15px 40px; background: #fbbf24; color: #00274E; text-decoration: none; font-weight: 600; margin: 20px 0; }
    .checklist { list-style: none; padding: 0; }
    .checklist li { padding: 8px 0; }
    .checklist li:before { content: "✅ "; margin-right: 8px; }
    .footer { padding: 20px; background: #f3f4f6; font-size: 12px; color: #666; text-align: center; }
    .important-box { background: #fef3c7; border-left: 4px solid #fbbf24; padding: 15px; margin: 20px 0; }
    .credentials-box { background: #dbeafe; border: 2px solid #3b82f6; padding: 20px; margin: 20px 0; }
    .credential-item { background: #ffffff; padding: 10px; margin: 5px 0; border-radius: 4px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Your NYLTA Bulk Filing Account Is Approved</h1>
    </div>
    
    <div class="content">
      <p><strong>Congratulations, ${firstName}</strong> — your NYLTA Bulk Filing Account is approved.</p>
      
      <p>We're pleased to welcome <strong>${firmName}</strong> to the NYLTA.com™ Bulk Filing Program, designed exclusively for accountants, attorneys, and compliance professionals managing NYLTA filings at scale.</p>
      
      <div class="credentials-box">
        <h3 style="margin-top: 0; color: #00274E;">🔐 Your Login Credentials</h3>
        <p><strong>Username:</strong></p>
        <div class="credential-item">${username}</div>
        <p><strong>Temporary Password:</strong></p>
        <div class="credential-item">${temporaryPassword}</div>
        <p style="color: #dc2626; margin-top: 10px; margin-bottom: 0;">
          ⚠️ <strong>Important:</strong> You will be required to change your password upon first login.
        </p>
      </div>
      
      <p>Your professional account has been fully activated and you may now access the Bulk Filing Dashboard to begin preparing and submitting filings on behalf of your clients.</p>
      
      <h3>What You Can Do Now</h3>
      
      <p>With your approved bulk account, you can:</p>
      
      <ul class="checklist">
        <li>Upload and manage multiple LLC filings in one workflow</li>
        <li>Use CSV or manual entry for faster client onboarding</li>
        <li>Submit filings under a single batch with consolidated payment</li>
        <li>Receive bulk receipts plus individual client confirmations</li>
        <li>Work with our dedicated Bulk Compliance Support Team</li>
      </ul>
      
      <p>All filings are reviewed for accuracy before submission to ensure alignment with New York Department of State (NYDOS) requirements under the New York LLC Transparency Act (NYLTA).</p>
      
      <h3>Access Your Bulk Filing Dashboard</h3>
      
      <p>👉 <a href="${dashboardLink}" class="button">Log in here</a></p>
      
      <p>Once logged in, you can:</p>
      
      <ul>
        <li>Download the approved CSV template</li>
        <li>Begin uploading client entities</li>
        <li>Track filing status and batch submissions</li>
        <li>Access receipts and confirmations at any time</li>
      </ul>
      
      <div class="important-box">
        <h4 style="margin-top: 0;">Important Notes</h4>
        <ul style="margin-bottom: 0;">
          <li>Bulk filing is available for 10 or more entities per batch</li>
          <li>Payment is processed securely via ACH or approved methods</li>
          <li>All client data is encrypted and handled under strict confidentiality standards</li>
          <li>NYLTA.com™ is a private compliance technology platform and is not affiliated with the New York Department of State</li>
        </ul>
      </div>
      
      <h3>Need Help Getting Started?</h3>
      
      <p>Our Bulk Compliance Team is here to support you every step of the way.</p>
      
      <p>
        📩 Email: <a href="mailto:bulk@nylta.com">bulk@nylta.com</a><br>
        ⏱ Response Time: Typically within 1 business day
      </p>
      
      <p><strong>Thank you for partnering with NYLTA.com™.</strong></p>
      
      <p>Your role in helping New York businesses meet their transparency obligations is essential — and we're proud to support your firm with a platform built for accuracy, efficiency, and trust.</p>
      
      <p>Warm regards,<br>
      <strong>NYLTA Bulk Compliance Division</strong><br>
      NYLTA.com™</p>
    </div>
    
    <div class="footer">
      <p>NYLTA.com™ is operated by New Way Enterprise LLC and is not affiliated with the New York Department of State or any government agency.</p>
    </div>
  </div>
</body>
</html>
  `;

  const emailText = `
Congratulations, ${firstName} — your NYLTA Bulk Filing Account is approved.

We're pleased to welcome ${firmName} to the NYLTA.com™ Bulk Filing Program, designed exclusively for accountants, attorneys, and compliance professionals managing NYLTA filings at scale.

🔐 Your Login Credentials:

Username: ${username}
Temporary Password: ${temporaryPassword}

⚠️ IMPORTANT: You will be required to change your password upon first login.

Your professional account has been fully activated and you may now access the Bulk Filing Dashboard to begin preparing and submitting filings on behalf of your clients.

Access your dashboard: ${dashboardLink}

Thank you for partnering with NYLTA.com™.

Warm regards,
NYLTA Bulk Compliance Division
NYLTA.com™
  `;

  try {
    // Log the email since Supabase email might not be configured
    console.log('=== APPROVAL EMAIL ===');
    console.log(`To: ${email}`);
    console.log(`Subject: 🎉 Your NYLTA Bulk Filing Account Is Approved`);
    console.log(`Username: ${username}`);
    console.log(`Temporary Password: ${temporaryPassword}`);
    console.log(`Dashboard Link: ${dashboardLink}`);
    console.log('======================');
    
    // In production, you would integrate with an email service like SendGrid, Resend, etc.
    // For now, we're just logging to console
    
  } catch (error) {
    console.error('Failed to send approval email:', error);
  }
  
  return true;
}

// Health check endpoint
app.get("/make-server-2c01e603/health", (c) => {
  return c.json({ status: "ok" });
});

// Database audit health check - TEST ENDPOINT
app.get("/make-server-2c01e603/admin/database-audit-test", (c) => {
  return c.json({ 
    status: "ok", 
    message: "Database audit endpoint is reachable",
    timestamp: new Date().toISOString()
  });
});

// ===========================
// ACCOUNT MANAGEMENT ROUTES
// ===========================

/**
 * Sign up a new user account
 * Creates both Supabase auth user and stores firm information in KV store
 */
app.post("/make-server-2c01e603/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { 
      email, 
      password, 
      firmName, 
      firstName,
      lastName,
      phone, 
      role,
      country,
      professionalType,
      smsConsent,
      emailMarketingConsent,
      // HighLevel tracking data
      highLevelContactId,
      highLevelTags,
      highLevelSyncStatus,
      highLevelSyncError
    } = body;

    // Validate required fields
    if (!email || !password || !firmName || !firstName || !role) {
      return c.json({ 
        error: 'Missing required fields: email, password, firmName, firstName, role' 
      }, 400);
    }

    // Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        firmName,
        firstName,
        lastName,
        phone,
        role // 'cpa', 'attorney', 'compliance', 'processor', 'admin'
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (authError) {
      console.log(`Error creating auth user during signup: ${authError.message}`);
      return c.json({ error: authError.message }, 400);
    }

    const userId = authData.user?.id;
    if (!userId) {
      return c.json({ error: 'Failed to create user account' }, 500);
    }

    // Store account data in KV store (save everything except password)
    const accountData = {
      userId,
      email,
      firmName,
      firstName,
      lastName,
      phone,
      role,
      country: country || '',
      professionalType: professionalType || role,
      smsConsent: smsConsent || false,
      emailMarketingConsent: emailMarketingConsent || false,
      status: 'pending', // 'pending', 'approved', 'rejected'
      isFirstLogin: true,
      firmProfileCompleted: false, // Will be set to true when firm profile is completed
      workers: [], // Will be filled during first-time wizard
      // HighLevel CRM Integration tracking
      highLevelContactId: highLevelContactId || null,
      highLevelTags: highLevelTags || [],
      highLevelSyncStatus: highLevelSyncStatus || 'pending',
      highLevelSyncError: highLevelSyncError || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`account:${userId}`, accountData);
    await kv.set(`account:email:${email}`, userId); // Email lookup index

    console.log(`Successfully created account for user ${userId} (${firstName} ${lastName}) with email ${email}`);
    if (highLevelContactId) {
      console.log(`✅ HighLevel contact ID saved: ${highLevelContactId}`);
    } else {
      console.log(`⚠️ HighLevel contact creation failed: ${highLevelSyncError || 'Unknown error'}`);
    }

    return c.json({ 
      success: true, 
      userId,
      message: 'Account created successfully. Awaiting admin approval.' 
    });

  } catch (error) {
    console.log(`Unexpected error during signup: ${error}`);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

/**
 * Sign in an existing user
 * This is handled by Supabase client-side, but we provide this endpoint for reference
 */
app.post("/make-server-2c01e603/signin", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Note: Actual sign-in should be done client-side using Supabase client
    // This endpoint is for server-side validation if needed
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Sign-in error for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 401);
    }

    return c.json({ 
      success: true,
      session: data.session,
      user: data.user
    });

  } catch (error) {
    console.log(`Unexpected error during signin: ${error}`);
    return c.json({ error: 'Internal server error during signin' }, 500);
  }
});

/**
 * Get user account information
 * Requires authentication
 */
app.get("/make-server-2c01e603/account", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      console.log(`Authorization error while getting account: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Retrieve account data from KV store
    const accountData = await kv.get(`account:${user.id}`);
    
    if (!accountData) {
      return c.json({ error: 'Account data not found' }, 404);
    }

    return c.json({ success: true, account: accountData });

  } catch (error) {
    console.log(`Error retrieving account information: ${error}`);
    return c.json({ error: 'Internal server error while retrieving account' }, 500);
  }
});

/**
 * Update user account information (for first-time wizard and profile updates)
 * Requires authentication
 */
app.put("/make-server-2c01e603/account", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      console.log(`Authorization error while updating account: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const updates = await c.req.json();
    
    // Retrieve existing account data
    const existingAccount = await kv.get(`account:${user.id}`);
    
    if (!existingAccount) {
      return c.json({ error: 'Account not found' }, 404);
    }

    // Merge updates with existing data
    const updatedAccount = {
      ...existingAccount,
      ...updates,
      userId: user.id, // Prevent userId from being changed
      updatedAt: new Date().toISOString()
    };

    await kv.set(`account:${user.id}`, updatedAccount);

    console.log(`Successfully updated account for user ${user.id}`);

    return c.json({ success: true, account: updatedAccount });

  } catch (error) {
    console.log(`Error updating account: ${error}`);
    return c.json({ error: 'Internal server error while updating account' }, 500);
  }
});

/**
 * Get all pending accounts (Admin only)
 * Requires admin authentication
 */
app.get("/make-server-2c01e603/admin/accounts/pending", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const accountData = await kv.get(`account:${user.id}`);
    if (!accountData || accountData.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    // Get all accounts with pending status
    const allAccounts = await kv.getByPrefix('account:');
    const pendingAccounts = allAccounts
      .filter(account => 
        typeof account === 'object' && 
        account !== null && 
        account.status === 'pending' &&
        account.userId // Only accounts with userId (not email index entries)
      )
      .map(account => ({
        ...account,
        contactName: `${account.firstName || ''} ${account.lastName || ''}`.trim()
      }));

    return c.json({ success: true, accounts: pendingAccounts });

  } catch (error) {
    console.log(`Error retrieving pending accounts: ${error}`);
    return c.json({ error: 'Internal server error while retrieving pending accounts' }, 500);
  }
});

/**
 * Delete account request (Admin only)
 * Requires admin authentication
 */
app.delete("/make-server-2c01e603/admin/accounts/:userId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const targetUserId = c.req.param('userId');

    // Get target account to verify it exists
    const targetAccount = await kv.get(`account:${targetUserId}`);
    if (!targetAccount) {
      return c.json({ error: 'Account not found' }, 404);
    }

    // Delete the Supabase auth user first
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(targetUserId);
    if (deleteAuthError) {
      console.log(`Warning: Could not delete Supabase auth user ${targetUserId}: ${deleteAuthError.message}`);
      // Continue with deletion even if auth user deletion fails
    }

    // Delete the account from KV store
    await kv.del(`account:${targetUserId}`);

    // Also delete email index if it exists
    if (targetAccount.email) {
      await kv.del(`account:email:${targetAccount.email}`);
    }

    console.log(`Account deleted for user ${targetUserId} (${targetAccount.email}). User can now create a new account with this email.`);

    return c.json({ success: true, message: 'Account deleted successfully' });

  } catch (error) {
    console.log(`Error deleting account: ${error}`);
    return c.json({ error: 'Internal server error while deleting account' }, 500);
  }
});

/**
 * Freeze an account (Admin only)
 * Requires admin authentication
 */
app.post("/make-server-2c01e603/admin/accounts/:userId/freeze", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const targetUserId = c.req.param('userId');

    // Get target account to verify it exists
    const targetAccount = await kv.get(`account:${targetUserId}`);
    if (!targetAccount) {
      return c.json({ error: 'Account not found' }, 404);
    }

    // Update account to frozen status
    targetAccount.isFrozen = true;
    targetAccount.updatedAt = new Date().toISOString();
    await kv.set(`account:${targetUserId}`, targetAccount);

    console.log(`Account frozen for user ${targetUserId} (${targetAccount.email})`);

    return c.json({ 
      success: true, 
      message: 'Account has been frozen',
      account: targetAccount
    });

  } catch (error) {
    console.log(`Error freezing account: ${error}`);
    return c.json({ error: 'Internal server error while freezing account' }, 500);
  }
});

/**
 * Unfreeze an account (Admin only)
 * Requires admin authentication
 */
app.post("/make-server-2c01e603/admin/accounts/:userId/unfreeze", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const targetUserId = c.req.param('userId');

    // Get target account to verify it exists
    const targetAccount = await kv.get(`account:${targetUserId}`);
    if (!targetAccount) {
      return c.json({ error: 'Account not found' }, 404);
    }

    // Update account to unfrozen status
    targetAccount.isFrozen = false;
    targetAccount.updatedAt = new Date().toISOString();
    await kv.set(`account:${targetUserId}`, targetAccount);

    console.log(`Account unfrozen for user ${targetUserId} (${targetAccount.email})`);

    return c.json({ 
      success: true, 
      message: 'Account has been unfrozen',
      account: targetAccount
    });

  } catch (error) {
    console.log(`Error unfreezing account: ${error}`);
    return c.json({ error: 'Internal server error while unfreezing account' }, 500);
  }
});

/**
 * Approve an account (Admin only)
 * Requires admin authentication
 */
app.post("/make-server-2c01e603/admin/accounts/:userId/approve", async (c) => {
  try {
    console.log('=== APPROVE ACCOUNT REQUEST ===');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      console.log('Error: No authorization token provided');
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    console.log('Verifying admin user...');
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      console.log('Error: Unauthorized', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    console.log('Admin user verified:', user.id);

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      console.log('Error: User is not admin. Role:', adminAccount?.role);
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    console.log('Admin role confirmed');

    const targetUserId = c.req.param('userId');
    console.log('Target user ID:', targetUserId);

    // Get target account
    const targetAccount = await kv.get(`account:${targetUserId}`);
    if (!targetAccount) {
      console.log('Error: Target account not found');
      return c.json({ error: 'Account not found' }, 404);
    }

    console.log('Target account found:', targetAccount.email);

    // Generate temporary password (username is the user's email)
    const generateTemporaryPassword = () => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
      let password = "";
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };

    const username = targetAccount.email; // Username is their email
    const temporaryPassword = generateTemporaryPassword();

    console.log('Generated credentials for:', username);

    // Update account status and add credentials
    targetAccount.status = 'approved';
    targetAccount.updatedAt = new Date().toISOString();
    targetAccount.username = username;
    targetAccount.temporaryPassword = temporaryPassword;
    
    // Reset first login and profile completion flags
    // User hasn't logged in with new credentials yet, and profile is not complete
    targetAccount.isFirstLogin = true; // Will be set to false after they complete first-time wizard
    targetAccount.firmProfileCompleted = false; // Will be set to true when they complete firm profile
    
    // Initialize workers array with credentials
    targetAccount.workers = [{
      username,
      temporaryPassword,
      sentDate: new Date().toISOString()
    }];

    console.log('Saving updated account...');
    // Save updated account
    await kv.set(`account:${targetUserId}`, targetAccount);

    console.log(`Account approved for user ${targetUserId} with username: ${username}`);

    // Update HighLevel contact with approval tag to trigger workflow
    if (targetAccount.highLevelContactId) {
      console.log('🔄 Updating HighLevel contact with approval tag...');
      console.log('🔄 HighLevel Contact ID:', targetAccount.highLevelContactId);
      console.log('🔄 Location ID: fXXJzwVf8OtANDf2M4VP');
      
      try {
        // Add bulk_status_active tag to trigger workflow (Version 2021-07-28)
        const addHighLevelTag = async (contactId: string) => {
          const HIGHLEVEL_API_BASE = 'https://services.leadconnectorhq.com';
          const HIGHLEVEL_API_KEY = Deno.env.get('VITE_HIGHLEVEL_API_KEY') || 'pit-cca7bd65-1fe1-4754-88d7-a51883d631f2';
          const HIGHLEVEL_LOCATION_ID = Deno.env.get('VITE_HIGHLEVEL_LOCATION_ID') || 'fXXJzwVf8OtANDf2M4VP';
          
          const startTime = Date.now();
          let responseStatus = 0;
          let responseBody = '';
          let success = false;
          let errorMessage = '';
          
          try {
            // First, fetch existing contact to get current tags
            console.log('📤 Fetching existing contact tags...');
            const getResponse = await fetch(`${HIGHLEVEL_API_BASE}/contacts/${contactId}?locationId=${HIGHLEVEL_LOCATION_ID}`, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
                'Version': '2021-07-28'
              }
            });

            if (!getResponse.ok) {
              const errorText = await getResponse.text();
              console.error('❌ Failed to fetch contact for tag update:', getResponse.status, errorText);
              errorMessage = errorText;
              responseStatus = getResponse.status;
              responseBody = errorText;
              return false;
            }

            const contactData = await getResponse.json();
            const existingTags = contactData.contact?.tags || [];
            
            console.log('📋 Existing tags:', existingTags);
            
            // Merge existing tags with new tag (avoid duplicates)
            const mergedTags = [...new Set([...existingTags, 'bulk_status_active'])];
            
            console.log('📋 Merged tags (with bulk_status_active):', mergedTags);

            const requestBody = { tags: mergedTags };
            const url = `${HIGHLEVEL_API_BASE}/contacts/${contactId}?locationId=${HIGHLEVEL_LOCATION_ID}`;
            
            console.log('📤 HighLevel API Call Details:');
            console.log('   URL:', url);
            console.log('   Method: PUT');
            console.log('   Contact ID:', contactId);
            console.log('   Adding tag: bulk_status_active');
            console.log('📤 Request Body:', JSON.stringify(requestBody, null, 2));
            
            const response = await fetch(url, {
              method: 'PUT',
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
                'Content-Type': 'application/json',
                'Version': '2021-07-28'
              },
              body: JSON.stringify(requestBody)
            });
            
            responseStatus = response.status;
            console.log('📥 HighLevel PUT response status:', response.status, response.statusText);
            
            if (!response.ok) {
              const errorText = await response.text();
              console.error('❌ HighLevel PUT error response:', errorText);
              errorMessage = errorText;
              responseBody = errorText;
              success = false;
            } else {
              const responseText = await response.text();
              console.log('📥 HighLevel PUT response:', responseText);
              responseBody = responseText;
              success = true;
            }
          } catch (fetchError: any) {
            console.error('❌ HighLevel API fetch error:', fetchError);
            errorMessage = fetchError?.message || String(fetchError);
            success = false;
          }
          
          // Save audit log
          await saveAuditLog({
            timestamp: new Date().toISOString(),
            action: 'ACCOUNT_APPROVAL_TAG_UPDATE',
            contactId,
            userId: targetUserId,
            firmName: targetAccount.firmName,
            email: targetAccount.email,
            success,
            requestBody: { tag: 'bulk_status_active' },
            responseStatus,
            responseBody,
            errorMessage,
            metadata: {
              username,
              approvedBy: user.id,
              duration: Date.now() - startTime
            }
          });
          
          return success;
        };
        
        const updateSuccess = await addHighLevelTag(targetAccount.highLevelContactId);
        
        if (updateSuccess) {
          console.log('✅ HighLevel contact tagged with bulk_status_active (workflow trigger)');
        } else {
          console.warn('⚠️ Failed to update HighLevel contact tag (non-critical)');
        }
      } catch (hlError) {
        console.warn('⚠️ HighLevel update error (non-critical):', hlError);
        
        // Log the error
        await saveAuditLog({
          timestamp: new Date().toISOString(),
          action: 'ACCOUNT_APPROVAL_TAG_UPDATE',
          contactId: targetAccount.highLevelContactId,
          userId: targetUserId,
          firmName: targetAccount.firmName,
          email: targetAccount.email,
          success: false,
          errorMessage: hlError?.message || String(hlError),
          metadata: {
            username,
            approvedBy: user.id
          }
        });
      }
    } else {
      console.log('⚠️ No HighLevel contact ID found for this account - skipping HighLevel update');
    }

    // Send approval email
    const firstName = targetAccount.firstName || targetAccount.contactName?.split(' ')[0] || 'User';
    const firmName = targetAccount.firmName;
    const email = targetAccount.email;
    
    console.log('Sending approval email...');
    await sendApprovalEmail(email, firstName, firmName, username, temporaryPassword);

    console.log('Approval successful!');
    return c.json({ success: true, account: targetAccount, credentials: { username, temporaryPassword } });

  } catch (error) {
    console.log(`Error approving account: ${error}`);
    console.error('Full error:', error);
    return c.json({ error: 'Internal server error while approving account', details: String(error) }, 500);
  }
});

/**
 * Reject an account (Admin only)
 * Requires admin authentication
 */
app.post("/make-server-2c01e603/admin/accounts/:userId/reject", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const targetUserId = c.req.param('userId');
    const body = await c.req.json();
    const { rejectionReason } = body;

    if (!rejectionReason || !rejectionReason.trim()) {
      return c.json({ error: 'Rejection reason is required' }, 400);
    }

    // Get target account
    const targetAccount = await kv.get(`account:${targetUserId}`);
    if (!targetAccount) {
      return c.json({ error: 'Account not found' }, 404);
    }

    // Update account status
    targetAccount.status = 'rejected';
    targetAccount.rejectionReason = rejectionReason;
    targetAccount.updatedAt = new Date().toISOString();

    // Save updated account
    await kv.set(`account:${targetUserId}`, targetAccount);

    console.log(`Account rejected for user ${targetUserId}`);

    // TODO: Send rejection email
    console.log(`Rejection email would be sent to ${targetAccount.email} with reason: ${rejectionReason}`);

    return c.json({ success: true, account: targetAccount });

  } catch (error) {
    console.log(`Error rejecting account: ${error}`);
    return c.json({ error: 'Internal server error while rejecting account' }, 500);
  }
});

/**
 * Reset password for an account (Admin only)
 * Requires admin authentication
 */
app.post("/make-server-2c01e603/admin/accounts/:userId/reset-password", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const targetUserId = c.req.param('userId');

    // Get target account
    const targetAccount = await kv.get(`account:${targetUserId}`);
    if (!targetAccount) {
      return c.json({ error: 'Account not found' }, 404);
    }

    // Generate new temporary password
    const generateTemporaryPassword = () => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
      let password = "";
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };

    const temporaryPassword = generateTemporaryPassword();
    const username = targetAccount.username || targetAccount.workers?.[0]?.username;

    if (!username) {
      return c.json({ error: 'Account does not have a username' }, 400);
    }

    // Update account with new password
    targetAccount.temporaryPassword = temporaryPassword;
    targetAccount.updatedAt = new Date().toISOString();
    
    // Update workers array
    if (targetAccount.workers && targetAccount.workers[0]) {
      targetAccount.workers[0].temporaryPassword = temporaryPassword;
      targetAccount.workers[0].sentDate = new Date().toISOString();
    } else {
      targetAccount.workers = [{
        username,
        temporaryPassword,
        sentDate: new Date().toISOString()
      }];
    }

    // Save updated account
    await kv.set(`account:${targetUserId}`, targetAccount);

    console.log(`Password reset for user ${targetUserId}`);

    // TODO: Send password reset email
    console.log(`Password reset email would be sent to ${targetAccount.email}`);

    return c.json({ 
      success: true, 
      credentials: { 
        username, 
        temporaryPassword 
      } 
    });

  } catch (error) {
    console.log(`Error resetting password: ${error}`);
    return c.json({ error: 'Internal server error while resetting password' }, 500);
  }
});

/**
 * Get all accounts (Admin only) - for account management dashboard
 * Requires admin authentication
 */
app.get("/make-server-2c01e603/admin/accounts", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const accountData = await kv.get(`account:${user.id}`);
    if (!accountData || accountData.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    // Get all accounts
    const allAccounts = await kv.getByPrefix('account:');
    const accounts = allAccounts
      .filter(account => 
        typeof account === 'object' && 
        account !== null && 
        account.userId // Only actual account objects, not email index entries
      )
      .map(account => ({
        ...account,
        contactName: `${account.firstName || ''} ${account.lastName || ''}`.trim()
      }));

    return c.json({ success: true, accounts });

  } catch (error) {
    console.log(`Error retrieving all accounts: ${error}`);
    return c.json({ error: 'Internal server error while retrieving accounts' }, 500);
  }
});

/**
 * Change account status (Admin only)
 * Requires admin authentication
 */
app.post("/make-server-2c01e603/admin/accounts/:userId/change-status", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const targetUserId = c.req.param('userId');
    const body = await c.req.json();
    const { status } = body;

    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return c.json({ error: 'Invalid status value' }, 400);
    }

    // Get target account
    const targetAccount = await kv.get(`account:${targetUserId}`);
    if (!targetAccount) {
      return c.json({ error: 'Account not found' }, 404);
    }

    // Update account status
    targetAccount.status = status;
    targetAccount.updatedAt = new Date().toISOString();

    // Save updated account
    await kv.set(`account:${targetUserId}`, targetAccount);

    console.log(`Account status changed to ${status} for user ${targetUserId}`);

    return c.json({ success: true, account: targetAccount });

  } catch (error) {
    console.log(`Error changing account status: ${error}`);
    return c.json({ error: 'Internal server error while changing account status' }, 500);
  }
});

/**
 * CREATE ADMIN ACCOUNT (One-time setup endpoint)
 * This endpoint creates the first admin account
 * In production, you would protect this endpoint or remove it after first use
 */
app.post("/make-server-2c01e603/setup/create-admin", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, firmName, contactName } = body;

    // Validate required fields
    if (!email || !password || !firmName || !contactName) {
      return c.json({ 
        error: 'Missing required fields: email, password, firmName, contactName' 
      }, 400);
    }

    // Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        firmName,
        contactName,
        role: 'admin'
      },
      email_confirm: true
    });

    if (authError) {
      console.log(`Error creating admin user: ${authError.message}`);
      return c.json({ error: authError.message }, 400);
    }

    const userId = authData.user?.id;
    if (!userId) {
      return c.json({ error: 'Failed to create admin user' }, 500);
    }

    // Store admin account data in KV store
    const accountData = {
      userId,
      email,
      firmName,
      contactName,
      phone: '',
      role: 'admin',
      status: 'approved', // Admin is auto-approved
      isFirstLogin: false,
      workers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`account:${userId}`, accountData);
    await kv.set(`account:email:${email}`, userId);

    console.log(`✅ Successfully created ADMIN account for ${email} (User ID: ${userId})`);

    return c.json({ 
      success: true, 
      userId,
      email,
      message: 'Admin account created successfully. You can now login with these credentials.',
      loginUrl: `${Deno.env.get('SUPABASE_URL')}/bulk-filing`
    });

  } catch (error) {
    console.log(`Unexpected error during admin creation: ${error}`);
    return c.json({ error: 'Internal server error during admin creation' }, 500);
  }
});

/**
 * Delete account by email (Admin only - for cleanup/testing)
 * Requires admin authentication
 */
app.delete("/make-server-2c01e603/admin/accounts/by-email/:email", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const email = decodeURIComponent(c.req.param('email'));

    console.log(`🗑️ Admin cleanup request for email: ${email}`);

    // Look up user ID by email
    const userId = await kv.get(`account:email:${email}`);
    
    if (!userId) {
      console.log(`No account found in KV store for email: ${email}`);
      
      // Still try to delete from Supabase auth in case it exists there
      try {
        // List all Supabase users to find by email
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        
        if (!listError && users) {
          const supabaseUser = users.find(u => u.email === email);
          
          if (supabaseUser) {
            console.log(`Found user in Supabase auth: ${supabaseUser.id}`);
            const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(supabaseUser.id);
            
            if (deleteAuthError) {
              console.log(`Error deleting Supabase auth user: ${deleteAuthError.message}`);
            } else {
              console.log(`✅ Deleted Supabase auth user for ${email}`);
              return c.json({ 
                success: true, 
                message: `Deleted Supabase auth user for ${email}`,
                deleted: {
                  supabaseAuth: true,
                  kvStore: false
                }
              });
            }
          }
        }
      } catch (err) {
        console.log(`Error searching Supabase users: ${err}`);
      }
      
      return c.json({ 
        success: false, 
        message: `No account found for ${email}` 
      }, 404);
    }

    // Get the account to confirm
    const targetAccount = await kv.get(`account:${userId}`);
    
    console.log(`Found account in KV store - User ID: ${userId}`);

    // Delete from Supabase auth
    try {
      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(userId);
      if (deleteAuthError) {
        console.log(`Warning: Could not delete Supabase auth user ${userId}: ${deleteAuthError.message}`);
      } else {
        console.log(`✅ Deleted Supabase auth user ${userId}`);
      }
    } catch (err) {
      console.log(`Error deleting from Supabase auth: ${err}`);
    }

    // Delete from KV store
    await kv.del(`account:${userId}`);
    await kv.del(`account:email:${email}`);

    console.log(`✅ Cleaned up all data for ${email}. Email is now available for registration.`);

    return c.json({ 
      success: true, 
      message: `Successfully deleted account for ${email}`,
      deleted: {
        email,
        userId,
        firmName: targetAccount?.firmName,
        supabaseAuth: true,
        kvStore: true
      }
    });

  } catch (error) {
    console.log(`Error deleting account by email: ${error}`);
    return c.json({ error: 'Internal server error while deleting account' }, 500);
  }
});

// ===========================
// BULK FILING SUBMISSION ROUTES
// ===========================

/**
 * Submit bulk filing data to external API
 * This will be called when users complete the payment step
 * Requires authentication
 */
app.post("/make-server-2c01e603/bulk-filing/submit", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const submissionData = await c.req.json();

    // External API configuration
    const EXTERNAL_API_PIT = 'pit-cca7bd65-1fe1-4754-88d7-a51883d631f2';
    const LOCATION_ID = 'fXXJzwVf8OtANDf2M4VP';

    // TODO: Prepare the data format expected by the external API
    const apiPayload = {
      locationId: LOCATION_ID,
      pit: EXTERNAL_API_PIT,
      submissionType: 'bulk_filing',
      submittedBy: user.id,
      submittedAt: new Date().toISOString(),
      ...submissionData
    };

    console.log('Preparing to send bulk filing submission to external API');
    console.log('PIT:', EXTERNAL_API_PIT);
    console.log('Location ID:', LOCATION_ID);
    console.log('Submission data:', JSON.stringify(apiPayload, null, 2));

    // TODO: Uncomment when external API endpoint is known
    // const response = await fetch('EXTERNAL_API_ENDPOINT_URL', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer YOUR_API_KEY_HERE' // If needed
    //   },
    //   body: JSON.stringify(apiPayload)
    // });
    //
    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(`External API error: ${error.message}`);
    // }
    //
    // const result = await response.json();

    // For now, just log and return success
    console.log('✅ Bulk filing data ready for external API submission');

    return c.json({ 
      success: true,
      message: 'Bulk filing submission prepared (external API integration pending)',
      data: apiPayload
    });

  } catch (error) {
    console.log(`Error submitting bulk filing: ${error}`);
    return c.json({ error: 'Internal server error while submitting bulk filing' }, 500);
  }
});

// Firm Profile Routes
app.get('/make-server-2c01e603/firm-profile', async (c) => {
  try {
    // Try to get user from access token, but fall back to session ID if not authenticated
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    let userId = 'default_user'; // Default for unauthenticated users
    
    if (accessToken && accessToken !== Deno.env.get('SUPABASE_ANON_KEY')) {
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      if (!error && user?.id) {
        userId = user.id;
      }
    }

    // Get firm profile from KV store
    let profile = await kv.get(`firm_profile:${userId}`);
    
    // If profile doesn't exist and user is authenticated with approved account,
    // auto-generate initial profile from signup data
    if (!profile && userId !== 'default_user') {
      const accountData = await kv.get(`account:${userId}`);
      
      if (accountData && accountData.status === 'approved') {
        console.log(`Auto-generating firm profile for approved user ${userId} from account data`);
        
        // Create auto-generated authorized filer from signup information
        const autoFiler = {
          id: `filer-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          fullName: `${accountData.firstName || ''} ${accountData.lastName || ''}`.trim(),
          email: accountData.email || '',
          title: accountData.professionalType || accountData.role || '',
          role: "Authorized Filer",
          status: "Active"
        };
        
        // Create initial profile with signup data
        profile = {
          firmName: accountData.firmName || '',
          ein: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States',
          contactEmail: accountData.email || '',
          phone: accountData.phone || '',
          authorizedFilers: [autoFiler],
          isComplete: false,
          isLocked: false,
          userId: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Save the auto-generated profile
        await kv.set(`firm_profile:${userId}`, profile);
        console.log(`Auto-generated firm profile saved for user ${userId}`);
      }
    }
    
    return c.json({ profile: profile || null });
  } catch (error) {
    console.log(`Error fetching firm profile: ${error}`);
    return c.json({ error: 'Internal server error while fetching firm profile' }, 500);
  }
});

app.post('/make-server-2c01e603/firm-profile', async (c) => {
  try {
    // Try to get user from access token, but fall back to session ID if not authenticated
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    let userId = 'default_user'; // Default for unauthenticated users
    
    console.log('📝 [FIRM PROFILE SAVE] Request received');
    console.log('🔑 Access token present:', !!accessToken);
    
    if (accessToken && accessToken !== Deno.env.get('SUPABASE_ANON_KEY')) {
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      if (!error && user?.id) {
        userId = user.id;
        console.log('✅ User authenticated:', userId);
      } else {
        console.log('⚠️ User authentication failed:', error);
      }
    }

    const body = await c.req.json();
    console.log('📦 Profile data received:', {
      firmName: body.firmName,
      ein: body.ein,
      isComplete: body.isComplete,
      userId: userId
    });
    
    // Get existing profile to check if it's locked
    const existingProfile = await kv.get(`firm_profile:${userId}`);
    console.log('🔍 Existing profile:', existingProfile ? 'Found' : 'Not found');
    
    // Prepare the profile data
    const profileData = {
      ...body,
      userId: userId,
      updatedAt: new Date().toISOString(),
      // If profile already exists and is complete, mark it as locked
      isLocked: existingProfile?.isComplete || body.isComplete,
      isComplete: body.isComplete
    };

    // If this is the first time completing the profile, set createdAt
    if (!existingProfile?.isComplete && body.isComplete) {
      profileData.createdAt = new Date().toISOString();
      console.log('🆕 First time completing profile - setting createdAt');
    } else if (existingProfile?.createdAt) {
      profileData.createdAt = existingProfile.createdAt;
    }

    // Save to KV store
    await kv.set(`firm_profile:${userId}`, profileData);
    console.log('💾 Firm profile saved to database successfully');
    
    console.log(`✅ Firm profile saved successfully for user ${userId}:`, {
      isComplete: profileData.isComplete,
      isLocked: profileData.isLocked,
      firmName: profileData.firmName
    });
    
    // If profile is complete, update account firmProfileCompleted flag
    if (body.isComplete && userId !== 'default_user') {
      const accountData = await kv.get(`account:${userId}`);
      
      if (accountData && !accountData.firmProfileCompleted) {
        console.log('📝 Marking firm profile as completed in account data...');
        accountData.firmProfileCompleted = true;
        accountData.updatedAt = new Date().toISOString();
        await kv.set(`account:${userId}`, accountData);
        
        // Update HighLevel contact
        if (accountData.highLevelContactId) {
          console.log('🔄 Updating HighLevel contact with firm_profile_completed = true...');
          
          try {
            const updateHighLevelContact = async (contactId: string, updates: any) => {
              const HIGHLEVEL_API_BASE = 'https://services.leadconnectorhq.com';
              const HIGHLEVEL_API_KEY = Deno.env.get('VITE_HIGHLEVEL_API_KEY') || 'pit-cca7bd65-1fe1-4754-88d7-a51883d631f2';
              const HIGHLEVEL_LOCATION_ID = Deno.env.get('VITE_HIGHLEVEL_LOCATION_ID') || 'fXXJzwVf8OtANDf2M4VP';
              
              const response = await fetch(`${HIGHLEVEL_API_BASE}/contacts/${contactId}?locationId=${HIGHLEVEL_LOCATION_ID}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
                  'Content-Type': 'application/json',
                  'Version': '2021-07-28'
                },
                body: JSON.stringify(updates)
              });
              
              return response.ok;
            };
            
            const updateSuccess = await updateHighLevelContact(accountData.highLevelContactId, {
              customFields: {
                firm_profile_completed: 'true'
              }
            });
            
            if (updateSuccess) {
              console.log('✅ HighLevel contact updated with firm_profile_completed = true');
            } else {
              console.warn('⚠️ Failed to update HighLevel contact (non-critical)');
            }
          } catch (hlError) {
            console.warn('⚠️ HighLevel update error (non-critical):', hlError);
          }
        }
      }
    }
    
    return c.json({ 
      success: true, 
      profile: profileData,
      message: 'Firm profile saved successfully'
    });
  } catch (error) {
    console.log(`Error saving firm profile: ${error}`);
    return c.json({ error: 'Internal server error while saving firm profile' }, 500);
  }
});

app.post('/make-server-2c01e603/firm-profile/change-request', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) {
      console.log(`Authorization error while submitting change request: ${error}`);
      return c.json({ error: 'Unauthorized: Invalid access token' }, 401);
    }

    const { field, currentValue, reason } = await c.req.json();
    
    // Create change request
    const changeRequest = {
      id: `change_request:${user.id}:${Date.now()}`,
      userId: user.id,
      field,
      currentValue,
      reason,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    // Save to KV store
    await kv.set(changeRequest.id, changeRequest);
    
    // Also add to user's change requests list
    const userChangeRequests = await kv.get(`change_requests:${user.id}`) || [];
    userChangeRequests.push(changeRequest.id);
    await kv.set(`change_requests:${user.id}`, userChangeRequests);
    
    return c.json({ 
      success: true, 
      changeRequest,
      message: 'Change request submitted successfully'
    });
  } catch (error) {
    console.log(`Error submitting change request: ${error}`);
    return c.json({ error: 'Internal server error while submitting change request' }, 500);
  }
});

// Admin route to get all firm profiles (for debugging)
app.get('/make-server-2c01e603/admin/firm-profiles', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) {
      console.log(`Authorization error while fetching firm profiles: ${error}`);
      return c.json({ error: 'Unauthorized: Invalid access token' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    // Get all firm profiles using prefix search
    const allFirmProfiles = await kv.getByPrefix('firm_profile:');
    
    console.log(`📊 Admin retrieved ${allFirmProfiles?.length || 0} firm profiles from database`);
    
    return c.json({ 
      firmProfiles: allFirmProfiles || [],
      count: allFirmProfiles?.length || 0
    });
  } catch (error) {
    console.log(`Error fetching firm profiles: ${error}`);
    return c.json({ error: 'Internal server error while fetching firm profiles' }, 500);
  }
});

// Admin route to get all change requests
app.get('/make-server-2c01e603/admin/change-requests', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) {
      console.log(`Authorization error while fetching change requests: ${error}`);
      return c.json({ error: 'Unauthorized: Invalid access token' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    // Get all change requests using prefix search
    const allChangeRequests = await kv.getByPrefix('change_request:');
    
    return c.json({ changeRequests: allChangeRequests || [] });
  } catch (error) {
    console.log(`Error fetching change requests: ${error}`);
    return c.json({ error: 'Internal server error while fetching change requests' }, 500);
  }
});

app.post('/make-server-2c01e603/admin/change-requests/:requestId/approve', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) {
      console.log(`Authorization error while approving change request: ${error}`);
      return c.json({ error: 'Unauthorized: Invalid access token' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const requestId = c.req.param('requestId');
    const { newValue } = await c.req.json();
    
    // Get the change request
    const changeRequest = await kv.get(requestId);
    if (!changeRequest) {
      return c.json({ error: 'Change request not found' }, 404);
    }

    // Update the firm profile
    const profile = await kv.get(`firm_profile:${changeRequest.userId}`);
    if (profile) {
      profile[changeRequest.field] = newValue;
      profile.updatedAt = new Date().toISOString();
      await kv.set(`firm_profile:${changeRequest.userId}`, profile);
    }

    // Update change request status
    changeRequest.status = 'Approved';
    changeRequest.approvedAt = new Date().toISOString();
    changeRequest.approvedBy = user.id;
    changeRequest.newValue = newValue;
    await kv.set(requestId, changeRequest);
    
    return c.json({ 
      success: true, 
      message: 'Change request approved and profile updated'
    });
  } catch (error) {
    console.log(`Error approving change request: ${error}`);
    return c.json({ error: 'Internal server error while approving change request' }, 500);
  }
});

app.post('/make-server-2c01e603/admin/change-requests/:requestId/deny', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) {
      console.log(`Authorization error while denying change request: ${error}`);
      return c.json({ error: 'Unauthorized: Invalid access token' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const requestId = c.req.param('requestId');
    const { reason } = await c.req.json();
    
    // Get the change request
    const changeRequest = await kv.get(requestId);
    if (!changeRequest) {
      return c.json({ error: 'Change request not found' }, 404);
    }

    // Update change request status
    changeRequest.status = 'Denied';
    changeRequest.deniedAt = new Date().toISOString();
    changeRequest.deniedBy = user.id;
    changeRequest.denialReason = reason;
    await kv.set(requestId, changeRequest);
    
    return c.json({ 
      success: true, 
      message: 'Change request denied'
    });
  } catch (error) {
    console.log(`Error denying change request: ${error}`);
    return c.json({ error: 'Internal server error while denying change request' }, 500);
  }
});

/**
 * POST /audit/highlevel
 * Save HighLevel audit log (from frontend)
 * No authentication required - this is for logging only
 */
app.post('/make-server-2c01e603/audit/highlevel', async (c) => {
  try {
    const logData = await c.req.json();
    
    await saveAuditLog(logData);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving audit log:', error);
    return c.json({ error: 'Failed to save audit log' }, 500);
  }
});

/**
 * GET /admin/audit-logs
 * Get HighLevel audit logs (Admin only - for Ryan)
 * Requires admin authentication
 */
app.get('/make-server-2c01e603/admin/audit-logs', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    // Get all audit logs (using getByPrefix to get all audit:highlevel: entries)
    const auditLogs = await kv.getByPrefix('audit:highlevel:');
    
    // Sort by timestamp (newest first)
    const sortedLogs = auditLogs.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeB - timeA;
    });

    return c.json({ 
      success: true, 
      logs: sortedLogs,
      total: sortedLogs.length 
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return c.json({ error: 'Failed to fetch audit logs' }, 500);
  }
});

// ========================
// SURVEY ENDPOINTS
// ========================

// Get survey completion status
app.get('/make-server-2c01e603/survey', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) {
      console.log(`Authorization error while fetching survey: ${error}`);
      return c.json({ error: 'Unauthorized: Invalid access token' }, 401);
    }

    const userId = user.id;
    const survey = await kv.get(`survey:${userId}`);
    
    return c.json({ 
      survey: survey || null,
      isComplete: !!survey 
    });
  } catch (error) {
    console.log(`Error fetching survey: ${error}`);
    return c.json({ error: 'Internal server error while fetching survey' }, 500);
  }
});

// Submit survey
app.post('/make-server-2c01e603/survey', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized: No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) {
      console.log(`Authorization error while submitting survey: ${error}`);
      return c.json({ error: 'Unauthorized: Invalid access token' }, 401);
    }

    const userId = user.id;
    const body = await c.req.json();
    
    const surveyData = {
      ...body,
      userId: userId,
      completedAt: new Date().toISOString()
    };
    
    // Save survey
    await kv.set(`survey:${userId}`, surveyData);
    console.log(`Survey saved for user ${userId}`);
    
    return c.json({ 
      success: true, 
      survey: surveyData,
      message: 'Survey submitted successfully'
    });
  } catch (error) {
    console.log(`Error saving survey: ${error}`);
    return c.json({ error: 'Internal server error while saving survey' }, 500);
  }
});

// ========================
// CREDITS SYSTEM (KV STORE)
// ========================

// Get user credits
app.get('/make-server-2c01e603/credits/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const creditsData = await kv.get(`credits:${userId}`) as any;
    
    return c.json({
      availableCredits: creditsData?.availableCredits || 0,
      totalEarned: creditsData?.totalEarned || 0,
      totalUsed: creditsData?.totalUsed || 0,
      lastUpdated: creditsData?.lastUpdated || new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching credits:', error);
    return c.json({ error: 'Internal server error while fetching credits' }, 500);
  }
});

// Get credit history
app.get('/make-server-2c01e603/credits/:userId/history', async (c) => {
  try {
    const userId = c.req.param('userId');
    const transactions = await kv.getByPrefix(`credit_tx:${userId}:`) || [];
    
    // Sort by timestamp descending
    const sortedTransactions = transactions.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    return c.json({ transactions: sortedTransactions });
  } catch (error) {
    console.error('Error fetching credit history:', error);
    return c.json({ error: 'Internal server error while fetching credit history' }, 500);
  }
});

// Add credits
app.post('/make-server-2c01e603/credits/:userId/add', async (c) => {
  try {
    const userId = c.req.param('userId');
    const { amount, type, description, metadata } = await c.req.json();
    
    // Get current credits
    const creditsData = await kv.get(`credits:${userId}`) as any || {
      availableCredits: 0,
      totalEarned: 0,
      totalUsed: 0,
      lastUpdated: new Date().toISOString()
    };
    
    const currentBalance = creditsData.availableCredits;
    const newBalance = currentBalance + amount;
    
    // Update credits
    const updatedCredits = {
      availableCredits: newBalance,
      totalEarned: creditsData.totalEarned + amount,
      totalUsed: creditsData.totalUsed,
      lastUpdated: new Date().toISOString()
    };
    
    await kv.set(`credits:${userId}`, updatedCredits);
    
    // Log transaction
    const transactionId = `credit_tx:${userId}:${Date.now()}:${Math.random().toString(36).substring(7)}`;
    const transaction = {
      id: transactionId,
      userId,
      amount,
      type,
      description,
      relatedSubmissionId: metadata?.relatedSubmissionId,
      createdBy: type === 'admin_adjustment' ? 'admin' : 'system',
      createdAt: new Date().toISOString(),
      metadata: {
        ...metadata,
        previousBalance: currentBalance,
        newBalance
      }
    };
    
    await kv.set(transactionId, transaction);
    
    console.log(`✅ Added ${amount} credits to user ${userId}. New balance: ${newBalance}`);
    
    return c.json({ success: true, newBalance, transaction });
  } catch (error) {
    console.error('Error adding credits:', error);
    return c.json({ error: 'Internal server error while adding credits' }, 500);
  }
});

// Use credits
app.post('/make-server-2c01e603/credits/:userId/use', async (c) => {
  try {
    const userId = c.req.param('userId');
    const { amount, description, submissionId } = await c.req.json();
    
    // Get current credits
    const creditsData = await kv.get(`credits:${userId}`) as any || {
      availableCredits: 0,
      totalEarned: 0,
      totalUsed: 0,
      lastUpdated: new Date().toISOString()
    };
    
    const currentBalance = creditsData.availableCredits;
    
    // Check if user has enough credits
    if (currentBalance < amount) {
      return c.json({ 
        error: 'Insufficient credits', 
        availableCredits: currentBalance,
        requiredCredits: amount 
      }, 400);
    }
    
    const newBalance = currentBalance - amount;
    
    // Update credits
    const updatedCredits = {
      availableCredits: newBalance,
      totalEarned: creditsData.totalEarned,
      totalUsed: creditsData.totalUsed + amount,
      lastUpdated: new Date().toISOString()
    };
    
    await kv.set(`credits:${userId}`, updatedCredits);
    
    // Log transaction
    const transactionId = `credit_tx:${userId}:${Date.now()}:${Math.random().toString(36).substring(7)}`;
    const transaction = {
      id: transactionId,
      userId,
      amount: -amount, // Negative for usage
      type: 'used',
      description,
      relatedSubmissionId: submissionId,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      metadata: {
        previousBalance: currentBalance,
        newBalance
      }
    };
    
    await kv.set(transactionId, transaction);
    
    console.log(`✅ Used ${amount} credits from user ${userId}. New balance: ${newBalance}`);
    
    return c.json({ success: true, newBalance, transaction });
  } catch (error) {
    console.error('Error using credits:', error);
    return c.json({ error: 'Internal server error while using credits' }, 500);
  }
});

// ========================
// HIGHLEVEL CUSTOM FIELDS CREATION
// ========================
app.post('/make-server-2c01e603/highlevel/create-custom-field', async (c) => {
  try {
    const { name, dataType, fieldKey, placeholder } = await c.req.json();
    
    // Hardcoded API key since environment variables aren't working
    const HIGHLEVEL_API_KEY = 'pit-cca7bd65-1fe1-4754-88d7-a51883d631f2';
    const HIGHLEVEL_LOCATION_ID = 'fXXJzwVf8OtANDf2M4VP';
    
    console.log(`🔧 Creating custom field: ${fieldKey}`);
    
    const response = await fetch(
      `https://services.leadconnectorhq.com/locations/${HIGHLEVEL_LOCATION_ID}/customFields`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${HIGHLEVEL_API_KEY}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        },
        body: JSON.stringify({
          name,
          dataType,
          model: 'contact',
          ...(placeholder && { placeholder }),
          ...(fieldKey && { fieldKey })
        })
      }
    );
    
    if (response.ok) {
      const responseData = await response.json();
      console.log(`✅ Created field: ${fieldKey}`, responseData);
      return c.json({ success: true, fieldKey, data: responseData });
    } else {
      const responseText = await response.text();
      console.error(`❌ Failed to create field ${fieldKey} (${response.status}):`, responseText);
      // Return 200 so frontend can parse JSON, but include status in body
      return c.json({ success: false, error: responseText, httpStatus: response.status });
    }
  } catch (error) {
    console.error('❌ Error creating custom field:', error);
    return c.json({ success: false, error: String(error) });
  }
});

// Admin adjust credits
app.post('/make-server-2c01e603/credits/:userId/admin-adjust', async (c) => {
  try {
    const userId = c.req.param('userId');
    const { amount, reason, adminName } = await c.req.json();
    
    // Get current credits
    const creditsData = await kv.get(`credits:${userId}`) as any || {
      availableCredits: 0,
      totalEarned: 0,
      totalUsed: 0,
      lastUpdated: new Date().toISOString()
    };
    
    const currentBalance = creditsData.availableCredits;
    const newBalance = currentBalance + amount; // amount can be positive or negative
    
    // Update credits (allow negative balance for admin adjustments)
    const updatedCredits = {
      availableCredits: newBalance,
      totalEarned: amount > 0 ? creditsData.totalEarned + amount : creditsData.totalEarned,
      totalUsed: amount < 0 ? creditsData.totalUsed + Math.abs(amount) : creditsData.totalUsed,
      lastUpdated: new Date().toISOString()
    };
    
    await kv.set(`credits:${userId}`, updatedCredits);
    
    // Log transaction
    const transactionId = `credit_tx:${userId}:${Date.now()}:${Math.random().toString(36).substring(7)}`;
    const transaction = {
      id: transactionId,
      userId,
      amount,
      type: 'admin_adjustment',
      description: `Admin adjustment: ${reason}`,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      metadata: {
        adminName,
        reason,
        previousBalance: currentBalance,
        newBalance
      }
    };
    
    await kv.set(transactionId, transaction);
    
    console.log(`✅ Admin ${adminName} adjusted credits for user ${userId} by ${amount}. New balance: ${newBalance}`);
    
    return c.json({ success: true, newBalance, transaction });
  } catch (error) {
    console.error('Error adjusting credits:', error);
    return c.json({ error: 'Internal server error while adjusting credits' }, 500);
  }
});

// ========================
// PAYMENT TRACKING ROUTES
// ========================

/**
 * Get user's payment history
 */
app.get("/make-server-2c01e603/payments/my-payments", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      console.log('❌ Fetch payments failed: No authorization token provided');
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      console.log('❌ Fetch payments failed: Unauthorized', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    console.log('📥 Fetching payments for user:', user.id);
    const userPayments = await payments.getUserPayments(user.id);
    console.log('✅ Found', userPayments.length, 'payment records for user:', user.id);

    return c.json({ success: true, payments: userPayments });

  } catch (error) {
    console.error('❌ Error fetching user payments:', error);
    return c.json({ error: 'Internal server error while fetching payments' }, 500);
  }
});

/**
 * Create a payment record
 */
app.post("/make-server-2c01e603/payments", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      console.log('❌ Payment creation failed: No authorization token provided');
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      console.log('❌ Payment creation failed: Unauthorized', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    console.log('📝 Creating payment record for user:', user.id);
    console.log('Payment data:', JSON.stringify(body, null, 2));
    
    const payment = await payments.createPaymentRecord({
      userId: user.id,
      ...body
    });

    console.log('✅ Payment record created successfully:', payment.id, 'for', payment.clientCount, 'clients');
    return c.json({ success: true, payment });

  } catch (error) {
    console.error('❌ Error creating payment record:', error);
    return c.json({ error: 'Internal server error while creating payment' }, 500);
  }
});

/**
 * Create upgrade payment (monitoring -> filing)
 */
app.post("/make-server-2c01e603/payments/upgrade", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { originalPaymentId, ...newPaymentData } = body;

    // Verify the original payment belongs to this user
    const originalPayment = await payments.getPaymentRecord(originalPaymentId);
    if (!originalPayment || originalPayment.userId !== user.id) {
      return c.json({ error: 'Original payment not found or unauthorized' }, 404);
    }

    const upgradePayment = await payments.createUpgradePayment(originalPaymentId, {
      ...newPaymentData,
      userId: user.id,
    });

    if (!upgradePayment) {
      return c.json({ error: 'Failed to create upgrade payment' }, 400);
    }

    return c.json({ success: true, payment: upgradePayment });

  } catch (error) {
    console.error('Error creating upgrade payment:', error);
    return c.json({ error: 'Internal server error while creating upgrade' }, 500);
  }
});

// ========================
// DATABASE AUDIT ENDPOINTS
// ========================

/**
 * Run comprehensive database audit
 * Admin only
 */
app.get("/make-server-2c01e603/admin/database-audit", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    console.log('🔍 Running comprehensive database audit...');

    // Get ALL keys and values from database directly
    console.log('Attempting to query kv_store_2c01e603 table...');
    const { data: allDataRows, error: dataError } = await supabase
      .from('kv_store_2c01e603')
      .select('key, value');
    
    if (dataError) {
      console.error('❌ Database query error:', dataError);
      return c.json({ 
        error: 'Failed to fetch database data', 
        details: dataError.message,
        hint: dataError.hint,
        code: dataError.code 
      }, 500);
    }

    const allData = allDataRows || [];
    console.log(`✅ Successfully fetched ${allData.length} keys from database`);

    // Define critical data categories
    const categories = [
      { 
        name: 'Firm Accounts', 
        prefix: 'account:', 
        icon: 'Users',
        color: 'bg-blue-600',
        critical: true,
        validator: (item: any) => item.userId && item.email && item.firmName
      },
      { 
        name: 'Email Index', 
        prefix: 'email:', 
        icon: 'Mail',
        color: 'bg-green-600',
        critical: true,
        validator: (item: any) => typeof item === 'string'
      },
      { 
        name: 'Payments', 
        prefix: 'payment:', 
        icon: 'CreditCard',
        color: 'bg-yellow-600',
        critical: true,
        validator: (item: any) => item.submissionNumber && item.amountPaid && item.firmName
      },
      { 
        name: 'Assignments', 
        prefix: 'assignment:', 
        icon: 'FileText',
        color: 'bg-purple-600',
        critical: true,
        validator: (item: any) => item.submissionId && item.employeeId
      },
      { 
        name: 'Employee Assignments', 
        prefix: 'employee_assignments:', 
        icon: 'Users',
        color: 'bg-indigo-600',
        critical: false,
        validator: (item: any) => Array.isArray(item)
      },
      { 
        name: 'Audit Logs', 
        prefix: 'audit:', 
        icon: 'Shield',
        color: 'bg-gray-600',
        critical: false,
        validator: (item: any) => item.timestamp && item.action
      },
      { 
        name: 'Test Data', 
        prefix: 'test:', 
        icon: 'Database',
        color: 'bg-red-600',
        critical: false,
        validator: () => true
      }
    ];

    const warnings: string[] = [];
    const errors: string[] = [];
    const categoryResults = [];

    // Analyze each category
    for (const category of categories) {
      const items = allData.filter(row => row.key.startsWith(category.prefix));
      
      const sampleKeys = items.slice(0, 3).map(row => row.key);
      
      // Validate data integrity
      let validCount = 0;
      let invalidCount = 0;
      
      for (const row of items) {
        try {
          if (category.validator(row.value)) {
            validCount++;
          } else {
            invalidCount++;
            if (category.critical) {
              errors.push(`Invalid ${category.name} data: ${row.key}`);
            } else {
              warnings.push(`Invalid ${category.name} data: ${row.key}`);
            }
          }
        } catch (error) {
          invalidCount++;
          errors.push(`Validation error in ${category.name}: ${row.key}`);
        }
      }

      categoryResults.push({
        name: category.name,
        prefix: category.prefix,
        icon: category.icon,
        color: category.color,
        count: items.length,
        validCount,
        invalidCount,
        sampleKeys,
        critical: category.critical
      });

      // Critical category warnings
      if (category.critical && items.length === 0) {
        warnings.push(`⚠️ No data found for critical category: ${category.name}`);
      }
    }

    // Check for orphaned data
    const knownPrefixes = categories.map(c => c.prefix);
    const orphanedData = allData.filter(row => 
      !knownPrefixes.some(prefix => row.key.startsWith(prefix))
    );

    if (orphanedData.length > 0) {
      warnings.push(`Found ${orphanedData.length} orphaned data records (unknown prefixes)`);
    }

    // Determine overall data integrity
    let dataIntegrity: 'excellent' | 'good' | 'warning' | 'critical';
    if (errors.length > 0) {
      dataIntegrity = 'critical';
    } else if (warnings.length > 5) {
      dataIntegrity = 'warning';
    } else if (warnings.length > 0) {
      dataIntegrity = 'good';
    } else {
      dataIntegrity = 'excellent';
    }

    const audit = {
      totalKeys: allData.length,
      categories: categoryResults,
      warnings,
      errors,
      lastChecked: new Date().toISOString(),
      dataIntegrity
    };

    console.log('✅ Database audit complete:', {
      totalKeys: audit.totalKeys,
      integrity: audit.dataIntegrity,
      errors: errors.length,
      warnings: warnings.length
    });

    return c.json({ success: true, audit });

  } catch (error) {
    console.error('Error running database audit:', error);
    return c.json({ error: 'Internal server error while running audit' }, 500);
  }
});

/**
 * Get detailed data for a specific category
 * Admin only
 */
app.get("/make-server-2c01e603/admin/database-category", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const prefix = c.req.query('prefix');
    if (!prefix) {
      return c.json({ error: 'Prefix parameter required' }, 400);
    }

    // Query database directly with key and value
    const { data: items, error: queryError } = await supabase
      .from('kv_store_2c01e603')
      .select('key, value')
      .like('key', prefix + '%');
    
    if (queryError) {
      console.error('Error fetching category data:', queryError);
      return c.json({ error: 'Failed to fetch category data' }, 500);
    }

    return c.json({ success: true, items: items || [] });

  } catch (error) {
    console.error('Error fetching category data:', error);
    return c.json({ error: 'Internal server error while fetching category' }, 500);
  }
});

/**
 * Export all database data
 * Admin only - CRITICAL for backups
 */
app.get("/make-server-2c01e603/admin/database-export", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    console.log('📦 Exporting entire database...');

    // Get ALL data directly from database
    const { data: allData, error: dataError } = await supabase
      .from('kv_store_2c01e603')
      .select('key, value');
    
    if (dataError) {
      console.error('Error exporting data:', dataError);
      return c.json({ error: 'Failed to export database' }, 500);
    }
    
    const exportData = {
      exportDate: new Date().toISOString(),
      totalRecords: allData?.length || 0,
      exportedBy: {
        userId: user.id,
        email: adminAccount.email,
        name: `${adminAccount.firstName} ${adminAccount.lastName}`
      },
      data: allData || []
    };

    console.log(`✅ Database export complete: ${allData?.length || 0} records`);

    return c.json({ success: true, export: exportData });

  } catch (error) {
    console.error('Error exporting database:', error);
    return c.json({ error: 'Internal server error while exporting database' }, 500);
  }
});

/**
 * Test database persistence (write/read/verify)
 * Admin only
 */
app.post("/make-server-2c01e603/admin/database-test", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const { key, data } = await c.req.json();

    if (!key || !data) {
      return c.json({ error: 'Key and data required' }, 400);
    }

    // Write test data
    await kv.set(key, data);
    console.log(`✅ Test data written: ${key}`);

    return c.json({ success: true, message: 'Test data written successfully' });

  } catch (error) {
    console.error('Error in persistence test (write):', error);
    return c.json({ error: 'Internal server error while writing test data' }, 500);
  }
});

/**
 * Read test data
 * Admin only
 */
app.get("/make-server-2c01e603/admin/database-test", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const key = c.req.query('key');
    if (!key) {
      return c.json({ error: 'Key parameter required' }, 400);
    }

    // Read test data
    const data = await kv.get(key);
    
    if (data === null) {
      return c.json({ error: 'Test data not found' }, 404);
    }

    console.log(`✅ Test data read: ${key}`);

    return c.json({ success: true, data });

  } catch (error) {
    console.error('Error in persistence test (read):', error);
    return c.json({ error: 'Internal server error while reading test data' }, 500);
  }
});

/**
 * Delete test data
 * Admin only
 */
app.delete("/make-server-2c01e603/admin/database-test", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const key = c.req.query('key');
    if (!key) {
      return c.json({ error: 'Key parameter required' }, 400);
    }

    // Delete test data
    await kv.del(key);
    console.log(`✅ Test data deleted: ${key}`);

    return c.json({ success: true, message: 'Test data deleted successfully' });

  } catch (error) {
    console.error('Error in persistence test (delete):', error);
    return c.json({ error: 'Internal server error while deleting test data' }, 500);
  }
});

/**
 * Simple data viewer - Get ALL data from KV store
 * Admin only
 */
app.get("/make-server-2c01e603/admin/simple-data-view", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const adminAccount = await kv.get(`account:${user.id}`);
    if (!adminAccount || adminAccount.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    console.log('📊 Loading all data from KV store...');

    // Get ALL data using kv.getByPrefix with empty string
    const allData = await kv.getByPrefix('');
    
    // Format the data with keys
    const items = allData.map((value, index) => {
      // The value should have a _key property
      const key = value._key || `unknown-${index}`;
      return {
        key,
        value
      };
    });

    console.log(`✅ Loaded ${items.length} records from database`);

    return c.json({ success: true, items, total: items.length });

  } catch (error) {
    console.error('Error loading data:', error);
    return c.json({ error: 'Internal server error while loading data' }, 500);
  }
});

Deno.serve(app.fetch);