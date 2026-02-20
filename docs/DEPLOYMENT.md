# Anime Ascend — Deployment Guide

## Hosting

Anime Ascend is hosted on the Manus platform with built-in deployment, SSL, and custom domain support.

## Deployment Steps

1. Save a checkpoint via `webdev_save_checkpoint`
2. Click the **Publish** button in the Management UI header
3. Select the checkpoint version to deploy
4. Confirm deployment

The platform handles build, server startup, database connections, and SSL automatically.

## Environment Variables

All environment variables are managed through the Manus platform and are automatically injected at runtime. Do not hardcode these values or commit `.env` files.

| Variable | Purpose |
|----------|---------|
| DATABASE_URL | MySQL connection string |
| JWT_SECRET | Session cookie signing |
| VITE_APP_ID | Manus OAuth app ID |
| OAUTH_SERVER_URL | OAuth backend URL |
| STRIPE_SECRET_KEY | Stripe API key (server) |
| STRIPE_WEBHOOK_SECRET | Webhook verification |
| VITE_STRIPE_PUBLISHABLE_KEY | Stripe key (frontend) |
| BUILT_IN_FORGE_API_URL | LLM and storage APIs |
| BUILT_IN_FORGE_API_KEY | API authentication |

## Database

MySQL database is provisioned automatically. Apply schema changes with:

```bash
pnpm db:push    # Generates and applies migrations
```

## Stripe Configuration

The Stripe test sandbox must be claimed before the deadline. Test payments use card `4242 4242 4242 4242`. The webhook endpoint is `/api/stripe/webhook` and handles checkout completions, subscription updates, and invoice events. For production, enter live keys in Settings > Payment after completing Stripe KYC verification.

## Build Commands

```bash
pnpm install       # Install dependencies
pnpm dev           # Development server
pnpm build         # Production build
pnpm start         # Start production server
pnpm check         # TypeScript check
pnpm test          # Run tests (11/11 passing)
```

## Rollback

If a deployment causes issues, use `webdev_rollback_checkpoint` with the previous version ID to restore a known-good state. The Management UI also provides a Rollback button on older checkpoints.

---

**Last Updated:** 2026-02-20 | **Version:** 2.0.0 (Health Monitoring Update)
