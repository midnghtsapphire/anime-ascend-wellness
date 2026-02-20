import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
  index,
} from "drizzle-orm/mysql-core";

/**
 * ANIME ASCEND — Database Schema
 * PRIMARY: Health monitoring (heart, stress, fall detection, companion, emergency)
 * SECONDARY: Habits, journal, goals, tokens, subscriptions
 */

// ============================================================================
// USERS & AUTHENTICATION
// ============================================================================

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  email: varchar("email", { length: 320 }).unique(),
  name: text("name"),
  avatar: text("avatar"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  accessibilityMode: mysqlEnum("accessibilityMode", [
    "default", "wcag-aaa", "eco-code", "neuro-code", "dyslexic", "no-blue-light",
  ]).default("default"),
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "premium", "pro"]).default("free"),
  tokenBalance: int("tokenBalance").default(5),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  subscriptionStatus: mysqlEnum("subscriptionStatus", [
    "active", "past_due", "canceled", "expired",
  ]).default("active"),
  subscriptionEndsAt: timestamp("subscriptionEndsAt"),
  preferences: json("preferences").$type<{
    theme?: "dark" | "light";
    notifications?: boolean;
    emailUpdates?: boolean;
    language?: string;
    companionEnabled?: boolean;
    emergencyAlertsEnabled?: boolean;
  }>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================================
// HEALTH MONITORING — Heart Rate & Arrhythmia
// ============================================================================

export const heartReadings = mysqlTable(
  "heartReadings",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    bpm: int("bpm").notNull(),
    hrv: decimal("hrv", { precision: 8, scale: 2 }),
    rhythmStatus: mysqlEnum("rhythmStatus", ["normal", "irregular", "arrhythmia_detected", "tachycardia", "bradycardia"]).default("normal"),
    confidence: decimal("confidence", { precision: 5, scale: 2 }),
    ppgData: json("ppgData").$type<number[]>(),
    duration: int("duration"),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("heartReadings_userId_idx").on(table.userId),
    rhythmIdx: index("heartReadings_rhythm_idx").on(table.rhythmStatus),
  })
);

export type HeartReading = typeof heartReadings.$inferSelect;
export type InsertHeartReading = typeof heartReadings.$inferInsert;

// ============================================================================
// HEALTH MONITORING — Stress Detection
// ============================================================================

export const stressReadings = mysqlTable(
  "stressReadings",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    stressLevel: int("stressLevel").notNull(),
    hrvBaseline: decimal("hrvBaseline", { precision: 8, scale: 2 }),
    heartRateAtReading: int("heartRateAtReading"),
    triggers: json("triggers").$type<string[]>(),
    isEpisode: boolean("isEpisode").default(false),
    episodeDuration: int("episodeDuration"),
    exerciseCompleted: boolean("exerciseCompleted").default(false),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("stressReadings_userId_idx").on(table.userId),
  })
);

export type StressReading = typeof stressReadings.$inferSelect;
export type InsertStressReading = typeof stressReadings.$inferInsert;

// ============================================================================
// HEALTH MONITORING — Fall Detection
// ============================================================================

export const fallEvents = mysqlTable(
  "fallEvents",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    severity: mysqlEnum("severity", ["mild", "moderate", "severe"]).default("moderate"),
    accelerometerData: json("accelerometerData").$type<{ x: number; y: number; z: number; timestamp: number }[]>(),
    gyroscopeData: json("gyroscopeData").$type<{ alpha: number; beta: number; gamma: number; timestamp: number }[]>(),
    impactForce: decimal("impactForce", { precision: 8, scale: 2 }),
    location: text("location"),
    alertSent: boolean("alertSent").default(false),
    alertedContacts: json("alertedContacts").$type<string[]>(),
    userResponded: boolean("userResponded").default(false),
    responseTime: int("responseTime"),
    falseAlarm: boolean("falseAlarm").default(false),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("fallEvents_userId_idx").on(table.userId),
    severityIdx: index("fallEvents_severity_idx").on(table.severity),
  })
);

export type FallEvent = typeof fallEvents.$inferSelect;
export type InsertFallEvent = typeof fallEvents.$inferInsert;

// ============================================================================
// EMERGENCY CONTACTS
// ============================================================================

export const emergencyContacts = mysqlTable(
  "emergencyContacts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    name: text("name").notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    email: varchar("email", { length: 320 }),
    relationship: varchar("relationship", { length: 64 }),
    isPrimary: boolean("isPrimary").default(false),
    notifyOnFall: boolean("notifyOnFall").default(true),
    notifyOnArrhythmia: boolean("notifyOnArrhythmia").default(true),
    notifyOnStress: boolean("notifyOnStress").default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("emergencyContacts_userId_idx").on(table.userId),
  })
);

export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsertEmergencyContact = typeof emergencyContacts.$inferInsert;

// ============================================================================
// GUIDED EXERCISE SESSIONS (Companion Mode)
// ============================================================================

export const exerciseSessions = mysqlTable(
  "exerciseSessions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    type: mysqlEnum("type", [
      "breathing", "grounding", "stretching", "cardiac_recovery",
      "stress_relief", "meditation", "progressive_relaxation",
    ]).notNull(),
    trigger: mysqlEnum("trigger", [
      "arrhythmia", "stress_episode", "fall_recovery", "manual", "scheduled",
    ]).default("manual"),
    triggerReadingId: int("triggerReadingId"),
    duration: int("duration"),
    completedSteps: int("completedSteps").default(0),
    totalSteps: int("totalSteps"),
    heartRateBefore: int("heartRateBefore"),
    heartRateAfter: int("heartRateAfter"),
    stressBefore: int("stressBefore"),
    stressAfter: int("stressAfter"),
    completed: boolean("completed").default(false),
    companionMessages: json("companionMessages").$type<{ role: string; message: string; timestamp: number }[]>(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    completedAt: timestamp("completedAt"),
  },
  (table) => ({
    userIdIdx: index("exerciseSessions_userId_idx").on(table.userId),
    typeIdx: index("exerciseSessions_type_idx").on(table.type),
  })
);

export type ExerciseSession = typeof exerciseSessions.$inferSelect;
export type InsertExerciseSession = typeof exerciseSessions.$inferInsert;

// ============================================================================
// HEALTH ALERTS
// ============================================================================

export const healthAlerts = mysqlTable(
  "healthAlerts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    type: mysqlEnum("type", [
      "arrhythmia", "high_heart_rate", "low_heart_rate",
      "stress_episode", "fall_detected", "inactivity",
    ]).notNull(),
    severity: mysqlEnum("severity", ["info", "warning", "critical"]).default("warning"),
    message: text("message").notNull(),
    relatedReadingId: int("relatedReadingId"),
    acknowledged: boolean("acknowledged").default(false),
    acknowledgedAt: timestamp("acknowledgedAt"),
    emergencyContactsNotified: boolean("emergencyContactsNotified").default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("healthAlerts_userId_idx").on(table.userId),
    typeIdx: index("healthAlerts_type_idx").on(table.type),
  })
);

export type HealthAlert = typeof healthAlerts.$inferSelect;
export type InsertHealthAlert = typeof healthAlerts.$inferInsert;

// ============================================================================
// HABITS & TRACKING (Secondary)
// ============================================================================

export const habits = mysqlTable(
  "habits",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    category: varchar("category", { length: 64 }),
    emoji: varchar("emoji", { length: 10 }),
    color: varchar("color", { length: 7 }),
    frequency: mysqlEnum("frequency", ["daily", "weekly", "monthly"]).default("daily"),
    targetDays: int("targetDays").default(7),
    isActive: boolean("isActive").default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("habits_userId_idx").on(table.userId),
  })
);

export type Habit = typeof habits.$inferSelect;
export type InsertHabit = typeof habits.$inferInsert;

export const habitLogs = mysqlTable(
  "habitLogs",
  {
    id: int("id").autoincrement().primaryKey(),
    habitId: int("habitId").notNull(),
    userId: int("userId").notNull(),
    completedAt: timestamp("completedAt").defaultNow().notNull(),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    habitIdIdx: index("habitLogs_habitId_idx").on(table.habitId),
    userIdIdx: index("habitLogs_userId_idx").on(table.userId),
  })
);

export type HabitLog = typeof habitLogs.$inferSelect;
export type InsertHabitLog = typeof habitLogs.$inferInsert;

// ============================================================================
// JOURNAL & MOOD TRACKING (Secondary)
// ============================================================================

export const journalEntries = mysqlTable(
  "journalEntries",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    title: text("title"),
    content: text("content").notNull(),
    mood: varchar("mood", { length: 32 }),
    moodScore: int("moodScore"),
    tags: json("tags").$type<string[]>(),
    isPrivate: boolean("isPrivate").default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("journalEntries_userId_idx").on(table.userId),
  })
);

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = typeof journalEntries.$inferInsert;

export const moodLogs = mysqlTable(
  "moodLogs",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    mood: varchar("mood", { length: 32 }).notNull(),
    moodScore: int("moodScore").notNull(),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("moodLogs_userId_idx").on(table.userId),
  })
);

export type MoodLog = typeof moodLogs.$inferSelect;
export type InsertMoodLog = typeof moodLogs.$inferInsert;

// ============================================================================
// GOALS & MILESTONES (Secondary)
// ============================================================================

export const goals = mysqlTable(
  "goals",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    category: varchar("category", { length: 64 }),
    targetDate: timestamp("targetDate"),
    progress: int("progress").default(0),
    status: mysqlEnum("status", ["active", "completed", "abandoned"]).default("active"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("goals_userId_idx").on(table.userId),
  })
);

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = typeof goals.$inferInsert;

export const milestones = mysqlTable(
  "milestones",
  {
    id: int("id").autoincrement().primaryKey(),
    goalId: int("goalId").notNull(),
    userId: int("userId").notNull(),
    title: text("title").notNull(),
    targetDate: timestamp("targetDate"),
    isCompleted: boolean("isCompleted").default(false),
    completedAt: timestamp("completedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    goalIdIdx: index("milestones_goalId_idx").on(table.goalId),
    userIdIdx: index("milestones_userId_idx").on(table.userId),
  })
);

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = typeof milestones.$inferInsert;

// ============================================================================
// TOKEN & CREDIT ECONOMY
// ============================================================================

export const tokenTransactions = mysqlTable(
  "tokenTransactions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    amount: int("amount").notNull(),
    type: mysqlEnum("type", ["purchase", "usage", "refund", "bonus"]).notNull(),
    description: text("description"),
    relatedId: varchar("relatedId", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("tokenTransactions_userId_idx").on(table.userId),
  })
);

export type TokenTransaction = typeof tokenTransactions.$inferSelect;
export type InsertTokenTransaction = typeof tokenTransactions.$inferInsert;

// ============================================================================
// SUBSCRIPTIONS & BILLING
// ============================================================================

export const subscriptions = mysqlTable(
  "subscriptions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().unique(),
    stripeCustomerId: varchar("stripeCustomerId", { length: 255 }).notNull(),
    stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }).notNull().unique(),
    tier: mysqlEnum("tier", ["free", "premium", "pro"]).notNull(),
    status: mysqlEnum("status", ["active", "past_due", "canceled", "expired"]).notNull(),
    tokensPerMonth: int("tokensPerMonth").notNull(),
    currentTokens: int("currentTokens").notNull(),
    billingCycleStart: timestamp("billingCycleStart").notNull(),
    billingCycleEnd: timestamp("billingCycleEnd").notNull(),
    canceledAt: timestamp("canceledAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("subscriptions_userId_idx").on(table.userId),
    stripeCustomerIdIdx: index("subscriptions_stripeCustomerId_idx").on(table.stripeCustomerId),
  })
);

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// ============================================================================
// PAYMENTS & INVOICES
// ============================================================================

export const payments = mysqlTable(
  "payments",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).notNull().unique(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    status: mysqlEnum("status", [
      "pending", "succeeded", "failed", "canceled", "refunded",
    ]).notNull(),
    description: text("description"),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("payments_userId_idx").on(table.userId),
  })
);

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// ============================================================================
// ADMIN & SUPPORT
// ============================================================================

export const supportTickets = mysqlTable(
  "supportTickets",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    subject: text("subject").notNull(),
    description: text("description").notNull(),
    category: varchar("category", { length: 64 }),
    status: mysqlEnum("status", ["open", "in_progress", "resolved", "closed"]).default("open"),
    priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium"),
    assignedTo: int("assignedTo"),
    resolution: text("resolution"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    resolvedAt: timestamp("resolvedAt"),
  },
  (table) => ({
    userIdIdx: index("supportTickets_userId_idx").on(table.userId),
    statusIdx: index("supportTickets_status_idx").on(table.status),
  })
);

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

export const adminLogs = mysqlTable(
  "adminLogs",
  {
    id: int("id").autoincrement().primaryKey(),
    adminId: int("adminId").notNull(),
    action: varchar("action", { length: 255 }).notNull(),
    targetUserId: int("targetUserId"),
    targetType: varchar("targetType", { length: 64 }),
    targetId: varchar("targetId", { length: 255 }),
    details: json("details").$type<Record<string, unknown>>(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    adminIdIdx: index("adminLogs_adminId_idx").on(table.adminId),
    targetUserIdIdx: index("adminLogs_targetUserId_idx").on(table.targetUserId),
  })
);

export type AdminLog = typeof adminLogs.$inferSelect;
export type InsertAdminLog = typeof adminLogs.$inferInsert;

// ============================================================================
// ANALYTICS & EVENTS
// ============================================================================

export const analyticsEvents = mysqlTable(
  "analyticsEvents",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId"),
    eventName: varchar("eventName", { length: 255 }).notNull(),
    eventData: json("eventData").$type<Record<string, unknown>>(),
    userAgent: text("userAgent"),
    ipAddress: varchar("ipAddress", { length: 45 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("analyticsEvents_userId_idx").on(table.userId),
    eventNameIdx: index("analyticsEvents_eventName_idx").on(table.eventName),
  })
);

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = typeof analyticsEvents.$inferInsert;
