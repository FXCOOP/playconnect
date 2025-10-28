

 # Deployment Guide

Comprehensive instructions for deploying PlayConnect to production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Database Setup (Railway)](#database-setup-railway)
4. [Frontend + API Deployment (Vercel)](#frontend--api-deployment-vercel)
5. [Alternative: Full-Stack on Render](#alternative-full-stack-on-render)
6. [Post-Deployment](#post-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

- Node.js 20+ installed locally
- pnpm 8+ package manager
- Git repository (GitHub recommended)
- Accounts:
  - [Vercel](https://vercel.com) (free tier sufficient)
  - [Railway](https://railway.app) or [Supabase](https://supabase.com)
  - [Resend](https://resend.com) for emails
  - [Pusher](https://pusher.com) for real-time messaging
  - [Google Cloud Console](https://console.cloud.google.com) for OAuth (optional)

---

## Environment Variables

### Required Variables

Create `.env.production` with the following:

```bash
# Database (from Railway/Supabase)
DATABASE_URL="postgresql://user:password@host:5432/playconnect"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="PlayConnect <noreply@yourdomain.com>"

# Real-time Messaging (Pusher)
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
NEXT_PUBLIC_PUSHER_CLUSTER="us2"
PUSHER_APP_ID="your-app-id"
PUSHER_SECRET="your-pusher-secret"

# Application
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

### Optional Variables

```bash
# Feature Flags
ENABLE_GROUPS="true"
ENABLE_MESSAGING="true"

# Matching Configuration
MATCHING_WEIGHT_INTERESTS="0.45"
MATCHING_WEIGHT_AGE="0.20"
MATCHING_WEIGHT_DISTANCE="0.15"
MATCHING_WEIGHT_AVAILABILITY="0.15"
MATCHING_WEIGHT_SAFETY="0.05"

# Privacy
GEOHASH_RESOLUTION="7"
DEFAULT_BLUR_PHOTOS="true"
```

---

## Database Setup (Railway)

### Option 1: Railway PostgreSQL

1. **Create Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login
   railway login

   # Create new project
   railway init
   ```

2. **Add PostgreSQL**
   - Go to Railway dashboard → Add New → Database → PostgreSQL
   - Copy the `DATABASE_URL` from the Variables tab

3. **Run Migrations**
   ```bash
   # Set DATABASE_URL locally
   export DATABASE_URL="postgresql://..."

   # Run migrations
   pnpm prisma migrate deploy

   # (Optional) Seed production data
   pnpm db:seed
   ```

### Option 2: Supabase PostgreSQL

1. Create project at [supabase.com](https://supabase.com)
2. Go to Settings → Database → Connection String
3. Copy the URI connection string
4. Run migrations as above

---

## Frontend + API Deployment (Vercel)

### Step 1: Prepare Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your Git repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next` (default)
   - **Install Command**: `pnpm install`

### Step 3: Environment Variables

In Vercel dashboard → Settings → Environment Variables, add ALL variables from `.env.production`:

- `DATABASE_URL`
- `NEXTAUTH_URL` (set to your Vercel domain, e.g., `https://playconnect.vercel.app`)
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID` (if using OAuth)
- `GOOGLE_CLIENT_SECRET`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `NEXT_PUBLIC_PUSHER_KEY`
- `NEXT_PUBLIC_PUSHER_CLUSTER`
- `PUSHER_APP_ID`
- `PUSHER_SECRET`
- `NEXT_PUBLIC_APP_URL`

**Important**: Mark sensitive variables as "Secret" and set environment to "Production".

### Step 4: Deploy

```bash
# Via Vercel CLI
npm install -g vercel
vercel --prod

# Or push to main branch (auto-deploy)
git push origin main
```

### Step 5: Configure Domain

1. Vercel dashboard → Settings → Domains
2. Add custom domain (optional): `playconnect.com`
3. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to custom domain
4. Redeploy

---

## Alternative: Full-Stack on Render

Deploy both app and database on Render:

### Step 1: Create PostgreSQL Database

1. Render dashboard → New → PostgreSQL
2. Name: `playconnect-db`
3. Copy **Internal Database URL**

### Step 2: Create Web Service

1. Render dashboard → New → Web Service
2. Connect Git repository
3. Configure:
   - **Name**: `playconnect-app`
   - **Environment**: Node
   - **Build Command**: `pnpm install && pnpm prisma generate && pnpm build`
   - **Start Command**: `pnpm start`
   - **Instance Type**: Free (or Starter for production)

### Step 3: Environment Variables

Add all variables from `.env.production` (use Internal Database URL from Step 1)

### Step 4: Deploy

Render auto-deploys on push to main branch.

---

## Post-Deployment

### 1. Verify Database Migrations

```bash
# Check migration status
pnpm prisma migrate status

# If needed, run
pnpm prisma migrate deploy
```

### 2. Seed Initial Data (Optional)

```bash
# SSH into Railway/Render
pnpm db:seed
```

### 3. Test Critical Flows

- [ ] Sign up with email
- [ ] Email verification link
- [ ] Google OAuth (if enabled)
- [ ] Create household profile
- [ ] Add child profile
- [ ] View matches
- [ ] Create playdate proposal
- [ ] Confirm playdate
- [ ] Receive email notifications
- [ ] Chat messaging

### 4. Configure OAuth Redirect URIs

**Google OAuth**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth client
3. Add Authorized redirect URIs:
   - `https://your-domain.vercel.app/api/auth/callback/google`
   - `https://your-custom-domain.com/api/auth/callback/google`

### 5. Set Up Email Domain (Resend)

1. Resend dashboard → Domains
2. Add your domain (e.g., `playconnect.com`)
3. Add DNS records (SPF, DKIM, DMARC)
4. Update `EMAIL_FROM` to use verified domain

---

## Monitoring & Maintenance

### Logs

**Vercel**:
- Dashboard → Deployments → [deployment] → Logs

**Railway**:
- Dashboard → [service] → Logs

### Database Backups

**Railway**:
- Automatic daily backups (paid plans)
- Manual backup: `pg_dump $DATABASE_URL > backup.sql`

**Supabase**:
- Automatic daily backups
- Download from Dashboard → Database → Backups

### Performance Monitoring

1. **Vercel Analytics** (built-in)
2. **Sentry** for error tracking (optional):
   ```bash
   npm install @sentry/nextjs
   # Configure in next.config.mjs
   ```

### Health Checks

Create `app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ status: 'unhealthy', error }, { status: 500 });
  }
}
```

Monitor: `https://your-domain.vercel.app/api/health`

---

## Rollback Procedures

### Vercel Rollback

1. Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → Promote to Production

### Database Rollback

```bash
# Restore from backup
psql $DATABASE_URL < backup.sql

# Or revert specific migration
pnpm prisma migrate resolve --rolled-back 20240101000000_migration_name
```

### Emergency Kill Switch

Set environment variable:
```bash
MAINTENANCE_MODE="true"
```

Create middleware in `app/middleware.ts`:

```typescript
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return new Response('Maintenance in progress', { status: 503 });
  }
  return NextResponse.next();
}
```

---

## Scaling Considerations

### Database

- **Connection Pooling**: Use PgBouncer (Railway/Supabase)
- **Read Replicas**: For high read traffic
- **Indexes**: Monitor slow queries, add indexes as needed

### API Routes

- **Edge Functions**: Move lightweight routes to Edge runtime
- **Caching**: Implement Redis for match scores, sessions
- **Rate Limiting**: Upstash Rate Limit or Vercel KV

### File Storage

- **Supabase Storage** for child photos
- **CDN**: Vercel Edge Network (automatic)
- **Image Optimization**: Next.js Image component (built-in)

---

## Troubleshooting

### Common Issues

**Issue**: "Prisma Client not found"
- **Solution**: Ensure `pnpm prisma generate` runs in build command

**Issue**: "NEXTAUTH_URL mismatch"
- **Solution**: Update `NEXTAUTH_URL` to match deployment domain

**Issue**: "Database connection timeout"
- **Solution**: Check DATABASE_URL, increase connection pool size

**Issue**: "Email delivery failed"
- **Solution**: Verify Resend API key, check domain DNS records

---

## Security Checklist

- [ ] All secrets stored in environment variables (not committed)
- [ ] NEXTAUTH_SECRET is 32+ characters random string
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] SQL injection protected (Prisma parameterized queries)
- [ ] XSS protected (React escaping)
- [ ] CSP headers configured (next.config.mjs)

---

## Support

- GitHub Issues: `https://github.com/yourusername/playconnect/issues`
- Email: `support@playconnect.app`
- Documentation: `https://docs.playconnect.app`

---

**Deployment Checklist**:

- [ ] Environment variables set
- [ ] Database provisioned and migrated
- [ ] OAuth redirect URIs configured
- [ ] Email domain verified
- [ ] Deployment successful
- [ ] Critical flows tested
- [ ] Monitoring configured
- [ ] Backups enabled
- [ ] Security headers verified
- [ ] Performance checked (Lighthouse score ≥ 85)
