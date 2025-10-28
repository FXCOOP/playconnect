# Supabase Quick Setup

## Step 1: Create Supabase Project
1. Go to: https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - Name: playconnect
   - Database Password: (generate a strong one)
   - Region: Choose closest to you
4. Click "Create new project" (takes ~2 mins)

## Step 2: Get Database URL
1. In your project, go to: Settings → Database
2. Scroll to "Connection string"
3. Select "URI" tab
4. Copy the connection string (looks like this):
   ```
   postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```
5. Replace [YOUR-PASSWORD] with your actual database password

## Step 3: Update .env.local
Open `.env.local` and replace the DATABASE_URL line:
```bash
DATABASE_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

## Step 4: Push Schema & Seed Data
```bash
cd playconnect
pnpm db:push
pnpm db:seed
```

## Step 5: Start the App!
```bash
pnpm dev
```

Then visit: http://localhost:3000
