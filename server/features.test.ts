import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: { origin: "https://anime-ascend.manus.space" },
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Health Monitoring Router", () => {
  it("should have logReading procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.health).toBeDefined();
    expect(caller.health.logReading).toBeDefined();
  });

  it("should have getReadings procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.health.getReadings).toBeDefined();
  });

  it("should have getLatest procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.health.getLatest).toBeDefined();
  });

  it("should have getAlerts procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.health.getAlerts).toBeDefined();
  });

  it("should have createAlert procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.health.createAlert).toBeDefined();
  });
});

describe("Emergency Router", () => {
  it("should have listContacts procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.emergency).toBeDefined();
    expect(caller.emergency.listContacts).toBeDefined();
  });

  it("should have addContact procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.emergency.addContact).toBeDefined();
  });

  it("should have removeContact procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.emergency.removeContact).toBeDefined();
  });

  it("should have triggerAlert procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.emergency.triggerAlert).toBeDefined();
  });
});

describe("Exercise Sessions Router", () => {
  it("should have startSession procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.exercise).toBeDefined();
    expect(caller.exercise.startSession).toBeDefined();
  });

  it("should have completeSession procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.exercise.completeSession).toBeDefined();
  });

  it("should have getHistory procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.exercise.getHistory).toBeDefined();
  });
});

describe("Habits Router", () => {
  it("should have list and create procedures", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.habits).toBeDefined();
    expect(caller.habits.list).toBeDefined();
    expect(caller.habits.create).toBeDefined();
    expect(caller.habits.delete).toBeDefined();
  });
});

describe("Journal Router", () => {
  it("should have list and create procedures", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.journal).toBeDefined();
    expect(caller.journal.list).toBeDefined();
    expect(caller.journal.create).toBeDefined();
    expect(caller.journal.delete).toBeDefined();
  });
});

describe("Goals Router", () => {
  it("should have list and create procedures", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.goals).toBeDefined();
    expect(caller.goals.list).toBeDefined();
    expect(caller.goals.create).toBeDefined();
    expect(caller.goals.updateProgress).toBeDefined();
  });
});

describe("Tokens Router", () => {
  it("should have balance and history procedures", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.tokens).toBeDefined();
    expect(caller.tokens.getBalance).toBeDefined();
    expect(caller.tokens.getHistory).toBeDefined();
    expect(caller.tokens.use).toBeDefined();
  });
});

describe("Billing Router", () => {
  it("should have createCheckoutSession procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.billing).toBeDefined();
    expect(caller.billing.createCheckoutSession).toBeDefined();
  });
});

describe("Support Router", () => {
  it("should have ticket procedures", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    expect(caller.support).toBeDefined();
    expect(caller.support.createTicket).toBeDefined();
    expect(caller.support.listTickets).toBeDefined();
  });
});

describe("Auth Router", () => {
  it("should get current user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user).toBeDefined();
    expect(user?.id).toBe(1);
    expect(user?.email).toBe("test@example.com");
  });

  it("should logout", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
  });
});
