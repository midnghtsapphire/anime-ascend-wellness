# Anime Ascend Wellness

**Your Journey to Growth** — Transform personal growth through anime-inspired wellness.

[![GitHub](https://img.shields.io/badge/GitHub-MIDNGHTSAPPHIRE%2Fanime--ascend--wellness-blue)](https://github.com/MIDNGHTSAPPHIRE/anime-ascend-wellness)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Live-success)](https://anime-ascend.manus.space)

---

## 🌟 Overview

Anime Ascend is a full-stack wellness platform that combines anime-inspired aesthetics with evidence-based personal growth tools. Track habits, journal reflections, meditate, set goals, and discover wellness activities—all powered by an AI coach and token-based credit system.

**Live:** https://anime-ascend.manus.space

---

## ✨ Features

### Core Features
- **Dashboard** — Daily mood check-in, habit streaks, quick actions
- **Habits** — Track daily habits with visual progress and categories
- **Journal** — Guided journaling with mood tracking and AI suggestions
- **Meditation** — Breathing exercises, ambient sounds, session history
- **Goals** — Long-term goal setting with milestone tracking
- **Discover** — Browse wellness activities by mood and category
- **Pricing** — 3 tiers (Free, Premium $9.99/mo, Pro $19.99/mo)
- **Support** — Contact form, FAQ, ticket system

### Technical Features
- **Authentication** — Manus OAuth (Google, Email)
- **Payments** — Stripe integration with subscriptions
- **Token Economy** — Free (5 tokens), Premium (50), Pro (200) per month
- **Accessibility** — 5 modes (WCAG AAA, ECO CODE, NEURO CODE, Dyslexic, No Blue Light)
- **Testing** — 11/11 tests passing with Vitest
- **Database** — MySQL with Drizzle ORM
- **API** — tRPC with full type safety

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- pnpm 10+
- MySQL 8+

### Installation

```bash
# Clone repository
git clone https://github.com/MIDNGHTSAPPHIRE/anime-ascend-wellness.git
cd anime-ascend-wellness

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Push database schema
pnpm db:push

# Run development server
pnpm dev
```

**Development URL:** http://localhost:3000

### Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test --watch
```

### Building

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

---

## 📁 Project Structure

```
anime-ascend-wellness/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── config/        # Brand configuration
│   │   └── lib/           # Utilities and hooks
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── routers.ts         # tRPC procedures
│   ├── db.ts              # Database queries
│   ├── products.ts        # Stripe products
│   └── _core/             # Framework code
├── drizzle/               # Database schema
│   └── schema.ts
├── docs/                  # Documentation
│   ├── BLUEPRINT.md       # Project blueprint
│   ├── API.md             # API documentation
│   ├── SCHEMA.md          # Database schema
│   ├── ROADMAP.md         # Product roadmap
│   └── DEPLOYMENT.md      # Deployment guide
└── package.json
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Tailwind CSS 4 + TypeScript |
| **Backend** | Express 4 + tRPC 11 + Node.js |
| **Database** | MySQL + Drizzle ORM |
| **Auth** | Manus OAuth |
| **Payments** | Stripe |
| **Storage** | AWS S3 |
| **Testing** | Vitest |
| **Hosting** | Manus |

---

## 📚 Documentation

- **[BLUEPRINT.md](docs/BLUEPRINT.md)** — Complete project blueprint with vision, architecture, and operations
- **[API.md](docs/API.md)** — Full API documentation with examples
- **[SCHEMA.md](docs/SCHEMA.md)** — Database schema with all tables and relationships
- **[ROADMAP.md](docs/ROADMAP.md)** — Product roadmap with phases and milestones
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** — Deployment guide with checklist and troubleshooting

---

## 💳 Pricing

| Tier | Price | AI Messages | Features |
|------|-------|------------|----------|
| **Free** | $0 | 5/month | Core features |
| **Premium** | $9.99/mo | 50/month | Advanced analytics |
| **Pro** | $19.99/mo | 200/month | 1-on-1 coaching |

---

## 🔐 Authentication

Anime Ascend uses **Manus OAuth** for secure authentication. Users can sign in with:
- Google account
- Email + password

No passwords are stored locally—all authentication is handled by Manus.

---

## 💰 Payments

Payments are processed through **Stripe**. Features include:
- Subscription management
- Automatic billing
- Invoice generation
- Refund handling
- Webhook integration

**Test Card:** `4242 4242 4242 4242`

---

## ♿ Accessibility

Anime Ascend includes 5 accessibility modes:

1. **WCAG AAA Compliance** — Enhanced contrast, focus indicators
2. **ECO CODE** — Low-energy mode for reduced power consumption
3. **NEURO CODE** — ADHD-friendly with reduced clutter
4. **Dyslexic Mode** — OpenDyslexic font with increased spacing
5. **No Blue Light** — Warm color filter for night use

---

## 🧪 Testing

All code is tested with Vitest:

```bash
# Run tests
pnpm test

# Run specific test file
pnpm test server/auth.logout.test.ts

# Watch mode
pnpm test --watch

# Coverage report
pnpm test --coverage
```

**Current Status:** 11/11 tests passing ✓

---

## 🚀 Deployment

### Via Manus (Recommended)

1. Create checkpoint with `webdev_save_checkpoint`
2. Click "Publish" in Management UI
3. Select checkpoint version
4. Confirm deployment

### Manual Deployment

```bash
# Build
pnpm build

# Deploy to hosting
# (Instructions depend on hosting provider)
```

**Live URL:** https://anime-ascend.manus.space

---

## 📊 Monitoring

Monitor application health via:
- **Manus Dashboard** — Server logs, metrics, uptime
- **Stripe Dashboard** — Payment activity, webhooks
- **Database** — Query performance, disk usage
- **Browser Console** — Client-side errors

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all code
- Follow ESLint rules
- Format with Prettier
- Write tests for new features

### Database Changes
```bash
# Update schema in drizzle/schema.ts
# Generate migration
pnpm db:generate

# Apply migration
pnpm db:push
```

### Adding Features
1. Create database schema (if needed)
2. Add tRPC router and procedures
3. Build frontend pages/components
4. Write tests
5. Create checkpoint
6. Deploy

---

## 🐛 Bug Reports

Found a bug? Please report it:
- **GitHub Issues:** https://github.com/MIDNGHTSAPPHIRE/anime-ascend-wellness/issues
- **Email:** support@anime-ascend.com
- **Discord:** [Community Server]

---

## 💬 Support

Need help? Contact us:
- **Email:** support@anime-ascend.com
- **Support Page:** https://anime-ascend.manus.space/support
- **Discord:** [Community Server]
- **GitHub Discussions:** [Link]

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Anime Studios** — For inspiring wellness through storytelling
- **Manus** — For hosting and authentication
- **Stripe** — For payment processing
- **Community** — For feedback and support

---

## 📈 Roadmap

**Phase 1 (Complete ✓):** MVP with core features
**Phase 2 (Q2 2026):** Community & AI Coach
**Phase 3 (Q3 2026):** Mobile app
**Phase 4 (Q4 2026):** Accessibility & Localization
**Phase 5 (Q1 2027):** B2B & Enterprise

See [ROADMAP.md](docs/ROADMAP.md) for detailed timeline.

---

## 📞 Contact

- **Website:** https://anime-ascend.manus.space
- **GitHub:** https://github.com/MIDNGHTSAPPHIRE/anime-ascend-wellness
- **Email:** support@anime-ascend.com
- **Twitter:** [@AnimeAscend](https://twitter.com/AnimeAscend)
- **Discord:** [Join Community]

---

**Made with 💜 by the Anime Ascend team**

Last Updated: 2026-02-20 | Version: 1.0.0 | Status: Live
