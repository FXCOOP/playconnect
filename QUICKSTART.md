# PlayConnect - Quick Start Guide

**Get running in 5 minutes** ⚡

---

## What You Have

A **production-ready foundation** for a playdate coordination platform:

✅ **Complete Backend Infrastructure**
- Next.js 14 App Router with React Server Components
- PostgreSQL database with Prisma ORM (12 entities, 25+ indexes)
- H3 geospatial indexing for privacy-preserving location
- NextAuth.js authentication (email/password + Google OAuth)
- Comprehensive matching algorithm with 5 weighted factors
- Real-time messaging setup (Pusher)
- Email notifications (Resend)
- ICS calendar generation
- Full TypeScript with strict mode

✅ **Core Business Logic (100% Complete)**
- Matching service with explainable AI (`lib/services/scoring.ts`)
- Geolocation service with H3 hexagons (`lib/services/geo.ts`)
- Availability overlap calculator (`lib/services/availability.ts`)
- Notification service with email templates (`lib/services/notifications.ts`)
- ICS file generator (`lib/services/ics-generator.ts`)

✅ **Database & Seed Data**
- Complete Prisma schema with all relations
- 10 demo families in San Francisco
- 20+ children with realistic profiles
- 40 curated interests across 7 categories
- Sample Lego Builders Club group

✅ **Configuration & DevOps**
- Docker Compose for local PostgreSQL + Redis
- GitHub Actions CI/CD pipeline
- Vitest + Playwright test setup
- ESLint + Prettier
- Comprehensive `.env.example`

✅ **Documentation**
- Deployment guide (Vercel + Railway)
- Implementation summary (what's done, what's next)
- Architecture diagram
- Full README

---

## What You Need to Build

**~60% of work remains** (UI components, API routes, pages):

🚧 **UI Components** (20+ components needed)
- shadcn/ui primitives (button, card, input, etc.)
- Feature components (match cards, proposal wizard, child forms)
- Layout components (header, nav, footer)

🚧 **Pages** (15+ pages needed)
- Authentication flows (sign-in, sign-up, verify-email)
- Dashboard with "This Week's Matches"
- Children management (list, create, edit)
- Matches discovery and detail
- Proposal wizard and detail
- Messaging interface
- Groups/circles
- Admin panel

🚧 **API Routes** (10+ routes needed)
- Children CRUD
- Proposals CRUD + confirm + ICS download
- Messages send/list
- Groups join/create

**See `IMPLEMENTATION_SUMMARY.md` for complete roadmap.**

---

## Installation & Setup

### 1. Install Dependencies

```bash
cd playconnect
pnpm install
```

Expected output:
```
 WARN  deprecated inflight@1.0.6
 WARN  deprecated glob@7.2.3
Progress: resolved 427, reused 401, downloaded 26, added 427, done

dependencies:
+ @prisma/client 5.8.1
+ next 14.1.0
+ react 18.2.0
... (100+ packages)

Done in 45.3s
```

### 2. Start PostgreSQL

```bash
docker-compose up -d
```

Expected output:
```
Creating network "playconnect_default" with the default driver
Creating volume "playconnect_postgres_data" with default driver
Creating playconnect_db    ... done
Creating playconnect_redis ... done
```

Verify running:
```bash
docker ps
# Should show playconnect_db and playconnect_redis
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

**Edit `.env.local`** with these minimum values:

```bash
# Database (from Docker Compose)
DATABASE_URL="postgresql://playconnect:playconnect_dev_password@localhost:5432/playconnect"

# NextAuth (generate secret)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<run: openssl rand -base64 32>"

# Email (Resend - get free key from resend.com)
RESEND_API_KEY="re_your_key_here"
EMAIL_FROM="PlayConnect <noreply@localhost>"

# Pusher (get free account from pusher.com)
NEXT_PUBLIC_PUSHER_KEY="your-key"
NEXT_PUBLIC_PUSHER_CLUSTER="us2"
PUSHER_APP_ID="your-app-id"
PUSHER_SECRET="your-secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Generate NextAuth secret**:
```bash
openssl rand -base64 32
# Copy output to NEXTAUTH_SECRET
```

### 4. Initialize Database

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed demo data
pnpm db:seed
```

Expected output:
```
🌱 Starting PlayConnect database seed...

🗑️  Clearing existing data...
✅ Existing data cleared

🎨 Seeding interests...
✅ Created 40 interests

👤 Seeding admin user...
✅ Admin user created (email: admin@playconnect.app, password: admin123)

👨‍👩‍👧‍👦 Seeding families...
  ✅ Sarah Johnson (2 children)
  ✅ Michael Chen (1 children)
  ✅ Jessica Martinez (2 children)
  ... (7 more families)

✅ Created 10 families with 20 children

🔵 Creating sample interest circle...
✅ Created "Lego Builders Club" group with 3 members

✨ Seed completed successfully!

📝 Demo Credentials:
   Admin: admin@playconnect.app / admin123
   Parent: sarah.johnson@example.com / password123
   Parent: michael.chen@example.com / password123
   (All parent accounts use password: password123)
```

### 5. Start Development Server

```bash
pnpm dev
```

Expected output:
```
  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.3s
```

### 6. Open Application

Visit **http://localhost:3000**

You should see the landing page with:
- Hero: "Find Perfect Playdates for Your Kids"
- Features grid
- "How it works" section
- CTA: "Get started free"

---

## Verify Setup

### 1. Check Database Connection

Visit: http://localhost:3000/api/health (you'll need to create this route)

Or check directly:
```bash
pnpm prisma studio
```

Opens GUI at http://localhost:5555 showing:
- 1 admin user
- 10 parent users
- 10 households
- 20 children
- 40 interests
- 1 group

### 2. Test Sign-In

1. Visit http://localhost:3000/sign-in (you'll need to build this page)
2. Use demo credentials: `sarah.johnson@example.com` / `password123`
3. Should redirect to dashboard

### 3. Run Unit Tests

```bash
pnpm test:unit
```

Expected output:
```
 ✓ tests/unit/scoring.test.ts (8 tests) 342ms
   ✓ Matching Algorithm - computeMatch (6)
     ✓ should compute high score for very similar children
     ✓ should compute low score for incompatible age bands
     ✓ should penalize for pet allergies
     ✓ should score higher for closer geographic proximity
     ✓ should calculate Jaccard similarity correctly
     ✓ should generate meaningful explanations
   ✓ Matching Algorithm - findTopMatches (2)
     ✓ should return top N matches sorted by score
     ✓ should exclude self from matches

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  10:30:45
   Duration  1.24s
```

### 4. Test Matching Algorithm

```bash
node -r tsx/cjs --eval "
const { prisma } = require('./lib/db/client.ts');
const { computeMatch } = require('./lib/services/scoring.ts');

async function test() {
  const children = await prisma.child.findMany({
    take: 2,
    include: {
      household: true,
      interests: { include: { interest: true } },
      availabilitySlots: true,
    },
  });

  const match = computeMatch(children[0], children[1]);
  console.log('Match Score:', match.overallScore);
  console.log('Explanation:', match.explanation);
  console.log('Shared Interests:', match.sharedInterests.length);
  process.exit(0);
}

test();
"
```

---

## Next Steps: Build the UI

### Option 1: Follow Week-by-Week Plan

See `IMPLEMENTATION_SUMMARY.md` → "Next Steps: Quick Start Implementation Order"

### Option 2: Quick MVP Path (Weekend Project)

**Day 1: Auth + Children (6 hours)**
1. Install shadcn/ui: `npx shadcn-ui@latest init`
2. Add components: `npx shadcn-ui@latest add button card input label`
3. Create `app/(auth)/sign-in/page.tsx` with form
4. Create `app/api/children/route.ts` (GET, POST)
5. Create `app/children/page.tsx` listing children
6. Test: Sign in → View children

**Day 2: Matches + Proposals (8 hours)**
1. Create `app/matches/page.tsx` with match cards
2. Use existing `/api/matches` route (already created!)
3. Create `app/proposals/new/page.tsx` with wizard
4. Create `app/api/proposals/route.ts` (POST)
5. Test: View matches → Propose playdate

**Sunday: Polish (4 hours)**
1. Add `components/layout/header.tsx` with nav
2. Style with Tailwind
3. Add loading states (Skeleton)
4. Test full flow: Sign up → Add child → Find match → Propose → Done!

---

## Useful Commands

```bash
# Development
pnpm dev                 # Start Next.js dev server
pnpm db:studio           # Open Prisma Studio GUI

# Database
pnpm db:push             # Sync schema to database
pnpm db:seed             # Seed demo data
pnpm db:reset            # Reset + reseed (DESTRUCTIVE)
pnpm db:migrate          # Create migration

# Testing
pnpm test                # Run unit tests (watch mode)
pnpm test:unit           # Run unit tests once
pnpm test:e2e            # Run Playwright E2E tests
pnpm test:coverage       # Generate coverage report

# Code Quality
pnpm lint                # Run ESLint
pnpm type-check          # Run TypeScript check
pnpm format              # Format with Prettier
pnpm format:check        # Check formatting

# Build
pnpm build               # Production build
pnpm start               # Start production server
```

---

## Project Structure

```
playconnect/
├── app/                    # Next.js App Router
│   ├── (marketing)/       # Landing, about, privacy (✅ landing page done)
│   ├── (auth)/            # Sign-in, sign-up (🚧 need to build)
│   ├── dashboard/         # Parent dashboard (🚧 need to build)
│   ├── children/          # Child management (🚧 need to build)
│   ├── matches/           # Discovery (🚧 need to build)
│   ├── proposals/         # Playdate proposals (🚧 need to build)
│   ├── api/               # API routes
│   │   ├── auth/[...nextauth]/ # ✅ NextAuth handler done
│   │   └── matches/       # ✅ Matches endpoint done
│   ├── layout.tsx         # ✅ Root layout done
│   ├── providers.tsx      # ✅ Providers done
│   └── globals.css        # ✅ Global styles done
├── components/            # React components (🚧 need to build)
├── lib/
│   ├── services/          # ✅ All services done (scoring, geo, availability, etc.)
│   ├── auth/              # ✅ NextAuth config done
│   ├── db/                # ✅ Prisma client done
│   ├── config/            # ✅ Matching config done
│   └── validations/       # 🚧 Zod schemas needed
├── prisma/
│   ├── schema.prisma      # ✅ Complete schema done
│   └── seed.ts            # ✅ Seed script done
├── tests/
│   └── unit/              # ✅ Matching tests done
├── docs/
│   ├── DEPLOY.md          # ✅ Deployment guide done
│   └── ARCHITECTURE.md    # 🚧 Need to create
├── README.md              # ✅ Done
├── IMPLEMENTATION_SUMMARY.md # ✅ Done
└── QUICKSTART.md          # ✅ This file
```

**Legend**:
- ✅ Complete
- 🚧 Needs implementation

---

## Troubleshooting

### "Prisma Client not generated"

```bash
pnpm db:generate
```

### "Can't connect to database"

```bash
# Check Docker is running
docker ps

# Check connection string
echo $DATABASE_URL
# Should be: postgresql://playconnect:playconnect_dev_password@localhost:5432/playconnect

# Restart containers
docker-compose restart
```

### "Module not found: @/components/ui/button"

You need to install shadcn/ui components:

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
```

### "NextAuth URL mismatch"

Ensure `.env.local` has:
```bash
NEXTAUTH_URL="http://localhost:3000"
```

### Port 3000 already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

---

## Getting Help

1. **Check Documentation**:
   - `README.md` - Overview and features
   - `IMPLEMENTATION_SUMMARY.md` - Detailed roadmap
   - `docs/DEPLOY.md` - Deployment guide

2. **Inspect Database**:
   ```bash
   pnpm db:studio
   ```

3. **Check Logs**:
   ```bash
   # Next.js logs
   tail -f .next/trace

   # PostgreSQL logs
   docker logs playconnect_db
   ```

4. **Run Type Check**:
   ```bash
   pnpm type-check
   ```

---

## Demo Credentials

**Admin**:
- Email: `admin@playconnect.app`
- Password: `admin123`

**Parents** (10 accounts, all with password `password123`):
- `sarah.johnson@example.com` (2 children: Emma, Liam)
- `michael.chen@example.com` (1 child: Sophia)
- `jessica.martinez@example.com` (2 children: Noah, Olivia)
- `david.williams@example.com` (1 child: Ava)
- `emily.brown@example.com` (1 child: Mason)
- `amanda.taylor@example.com` (2 children: Isabella, Ethan)
- `jennifer.davis@example.com` (1 child: Mia)
- `robert.anderson@example.com` (2 children: Lucas, Charlotte)
- `lisa.wilson@example.com` (1 child: Amelia)
- `james.moore@example.com` (2 children: Benjamin, Harper)

---

## What's Implemented vs. What's Not

### ✅ Fully Implemented (Ready to Use)

| Component | Status | Usage |
|-----------|--------|-------|
| Matching Algorithm | ✅ Complete | `import { computeMatch } from '@/lib/services/scoring'` |
| Geo Service | ✅ Complete | `import { calculateDistance } from '@/lib/services/geo'` |
| Availability Calculator | ✅ Complete | `import { calculateRecurringOverlap } from '@/lib/services/availability'` |
| ICS Generator | ✅ Complete | `import { generatePlaydateICS } from '@/lib/services/ics-generator'` |
| Email Service | ✅ Complete | `import { sendProposalNotification } from '@/lib/services/notifications'` |
| Auth Config | ✅ Complete | Used automatically by NextAuth |
| Prisma Client | ✅ Complete | `import { prisma } from '@/lib/db/client'` |
| Database Schema | ✅ Complete | 12 entities, 25+ indexes |
| Seed Data | ✅ Complete | 10 families, 20 children |
| Landing Page | ✅ Complete | Visit http://localhost:3000 |
| Matches API | ✅ Complete | `GET /api/matches?childId=xxx` |

### 🚧 Not Implemented (You Need to Build)

| Component | Priority | Estimated Time |
|-----------|----------|----------------|
| shadcn/ui Components | **HIGH** | 1 hour |
| Auth Pages (sign-in, sign-up) | **HIGH** | 4 hours |
| Children API Routes | **HIGH** | 3 hours |
| Children Pages (list, create) | **HIGH** | 4 hours |
| Dashboard Page | MEDIUM | 3 hours |
| Matches Pages | **HIGH** | 4 hours |
| Proposal Wizard | **HIGH** | 6 hours |
| Proposals API Routes | **HIGH** | 4 hours |
| Messaging UI | MEDIUM | 4 hours |
| Messages API | MEDIUM | 2 hours |
| Groups Pages | LOW | 4 hours |
| Admin Panel | LOW | 6 hours |
| Leaflet Map Integration | LOW | 3 hours |
| i18n Setup | LOW | 2 hours |
| E2E Tests | MEDIUM | 4 hours |

**Total Estimated Work**: ~50-60 hours for full MVP

---

## Success Criteria

You're ready to deploy when:

- ✅ User can sign up and verify email
- ✅ User can create child profile with interests
- ✅ User can view matches with scores and explanations
- ✅ User can propose a playdate
- ✅ Recipient can confirm playdate
- ✅ Both parties receive email confirmation + ICS file
- ✅ Parents can message about playdate
- ✅ All unit tests pass (`pnpm test:unit`)
- ✅ Critical E2E flow passes (sign-up → child → match → propose → confirm)
- ✅ Lighthouse performance score ≥ 85

---

## Deploy to Production

When ready:

```bash
# 1. Push to GitHub
git add .
git commit -m "Initial implementation"
git push origin main

# 2. Deploy to Vercel
vercel --prod

# 3. Set up Railway PostgreSQL
# Follow docs/DEPLOY.md
```

See `docs/DEPLOY.md` for complete deployment instructions.

---

## Support & Resources

- **Documentation**: `docs/` directory
- **Implementation Roadmap**: `IMPLEMENTATION_SUMMARY.md`
- **Deployment Guide**: `docs/DEPLOY.md`
- **GitHub Issues**: (create repository first)
- **Email**: support@playconnect.app

---

**You're all set! Start with `pnpm dev` and build your first page.** 🚀

Good luck building PlayConnect! 🎉
