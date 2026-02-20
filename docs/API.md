# Anime Ascend — API Documentation

## Overview

All API endpoints are exposed via **tRPC** at `/api/trpc/`. The API uses JSON-RPC 2.0 protocol with automatic type safety.

---

## Authentication

### `auth.me` (Query, Public)
Returns the currently authenticated user or `null`.

### `auth.logout` (Mutation, Public)
Clears the session cookie and logs the user out.

---

## Health Monitoring (Primary)

### `health.logReading` (Mutation, Protected)
Log a health reading (heart rate, HRV, stress level).

**Input:** `{ heartRate: number, hrv?: number, stressLevel?: number, arrhythmiaDetected?: boolean, readingType: "manual" | "automatic" | "emergency" }`

### `health.getReadings` (Query, Protected)
Get health readings for the current user (last 50).

### `health.getLatest` (Query, Protected)
Get the most recent health reading.

### `health.getAlerts` (Query, Protected)
Get health alerts for the current user.

### `health.createAlert` (Mutation, Protected)
Create a health alert.

**Input:** `{ alertType: "fall_detected" | "arrhythmia" | "high_stress" | "low_heart_rate" | "high_heart_rate", severity: "low" | "medium" | "high" | "critical", message: string, heartRate?: number, stressLevel?: number }`

---

## Emergency

### `emergency.listContacts` (Query, Protected)
List all emergency contacts for the current user.

### `emergency.addContact` (Mutation, Protected)
Add an emergency contact.

**Input:** `{ name: string, phone: string, relationship: string }`

### `emergency.removeContact` (Mutation, Protected)
Remove an emergency contact by ID.

**Input:** `{ id: number }`

### `emergency.triggerAlert` (Mutation, Protected)
Trigger an emergency alert to all contacts.

**Input:** `{ alertType: string, message: string }`

---

## Exercise Sessions

### `exercise.startSession` (Mutation, Protected)
Start a guided exercise session with Hana.

**Input:** `{ exerciseType: "box_breathing" | "deep_breathing" | "grounding" | "body_scan" | "progressive_relaxation" | "gentle_movement", triggerReason?: string }`

### `exercise.completeSession` (Mutation, Protected)
Mark a session as completed.

**Input:** `{ sessionId: number, durationSeconds: number, completionPercentage?: number, moodBefore?: number, moodAfter?: number }`

### `exercise.getHistory` (Query, Protected)
Get exercise session history.

---

## Habits

### `habits.list` (Query, Protected)
List all habits for the current user.

### `habits.create` (Mutation, Protected)
**Input:** `{ name: string, description?: string, category?: string, emoji?: string, color?: string, frequency?: string, targetDays?: number }`

### `habits.delete` (Mutation, Protected)
**Input:** `{ id: number }`

### `habitLogs.log` (Mutation, Protected)
**Input:** `{ habitId: number, notes?: string }`

### `habitLogs.getStreak` (Query, Protected)
**Input:** `{ habitId: number }`

---

## Journal

### `journal.list` (Query, Protected)
List journal entries (most recent first).

### `journal.create` (Mutation, Protected)
**Input:** `{ title?: string, content: string, mood?: string, moodScore?: number, tags?: string }`

### `journal.delete` (Mutation, Protected)
**Input:** `{ id: number }`

---

## Mood

### `mood.log` (Mutation, Protected)
**Input:** `{ mood: string, moodScore: number, notes?: string }`

### `mood.getAverage` (Query, Protected)
Returns average mood score for last 7 days.

---

## Goals

### `goals.list` (Query, Protected)
### `goals.create` (Mutation, Protected)
**Input:** `{ title: string, description?: string, category?: string, targetDate?: string }`

### `goals.updateProgress` (Mutation, Protected)
**Input:** `{ id: number, progress: number }`

### `milestones.list` (Query, Protected)
**Input:** `{ goalId: number }`

### `milestones.complete` (Mutation, Protected)
**Input:** `{ id: number }`

---

## Tokens

### `tokens.getBalance` (Query, Protected)
### `tokens.getHistory` (Query, Protected)
### `tokens.use` (Mutation, Protected)
**Input:** `{ amount: number, description: string, relatedId?: string }`

---

## Billing

### `billing.createCheckoutSession` (Mutation, Protected)
**Input:** `{ tier: "premium" | "pro" }`
**Response:** `{ checkoutUrl: string }`

---

## Support

### `support.createTicket` (Mutation, Protected)
**Input:** `{ subject: string, description: string, category?: string }`

### `support.listTickets` (Query, Protected)

---

## Webhook

### `POST /api/stripe/webhook`
Stripe webhook endpoint. Handles: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`.
