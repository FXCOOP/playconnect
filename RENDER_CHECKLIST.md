# ✅ Render Deployment Checklist

Your code is ready! Follow these steps to deploy:

---

## 🎯 Quick Deploy (10 minutes)

### Step 1: Create Render Account ⏱️ 2 min
1. Go to: **https://render.com/register**
2. Sign up with GitHub
3. Authorize Render

### Step 2: Create PostgreSQL Database ⏱️ 3 min
1. Click **"New +"** → **"PostgreSQL"**
2. Settings:
   - Name: `playconnect-db`
   - Database: `playconnect`
   - User: `playconnect`
   - Plan: **Free**
   - Region: **Oregon** (or closest)
3. Click **"Create Database"**
4. Wait for provisioning (~2 min)
5. **Copy "Internal Database URL"** ← You'll need this!

### Step 3: Create Web Service ⏱️ 5 min
1. Click **"New +"** → **"Web Service"**
2. **Connect Repository**: `FXCOOP/playconnect`
3. Settings:
   - Name: `playconnect-app`
   - Region: Same as database
   - Branch: `main`
   - Runtime: **Node**
   - Build Command: `pnpm install && pnpm prisma generate && pnpm build`
   - Start Command: `pnpm start`
   - Plan: **Free**

4. **Environment Variables** (click "Advanced"):

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Paste Internal Database URL from Step 2 |
   | `NEXTAUTH_URL` | `https://playconnect-app.onrender.com` |
   | `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` and paste result |
   | `NODE_ENV` | `production` |
   | `NEXT_PUBLIC_APP_URL` | `https://playconnect-app.onrender.com` |

5. Click **"Create Web Service"**

### Step 4: Initialize Database ⏱️ 2 min
Once deployed, in Render Shell:
```bash
pnpm prisma db push
pnpm db:seed
```

---

## 🎉 Done! Your App is Live!

Visit: **https://playconnect-app.onrender.com**

**Demo Login:**
- Email: `sarah.johnson@example.com`
- Password: `password123`

---

## 📋 What You Get

✅ **Full-stack app deployed**
✅ **PostgreSQL database**
✅ **SSL certificate (HTTPS)**
✅ **Auto-deploy on git push**
✅ **Free tier ($0/month)**
✅ **10 demo families seeded**

---

## 🔄 To Update Later

Just push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push
```

Render auto-deploys! ⚡

---

## 📞 Need Help?

- Full guide: `DEPLOY_RENDER.md`
- Troubleshooting: See that file too
- Render docs: https://render.com/docs

**Let's go live! 🚀**
