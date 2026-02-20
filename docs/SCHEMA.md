# Anime Ascend Wellness — Database Schema

## Overview

MySQL database with Drizzle ORM. All timestamps stored as UTC Unix timestamps (milliseconds since epoch).

---

## Tables

### `users`

Core user account table.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user ID |
| `openId` | VARCHAR(64) | NOT NULL, UNIQUE | Manus OAuth identifier |
| `name` | TEXT | Nullable | User's display name |
| `email` | VARCHAR(320) | Nullable | User's email address |
| `loginMethod` | VARCHAR(64) | Nullable | "manus", "google", "apple" |
| `role` | ENUM | DEFAULT "user" | "user" or "admin" |
| `subscriptionTier` | VARCHAR(32) | DEFAULT "free" | "free", "premium", "pro" |
| `subscriptionStatus` | VARCHAR(32) | Nullable | "active", "past_due", "canceled" |
| `subscriptionEndsAt` | TIMESTAMP | Nullable | When subscription ends |
| `stripeCustomerId` | VARCHAR(255) | Nullable | Stripe customer ID |
| `tokenBalance` | INT | DEFAULT 5 | Current token balance |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Account creation date |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last update |
| `lastSignedIn` | TIMESTAMP | DEFAULT NOW() | Last login |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `openId`
- INDEX: `email`, `role`, `subscriptionTier`

---

### `habits`

User habit definitions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique habit ID |
| `userId` | INT | NOT NULL, FOREIGN KEY | Reference to `users.id` |
| `name` | TEXT | NOT NULL | Habit name (e.g., "Morning Meditation") |
| `description` | TEXT | Nullable | Habit description |
| `category` | VARCHAR(64) | Nullable | "Health", "Learning", "Creativity", etc. |
| `emoji` | VARCHAR(10) | Nullable | Emoji representation |
| `color` | VARCHAR(7) | Nullable | Hex color code |
| `frequency` | ENUM | DEFAULT "daily" | "daily", "weekly", "monthly" |
| `targetDays` | INT | DEFAULT 30 | Goal duration in days |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Creation date |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last update |

**Indexes:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `userId` → `users.id`
- INDEX: `userId`, `category`

---

### `habitLogs`

Daily habit completion records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique log ID |
| `habitId` | INT | NOT NULL, FOREIGN KEY | Reference to `habits.id` |
| `userId` | INT | NOT NULL, FOREIGN KEY | Reference to `users.id` |
| `notes` | TEXT | Nullable | Optional notes about completion |
| `completedAt` | TIMESTAMP | DEFAULT NOW() | When habit was logged |

**Indexes:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `habitId` → `habits.id`
- FOREIGN KEY: `userId` → `users.id`
- INDEX: `userId`, `habitId`, `completedAt`

---

### `journalEntries`

User journal entries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique entry ID |
| `userId` | INT | NOT NULL, FOREIGN KEY | Reference to `users.id` |
| `title` | TEXT | Nullable | Entry title |
| `content` | LONGTEXT | NOT NULL | Journal content |
| `mood` | VARCHAR(64) | Nullable | Mood label (e.g., "happy") |
| `moodScore` | INT | Nullable | Mood score (1-10) |
| `tags` | JSON | Nullable | Array of tags |
| `isPrivate` | BOOLEAN | DEFAULT TRUE | Private/public toggle |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Creation date |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last update |

**Indexes:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `userId` → `users.id`
- INDEX: `userId`, `createdAt`, `mood`

---

### `moodLogs`

Mood tracking history.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique log ID |
| `userId` | INT | NOT NULL, FOREIGN KEY | Reference to `users.id` |
| `mood` | VARCHAR(64) | NOT NULL | Mood label |
| `moodScore` | INT | NOT NULL | Mood score (1-10) |
| `notes` | TEXT | Nullable | Optional notes |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Log date |

**Indexes:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `userId` → `users.id`
- INDEX: `userId`, `createdAt`, `moodScore`

---

### `goals`

Long-term user goals.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique goal ID |
| `userId` | INT | NOT NULL, FOREIGN KEY | Reference to `users.id` |
| `title` | TEXT | NOT NULL | Goal title |
| `description` | TEXT | Nullable | Goal description |
| `category` | VARCHAR(64) | Nullable | Goal category |
| `progress` | INT | DEFAULT 0 | Progress percentage (0-100) |
| `targetDate` | DATE | Nullable | Target completion date |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Creation date |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last update |

**Indexes:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `userId` → `users.id`
- INDEX: `userId`, `category`, `targetDate`

---

### `milestones`

Goal sub-tasks and checkpoints.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique milestone ID |
| `goalId` | INT | NOT NULL, FOREIGN KEY | Reference to `goals.id` |
| `userId` | INT | NOT NULL, FOREIGN KEY | Reference to `users.id` |
| `title` | TEXT | NOT NULL | Milestone title |
| `isCompleted` | BOOLEAN | DEFAULT FALSE | Completion status |
| `completedAt` | TIMESTAMP | Nullable | When milestone was completed |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Creation date |

**Indexes:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `goalId` → `goals.id`
- FOREIGN KEY: `userId` → `users.id`
- INDEX: `userId`, `goalId`, `isCompleted`

---

### `tokenTransactions`

Token purchase and usage history.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique transaction ID |
| `userId` | INT | NOT NULL, FOREIGN KEY | Reference to `users.id` |
| `amount` | INT | NOT NULL | Token amount |
| `type` | ENUM | NOT NULL | "purchase", "usage", "bonus", "refund" |
| `description` | TEXT | NOT NULL | Transaction description |
| `relatedId` | VARCHAR(255) | Nullable | Related resource ID (e.g., journal entry) |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Transaction date |

**Indexes:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `userId` → `users.id`
- INDEX: `userId`, `type`, `createdAt`

---

### `subscriptions`

Active subscription records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique subscription ID |
| `userId` | INT | NOT NULL, FOREIGN KEY | Reference to `users.id` |
| `stripeCustomerId` | VARCHAR(255) | NOT NULL | Stripe customer ID |
| `stripeSubscriptionId` | VARCHAR(255) | NOT NULL | Stripe subscription ID |
| `tier` | VARCHAR(32) | NOT NULL | "premium" or "pro" |
| `status` | VARCHAR(32) | NOT NULL | "active", "past_due", "canceled" |
| `tokensPerMonth` | INT | NOT NULL | Monthly token allowance |
| `currentTokens` | INT | NOT NULL | Current month's tokens |
| `billingCycleStart` | TIMESTAMP | NOT NULL | Billing period start |
| `billingCycleEnd` | TIMESTAMP | NOT NULL | Billing period end |
| `canceledAt` | TIMESTAMP | Nullable | When subscription was canceled |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Creation date |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last update |

**Indexes:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `userId` → `users.id`
- UNIQUE: `stripeSubscriptionId`
- INDEX: `userId`, `status`

---

### `payments`

Payment history and receipts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique payment ID |
| `userId` | INT | NOT NULL, FOREIGN KEY | Reference to `users.id` |
| `stripePaymentIntentId` | VARCHAR(255) | NOT NULL | Stripe payment intent ID |
| `amount` | VARCHAR(32) | NOT NULL | Payment amount (as string for precision) |
| `currency` | VARCHAR(3) | NOT NULL | Currency code (e.g., "USD") |
| `status` | VARCHAR(32) | NOT NULL | "succeeded", "failed", "pending" |
| `description` | TEXT | Nullable | Payment description |
| `metadata` | JSON | Nullable | Additional metadata |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Payment date |

**Indexes:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `userId` → `users.id`
- UNIQUE: `stripePaymentIntentId`
- INDEX: `userId`, `status`, `createdAt`

---

### `supportTickets`

Customer support tickets.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique ticket ID |
| `userId` | INT | NOT NULL, FOREIGN KEY | Reference to `users.id` |
| `subject` | TEXT | NOT NULL | Ticket subject |
| `description` | TEXT | NOT NULL | Ticket description |
| `category` | VARCHAR(64) | Nullable | "billing", "bug", "feature", etc. |
| `priority` | VARCHAR(32) | DEFAULT "medium" | "low", "medium", "high", "urgent" |
| `status` | VARCHAR(32) | DEFAULT "open" | "open", "in_progress", "resolved", "closed" |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Creation date |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last update |
| `resolvedAt` | TIMESTAMP | Nullable | When ticket was resolved |

**Indexes:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `userId` → `users.id`
- INDEX: `userId`, `status`, `priority`, `createdAt`

---

## Relationships

```
users (1) ──→ (many) habits
users (1) ──→ (many) habitLogs
users (1) ──→ (many) journalEntries
users (1) ──→ (many) moodLogs
users (1) ──→ (many) goals
users (1) ──→ (many) milestones
users (1) ──→ (many) tokenTransactions
users (1) ──→ (many) subscriptions
users (1) ──→ (many) payments
users (1) ──→ (many) supportTickets

habits (1) ──→ (many) habitLogs
goals (1) ──→ (many) milestones
```

---

## Data Types

| Type | Usage | Example |
|------|-------|---------|
| INT | IDs, counts, scores | `id`, `moodScore` |
| VARCHAR(n) | Short strings | `email`, `category` |
| TEXT | Medium strings | `name`, `description` |
| LONGTEXT | Large content | `journalEntries.content` |
| TIMESTAMP | Dates/times | `createdAt`, `updatedAt` |
| DATE | Dates only | `targetDate` |
| BOOLEAN | Flags | `isPrivate`, `isCompleted` |
| ENUM | Fixed options | `role`, `frequency` |
| JSON | Structured data | `tags`, `metadata` |

---

## Migrations

### v1.0.0 (2026-02-20)
- Initial schema with all core tables
- Stripe integration tables
- Support ticket system

---

## Backup & Recovery

**Backup Strategy:**
- Daily automated backups
- 30-day retention
- Point-in-time recovery available

**Recovery Procedure:**
1. Contact support
2. Specify recovery point
3. Restore from backup
4. Verify data integrity

---

**Last Updated:** 2026-02-20
**Version:** 1.0.0
