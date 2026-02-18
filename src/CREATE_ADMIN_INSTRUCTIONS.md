# 🎯 Create Your Admin Account - QUICK START

## Step 1: Access the Admin Creation Page

Simply add `#create-admin` to your URL:

```
https://your-app-url.com/#create-admin
```

For example, if your app is at `https://myapp.com`, navigate to:
```
https://myapp.com/#create-admin
```

## Step 2: Click the Button

You'll see a simple page with your pre-configured admin credentials:
- **Email:** waroxa@gmail.com
- **Password:** (hidden for security)

Just click the **"Create Admin Account"** button.

## Step 3: Success!

You'll see a success message with your User ID. Then click **"Go to Login Page"** to start using your admin account.

---

## Then Login!

1. Go back to the main page (remove the #create-admin from URL)
2. Click **"LOG IN / CREATE ACCOUNT"**
3. Enter:
   - **Email:** waroxa@gmail.com
   - **Password:** 1nthenameofJesus$$$
4. You're in as admin! 🎉

---

## What Happens Behind the Scenes

✅ Creates a Supabase Auth user with your email/password
✅ Sets role to "admin" (full access)
✅ Status automatically set to "approved" (no approval needed for admin)
✅ Account data stored in KV store
✅ Ready to manage other user accounts immediately

---

## Security Note

After creating your admin account, you should:
1. Remove or protect the `/setup/create-admin` endpoint in production
2. Or add authentication to prevent unauthorized admin account creation

---

**That's it! Your admin account will be created instantly and you can start approving user accounts right away.**
