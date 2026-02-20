# Anime Ascend

**Your Wellness Companion** — Health monitoring with Japanese cherry blossom aesthetics and a chibi companion named Hana.

[![GitHub](https://img.shields.io/badge/GitHub-MIDNGHTSAPPHIRE%2Fanime--ascend--wellness-pink)](https://github.com/MIDNGHTSAPPHIRE/anime-ascend-wellness)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## Overview

Anime Ascend is a health monitoring and wellness companion app. The primary purpose is real-time health monitoring (heart rate, stress detection, fall detection) with a chibi companion character named Hana who guides users through health episodes and exercises. Secondary features include habit tracking, journaling, meditation, and goal setting.

**Design:** White backgrounds, cherry blossom branches, soft pinks, Japanese minimalism with chibi mascot.

---

## Core Features (Health Monitoring)

- **Heart Rate Monitor** — PPG via phone camera for heart rate and arrhythmia detection
- **Stress Detection** — HRV-based stress monitoring with automatic exercise triggers
- **Fall Detection** — Accelerometer/gyroscope monitoring with emergency alerts
- **Companion Mode** — Hana guides you through breathing, grounding, and relaxation exercises (stays with you until stable)
- **Emergency System** — Manage contacts, trigger alerts on health events

## Secondary Features (Wellness)

- **Dashboard** — Health vitals overview, companion status, habit streaks
- **Habit Tracking** — Daily habits with streaks and categories
- **Journaling** — Guided prompts with mood tracking
- **Meditation** — Breathing exercises and ambient timer
- **Goal Setting** — Milestones and progress tracking
- **Discover** — Browse wellness activities by mood

## Platform Features

- **Stripe Billing** — Blossom (Free), Sakura ($9.99/mo), Hanami ($19.99/mo)
- **Token Economy** — AI coach tokens with purchase/usage tracking
- **5 Accessibility Modes** — WCAG AAA, ECO CODE, NEURO CODE, Dyslexic, No Blue Light
- **Support System** — Ticket creation and FAQ

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Tailwind CSS 4 + TypeScript |
| Backend | Express 4 + tRPC 11 + Node.js |
| Database | MySQL + Drizzle ORM |
| Auth | Manus OAuth |
| Payments | Stripe |
| Testing | Vitest (11/11 passing) |

---

## Development

```bash
pnpm install
pnpm dev          # Start dev server
pnpm check        # TypeScript check
pnpm test         # Run tests
pnpm db:push      # Push schema changes
```

---

## Documentation

- [Blueprint](docs/BLUEPRINT.md) — Full project vision and architecture
- [API Docs](docs/API.md) — tRPC endpoint documentation
- [Schema](docs/SCHEMA.md) — Database schema reference
- [Roadmap](docs/ROADMAP.md) — Feature roadmap
- [Deployment](docs/DEPLOYMENT.md) — Deployment guide

---

## Subscription Tiers

| Feature | Blossom (Free) | Sakura ($9.99/mo) | Hanami ($19.99/mo) |
|---------|----------------|--------------------|--------------------|
| Heart monitoring | 3x/day | Unlimited | Continuous |
| Stress detection | Basic | Advanced | Advanced |
| Fall detection | — | Yes | Yes |
| Companion mode | 3/month | Unlimited | Unlimited |
| Emergency alerts | — | Yes | Yes |
| AI tokens | 3/month | 50/month | 200/month |
| Family monitoring | — | — | Yes |

**Test Card:** `4242 4242 4242 4242`

---

## Accessibility Modes

1. **WCAG AAA** — Maximum contrast, large text, visible focus indicators
2. **ECO CODE** — Dark backgrounds, reduced animations, minimal data usage
3. **NEURO CODE** — ADHD-friendly, reduced clutter, focus mode
4. **DYSLEXIC MODE** — OpenDyslexic font, increased letter spacing
5. **NO BLUE LIGHT** — Warm color filter, removes blue wavelengths

---

## Repository

- **GitHub:** [MIDNGHTSAPPHIRE/anime-ascend-wellness](https://github.com/MIDNGHTSAPPHIRE/anime-ascend-wellness)
- **Part of:** [meetaudreyevans.com](https://meetaudreyevans.com) hub

**Last Updated:** 2026-02-20 | Version: 2.0.0 (Health Monitoring Update)
