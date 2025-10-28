# 🚀 Deploy PlayConnect to Render (via GitHub)

Complete step-by-step guide to deploy your app to production in 10 minutes!

---

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Render account (free - https://render.com/register)
- ✅ Your code is ready (it is!)

---

## Step 1: Push to GitHub

### 1.1 Initialize Git Repository (if not already done)

```bash
cd /c/Users/User/playconnect

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - PlayConnect app ready for deployment"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `playconnect`
3. Description: `AI-powered playdate coordination platform`
4. Choose: **Private** (recommended for now)
5. **DON'T** initialize with README (we already have one)
6. Click "Create repository"

### 1.3 Push to GitHub

```bash
# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/playconnect.git

# Push code
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up Render

### 2.1 Create Render Account
1. Go to https://render.com/register
2. Sign up with GitHub (easiest)
3. Authorize Render to access your repositories

### 2.2 Create PostgreSQL Database

1. In Render Dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Fill in:
   - **Name**: `playconnect-db`
   - **Database**: `playconnect`
   - **User**: `playconnect`
   - **Region**: Oregon (US West) or closest to you
   - **Plan**: **Free** ($0/month)
4. Click **"Create Database"**
5. ⏳ Wait 2-3 minutes for it to provision
6. Once ready, **copy the "Internal Database URL"** (you'll need this!)

---

## Step 3: Deploy Web Service

### 3.1 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository:
   - Search for `playconnect`
   - Click **"Connect"**

### 3.2 Configure Web Service

Fill in these settings:

**Basic Settings:**
- **Name**: `playconnect-app`
- **Region**: Same as database (Oregon)
- **Branch**: `main`
- **Root Directory**: Leave blank
- **Runtime**: **Node**

**Build & Deploy:**
- **Build Command**:
  ```
  pnpm install && pnpm prisma generate && pnpm build
  ```
- **Start Command**:
  ```
  pnpm start
  ```

**Plan:**
- Select: **Free** ($0/month)

### 3.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these one by one:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste the **Internal Database URL** from Step 2.2 |
| `NEXTAUTH_URL` | Will be: `https://playconnect-app.onrender.com` (or your custom domain) |
| `NEXTAUTH_SECRET` | Generate one: run `openssl rand -base64 32` |
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_APP_URL` | Same as NEXTAUTH_URL |

**Optional (can add later):**
| Key | Value |
|-----|-------|
| `RESEND_API_KEY` | Get from https://resend.com (for emails) |
| `EMAIL_FROM` | `PlayConnect <noreply@yourdomain.com>` |
| `NEXT_PUBLIC_PUSHER_KEY` | From https://pusher.com (for real-time) |
| `PUSHER_SECRET` | From Pusher dashboard |

### 3.4 Deploy!

1. Click **"Create Web Service"**
2. ⏳ Render will:
   - Clone your repo
   - Install dependencies (~2 min)
   - Run Prisma generate
   - Build Next.js (~3 min)
   - Start the server
3. Watch the logs in real-time!

---

## Step 4: Initialize Database

Once deployed, you need to create the tables and seed data.

### 4.1 Run Database Migrations

In Render dashboard → your web service → **Shell** tab:

```bash
pnpm prisma db push
```

Wait for "✓ Database schema created" message.

### 4.2 Seed Demo Data

Still in the Shell:

```bash
pnpm db:seed
```

This creates:
- 1 admin user
- 10 demo families
- 20 children
- 40 interests
- 1 sample group

---

## Step 5: Test Your Live App! 🎉

### 5.1 Visit Your URL

Your app will be live at:
```
https://playconnect-app.onrender.com
```

(Or whatever name you chose)

### 5.2 Try Demo Login

Go to: `https://playconnect-app.onrender.com/sign-in`

**Demo credentials:**
- Email: `sarah.johnson@example.com`
- Password: `password123`

(Or any of the 10 demo accounts - all use password123)

### 5.3 Verify Everything Works

✅ Landing page loads
✅ Can sign in
✅ Dashboard shows "This Week's Matches" (once implemented)
✅ No errors in browser console

---

## Step 6: Custom Domain (Optional)

### 6.1 Buy a Domain
- Namecheap.com
- Google Domains
- Cloudflare

### 6.2 Add to Render
1. Your web service → **Settings** → **Custom Domains**
2. Click **"Add Custom Domain"**
3. Enter your domain: `playconnect.app`
4. Render gives you DNS instructions
5. Add CNAME record in your domain provider
6. Wait for SSL cert (automatic, ~5 mins)

### 6.3 Update Environment Variables
- Change `NEXTAUTH_URL` to `https://playconnect.app`
- Change `NEXT_PUBLIC_APP_URL` to same
- Click **"Save Changes"**

---

## 🎯 Troubleshooting

### Issue: "Build failed"

**Check:**
- Is Node version ≥ 20? (Render uses Node 20 by default)
- Did pnpm install succeed?
- Check build logs for specific error

**Fix:**
- Add `"engines": {"node": ">=20.0.0"}` to package.json (already there!)

### Issue: "Prisma Client not found"

**Fix:**
- Make sure build command includes: `pnpm prisma generate`
- Restart deployment

### Issue: "Database connection failed"

**Check:**
- Is DATABASE_URL set correctly?
- Is it the **Internal** URL, not External?
- Is database still provisioning?

**Fix:**
- Copy-paste DATABASE_URL again from database dashboard
- Verify no extra spaces

### Issue: "NextAuth error"

**Check:**
- Is NEXTAUTH_URL set to your actual Render URL?
- Is NEXTAUTH_SECRET at least 32 characters?

**Fix:**
- Generate new secret: `openssl rand -base64 32`
- Update NEXTAUTH_URL to match your live URL

### Issue: "Free tier limits"

**Render Free Tier:**
- ✅ 750 hours/month
- ✅ Sleeps after 15 min inactivity (wakes on visit)
- ✅ PostgreSQL 90-day retention
- ✅ Perfect for MVP/testing

**If you need always-on:**
- Upgrade to Starter plan ($7/month)

---

## 🔄 Future Updates

### To Deploy New Changes:

1. Make code changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Add new feature"
   git push
   ```
3. Render **auto-deploys** on push! ⚡
4. Watch logs in Render dashboard

### Rollback if Needed:

1. Render dashboard → your service → **Events**
2. Find previous successful deploy
3. Click **"Rollback to this deploy"**

---

## 📊 Monitoring

### View Logs:
- Render dashboard → your service → **Logs** tab
- Real-time application logs
- Filter by error/warn/info

### View Metrics:
- **Metrics** tab shows:
  - CPU usage
  - Memory usage
  - Request rate
  - Response times

### Set Up Alerts:
- **Settings** → **Notifications**
- Get emails on deploy failures

---

## 🎉 You're Live!

**Congratulations!** Your PlayConnect app is now:
- ✅ Deployed to production
- ✅ Running on free tier
- ✅ Auto-deploys on git push
- ✅ SSL certificate (HTTPS)
- ✅ PostgreSQL database
- ✅ Global CDN

**Share your app:**
```
https://playconnect-app.onrender.com
```

---

## 📚 Next Steps

1. **Add Supabase for file storage** (child photos)
2. **Set up Resend for emails** (notifications)
3. **Add Pusher for real-time messaging**
4. **Implement remaining features** (see IMPLEMENTATION_SUMMARY.md)
5. **Invite beta users!**

---

## 💡 Pro Tips

1. **Use Environment Variable Groups**
   - Render lets you group related env vars
   - Easier to manage

2. **Enable Deploy Previews**
   - Create branches for features
   - Render auto-creates preview URLs
   - Test before merging to main

3. **Monitor Cold Starts**
   - Free tier sleeps after 15 min
   - First request wakes it (~30 sec)
   - Use cron job to ping every 14 min if needed

4. **Database Backups**
   - Free tier: manual backups only
   - Export weekly: `pg_dump $DATABASE_URL > backup.sql`
   - Upgrade for automatic backups

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com/
- **Your IMPLEMENTATION_SUMMARY.md**: Complete roadmap
- **Your QUICKSTART.md**: Local development guide

---

**Built with ❤️ by Claude Code. Now go live! 🚀**
