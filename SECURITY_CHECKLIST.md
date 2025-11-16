# 🔒 Production Security Checklist

Before deploying to production, complete these security tasks:

## Authentication & Sessions

- [ ] **Update Admin Credentials**
  - [ ] Change email from `admin@peep.com` to actual admin email
  - [ ] Change password from `admin123` to secure password
  - [ ] Store credentials in `.env.local` (not hardcoded)
  
- [ ] **Implement Proper Session Management**
  - [ ] Replace localStorage with httpOnly cookies
  - [ ] Consider NextAuth.js for better session handling
  - [ ] Add session expiration (30 min idle timeout)
  - [ ] Refresh tokens on each action

## API Security

- [ ] **Rate Limiting**
  ```typescript
  // Add to route.ts
  import { Ratelimit } from '@upstash/ratelimit';
  ```
  
- [ ] **Input Validation**
  - [ ] Validate all request data types
  - [ ] Check data length limits
  - [ ] Sanitize string inputs

- [ ] **CORS Configuration**
  - [ ] Restrict `/api/admin/sheets` to your domain only
  - [ ] Never allow `*` (all origins)

## Secrets Management

- [ ] **Never commit secrets to GitHub**
  ```bash
  # In .gitignore:
  .env.local
  .env.*.local
  ```

- [ ] **Use Vercel Environment Variables**
  - [ ] Add secrets in Vercel dashboard
  - [ ] Never paste into GitHub
  - [ ] Use different values for staging/production

- [ ] **Rotate Service Account Key**
  - [ ] Generate new key
  - [ ] Update in Vercel
  - [ ] Delete old key from Google Cloud

## Monitoring & Logging

- [ ] **Log All Admin Actions**
  ```typescript
  // Add to route.ts
  console.log(`[${new Date().toISOString()}] Admin: ${action} on ${sheetName}`);
  ```

- [ ] **Monitor API Errors**
  - [ ] Set up error tracking (Sentry, DataDog, etc.)
  - [ ] Alert on failures
  - [ ] Review error logs weekly

- [ ] **Audit Trail**
  - [ ] Store all edits with timestamp and admin user
  - [ ] Keep immutable log (don't edit after creation)
  - [ ] Review for unauthorized changes

## Sheet Protection

- [ ] **Backup Strategy**
  - [ ] Enable version history in Google Sheets
  - [ ] Automated backups (weekly)
  - [ ] Test restore procedures

- [ ] **Access Control**
  - [ ] Only service account has editor access
  - [ ] Other admins have viewer access (if needed)
  - [ ] No public sharing of sheet

- [ ] **Data Validation**
  - [ ] Add data validation rules in Google Sheets
  - [ ] Restrict field formats
  - [ ] Protect header row

## Deployment

- [ ] **HTTPS Only**
  - [ ] Vercel provides HTTPS by default ✅
  - [ ] Set Security Headers:
    ```
    Strict-Transport-Security: max-age=31536000; includeSubDomains
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    X-XSS-Protection: 1; mode=block
    ```

- [ ] **Environment Variables**
  - [ ] Add all secrets to Vercel
  - [ ] Verify they load correctly
  - [ ] Never expose in client code

- [ ] **Test in Staging**
  - [ ] Deploy to staging environment first
  - [ ] Test all edit operations
  - [ ] Verify sheet updates
  - [ ] Check error handling

## Code Security

- [ ] **Review API Endpoint**
  - [ ] Verify auth checks are in place
  - [ ] Check input validation
  - [ ] Review error messages (don't leak info)

- [ ] **Update Admin Page**
  - [ ] Remove mock credentials
  - [ ] Add logout on inactivity
  - [ ] Verify permissions check

- [ ] **Check Dependencies**
  - [ ] Run `npm audit`
  - [ ] Update vulnerable packages
  - [ ] Review new dependencies before adding

## Post-Deployment

- [ ] **Monitor First Week**
  - [ ] Check error logs daily
  - [ ] Verify sheet updates are working
  - [ ] Monitor API response times

- [ ] **Regular Maintenance**
  - [ ] Check API quota usage
  - [ ] Review access logs
  - [ ] Rotate credentials periodically

- [ ] **Document Procedures**
  - [ ] How to backup sheet
  - [ ] How to restore from backup
  - [ ] How to rotate credentials
  - [ ] Emergency shutdown procedure

## Checklist Template

```bash
# Copy this to terminal for easy checking
echo "🔒 Production Security Checklist"
echo "================================"
echo ""
echo "Authentication & Sessions:"
echo "  [ ] Updated admin credentials"
echo "  [ ] Implemented proper sessions"
echo ""
echo "API Security:"
echo "  [ ] Added rate limiting"
echo "  [ ] Validated all inputs"
echo "  [ ] Set CORS restrictions"
echo ""
echo "Secrets Management:"
echo "  [ ] Secrets not in GitHub"
echo "  [ ] Added to Vercel env vars"
echo "  [ ] Service account key rotated"
echo ""
echo "Monitoring & Logging:"
echo "  [ ] Admin action logging"
echo "  [ ] Error tracking setup"
echo "  [ ] Audit trail enabled"
echo ""
echo "Sheet Protection:"
echo "  [ ] Backup strategy ready"
echo "  [ ] Access controls set"
echo "  [ ] Data validation rules"
echo ""
echo "Deployment:"
echo "  [ ] HTTPS enabled (Vercel)"
echo "  [ ] Security headers set"
echo "  [ ] Tested in staging"
echo ""
echo "Complete all items before deploying!"
```

## Emergency Contacts

In case of security incident:
1. Immediately rotate credentials
2. Review audit logs
3. Notify affected users
4. Document incident
5. Implement preventive measures

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/going-to-production)
- [Google Cloud Security](https://cloud.google.com/security)

---

**Status**: Ready for Production Review
**Last Updated**: November 16, 2025
