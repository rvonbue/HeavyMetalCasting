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

---

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (for local Supabase)
- Supabase CLI

### Install Dependencies
```bash
npm install
```

### Start Local Supabase
```bash
cd supabase
npx supabase start
```

This runs Supabase locally at `http://localhost:54323` with the database on `postgresql://postgres:postgres@127.0.0.1:54322/postgres`.

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

### 4. Verify Deployment
- Check the [Vercel Dashboard](https://vercel.com/rvonbue-5602s-projects/heavy-metal-casting) to confirm status
- Visit the live app and test key features

---

## Environment Variables

The app requires these Supabase credentials (set in Vercel):
- `VITE_SUPABASE_URL` - Remote Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase public API key

These are already configured in Vercel's environment settings.

---

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

## Troubleshooting

**App shows 404 on reload?**
- Check `vercel.json` exists in project root
- This file configures SPA routing for Vercel

**Can't sign up?**
- Verify RLS policies allow public INSERT on `users` table
- Check `store_settings` table has required configuration

**Supabase connection fails locally?**
- Run `npx supabase start` from the `supabase/` folder
- Verify port 54322 (database) and 54323 (studio) are available
