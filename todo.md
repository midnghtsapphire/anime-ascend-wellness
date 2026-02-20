# Anime Ascend Wellness — Project TODO

## Phase 1: Foundation
- [x] Database schema (users, habits, journal entries, goals, mood logs, tokens, subscriptions, admin)
- [x] Brand configuration (anime-inspired, coming-of-age themes, neon accents, glassmorphism)
- [x] Global CSS theming with OKLCH colors
- [x] Google Fonts and anime-inspired typography

## Phase 2: Frontend Pages
- [x] Landing/Home page with hero, features, CTA
- [x] Dashboard (daily overview, mood check-in, streak tracker, quick actions)
- [x] Discover page (browse wellness activities by mood)
- [x] Habits page (habit tracker with streaks, categories)
- [x] Journal page (guided journaling, mood tracking)
- [x] Meditation page (breathing exercises, ambient timer)
- [x] Goals page (goal setting, milestone tracking)
- [x] Settings page (account, accessibility, billing, notifications)

## Phase 3: Backend API
- [x] tRPC routers for habits CRUD
- [x] tRPC routers for journal CRUD
- [x] tRPC routers for goals CRUD
- [x] tRPC routers for mood logging
- [ ] AI wellness coach endpoint (OpenRouter LLM)
- [x] Token economy system (balance, usage, purchase)
- [x] Support ticket system

## Phase 4: Auth, Billing, Admin, Accessibility
- [x] Google OAuth (Sign in with Google) - via Manus OAuth
- [x] Email/password auth with JWT - via Manus OAuth
- [x] Stripe billing (subscriptions + one-time payments)
- [x] Pricing page with tiers (Free, Premium, Pro)
- [x] Token/credit economy (free tier + paid tokens for bulk usage)
- [ ] Admin dashboard (user stats, revenue, subscriptions, moderation)
- [x] WCAG AAA compliance mode (CSS + Settings toggle)
- [x] ECO CODE mode (low energy, reduced animations, dark backgrounds)
- [x] NEURO CODE mode (ADHD-friendly, reduced clutter, focus mode)
- [x] DYSLEXIC MODE (OpenDyslexic font, increased spacing, high contrast)
- [x] NO BLUE LIGHT mode (warm color filter toggle, removes blue wavelengths)
- [x] Settings page (account, accessibility, billing, notifications)
- [ ] Payment failure handling (dunning emails, retry logic, grace periods)
- [ ] Self-healing error recovery

## Phase 5: Customer Service & Testing
- [x] Support page (chat, FAQ, contact, refund)
- [ ] Payment failure handling (dunning, retry, grace)
- [ ] Self-healing error recovery
- [x] Vitest unit tests for backend (21/21 passing)
- [ ] Login/Signup pages

## Phase 6: Deploy & Ship
- [ ] Push to GitHub (MIDNGHTSAPPHIRE/seishun-wellness)
- [ ] Add to meetaudreyevans.com hub
- [ ] Save checkpoint and deploy

## CRITICAL UPDATE — Core Health Monitoring Features (PRIMARY PURPOSE)
- [x] Retheme: White background, cherry blossom branches, soft pinks, Japanese minimalism
- [x] Retheme: Chibi mascot character (Hana) as guide/companion
- [x] Heart Arrhythmia Detection (PPG via phone camera + flash)
- [x] Heart Rate Variability (HRV) monitoring
- [x] Stress Detection (biometric signals monitoring)
- [x] Fall Detection (accelerometer/gyroscope)
- [x] Guided Exercises (companion stays with user through session)
- [x] Companion Mode (active presence during health episodes)
- [x] Emergency Alerts (alert emergency contacts on fall/concerning vitals)
- [x] Emergency Contacts management page
- [x] Health Dashboard (primary view — vitals, alerts, history)
- [x] Update navigation: Health features are PRIMARY, habits/journal are SECONDARY
- [x] Backend: health readings, alerts, emergency contacts, exercise sessions tables
- [x] Backend: tRPC routers for all health features
- [x] Update tests for health features (21/21 passing)
- [ ] Push to GitHub MIDNGHTSAPPHIRE/anime-ascend-wellness
- [ ] Add to meetaudreyevans.com hub
