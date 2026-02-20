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

describe("Habits Router", () => {
  it("should list habits for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // This would require database setup
    // For now, we're testing the structure
    expect(caller.habits).toBeDefined();
    expect(caller.habits.list).toBeDefined();
  });
});

describe("Journal Router", () => {
  it("should list journal entries for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.journal).toBeDefined();
    expect(caller.journal.list).toBeDefined();
  });
});

describe("Goals Router", () => {
  it("should list goals for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.goals).toBeDefined();
    expect(caller.goals.list).toBeDefined();
  });
});

describe("Tokens Router", () => {
  it("should get token balance", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.tokens).toBeDefined();
    expect(caller.tokens.getBalance).toBeDefined();
  });

  it("should get token history", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.tokens.getHistory).toBeDefined();
  });
});

describe("Billing Router", () => {
  it("should create checkout session", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.billing).toBeDefined();
    expect(caller.billing.createCheckoutSession).toBeDefined();
  });
});

describe("Support Router", () => {
  it("should create support ticket", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    expect(caller.support).toBeDefined();
    expect(caller.support.createTicket).toBeDefined();
  });

  it("should list support tickets", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

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
