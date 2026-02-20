# Anime Ascend Wellness — Project Blueprint

## Overview

**Anime Ascend** is a full-stack wellness platform that combines anime-inspired aesthetics with evidence-based personal growth tools. Users track habits, journal reflections, meditate, set goals, and discover wellness activities—all powered by an AI coach and token-based credit system.

**Core Concept:** Transform personal growth through anime-inspired wellness. "Your Journey to Growth."

---

## Part 1: Foundation & Brand

### 1.1 Brand Identity

| Aspect | Details |
|--------|---------|
| **Name** | Anime Ascend Wellness |
| **Tagline** | Your Journey to Growth |
| **Core Colors** | Teal (#14B8A6), Pink (#EC4899), Slate (#1E293B) |
| **Typography** | Outfit (headings), DM Sans (body) |
| **Design Language** | Anime-inspired, glassmorphism, neon accents, dark mode |
| **Target Audience** | 16-40 year olds interested in anime, wellness, personal growth |

### 1.2 Core Values

- **Transformation:** Help users become their best selves
- **Community:** Connect people on similar growth journeys
- **Accessibility:** 5 accessibility modes for all users
- **Transparency:** Clear pricing, open API, no hidden features
- **Sustainability:** ECO CODE mode for low-energy devices

---

## Part 2: Product Architecture

### 2.1 Core Features

#### **Dashboard**
- Daily mood check-in with emoji selector
- Habit streak tracker with visual progress
- Quick-access buttons to core features
- Weekly summary of progress

#### **Habits**
- Create, track, and log daily habits
- Visual streak counter (current/target)
- Categories: Health, Learning, Creativity, Relationships, Finance
- Emoji/color customization per habit

#### **Journal**
- Guided journaling prompts
- Mood logging with 1-10 scale
- Private/public entry toggle
- Tag-based organization
- AI wellness coach suggestions

#### **Meditation**
- Breathing exercise timer (4-7-8, box breathing)
- Ambient sound selection
- Guided meditation library (coming soon)
- Session history and stats

#### **Goals**
- Long-term goal setting
- Milestone breakdown
- Progress tracking (0-100%)
- Goal categories and target dates
- Achievement badges

#### **Discover**
- Browse wellness activities by mood
- Anime-themed activity cards
- Filter by category, duration, difficulty
- Save favorites to dashboard

#### **Pricing & Billing**
- Free tier: 5 AI messages/month
- Premium: $9.99/month, 50 AI messages
- Pro: $19.99/month, 200 AI messages
- Stripe integration with webhook handling

#### **Settings**
- Account management
- 5 accessibility modes (WCAG AAA, ECO CODE, NEURO CODE, Dyslexic, No Blue Light)
- Billing & subscription management
- Notification preferences

#### **Support**
- Contact form with ticket creation
- FAQ section
- Live chat placeholder
- Email support integration

---

## Part 3: Technical Architecture

### 3.1 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + Tailwind CSS 4 + TypeScript |
| **Backend** | Express 4 + tRPC 11 + Node.js |
| **Database** | MySQL (Drizzle ORM) |
| **Auth** | Manus OAuth (Google/Email) |
| **Payments** | Stripe (subscriptions + webhooks) |
| **Storage** | AWS S3 (file uploads) |
| **Hosting** | Manus (built-in) |
| **Testing** | Vitest |
| **LLM** | OpenRouter (AI coach) |

### 3.2 Database Schema

**Core Tables:**
- `users` — User accounts, subscription tier, token balance
- `habits` — Habit definitions with categories and metadata
- `habitLogs` — Daily habit completion records
- `journalEntries` — Journal entries with mood and tags
- `moodLogs` — Mood tracking history
- `goals` — User goals with progress tracking
- `milestones` — Goal sub-tasks and checkpoints
- `tokenTransactions` — Token purchase/usage history
- `subscriptions` — Active subscription records with Stripe IDs
- `payments` — Payment history and receipts
- `supportTickets` — Customer support tickets

### 3.3 API Routes (tRPC)

```
/api/trpc/
  ├── auth.me                          (GET current user)
  ├── auth.logout                      (POST logout)
  ├── habits.list                      (GET user habits)
  ├── habits.create                    (POST new habit)
  ├── habits.delete                    (DELETE habit)
  ├── habitLogs.log                    (POST habit completion)
  ├── habitLogs.getStreak              (GET streak count)
  ├── journal.list                     (GET journal entries)
  ├── journal.create                   (POST new entry)
  ├── journal.delete                   (DELETE entry)
  ├── mood.log                         (POST mood entry)
  ├── mood.getAverage                  (GET mood average)
  ├── goals.list                       (GET user goals)
  ├── goals.create                     (POST new goal)
  ├── goals.updateProgress             (PATCH goal progress)
  ├── milestones.list                  (GET goal milestones)
  ├── milestones.complete              (PATCH milestone)
  ├── tokens.getBalance                (GET token balance)
  ├── tokens.getHistory                (GET token transactions)
  ├── tokens.use                       (POST use tokens)
  ├── billing.createCheckoutSession    (POST Stripe checkout)
  ├── support.createTicket             (POST support ticket)
  └── support.listTickets              (GET user tickets)
```

### 3.4 File Structure

```
anime-ascend-wellness/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Habits.tsx
│   │   │   ├── Journal.tsx
│   │   │   ├── Meditation.tsx
│   │   │   ├── Goals.tsx
│   │   │   ├── Discover.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── Support.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── NotFound.tsx
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── config/
│   │   │   └── brand.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   └── index.html
├── server/
│   ├── routers.ts
│   ├── db.ts
│   ├── products.ts
│   ├── stripe-checkout.ts
│   ├── stripe-webhook.ts
│   ├── auth.logout.test.ts
│   ├── features.test.ts
│   └── _core/
├── drizzle/
│   └── schema.ts
├── docs/
│   ├── BLUEPRINT.md
│   ├── ROADMAP.md
│   ├── API.md
│   ├── SCHEMA.md
│   └── DEPLOYMENT.md
├── package.json
├── tsconfig.json
└── README.md
```

---

## Part 4: Operations & Processes

### 4.1 Development Workflow

1. **Feature Planning:** Add to `todo.md`
2. **Backend First:** Create schema, tRPC router, tests
3. **Frontend:** Build UI pages using shadcn/ui
4. **Integration:** Wire frontend to backend via tRPC hooks
5. **Testing:** Run `pnpm test` (11/11 tests passing)
6. **Checkpoint:** Save with `webdev_save_checkpoint`
7. **Deploy:** Push to GitHub, deploy via Manus

### 4.2 Database Migrations

```bash
# Update schema in drizzle/schema.ts
# Push changes
pnpm db:push

# Verify in database
# Update db.ts with new queries
# Update routers.ts with new procedures
```

### 4.3 Stripe Integration

**Setup:**
1. Claim sandbox at https://dashboard.stripe.com/claim_sandbox
2. Copy STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY
3. Set STRIPE_WEBHOOK_SECRET in environment

**Testing:**
- Test card: `4242 4242 4242 4242`
- Webhook testing via Stripe Dashboard

**Production:**
- Complete KYC verification
- Swap test keys for live keys
- Test with real transactions

### 4.4 Deployment Checklist

- [ ] All tests passing (`pnpm test`)
- [ ] TypeScript compilation clean (`pnpm check`)
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Stripe webhook configured
- [ ] GitHub repo updated
- [ ] Manus hub card added
- [ ] Live URL verified
- [ ] Smoke tests completed

---

## Part 5: Growth & Expansion

### 5.1 Planned Features (Phase 2)

- **AI Wellness Coach:** LLM-powered personalized recommendations
- **Community:** User profiles, follow, share achievements
- **Leaderboards:** Weekly/monthly wellness challenges
- **Integrations:** Apple Health, Google Fit sync
- **Mobile App:** React Native version
- **Accessibility:** Full WCAG AAA compliance + 5 modes
- **Admin Dashboard:** User stats, revenue, moderation

### 5.2 Revenue Model

| Tier | Price | AI Messages | Features |
|------|-------|------------|----------|
| Free | $0 | 5/month | Core features |
| Premium | $9.99/mo | 50/month | Advanced analytics |
| Pro | $19.99/mo | 200/month | 1-on-1 coaching |

**Additional Revenue:**
- Premium content (guided meditations)
- Merchandise
- Partnerships with anime studios
- B2B wellness programs

### 5.3 Marketing Channels

- TikTok/Instagram: Anime wellness clips
- YouTube: Meditation & habit guides
- Reddit: r/anime, r/wellness communities
- Discord: Community server
- Email: Weekly wellness tips
- SEO: Wellness + anime keywords

---

## Part 6: Accessibility & Inclusivity

### 6.1 Five Accessibility Modes

1. **WCAG AAA Compliance:** Enhanced contrast, focus indicators
2. **ECO CODE:** Low-energy mode (dark bg, reduced animations)
3. **NEURO CODE:** ADHD-friendly (reduced clutter, focus mode)
4. **Dyslexic Mode:** OpenDyslexic font, increased spacing
5. **No Blue Light:** Warm color filter for night use

### 6.2 Inclusive Design Principles

- Support for screen readers
- Keyboard navigation throughout
- Color-blind friendly palette
- Readable font sizes (minimum 16px)
- Clear error messages
- Multiple input methods

---

## Part 7: Review & Iterate

### 7.1 Success Metrics

- **User Engagement:** Daily active users, session duration
- **Retention:** 30-day, 90-day retention rates
- **Revenue:** MRR, LTV, churn rate
- **Quality:** Bug reports, support tickets, NPS

### 7.2 Feedback Loop

- Monthly user surveys
- Weekly analytics review
- Quarterly roadmap planning
- Community feedback integration
- A/B testing for major features

### 7.3 Lessons Learned

*[To be filled after launch and iteration]*

---

## Contact & Support

- **Email:** support@anime-ascend.com
- **Discord:** [Community Server]
- **GitHub:** https://github.com/MIDNGHTSAPPHIRE/anime-ascend-wellness
- **Website:** https://anime-ascend.manus.space

---

**Last Updated:** 2026-02-20
**Version:** 1.0.0
**Status:** Live & Ready for Users
