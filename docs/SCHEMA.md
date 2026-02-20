# Anime Ascend — Database Schema

## Health Monitoring Tables

### `healthReadings`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment |
| userId | INT (FK) | References users.id |
| heartRate | INT | Beats per minute |
| hrv | DECIMAL(5,2) | Heart rate variability |
| stressLevel | INT | 1-10 scale |
| arrhythmiaDetected | BOOLEAN | Irregular rhythm flag |
| readingType | ENUM | manual, automatic, emergency |
| createdAt | TIMESTAMP | Reading timestamp |

### `healthAlerts`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment |
| userId | INT (FK) | References users.id |
| alertType | ENUM | fall_detected, arrhythmia, high_stress, low_heart_rate, high_heart_rate |
| severity | ENUM | low, medium, high, critical |
| message | TEXT | Alert description |
| heartRate | INT | Heart rate at alert time |
| stressLevel | INT | Stress level at alert time |
| acknowledged | BOOLEAN | User acknowledged flag |
| createdAt | TIMESTAMP | Alert timestamp |

### `emergencyContacts`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment |
| userId | INT (FK) | References users.id |
| name | VARCHAR(255) | Contact name |
| phone | VARCHAR(20) | Phone number |
| relationship | VARCHAR(100) | Relationship |
| isPrimary | BOOLEAN | Primary contact flag |
| createdAt | TIMESTAMP | Created |

### `exerciseSessions`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment |
| userId | INT (FK) | References users.id |
| exerciseType | ENUM | box_breathing, deep_breathing, grounding, body_scan, progressive_relaxation, gentle_movement |
| triggerReason | VARCHAR(255) | Session trigger |
| durationSeconds | INT | Duration |
| completionPercentage | INT | 0-100 |
| moodBefore | INT | Pre-session mood (1-10) |
| moodAfter | INT | Post-session mood (1-10) |
| status | ENUM | in_progress, completed, abandoned |
| startedAt | TIMESTAMP | Session start |
| completedAt | TIMESTAMP | Session end |

---

## User Table

### `users`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment |
| openId | VARCHAR(64) | Manus OAuth ID (unique) |
| name | TEXT | Display name |
| email | VARCHAR(320) | Email |
| loginMethod | VARCHAR(64) | Auth method |
| role | ENUM | user, admin |
| subscriptionTier | VARCHAR(32) | free, premium, pro |
| stripeCustomerId | VARCHAR(255) | Stripe customer ID |
| tokenBalance | INT | Token balance (default 5) |
| createdAt | TIMESTAMP | Created |
| updatedAt | TIMESTAMP | Updated |
| lastSignedIn | TIMESTAMP | Last login |

---

## Wellness Tables

### `habits`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment |
| userId | INT (FK) | References users.id |
| name | TEXT | Habit name |
| category | VARCHAR(64) | Category |
| emoji | VARCHAR(10) | Emoji icon |
| frequency | ENUM | daily, weekly, monthly |
| targetDays | INT | Target days |
| createdAt | TIMESTAMP | Created |

### `habitLogs`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment |
| habitId | INT (FK) | References habits.id |
| userId | INT (FK) | References users.id |
| notes | TEXT | Optional notes |
| completedAt | TIMESTAMP | Logged at |

### `journalEntries`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment |
| userId | INT (FK) | References users.id |
| title | TEXT | Entry title |
| content | LONGTEXT | Content |
| mood | VARCHAR(64) | Mood label |
| moodScore | INT | 1-10 |
| tags | JSON | Tags array |
| createdAt | TIMESTAMP | Created |

### `moodLogs`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment |
| userId | INT (FK) | References users.id |
| mood | VARCHAR(64) | Mood label |
| moodScore | INT | 1-10 |
| notes | TEXT | Notes |
| createdAt | TIMESTAMP | Logged at |

### `goals`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment |
| userId | INT (FK) | References users.id |
| title | TEXT | Goal title |
| description | TEXT | Description |
| category | VARCHAR(64) | Category |
| progress | INT | 0-100 |
| targetDate | DATE | Target date |
| createdAt | TIMESTAMP | Created |

### `milestones`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment |
| goalId | INT (FK) | References goals.id |
| title | TEXT | Milestone title |
| isCompleted | BOOLEAN | Completed flag |
| completedAt | TIMESTAMP | Completed at |

---

## Business Tables

### `tokenTransactions`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment |
| userId | INT (FK) | References users.id |
| amount | INT | Token amount (+/-) |
| type | ENUM | purchase, usage, bonus, refund |
| description | TEXT | Description |
| createdAt | TIMESTAMP | Transaction time |

### `subscriptions`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment |
| userId | INT (FK) | References users.id |
| stripeSubscriptionId | VARCHAR(255) | Stripe sub ID |
| tier | VARCHAR(32) | premium, pro |
| status | VARCHAR(32) | active, canceled, past_due |
| createdAt | TIMESTAMP | Created |

### `payments`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment |
| userId | INT (FK) | References users.id |
| stripePaymentIntentId | VARCHAR(255) | Stripe payment ID |
| amount | VARCHAR(32) | Amount |
| currency | VARCHAR(3) | Currency |
| status | VARCHAR(32) | succeeded, failed, pending |
| createdAt | TIMESTAMP | Payment time |

### `supportTickets`
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment |
| userId | INT (FK) | References users.id |
| subject | TEXT | Subject |
| description | TEXT | Description |
| category | VARCHAR(64) | Category |
| status | VARCHAR(32) | open, in_progress, resolved |
| createdAt | TIMESTAMP | Created |

---

## Relationships

```
users (1) → (many) healthReadings
users (1) → (many) healthAlerts
users (1) → (many) emergencyContacts
users (1) → (many) exerciseSessions
users (1) → (many) habits → (many) habitLogs
users (1) → (many) journalEntries
users (1) → (many) moodLogs
users (1) → (many) goals → (many) milestones
users (1) → (many) tokenTransactions
users (1) → (many) subscriptions
users (1) → (many) payments
users (1) → (many) supportTickets
```

**Version:** 2.0.0 (Health Monitoring Update) | **Last Updated:** 2026-02-20
