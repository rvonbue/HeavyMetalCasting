# Heavy Metal Casting

A full-stack e-commerce platform for handcrafted metal jewelry. Built with React, Vite, Supabase, and deployed on Vercel.

---

## Quick Links

| Resource | URL |
|----------|-----|
| **Supabase Dashboard** | [https://supabase.com/dashboard/project/ktvkxvhltrsqluxkxmkt](https://supabase.com/dashboard/project/ktvkxvhltrsqluxkxmkt) |
| **Vercel Dashboard** | [https://vercel.com/rvonbue-5602s-projects/heavy-metal-casting](https://vercel.com/rvonbue-5602s-projects/heavy-metal-casting) |
| **Live App** | [https://heavy-metal-casting.vercel.app](https://heavy-metal-casting.vercel.app) |
| **Local Dev** | `http://localhost:5173` |
| **Supabse Local Dev** | http://localhost:54323/
---

## Development Setup

### Prerequisites
- Node.js 18+
- Supabase CLI
- **Docker** (optional - only needed if running Supabase locally; otherwise use remote Supabase)

### Install Dependencies
```bash
npm install
```

### Start Local Supabase (Optional)
If you want to run Supabase locally for development:

```bash
cd supabase
npx supabase start
```

This requires Docker and runs Supabase locally at `http://localhost:54323` with the database on `postgresql://postgres:postgres@127.0.0.1:54322/postgres`.

**Note:** You can skip this step and use the remote Supabase instance instead. The app will connect to the production database during development.

### Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Deployment Workflow

### 1. Make Code Changes Locally
- Test thoroughly on `http://localhost:5173`
- Ensure the app runs without errors

### 2. Commit and Push to GitHub
```bash
git add .
git commit -m "Your descriptive commit message"
git push origin main
```

### 3. Vercel Automatically Deploys
- Vercel watches the `main` branch for changes
- On push, Vercel automatically:
  - Pulls the latest code
  - Runs `npm run build`
  - Deploys to production at `https://heavy-metal-casting.vercel.app`
- Deployment typically completes in 1-2 minutes


## Database Management

### Dump Local Database Schema
```bash
supabase db dump --db-url "postgresql://postgres:postgres@127.0.0.1:54322/postgres" > backup.sql
```

### Connect to Remote Database
```bash
"C:\Program Files\PostgreSQL\18\bin\psql" "postgresql://postgres:[PASSWORD]@ktvkxvhltrsqluxkxmkt.supabase.co:5432/postgres"
```

---

## Important Setup Notes

### Vercel Deployment (SPA Routing)
- `vercel.json` is already configured to handle client-side routing for the React SPA
- This ensures all routes redirect to `index.html` for Vite to handle

### Email Configuration (Supabase)
⚠️ **Critical:** The default Supabase email service is limited to **2 emails per hour**, which breaks immediately on signup attempts.

**Solution:** Configure a custom SMTP provider:
1. Go to **Supabase Dashboard** → **Authentication** → **Email**
2. Select **Custom SMTP**
3. Enter your email provider credentials (AWS SES, Resend, SendGrid, etc.)

For AWS SES specifically:
- Get SMTP credentials from AWS SES Console
- Use `email-smtp.[region].amazonaws.com` as host
- Port: `587` (TLS)
- **Note:** AWS SES sandbox mode only allows sending to verified email addresses. Request production access to send to any email.

---

## Troubleshooting

**Supabase connection fails locally?**
- Run `npx supabase start` from the `supabase/` folder
- Verify port 54322 (database) and 54323 (studio) are available

**Email signup returning 500 error?**
- Check Supabase custom SMTP settings are configured correctly
- Verify sender email is recognized by your email provider
- If using AWS SES sandbox, ensure recipient email is verified
