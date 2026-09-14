# 🚀 PRAVAH-AI — Netlify Publishing & Deployment Guide

This guide walks you through deploying **PRAVAH-AI** to [Netlify](https://www.netlify.com/).
The application has already been configured with `@netlify/plugin-nextjs`, `netlify.toml`, Prisma Linux query engines (`rhel-openssl-1.0.x`, `rhel-openssl-3.0.x`), MongoDB Atlas, and Supabase Storage.

---

## 🌟 Method 1: Git-Based Deployment via GitHub (Recommended)

This is the standard, best practice approach for Netlify with automatic continuous deployment on git push.

### Step 1: Push Code to GitHub
Open your terminal in `d:\New folder` and run:

```bash
# 1. Add your GitHub remote repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/pravah-ai.git

# 2. Rename branch to main (if needed)
git branch -M main

# 3. Push to GitHub
git push -u origin main
```

---

### Step 2: Connect Repository in Netlify

1. Log into your [Netlify Dashboard](https://app.netlify.com/).
2. Click **"Add new site"** > **"Import an existing project"**.
3. Choose **GitHub** (and authorize your repository `pravah-ai`).
4. Netlify will automatically detect [`netlify.toml`](file:///d:/New%20folder/netlify.toml) with:
   - **Base directory**: `pravah-ai/web`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Plugin**: `@netlify/plugin-nextjs`

---

### Step 3: Add Environment Variables in Netlify

In your Netlify Dashboard, navigate to **Site configuration** > **Environment variables**, and add the following variables:

```env
# 🍃 MongoDB Atlas (Document Store & Entity Sync)
MONGODB_URI="your-mongodb-atlas-uri"
MONGODB_DB_NAME="pravah_ai"

# ⚡ Supabase Storage (Evidence Photo CDN)
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
SUPABASE_STORAGE_BUCKET="grievance-evidence"

# 🔐 Security & NextAuth Session Tokens
NEXTAUTH_SECRET=pravah_ai_production_secret_key_2026
NEXTAUTH_URL=https://your-site-name.netlify.app

# 🗄️ Primary Database
DATABASE_URL=file:./dev.db

# 🤖 Python AI Service (optional: replace with your hosted FastAPI URL if deployed on Railway/Render)
AI_SERVICE_URL=http://127.0.0.1:8000
AI_MODE=demo
```

---

### Step 4: Click Deploy!
Click **"Deploy site"**. Netlify will:
1. Run `prisma generate` (compiling native and Linux query engines).
2. Run `next build` (compiling all 30 routes and middleware).
3. Provide you with your live URL: `https://<your-site-name>.netlify.app`.

---

## ⚡ Method 2: Direct CLI Deployment (Without Git)

If you prefer deploying directly from your local terminal using the Netlify CLI:

```powershell
cd "d:\New folder\pravah-ai\web"

# 1. Deploy directly using Netlify CLI
npx netlify-cli deploy --prod
```

1. It will ask: *"Create & configure a new site?"* -> Select **Yes**.
2. Give your site a name (e.g. `pravah-ai-portal`).
3. Set Publish directory to: `.next` (default from `netlify.toml`).
4. Once completed, your live URL will be generated instantly.
