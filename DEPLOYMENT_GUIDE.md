# OmniMind AI - Deployment Guide

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Database Migration](#database-migration)
4. [Deploying to Manus](#deploying-to-manus)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)
7. [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

Before deploying to production, ensure the following:

- [ ] All tests pass: `pnpm test`
- [ ] TypeScript compilation successful: `pnpm check`
- [ ] No console errors or warnings
- [ ] Environment variables are configured
- [ ] Database migrations are ready
- [ ] API keys are valid and active
- [ ] OAuth credentials are set up
- [ ] S3 storage is configured
- [ ] LLM API access is verified
- [ ] Backup of current production database exists

## Environment Setup

### 1. Production Environment Variables

Create or update environment variables in the Manus Settings → Secrets panel:

#### Database Configuration
```
DATABASE_URL=mysql://username:password@host:3306/omnimind_ai_prod
```

#### Authentication
```
JWT_SECRET=<generate-secure-random-string>
VITE_APP_ID=<your-manus-app-id>
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/oauth
OWNER_OPEN_ID=<your-owner-id>
OWNER_NAME=<your-name>
```

#### LLM Integration
```
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=<your-api-key>
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=<your-frontend-api-key>
```

#### Analytics
```
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=<your-website-id>
```

#### Application Info
```
VITE_APP_TITLE=OmniMind AI
VITE_APP_LOGO=https://your-cdn.com/logo.png
```

### 2. Generating Secure Secrets

For JWT_SECRET, generate a secure random string:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Verifying Environment Variables

Test environment variables locally:

```bash
# Create .env.local with production values
cat > .env.local << EOF
DATABASE_URL=mysql://...
JWT_SECRET=...
# ... other variables
EOF

# Run development server
pnpm dev

# Check that all variables are loaded
curl http://localhost:3000/api/trpc/system.health
```

## Database Migration

### 1. Pre-Migration Backup

Before running migrations, backup your production database:

```bash
# Using mysqldump
mysqldump -u username -p -h host omnimind_ai_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Store backup securely
aws s3 cp backup_*.sql s3://your-backup-bucket/
```

### 2. Running Migrations

#### Option A: Automatic Migration (Recommended)
Migrations run automatically during deployment:

1. Create a checkpoint in Manus UI
2. Click "Publish"
3. Manus will apply pending migrations automatically

#### Option B: Manual Migration
If you need to run migrations manually:

```bash
# Generate migrations from schema changes
pnpm drizzle-kit generate

# Review generated SQL files in drizzle/migrations/

# Apply migrations
pnpm drizzle-kit migrate

# Verify migration success
mysql -u username -p -h host omnimind_ai_prod -e "SELECT * FROM __drizzle_migrations__;"
```

### 3. Verifying Migration Success

After migration, verify all tables exist:

```bash
mysql -u username -p -h host omnimind_ai_prod << EOF
SHOW TABLES;
DESCRIBE users;
DESCRIBE chats;
DESCRIBE messages;
DESCRIBE documents;
DESCRIBE admin_logs;
EOF
```

### 4. Rollback Plan

If migration fails, rollback to previous version:

```bash
# Restore from backup
mysql -u username -p -h host omnimind_ai_prod < backup_YYYYMMDD_HHMMSS.sql

# Rollback application to previous checkpoint
# Use Manus UI: Dashboard → Version History → Rollback
```

## Deploying to Manus

### 1. Create Deployment Checkpoint

```bash
# Ensure all changes are committed
git status

# Create checkpoint in Manus UI
# Navigate to: Management UI → Checkpoint Card → Create Checkpoint
```

### 2. Configure Domain

#### Using Manus Subdomain (Default)
- Domain: `omnimind.manus.space`
- No additional configuration needed

#### Using Custom Domain
1. Go to Settings → Domains
2. Click "Add Custom Domain"
3. Enter your domain (e.g., `chat.yourdomain.com`)
4. Follow DNS configuration instructions
5. Verify domain ownership
6. Wait for SSL certificate issuance (usually 5-10 minutes)

### 3. Deploy Application

1. Click "Publish" button in Manus UI
2. Review deployment configuration
3. Confirm deployment
4. Wait for build and deployment to complete (usually 2-5 minutes)

### 4. Verify Deployment

```bash
# Test API endpoint
curl https://your-domain.com/api/trpc/auth.me

# Check health status
curl https://your-domain.com/api/trpc/system.health

# Test OAuth login
# Visit https://your-domain.com and attempt login
```

## Post-Deployment Configuration

### 1. Update OAuth Redirect URLs

In Manus OAuth settings, update redirect URLs:

```
https://your-domain.com/api/oauth/callback
https://your-domain.com
```

### 2. Configure Email Notifications (Optional)

Set up email notifications for admin alerts:

1. Go to Settings → Notifications
2. Configure email recipients
3. Set notification preferences

### 3. Set Up Monitoring

Enable application monitoring:

1. Go to Dashboard → Monitoring
2. Configure alert thresholds
3. Set up log aggregation

### 4. Configure Backups

Set up automated database backups:

```bash
# Create backup schedule
# Using Manus backup feature or external service

# Example: Daily backup at 2 AM UTC
0 2 * * * mysqldump -u user -p -h host db > /backups/db_$(date +\%Y\%m\%d).sql
```

### 5. SSL Certificate

SSL is automatically configured by Manus. Verify:

```bash
# Check certificate
curl -I https://your-domain.com

# Should show: HTTP/2 200 with valid SSL certificate
```

## Monitoring and Maintenance

### 1. Application Monitoring

Monitor key metrics:

- **Response Time**: Should be < 500ms for 95th percentile
- **Error Rate**: Should be < 0.1%
- **Uptime**: Target 99.9%
- **Database Connections**: Monitor connection pool usage

### 2. Log Monitoring

Check logs regularly:

```bash
# View dev server logs
tail -f .manus-logs/devserver.log

# View browser console logs
tail -f .manus-logs/browserConsole.log

# View network request logs
tail -f .manus-logs/networkRequests.log
```

### 3. Database Maintenance

#### Regular Tasks
- Monitor query performance
- Optimize slow queries
- Maintain indexes
- Archive old data

```bash
# Check slow query log
mysql -u username -p -h host -e "SHOW PROCESSLIST;"

# Analyze table
mysql -u username -p -h host omnimind_ai_prod -e "ANALYZE TABLE users;"

# Optimize table
mysql -u username -p -h host omnimind_ai_prod -e "OPTIMIZE TABLE messages;"
```

#### Backup Schedule
- Daily backups at 2 AM UTC
- Weekly full backups
- Monthly archival to cold storage
- Test restore procedures monthly

### 4. Security Maintenance

- Update dependencies monthly: `pnpm update`
- Review security logs weekly
- Rotate API keys quarterly
- Audit user access monthly

### 5. Performance Optimization

Monitor and optimize:

```bash
# Check database indexes
mysql -u username -p -h host omnimind_ai_prod -e "SHOW INDEX FROM users;"

# Monitor connection pool
mysql -u username -p -h host -e "SHOW STATUS LIKE 'Threads%';"

# Check cache hit ratio
mysql -u username -p -h host -e "SHOW STATUS LIKE 'Key%';"
```

## Troubleshooting

### Issue: Database Connection Failed

**Symptoms**: 500 errors, "Cannot connect to database"

**Solution**:
1. Verify DATABASE_URL is correct
2. Check database server is running
3. Verify credentials
4. Check firewall rules
5. Test connection: `mysql -u user -p -h host database`

### Issue: OAuth Login Not Working

**Symptoms**: Redirect loop, "Invalid client ID"

**Solution**:
1. Verify VITE_APP_ID is correct
2. Check OAuth redirect URL matches Manus settings
3. Verify OAuth server URL
4. Clear browser cookies
5. Check OAuth service status

### Issue: Slow API Responses

**Symptoms**: API calls take > 1 second

**Solution**:
1. Check database query performance
2. Add missing indexes
3. Optimize N+1 queries
4. Enable caching
5. Scale horizontally

### Issue: File Upload Failures

**Symptoms**: 500 errors when uploading files

**Solution**:
1. Verify S3 credentials
2. Check file size limits (max 10MB)
3. Verify file type support
4. Check S3 bucket permissions
5. Review storage logs

### Issue: High Memory Usage

**Symptoms**: Application crashes, OOM errors

**Solution**:
1. Check for memory leaks
2. Optimize database queries
3. Implement pagination
4. Clear old data
5. Scale vertically

### Issue: SSL Certificate Errors

**Symptoms**: "Certificate not valid", "Mixed content"

**Solution**:
1. Verify domain configuration
2. Wait for certificate issuance
3. Clear browser cache
4. Use HTTPS for all resources
5. Check certificate expiration

## Rollback Procedure

If deployment causes issues:

### Quick Rollback (< 5 minutes)

1. Go to Manus UI → Dashboard → Version History
2. Find previous stable version
3. Click "Rollback"
4. Confirm rollback
5. Verify application is working

### Full Rollback (with database)

1. Restore database from backup
2. Rollback application code
3. Verify all systems are operational
4. Investigate root cause

```bash
# Restore database
mysql -u username -p -h host omnimind_ai_prod < backup_YYYYMMDD_HHMMSS.sql

# Verify restoration
mysql -u username -p -h host omnimind_ai_prod -e "SELECT COUNT(*) FROM users;"
```

## Performance Tuning

### Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_chats_userId_createdAt ON chats(userId, createdAt DESC);
CREATE INDEX idx_messages_chatId_createdAt ON messages(chatId, createdAt DESC);
CREATE INDEX idx_documents_userId_createdAt ON documents(userId, createdAt DESC);

-- Analyze tables
ANALYZE TABLE users, chats, messages, documents;

-- Check query performance
EXPLAIN SELECT * FROM messages WHERE chatId = 1 ORDER BY createdAt DESC LIMIT 50;
```

### Application Optimization

```typescript
// Enable response compression
app.use(compression());

// Implement caching
app.use(cache('5 minutes'));

// Optimize database queries
// Use connection pooling
// Implement query batching
```

### Frontend Optimization

```typescript
// Code splitting
const Chat = lazy(() => import('./pages/Chat'));

// Image optimization
<img src={image} loading="lazy" />

// Virtual scrolling for long lists
<VirtualList items={messages} />
```

## Scaling Strategy

### Horizontal Scaling
- Deploy multiple instances behind load balancer
- Use read replicas for database
- Implement caching layer (Redis)

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize database queries
- Implement connection pooling

### Database Scaling
- Implement sharding by userId
- Archive old data
- Use read replicas

## Disaster Recovery

### Recovery Time Objective (RTO): 1 hour
### Recovery Point Objective (RPO): 15 minutes

### Disaster Recovery Plan

1. **Identify Issue**: Monitor alerts and logs
2. **Assess Impact**: Determine scope of failure
3. **Activate Backup**: Restore from most recent backup
4. **Verify Restoration**: Test all systems
5. **Notify Users**: Communicate status
6. **Root Cause Analysis**: Investigate failure
7. **Implement Prevention**: Update systems

### Backup Verification

Test restore procedures monthly:

```bash
# Create test database
CREATE DATABASE omnimind_ai_test;

# Restore backup
mysql -u username -p -h host omnimind_ai_test < backup_latest.sql

# Verify data integrity
mysql -u username -p -h host omnimind_ai_test -e "SELECT COUNT(*) FROM users;"

# Clean up
DROP DATABASE omnimind_ai_test;
```

## Support and Documentation

- **Documentation**: https://omnimind.ai/docs
- **API Reference**: See API_DOCUMENTATION.md
- **Architecture**: See SYSTEM_ARCHITECTURE.md
- **Support Email**: support@omnimind.ai

---

**Last Updated**: June 2024
**Version**: 1.0.0
