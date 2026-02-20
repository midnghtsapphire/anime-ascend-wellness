# Anime Ascend — Project Blueprint

## Vision

Anime Ascend is a health monitoring and wellness companion app with a Japanese cherry blossom aesthetic. The primary purpose is real-time health monitoring (heart rate, stress, fall detection) with a chibi companion character named Hana who guides users through health episodes and exercises. Secondary features include habit tracking, journaling, meditation, and goal setting.

---

## Part 1: Foundation & Brand

### 1.1 Brand Identity

| Aspect | Details |
|--------|---------|
| **Name** | Anime Ascend |
| **Tagline** | Your Wellness Companion |
| **Core Colors** | Sakura Pink (#e8729a), Soft Pink (#f5a3c0), White (#ffffff), Rose (#fdf2f4) |
| **Accent Colors** | Warm Gold (#e8a849), Soft Teal (#7ab8c4), Gentle Green (#7ab87a), Deep Rose (#d4556b) |
| **Text Colors** | Dark (#3d2b2e), Muted (#8a7075) |
| **Typography** | Outfit (headings), DM Sans (body) |
| **Design Language** | White backgrounds, cherry blossom branches, Japanese minimalism, chibi mascot |
| **Mascot** | Hana — a chibi character who guides users through exercises and health episodes |
| **Target Audience** | Health-conscious users, elderly/sick users needing monitoring, anime fans |

### 1.2 Core Values

- **Health First:** Real-time monitoring for heart, stress, and falls
- **Companion Care:** Hana stays with users during health episodes, not just showing a list
- **Accessibility:** 5 accessibility modes for all users (WCAG AAA, ECO CODE, NEURO CODE, Dyslexic, No Blue Light)
- **Elegance:** Dainty, subtle, Japanese minimalism with cherry blossom elements
- **Privacy:** All health data encrypted and never shared

---

## Part 2: Product Architecture

### 2.1 Primary Features (Health Monitoring)

#### **Heart Rate Monitor**
- PPG (photoplethysmography) via phone camera + flash
- Real-time heart rate display with animated pulse visualization
- Arrhythmia detection (irregular rhythm alerts)
- Heart Rate Variability (HRV) tracking
- Historical heart rate data with trends

#### **Stress Detection**
- Biometric signal monitoring (HRV-based stress index)
- Real-time stress level indicator (Low/Moderate/High/Critical)
- Automatic guided exercise trigger when stress is elevated
- Stress history and pattern recognition

#### **Fall Detection**
- Accelerometer and gyroscope monitoring
- Automatic fall event detection
- Emergency contact alert system
- Configurable sensitivity levels
- False positive handling with user confirmation

#### **Companion Mode**
- Hana (chibi mascot) guides users through exercises
- Active presence during health episodes — stays with user until stable
- Box breathing (4-4-4-4 pattern)
- Progressive muscle relaxation
- Grounding exercises (5-4-3-2-1 technique)
- Body scan meditation
- Gentle movement sequences
- Session tracking with duration and completion

#### **Emergency System**
- Emergency contact management (name, phone, relationship)
- Automatic alerts on fall detection
- Automatic alerts on concerning vital signs
- One-tap emergency call
- Location sharing capability

### 2.2 Secondary Features (Wellness)

#### **Dashboard**
- Health vitals overview (heart rate, stress, last check)
- Companion status with Hana
- Quick access to health monitoring
- Habit streak tracker
- Weekly wellness summary

#### **Habits**
- Create, track, and log daily habits
- Visual streak counter
- Categories: Health, Mindfulness, Fitness, Nutrition, Sleep, Social
- Emoji customization per habit

#### **Journal**
- Guided journaling prompts
- Mood logging with emoji selector
- Private entries with tags
- AI wellness coach suggestions

#### **Meditation**
- Breathing exercise timer (4-7-8, box breathing)
- Ambient sound selection
- Session history and stats

#### **Goals**
- Long-term goal setting with milestones
- Progress tracking (0-100%)
- Category organization
- Target dates

#### **Discover**
- Browse wellness activities by mood
- Health-focused activity cards
- Filter by category

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
| **LLM** | Built-in Forge API (AI coach) |

### 3.2 Database Schema

**Health Tables:**
- `healthReadings` — Heart rate, HRV, stress level, arrhythmia detection
- `healthAlerts` — Alerts triggered by health events (fall, arrhythmia, high stress)
- `emergencyContacts` — User emergency contacts with phone and relationship
- `exerciseSessions` — Guided exercise sessions with Hana (type, duration, completion)

**Wellness Tables:**
- `habits` — Habit definitions with categories and metadata
- `habitLogs` — Daily habit completion records
- `journalEntries` — Journal entries with mood and tags
- `moodLogs` — Mood tracking history
- `goals` — User goals with progress tracking
- `milestones` — Goal sub-tasks and checkpoints

**Business Tables:**
- `tokenTransactions` — Token purchase/usage history
- `subscriptions` — Active subscription records with Stripe IDs
- `payments` — Payment history
- `supportTickets` — Customer support tickets

### 3.3 API Routes (tRPC)

```
/api/trpc/
  ├── auth.me / auth.logout
  ├── health.logReading
  ├── health.getReadings
  ├── health.getLatest
  ├── health.getAlerts
  ├── health.createAlert
  ├── emergency.listContacts
  ├── emergency.addContact
  ├── emergency.removeContact
  ├── emergency.triggerAlert
  ├── exercise.startSession
  ├── exercise.completeSession
  ├── exercise.getHistory
  ├── habits.list / create / delete
  ├── habitLogs.log / getStreak
  ├── journal.list / create / delete
  ├── mood.log / getAverage
  ├── goals.list / create / updateProgress
  ├── milestones.list / complete
  ├── tokens.getBalance / getHistory / use
  ├── billing.createCheckoutSession
  └── support.createTicket / listTickets
```

### 3.4 File Structure

```
anime-ascend-wellness/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx           (Landing page with cherry blossom hero)
│   │   │   ├── Dashboard.tsx      (Health-first dashboard)
│   │   │   ├── HealthMonitor.tsx  (Heart rate, stress, fall detection)
│   │   │   ├── CompanionMode.tsx  (Hana guided exercises)
│   │   │   ├── Emergency.tsx      (Emergency contacts management)
│   │   │   ├── Habits.tsx
│   │   │   ├── Journal.tsx
│   │   │   ├── Meditation.tsx
│   │   │   ├── Goals.tsx
│   │   │   ├── Discover.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── Support.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── NotFound.tsx
│   │   ├── config/brand.ts
│   │   ├── App.tsx
│   │   └── index.css
│   └── index.html
├── server/
│   ├── routers.ts
│   ├── db.ts
│   ├── products.ts
│   ├── stripe-checkout.ts
│   ├── stripe-webhook.ts
│   └── _core/
├── drizzle/schema.ts
├── docs/
│   ├── BLUEPRINT.md
│   ├── ROADMAP.md
│   ├── API.md
│   ├── SCHEMA.md
│   └── DEPLOYMENT.md
├── package.json
└── README.md
```

---

## Part 4: Subscription Tiers

| Feature | Blossom (Free) | Sakura ($9.99/mo) | Hanami ($19.99/mo) |
|---------|----------------|--------------------|--------------------|
| Heart monitoring | 3x/day | Unlimited | Continuous |
| Stress detection | Basic | Advanced | Advanced |
| Fall detection | — | Yes | Yes |
| Habits | 5 | Unlimited | Unlimited |
| Journal | 5/month | Unlimited | Unlimited |
| AI tokens | 3/month | 50/month | 200/month |
| Companion mode | 3/month | Unlimited | Unlimited |
| Emergency alerts | — | Yes | Yes |
| Family monitoring | — | — | Yes |
| Data export | — | — | Yes |

---

## Part 5: Accessibility Modes

1. **WCAG AAA** — Maximum contrast, large text, visible focus indicators
2. **ECO CODE** — Dark backgrounds, reduced animations, minimal data usage
3. **NEURO CODE** — ADHD-friendly, reduced clutter, focus mode
4. **DYSLEXIC MODE** — OpenDyslexic font, increased letter spacing, high contrast
5. **NO BLUE LIGHT** — Warm color filter, removes blue wavelengths

---

## Contact & Support

- **Email:** support@animeascend.com
- **GitHub:** https://github.com/MIDNGHTSAPPHIRE/anime-ascend-wellness

---

**Last Updated:** 2026-02-20
**Version:** 2.0.0 (Health Monitoring Update)
**Status:** Live
