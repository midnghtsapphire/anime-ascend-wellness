# Anime Ascend Wellness — API Documentation

## Overview

All API endpoints are exposed via **tRPC** at `/api/trpc/`. The API uses **JSON-RPC 2.0** protocol with automatic type safety between frontend and backend.

**Base URL:** `https://anime-ascend.manus.space/api/trpc/`

---

## Authentication

All endpoints require authentication via Manus OAuth, except public endpoints.

**Auth Flow:**
1. User clicks "Sign In"
2. Redirected to Manus OAuth portal
3. OAuth callback sets session cookie
4. All subsequent requests include session cookie
5. Backend validates cookie and injects `ctx.user`

**Protected Procedures:** Require valid session cookie
**Public Procedures:** No authentication required

---

## Auth Router

### `auth.me`

Get current authenticated user.

**Type:** Query (GET)
**Auth:** Public
**Response:**
```typescript
{
  id: number;
  openId: string;
  email: string | null;
  name: string | null;
  role: "user" | "admin";
  subscriptionTier: "free" | "premium" | "pro";
  tokenBalance: number;
  createdAt: Date;
  lastSignedIn: Date;
}
```

**Example:**
```javascript
const user = await trpc.auth.me.useQuery();
```

---

### `auth.logout`

Logout current user and clear session.

**Type:** Mutation (POST)
**Auth:** Protected
**Input:** None
**Response:**
```typescript
{ success: true }
```

**Example:**
```javascript
const { mutate } = trpc.auth.logout.useMutation({
  onSuccess: () => window.location.href = "/"
});
mutate();
```

---

## Habits Router

### `habits.list`

Get all habits for current user.

**Type:** Query (GET)
**Auth:** Protected
**Response:**
```typescript
Array<{
  id: number;
  userId: number;
  name: string;
  description?: string;
  category?: string;
  emoji?: string;
  color?: string;
  frequency: "daily" | "weekly" | "monthly";
  targetDays: number;
  createdAt: Date;
}>
```

---

### `habits.create`

Create a new habit.

**Type:** Mutation (POST)
**Auth:** Protected
**Input:**
```typescript
{
  name: string;                              // Required
  description?: string;
  category?: string;                         // e.g., "Health", "Learning"
  emoji?: string;                            // e.g., "💪"
  color?: string;                            // Hex color
  frequency?: "daily" | "weekly" | "monthly"; // Default: "daily"
  targetDays?: number;                       // Default: 30
}
```

**Response:**
```typescript
{ success: true }
```

**Example:**
```javascript
const { mutate } = trpc.habits.create.useMutation();
mutate({
  name: "Morning Meditation",
  category: "Health",
  emoji: "🧘",
  frequency: "daily",
  targetDays: 30
});
```

---

### `habits.delete`

Delete a habit.

**Type:** Mutation (DELETE)
**Auth:** Protected
**Input:**
```typescript
{ id: number }
```

**Response:**
```typescript
{ success: true }
```

---

## Habit Logs Router

### `habitLogs.log`

Log a habit completion.

**Type:** Mutation (POST)
**Auth:** Protected
**Input:**
```typescript
{
  habitId: number;
  notes?: string;
}
```

**Response:**
```typescript
{ success: true }
```

---

### `habitLogs.getStreak`

Get current streak for a habit.

**Type:** Query (GET)
**Auth:** Protected
**Input:**
```typescript
{ habitId: number }
```

**Response:**
```typescript
number  // Current streak count
```

---

## Journal Router

### `journal.list`

Get all journal entries for current user.

**Type:** Query (GET)
**Auth:** Protected
**Response:**
```typescript
Array<{
  id: number;
  userId: number;
  title?: string;
  content: string;
  mood?: string;
  moodScore?: number;  // 1-10
  tags?: string[];
  isPrivate: boolean;
  createdAt: Date;
}>
```

---

### `journal.create`

Create a new journal entry.

**Type:** Mutation (POST)
**Auth:** Protected
**Input:**
```typescript
{
  title?: string;
  content: string;                    // Required
  mood?: string;
  moodScore?: number;                 // 1-10
  tags?: string[];
  isPrivate?: boolean;                // Default: true
}
```

**Response:**
```typescript
{ success: true }
```

---

### `journal.delete`

Delete a journal entry.

**Type:** Mutation (DELETE)
**Auth:** Protected
**Input:**
```typescript
{ id: number }
```

**Response:**
```typescript
{ success: true }
```

---

## Mood Router

### `mood.log`

Log a mood entry.

**Type:** Mutation (POST)
**Auth:** Protected
**Input:**
```typescript
{
  mood: string;              // e.g., "happy", "anxious"
  moodScore: number;         // 1-10 (required)
  notes?: string;
}
```

**Response:**
```typescript
{ success: true }
```

---

### `mood.getAverage`

Get average mood score for user.

**Type:** Query (GET)
**Auth:** Protected
**Response:**
```typescript
number  // Average mood score (1-10)
```

---

## Goals Router

### `goals.list`

Get all goals for current user.

**Type:** Query (GET)
**Auth:** Protected
**Response:**
```typescript
Array<{
  id: number;
  userId: number;
  title: string;
  description?: string;
  category?: string;
  progress: number;         // 0-100
  targetDate?: Date;
  createdAt: Date;
}>
```

---

### `goals.create`

Create a new goal.

**Type:** Mutation (POST)
**Auth:** Protected
**Input:**
```typescript
{
  title: string;            // Required
  description?: string;
  category?: string;
  targetDate?: Date;
}
```

**Response:**
```typescript
{ success: true }
```

---

### `goals.updateProgress`

Update goal progress.

**Type:** Mutation (PATCH)
**Auth:** Protected
**Input:**
```typescript
{
  id: number;
  progress: number;         // 0-100
}
```

**Response:**
```typescript
{ success: true }
```

---

## Milestones Router

### `milestones.list`

Get milestones for a goal.

**Type:** Query (GET)
**Auth:** Protected
**Input:**
```typescript
{ goalId: number }
```

**Response:**
```typescript
Array<{
  id: number;
  goalId: number;
  title: string;
  isCompleted: boolean;
  completedAt?: Date;
}>
```

---

### `milestones.complete`

Mark milestone as complete.

**Type:** Mutation (PATCH)
**Auth:** Protected
**Input:**
```typescript
{ id: number }
```

**Response:**
```typescript
{ success: true }
```

---

## Tokens Router

### `tokens.getBalance`

Get current token balance.

**Type:** Query (GET)
**Auth:** Protected
**Response:**
```typescript
number  // Token balance
```

---

### `tokens.getHistory`

Get token transaction history.

**Type:** Query (GET)
**Auth:** Protected
**Response:**
```typescript
Array<{
  id: number;
  userId: number;
  amount: number;
  type: "purchase" | "usage" | "bonus" | "refund";
  description: string;
  relatedId?: string;
  createdAt: Date;
}>
```

---

### `tokens.use`

Use tokens for a feature.

**Type:** Mutation (POST)
**Auth:** Protected
**Input:**
```typescript
{
  amount: number;           // Positive number
  description: string;      // e.g., "AI Coach Message"
  relatedId?: string;       // Optional reference ID
}
```

**Response:**
```typescript
{ success: true }
```

---

## Billing Router

### `billing.createCheckoutSession`

Create Stripe checkout session for subscription upgrade.

**Type:** Mutation (POST)
**Auth:** Protected
**Input:**
```typescript
{
  tier: "premium" | "pro"
}
```

**Response:**
```typescript
{
  checkoutUrl: string  // Stripe checkout URL
}
```

**Example:**
```javascript
const { mutate } = trpc.billing.createCheckoutSession.useMutation({
  onSuccess: (data) => {
    window.open(data.checkoutUrl, "_blank");
  }
});
mutate({ tier: "premium" });
```

---

## Support Router

### `support.createTicket`

Create a support ticket.

**Type:** Mutation (POST)
**Auth:** Protected
**Input:**
```typescript
{
  subject: string;                              // Required
  description: string;                          // Required
  category?: string;                            // e.g., "billing", "bug"
  priority?: "low" | "medium" | "high" | "urgent"; // Default: "medium"
}
```

**Response:**
```typescript
{ success: true }
```

---

### `support.listTickets`

Get user's support tickets.

**Type:** Query (GET)
**Auth:** Protected
**Response:**
```typescript
Array<{
  id: number;
  userId: number;
  subject: string;
  description: string;
  category?: string;
  priority: string;
  status: string;
  createdAt: Date;
}>
```

---

## Error Handling

All errors follow tRPC error format:

```typescript
{
  code: "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR";
  message: string;
}
```

**Common Errors:**
- `UNAUTHORIZED` — Not authenticated
- `FORBIDDEN` — Authenticated but not authorized
- `NOT_FOUND` — Resource doesn't exist
- `BAD_REQUEST` — Invalid input
- `INTERNAL_SERVER_ERROR` — Server error

---

## Rate Limiting

- Free tier: 100 requests/hour
- Premium: 500 requests/hour
- Pro: 2000 requests/hour

---

## Webhooks

### Stripe Webhook: `POST /api/stripe/webhook`

Handles Stripe events:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `invoice.paid`

**Headers Required:**
```
Stripe-Signature: <signature>
```

---

## SDK Usage

### React Hook Example

```javascript
import { trpc } from "@/lib/trpc";

function HabitsList() {
  const { data: habits, isLoading } = trpc.habits.list.useQuery();
  const createHabit = trpc.habits.create.useMutation({
    onSuccess: () => {
      // Invalidate cache to refetch
      trpc.useUtils().habits.list.invalidate();
    }
  });

  return (
    <div>
      {habits?.map(habit => (
        <div key={habit.id}>{habit.name}</div>
      ))}
      <button onClick={() => createHabit.mutate({ name: "New Habit" })}>
        Add Habit
      </button>
    </div>
  );
}
```

---

## Changelog

### v1.0.0 (2026-02-20)
- Initial API release
- 20+ endpoints
- Stripe integration
- Token economy
- Support system

---

**Last Updated:** 2026-02-20
**Status:** Live
