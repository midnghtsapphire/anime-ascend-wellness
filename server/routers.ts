import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { eq, desc, and } from "drizzle-orm";
import {
  habits,
  habitLogs,
  journalEntries,
  moodLogs,
  goals,
  milestones,
  tokenTransactions,
  supportTickets,
} from "../drizzle/schema";
import { createCheckoutSession } from "./stripe-checkout";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============================================================================
  // HABITS
  // ============================================================================
  habits: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(habits)
        .where(eq(habits.userId, ctx.user.id))
        .orderBy(desc(habits.createdAt));
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          category: z.string().optional(),
          emoji: z.string().optional(),
          color: z.string().optional(),
          frequency: z.enum(["daily", "weekly", "monthly"]).default("daily"),
          targetDays: z.number().default(30),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db.insert(habits).values({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db
          .delete(habits)
          .where(and(eq(habits.id, input.id), eq(habits.userId, ctx.user.id)));
        return { success: true };
      }),
  }),

  // ============================================================================
  // HABIT LOGS
  // ============================================================================
  habitLogs: router({
    log: protectedProcedure
      .input(z.object({ habitId: z.number(), notes: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db.insert(habitLogs).values({
          habitId: input.habitId,
          userId: ctx.user.id,
          notes: input.notes,
        });
        return { success: true };
      }),

    getStreak: protectedProcedure
      .input(z.object({ habitId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return 0;

        const logs = await db
          .select()
          .from(habitLogs)
          .where(
            and(eq(habitLogs.habitId, input.habitId), eq(habitLogs.userId, ctx.user.id))
          )
          .orderBy(desc(habitLogs.completedAt));

        if (logs.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const log of logs) {
          const logDate = new Date(log.completedAt);
          logDate.setHours(0, 0, 0, 0);

          const daysDiff = Math.floor(
            (today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysDiff === streak) {
            streak++;
          } else {
            break;
          }
        }

        return streak;
      }),
  }),

  // ============================================================================
  // JOURNAL
  // ============================================================================
  journal: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(journalEntries)
        .where(eq(journalEntries.userId, ctx.user.id))
        .orderBy(desc(journalEntries.createdAt));
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().optional(),
          content: z.string().min(1),
          mood: z.string().optional(),
          moodScore: z.number().min(1).max(10).optional(),
          tags: z.array(z.string()).optional(),
          isPrivate: z.boolean().default(true),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db.insert(journalEntries).values({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db
          .delete(journalEntries)
          .where(
            and(eq(journalEntries.id, input.id), eq(journalEntries.userId, ctx.user.id))
          );
        return { success: true };
      }),
  }),

  // ============================================================================
  // MOOD LOGS
  // ============================================================================
  mood: router({
    log: protectedProcedure
      .input(
        z.object({
          mood: z.string(),
          moodScore: z.number().min(1).max(10),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db.insert(moodLogs).values({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    getAverage: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return 0;

      const logs = await db
        .select()
        .from(moodLogs)
        .where(eq(moodLogs.userId, ctx.user.id));

      if (logs.length === 0) return 0;
      const sum = logs.reduce((acc, log) => acc + log.moodScore, 0);
      return Math.round((sum / logs.length) * 10) / 10;
    }),
  }),

  // ============================================================================
  // GOALS
  // ============================================================================
  goals: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(goals)
        .where(eq(goals.userId, ctx.user.id))
        .orderBy(desc(goals.createdAt));
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          category: z.string().optional(),
          targetDate: z.date().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db.insert(goals).values({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    updateProgress: protectedProcedure
      .input(z.object({ id: z.number(), progress: z.number().min(0).max(100) }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db
          .update(goals)
          .set({ progress: input.progress })
          .where(and(eq(goals.id, input.id), eq(goals.userId, ctx.user.id)));
        return { success: true };
      }),
  }),

  // ============================================================================
  // MILESTONES
  // ============================================================================
  milestones: router({
    list: protectedProcedure
      .input(z.object({ goalId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        return db
          .select()
          .from(milestones)
          .where(
            and(eq(milestones.goalId, input.goalId), eq(milestones.userId, ctx.user.id))
          );
      }),

    complete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db
          .update(milestones)
          .set({ isCompleted: true, completedAt: new Date() })
          .where(and(eq(milestones.id, input.id), eq(milestones.userId, ctx.user.id)));
        return { success: true };
      }),
  }),

  // ============================================================================
  // TOKENS & CREDITS
  // ============================================================================
  tokens: router({
    getBalance: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return 0;

      const transactions = await db
        .select()
        .from(tokenTransactions)
        .where(eq(tokenTransactions.userId, ctx.user.id));

      return transactions.reduce((acc, tx) => {
        if (tx.type === "purchase" || tx.type === "bonus") {
          return acc + tx.amount;
        } else if (tx.type === "usage" || tx.type === "refund") {
          return acc - tx.amount;
        }
        return acc;
      }, 0);
    }),

    getHistory: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(tokenTransactions)
        .where(eq(tokenTransactions.userId, ctx.user.id))
        .orderBy(desc(tokenTransactions.createdAt));
    }),

    use: protectedProcedure
      .input(
        z.object({
          amount: z.number().positive(),
          description: z.string(),
          relatedId: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db.insert(tokenTransactions).values({
          userId: ctx.user.id,
          amount: input.amount,
          type: "usage",
          description: input.description,
          relatedId: input.relatedId,
        });
        return { success: true };
      }),
  }),

  // ============================================================================
  // BILLING & STRIPE
  // ============================================================================
  billing: router({
    createCheckoutSession: protectedProcedure
      .input(z.object({ tier: z.enum(["premium", "pro"]) }))
      .mutation(async ({ ctx, input }) => {
        const origin = ctx.req.headers.origin || "https://anime-ascend.manus.space";
        const checkoutUrl = await createCheckoutSession(
          ctx.user.id,
          ctx.user.email || undefined,
          ctx.user.name || undefined,
          input.tier,
          origin
        );
        return { checkoutUrl };
      }),
  }),

  // ============================================================================
  // SUPPORT
  // ============================================================================
  support: router({
    createTicket: protectedProcedure
      .input(
        z.object({
          subject: z.string().min(1),
          description: z.string().min(1),
          category: z.string().optional(),
          priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db.insert(supportTickets).values({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    listTickets: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(supportTickets)
        .where(eq(supportTickets.userId, ctx.user.id))
        .orderBy(desc(supportTickets.createdAt));
    }),
  }),
});

export type AppRouter = typeof appRouter;
