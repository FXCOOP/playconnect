# PlayConnect

**A secure, mobile-first platform for organizing children's playdates through intelligent family matching.**

PlayConnect helps parents discover and coordinate playdates for their children based on shared interests, age compatibility, availability, and location proximity — with strong privacy and parental-control safeguards.

---

## 🌟 Features

### Core Functionality
- **Smart Matching**: AI-powered algorithm matches families based on interests, age, location, availability, and safety preferences
- **Child Profiles**: Manage multiple children with interests, availability, allergies, and special needs
- **Playdate Proposals**: Create, confirm, reschedule playdates with calendar integration (ICS)
- **Safe Messaging**: Parent-to-parent chat with moderation and quick-reply templates
- **Interest Circles**: Create or join groups for recurring playdates
- **Privacy First**: Coarse location display, photo blur, COPPA/GDPR compliance

### Safety & Privacy
- ✅ Email verification required
- ✅ No exact child DOB or precise GPS stored
- ✅ Photo consent with default blur
- ✅ Report/block users
- ✅ Admin moderation panel
- ✅ Audit trails for all actions

### Technical Highlights
- 🚀 Next.js 14 App Router with React Server Components
- 📱 Mobile-first responsive design
- 🔐 NextAuth.js authentication
- 🗄️ PostgreSQL + Prisma ORM
- 🌍 OpenStreetMap + Leaflet (no API keys)
- 💬 Real-time messaging via Pusher
- 📧 Transactional emails via Resend
- ✅ Full TypeScript with Zod validation
- 🧪 Vitest unit tests + Playwright E2E

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8+
- PostgreSQL 16+ (or Docker)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/yourusername/playconnect.git
   cd playconnect
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Start PostgreSQL** (via Docker)
   ```bash
   docker-compose up -d
   ```

4. **Initialize database**
   ```bash
   pnpm db:push
   pnpm db:seed
   ```

5. **Run development server**
   ```bash
   pnpm dev
   ```

6. **Open application**
   - Visit http://localhost:3000
   - Demo credentials seeded: see seed script output

---

## 📁 Project Structure

```
playconnect/
├── app/                      # Next.js App Router
│   ├── (marketing)/         # Public pages
│   ├── (auth)/              # Auth flows
│   ├── dashboard/           # Parent dashboard
│   ├── children/            # Child management
│   ├── matches/             # Discovery
│   ├── proposals/           # Playdate coordination
│   ├── groups/              # Interest circles
│   ├── messages/            # Parent chat
│   ├── admin/               # Moderation panel
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # shadcn/ui primitives
│   ├── layout/              # Header, nav, footer
│   ├── auth/                # Auth forms
│   ├── children/            # Child profiles
│   ├── matches/             # Match cards
│   ├── proposals/           # Proposal wizard
│   └── messaging/           # Chat UI
├── lib/                     # Business logic
│   ├── services/            # Core services
│   │   ├── scoring.ts      # Matching algorithm
│   │   ├── geo.ts          # Geolocation
│   │   ├── availability.ts # Overlap calculator
│   │   └── notifications.ts
│   ├── config/              # Configuration
│   ├── validations/         # Zod schemas
│   └── utils/               # Helpers
├── prisma/                  # Database
│   ├── schema.prisma        # Data model
│   └── seed.ts              # Seed data
├── tests/                   # Tests
│   ├── unit/                # Vitest
│   └── e2e/                 # Playwright
└── docs/                    # Documentation
```

---

## 🗄️ Database Schema

### Core Entities
- **User**: Guardian account with email verification
- **Household**: Family profile with coarse location
- **Child**: Child profile with age band (no exact DOB)
- **Interest**: Curated + custom tags
- **AvailabilitySlot**: Recurring + ad-hoc time windows
- **Match**: Computed matches with score breakdown
- **Proposal**: Playdate proposals with status
- **Message**: Parent-to-parent chat
- **Group**: Interest circles
- **Report**: Moderation reports
- **AuditEvent**: Action audit trail

See [prisma/schema.prisma](prisma/schema.prisma) for full schema.

---

## 🧮 Matching Algorithm

The matching engine computes a 0-100 score based on five weighted factors:

1. **Interests** (45%): Jaccard similarity of shared interests
2. **Age** (20%): Proximity of age bands with decay
3. **Distance** (15%): Geographic proximity with exponential decay
4. **Availability** (15%): Overlapping time slots in minutes
5. **Safety** (5%): House rules compatibility (pets, allergens, screen time)

**Configuration**: Weights are tunable in `.env` or `lib/config/matching.ts`.

**Explainability**: Each match includes a breakdown showing contribution per factor.

See [lib/services/scoring.ts](lib/services/scoring.ts) for implementation.

---

## 🧪 Testing

### Unit Tests
```bash
pnpm test              # Watch mode
pnpm test:unit         # Run once
pnpm test:coverage     # With coverage
```

### E2E Tests
```bash
pnpm test:e2e          # Headless
pnpm test:e2e:ui       # Interactive UI
```

### Test Coverage Goals
- Unit tests: 80%+ for business logic
- E2E tests: 3 critical paths (sign-up → profile → playdate)

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel
```

Set environment variables in Vercel dashboard. Database migrations run automatically via `postinstall` script.

### Railway (Database)
```bash
railway link
railway up
```

See [docs/DEPLOY.md](docs/DEPLOY.md) for detailed instructions.

---

## 🔒 Security

- **Authentication**: NextAuth.js with secure session cookies
- **Authorization**: Role-based (Parent, Admin) with middleware
- **Input Validation**: Zod schemas at API boundaries
- **Rate Limiting**: 10 proposals/day, 50 messages/hour, 100 API calls/min
- **Data Encryption**: Sensitive fields encrypted at rest
- **Headers**: Strict CSP, HSTS, X-Frame-Options

See [docs/SECURITY.md](docs/SECURITY.md) for security policy.

---

## 🛡️ Privacy

- **Data Minimization**: No exact DOB, only birth year/month
- **Coarse Location**: H3 geohash resolution 7 (~5km hexagons)
- **Photo Consent**: Default blur until mutual consent
- **COPPA Compliance**: No direct child accounts
- **GDPR Rights**: Export/delete data on request
- **Retention**: 90-day message retention configurable

See [docs/PRIVACY.md](docs/PRIVACY.md) for privacy policy.

---

## 🌐 Internationalization

Currently supports:
- 🇬🇧 English (default)
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German
- 🇮🇹 Italian
- 🇵🇹 Portuguese
- 🇸🇦 Arabic (RTL)
- 🇮🇱 Hebrew (RTL)

Add new locales in `messages/` directory. Uses `next-intl`.

---

## ♿ Accessibility

- **WCAG 2.2 AA** compliance target
- Focus indicators on all interactive elements
- ARIA labels and landmarks
- Keyboard navigation
- Screen reader tested
- Color contrast 4.5:1 minimum

---

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md) - System design and decisions
- [API Reference](docs/API.md) - Endpoint contracts
- [Deployment Guide](docs/DEPLOY.md) - Production setup
- [Security Policy](docs/SECURITY.md) - Security measures
- [Privacy Policy](docs/PRIVACY.md) - Data handling

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow
- Run `pnpm lint` before committing
- Write tests for new features
- Update documentation as needed
- Follow TypeScript strict mode
- Use Conventional Commits

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Leaflet](https://leafletjs.com/) - Mapping library
- [H3](https://h3geo.org/) - Geospatial indexing

---

## 📧 Support

- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](https://github.com/yourusername/playconnect/issues)
- Email: support@playconnect.app

---

## 🗺️ Roadmap

### Phase 1 (Current - MVP)
- ✅ Core matching algorithm
- ✅ Playdate proposals
- ✅ Basic messaging
- ✅ Admin moderation

### Phase 2 (Next)
- [ ] Mobile app (React Native)
- [ ] Calendar sync (Google, Apple)
- [ ] Group playdates
- [ ] Activity suggestions

### Phase 3 (Future)
- [ ] Recurring playdates
- [ ] Reviews/ratings system
- [ ] Integration with school systems
- [ ] AI activity recommendations

---

## Decisions & Assumptions

1. **Age Bands**: Birth year/month → age in months → band (0-12m, 13-24m, 2-3y, 4-5y, 6-8y, 9-12y)
2. **Default Radius**: 5 miles / 8 km (configurable per user)
3. **Matching Weights**: Interest=0.45, Age=0.20, Distance=0.15, Availability=0.15, Safety=0.05
4. **Geohash Resolution**: H3 level 7 for public display (~5km hexagons)
5. **Photo Storage**: Max 2MB, Supabase Storage, signed URLs
6. **Message Retention**: 90 days for unconfirmed, indefinite for confirmed playdates
7. **Availability Granularity**: 30-minute slots
8. **Rate Limits**: 10 proposals/day, 50 messages/hour, 100 API calls/min
9. **Custom Interests**: Require admin approval to appear in search
10. **COPPA**: No child accounts; all managed by verified guardians

---

**Built with ❤️ for families everywhere.**
