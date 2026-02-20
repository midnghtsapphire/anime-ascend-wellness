# Anime Ascend Wellness — Deployment Guide

## Overview

Anime Ascend Wellness is deployed on **Manus** with automatic CI/CD. The application uses a full-stack architecture with React frontend, Express backend, and MySQL database.

---

## Pre-Deployment Checklist

Before deploying to production, ensure the following:

- [ ] All tests passing (`pnpm test`)
- [ ] TypeScript compilation clean (`pnpm check`)
- [ ] Environment variables configured
- [ ] Database migrations applied (`pnpm db:push`)
- [ ] Stripe webhook configured
- [ ] GitHub repository up to date
- [ ] Checkpoint saved
- [ ] Security audit completed
- [ ] Performance baseline established
- [ ] Backup strategy in place

---

## Environment Variables

### Required Variables

**Frontend (.env.local or via Manus UI):**
```
VITE_APP_ID=<manus-app-id>
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=<forge-api-key>
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)
VITE_APP_TITLE=Anime Ascend Wellness
VITE_APP_LOGO=https://...
```

**Backend (.env or via Manus UI):**
```
DATABASE_URL=mysql://user:password@host:3306/anime_ascend
JWT_SECRET=<random-secret-key>
OAUTH_SERVER_URL=https://api.manus.im
OWNER_OPEN_ID=<owner-manus-id>
OWNER_NAME=<owner-name>
STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_...
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=<forge-api-key>
```

### Setting Variables in Manus UI

1. Navigate to project Settings
2. Go to Secrets panel
3. Add each variable
4. Save and restart server

---

## Stripe Configuration

### 1. Claim Sandbox

Visit: https://dashboard.stripe.com/claim_sandbox

**Deadline:** 2026-04-21

### 2. Configure Webhook

**Endpoint:** `https://anime-ascend.manus.space/api/stripe/webhook`

**Events to listen:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `invoice.paid`

**Copy webhook secret to:** `STRIPE_WEBHOOK_SECRET`

### 3. Test Payments

**Test card:** `4242 4242 4242 4242`
**Expiry:** Any future date
**CVC:** Any 3 digits

### 4. Go Live

1. Complete Stripe KYC verification
2. Swap test keys for live keys:
   - `STRIPE_SECRET_KEY` (sk_live_...)
   - `VITE_STRIPE_PUBLISHABLE_KEY` (pk_live_...)
3. Update webhook endpoint to live domain
4. Test with real transactions ($0.50 minimum)

---

## Database Deployment

### Initial Setup

```bash
# 1. Create database
mysql -u root -p -e "CREATE DATABASE anime_ascend CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Push schema
pnpm db:push

# 3. Verify tables
mysql -u root -p anime_ascend -e "SHOW TABLES;"
```

### Migrations

```bash
# Generate migration
pnpm db:generate

# Apply migration
pnpm db:migrate

# Verify
pnpm db:push
```

### Backup Strategy

**Automated Backups:**
- Daily at 2:00 AM UTC
- 30-day retention
- Point-in-time recovery available

**Manual Backup:**
```bash
mysqldump -u root -p anime_ascend > backup_$(date +%Y%m%d).sql
```

**Restore:**
```bash
mysql -u root -p anime_ascend < backup_20260220.sql
```

---

## Deployment Process

### Via Manus UI (Recommended)

1. **Create Checkpoint**
   - Make all changes locally
   - Run `pnpm test` (all passing)
   - Run `pnpm check` (no errors)
   - Use `webdev_save_checkpoint` with description

2. **Review Changes**
   - View checkpoint diff in Management UI
   - Verify all files included
   - Check file sizes (no large assets)

3. **Publish**
   - Click "Publish" button in Management UI
   - Select checkpoint version
   - Confirm deployment
   - Monitor deployment logs

4. **Verify Live**
   - Visit https://anime-ascend.manus.space
   - Test login flow
   - Verify database connectivity
   - Check Stripe integration
   - Test payment flow

### Via GitHub (Alternative)

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy: [description]"
git push origin main

# 2. Manus auto-deploys from GitHub
# (if configured)

# 3. Monitor deployment
# Check Manus Dashboard for status
```

---

## Post-Deployment Verification

### Health Checks

```bash
# 1. API Health
curl https://anime-ascend.manus.space/api/trpc/auth.me

# 2. Database Connection
# Check dashboard for database status

# 3. Stripe Webhook
# Test via Stripe Dashboard → Developers → Webhooks

# 4. Authentication
# Test login flow in browser
```

### Monitoring

**Logs:**
- Server logs: Manus Dashboard → Logs
- Browser console: Check for errors
- Network requests: Check for failed requests

**Metrics:**
- Page load time
- API response time
- Error rate
- User count

### Rollback

If deployment fails:

1. **Identify Issue**
   - Check logs for errors
   - Verify environment variables
   - Test database connectivity

2. **Rollback to Previous Checkpoint**
   - Use `webdev_rollback_checkpoint` with previous version
   - Verify rollback completed
   - Test application

3. **Fix & Redeploy**
   - Fix issue locally
   - Create new checkpoint
   - Deploy again

---

## Performance Optimization

### Frontend

```bash
# Build optimization
pnpm build

# Check bundle size
npm run analyze

# Optimize images
# Use WebP format
# Compress with TinyPNG
```

### Backend

```bash
# Monitor API response times
# Check slow queries in database
# Implement caching for frequently accessed data
# Use connection pooling
```

### Database

```bash
# Analyze slow queries
SHOW SLOW QUERY LOG;

# Optimize indexes
ANALYZE TABLE users;
OPTIMIZE TABLE habits;

# Monitor disk usage
SELECT table_name, ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'anime_ascend'
ORDER BY size_mb DESC;
```

---

## Security Checklist

- [ ] HTTPS enabled (automatic on Manus)
- [ ] Environment variables not in code
- [ ] Database credentials secured
- [ ] Stripe keys in environment only
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Drizzle ORM)
- [ ] XSS prevention (React escaping)
- [ ] CSRF tokens on forms
- [ ] Regular security audits scheduled
- [ ] Dependency vulnerabilities checked

---

## Scaling Strategy

### Phase 1: MVP (Current)
- Single server instance
- MySQL database
- CDN for static assets (S3)
- Expected: 100-1000 users

### Phase 2: Growth (1000-10000 users)
- Load balancer
- Multiple server instances
- Database read replicas
- Redis cache layer
- Implement rate limiting

### Phase 3: Scale (10000+ users)
- Database sharding
- Microservices architecture
- Kubernetes orchestration
- Global CDN
- Advanced monitoring

---

## Monitoring & Alerts

### Key Metrics to Monitor

| Metric | Alert Threshold |
|--------|-----------------|
| API Response Time | > 1000ms |
| Error Rate | > 1% |
| Database Connection Pool | > 80% |
| Disk Usage | > 80% |
| Memory Usage | > 85% |
| Stripe Webhook Failures | > 5 in 1 hour |

### Monitoring Tools

- **Manus Dashboard:** Built-in monitoring
- **Stripe Dashboard:** Payment monitoring
- **Database:** MySQL slow query log
- **Frontend:** Browser console errors

---

## Disaster Recovery

### Backup Locations

- Primary: Manus managed backups
- Secondary: Manual SQL dumps (weekly)
- Tertiary: GitHub repository

### Recovery Procedures

**Database Corruption:**
1. Stop application
2. Restore from latest backup
3. Verify data integrity
4. Restart application

**Application Crash:**
1. Check error logs
2. Rollback to previous checkpoint
3. Fix issue
4. Redeploy

**Security Breach:**
1. Rotate all secrets
2. Audit access logs
3. Patch vulnerability
4. Redeploy
5. Notify users if needed

---

## Cost Optimization

### Current Costs (Estimated Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| Manus Hosting | $50-100 | Scales with usage |
| Database | $20-50 | MySQL managed |
| Stripe | 2.9% + $0.30 | Per transaction |
| S3 Storage | $5-10 | File uploads |
| **Total** | **$75-190** | Scales with growth |

### Cost Reduction

- Use free tier features where possible
- Implement caching to reduce database queries
- Optimize images and assets
- Monitor Stripe transaction volume
- Consider reserved instances for database

---

## Support & Troubleshooting

### Common Issues

**"Database connection failed"**
- Check DATABASE_URL environment variable
- Verify database is running
- Check network connectivity
- Review database logs

**"Stripe webhook not received"**
- Verify webhook endpoint is correct
- Check STRIPE_WEBHOOK_SECRET is set
- Review Stripe webhook logs
- Test webhook manually

**"Login not working"**
- Check OAUTH_SERVER_URL
- Verify VITE_APP_ID
- Check browser cookies enabled
- Review OAuth logs

### Getting Help

- **GitHub Issues:** Report bugs
- **Email:** support@anime-ascend.com
- **Discord:** Community server
- **Manus Support:** For infrastructure issues

---

## Deployment Timeline

| Date | Milestone |
|------|-----------|
| 2026-02-20 | MVP Launch |
| 2026-03-20 | First 100 users |
| 2026-04-20 | Stripe sandbox claimed |
| 2026-05-20 | First paying customers |
| 2026-06-20 | Community features live |
| 2026-08-20 | Mobile app launch |
| 2026-12-20 | Break even |

---

**Last Updated:** 2026-02-20
**Status:** Ready for Deployment
**Next Review:** 2026-03-20
