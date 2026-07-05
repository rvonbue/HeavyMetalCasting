# Authentication System Setup Guide

This guide will help you set up the complete authentication system with social login and email verification.

## What's Been Built

✅ Sign up / Sign in with email & password  
✅ Social login (Google, Facebook, Apple, Discord)  
✅ Email verification (24-hour token expiry)  
✅ Password reset flow  
✅ Role-based access (admin/customer)  
✅ Brevo email integration  

## Prerequisites

- Supabase project (create at https://supabase.com)
- Brevo account with API key (already set up in previous step)
- OAuth provider credentials (Google, Facebook, Apple, Discord)

---

## Step 1: Supabase Setup

### 1.1 Create/Access Supabase Project

If you don't have a Supabase project:
1. Go to https://supabase.com
2. Click "Start your project"
3. Create a new project
4. Wait for provisioning (2-3 minutes)

### 1.2 Get Supabase Keys

1. In Supabase dashboard, go to **Settings → API**
2. Copy:
   - `Project URL` (looks like `https://xxxxx.supabase.co`)
   - `anon` key (public key)
3. Add to `.env`:
   ```
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 1.3 Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open `supabase/migrations/20260705000006_auth_users_and_roles.sql`
4. Copy the entire SQL and paste into the query
5. Click **Run**
6. Confirm the `users` table was created

---

## Step 2: Enable OAuth Providers

### 2.1 Google OAuth

1. Go to **Authentication → Providers**
2. Click **Google**
3. Enable the provider
4. You'll get a "Redirect URL" - save this
5. Go to https://console.cloud.google.com
6. Create a new project
7. Enable "Google+ API"
8. Go to **Credentials → Create Credentials → OAuth 2.0 Client ID**
9. Select "Web application"
10. Add redirect URL from Supabase
11. Copy Client ID and Secret back into Supabase
12. Save

### 2.2 Facebook OAuth

1. Go to https://developers.facebook.com
2. Create an app
3. Add "Facebook Login" product
4. Get App ID and App Secret
5. In Supabase **Authentication → Providers → Facebook**
6. Paste credentials
7. Add Supabase redirect URL to Facebook app settings

### 2.3 Apple OAuth

1. Go to https://developer.apple.com
2. Create credentials (Services ID, etc.) - more complex setup
3. Follow Supabase docs for Apple-specific setup
4. Get credentials into Supabase

### 2.4 Discord OAuth

1. Go to https://discord.com/developers
2. Create application
3. Go to **OAuth2**
4. Add redirect URL from Supabase
5. Copy Client ID and Secret into Supabase

---

## Step 3: Environment Variables

Update `.env` with all values:

```
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Brevo Email Service
VITE_BREVO_API_KEY=your_brevo_api_key_here
```

---

## Step 4: Test the System

1. Start dev server: `npm run dev`
2. Go to `http://localhost:5173/create_account`
3. Test email/password signup
4. Check email for verification link
5. Test social login (whichever provider you set up)
6. Test forgot password flow

---

## What Happens After Signup

1. **User creates account** → Email sent with verification link
2. **User clicks link** → Email verified, auto-redirect to shop
3. **30-day notice banner** → Shows "Please verify email" (30 days before auto-logout)
4. **After 30 days** → Account reverts to login-only (unverified accounts)

---

## Verification Message (Shop Page)

The shop page will show a notification banner if the user signed up:

```
"Please verify your email to keep your account active. You have 30 days."
[Resend Email]  [Skip]
```

---

## API Endpoints Used

### Auth Routes

- `POST /api/auth/signup` - Create account (via Supabase)
- `POST /api/auth/signin` - Sign in (via Supabase)
- `POST /api/auth/oauth` - OAuth login (via Supabase)
- `POST /api/auth/verify-email` - Verify email with token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Set new password

### Pages

- `/create_account` - Sign up / Sign in page
- `/verify-email?token=xxx` - Email verification
- `/forgot-password` - Password reset request
- `/reset-password?token=xxx` - Reset password form

---

## Troubleshooting

**"OAuth provider not showing"**
- Check that provider is enabled in Supabase → Authentication → Providers
- Refresh browser

**"Email not sending"**
- Verify Brevo API key is correct in .env
- Check Brevo dashboard for quota/limits

**"Users table not created"**
- Re-run the SQL migration
- Check Supabase SQL Editor for errors

**"Can't sign in after signup"**
- Email might not be verified yet
- Check that `email_verified` is `true` in `users` table

---

## Next Steps

1. ✅ Set up Supabase & OAuth providers
2. ✅ Run migrations
3. ✅ Add environment variables
4. ✅ Test signup/signin/password reset
5. **TODO:** Add navbar link to `/create_account`
6. **TODO:** Add "Verify email" banner to shop page
7. **TODO:** Add logout button to header
8. **TODO:** Add protected routes (admin-only pages)

---

## Reference

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Brevo Email API](https://developers.brevo.com/docs/send-a-transactional-email)
- Create account page: `src/pages/AuthPages/CreateAccountPage.jsx`
- Auth API: `src/api/authAPI.js`
