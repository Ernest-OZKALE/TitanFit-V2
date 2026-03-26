# TitanFit V2 - Deployment Checklist

This document provides a comprehensive checklist for deploying TitanFit V2 to production.

## 🚀 Pre-Deployment Checklist

### 1. Environment Configuration ✅

- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in all Supabase credentials (URL, Anon Key)
- [ ] Configure Stripe keys (Publishable + Secret)
- [ ] Set up SMTP credentials for email
- [ ] Add Google Analytics Measurement ID
- [ ] Configure site URL and metadata
- [ ] Set security flags (2FA, rate limiting)
- [ ] Verify all feature flags

### 2. Database Setup ✅

- [ ] Run Supabase migration: `titan_cms_v2.sql`
- [ ] Create storage buckets:
  - `media` (public read)
  - `private-uploads` (private)
- [ ] Set up Row Level Security (RLS) policies
- [ ] Seed initial data (optional)
- [ ] Create first admin user

### 3. Authentication & Security ✅

- [ ] Configure Supabase Auth providers
- [ ] Set up email templates (Welcome, Password Reset)
- [ ] Enable RLS on all tables
- [ ] Configure CORS origins
- [ ] Set up rate limiting
- [ ] Enable HTTPS only
- [ ] Configure CSP headers

### 4. Payment Integration ✅

- [ ] Activate Stripe account
- [ ] Configure webhook endpoint: `/api/webhooks/stripe`
- [ ] Test payment flow in sandbox
- [ ] Set up recurring billing (if applicable)
- [ ] Configure tax settings
- [ ] Set up refund policies

### 5. Email Configuration ✅

- [ ] Verify SMTP connection
- [ ] Test welcome email
- [ ] Test password reset email
- [ ] Configure email templates
- [ ] Set up email logging/tracking
- [ ] Configure bounce handling

### 6. Build & Performance ✅

- [ ] Run build: `npm run build`
- [ ] Check bundle size (< 500KB target)
- [ ] Run Lighthouse audit (score > 90)
- [ ] Optimize images (WebP format)
- [ ] Enable CDN for static assets
- [ ] Configure caching headers
- [ ] Minify CSS/JS

### 7. Testing ✅

- [ ] Run all unit tests: `npm test`
- [ ] Run E2E tests: `npm run test:e2e`
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices
- [ ] Test admin panel functionality
- [ ] Test payment flow end-to-end
- [ ] Verify email delivery

### 8. SEO & Analytics ✅

- [ ] Verify meta tags on all pages
- [ ] Submit sitemap.xml to Google
- [ ] Configure robots.txt
- [ ] Set up Google Analytics
- [ ] Configure Facebook Pixel (optional)
- [ ] Test Open Graph tags
- [ ] Verify canonical URLs

### 9. Monitoring & Logging ✅

- [ ] Set up error tracking (Sentry)
- [ ] Configure performance monitoring
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up alerting rules
- [ ] Create status page

### 10. Legal & Compliance ✅

- [ ] Add Privacy Policy page
- [ ] Add Terms of Service page
- [ ] Add Cookie Consent banner
- [ ] GDPR compliance check
- [ ] Add contact information
- [ ] Configure data retention policies

## 📦 Deployment Platforms

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Configuration:**
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Environment Variables:**
- Add all .env variables in Vercel dashboard
- Enable automatic deployment from main branch

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

## 🔄 Post-Deployment

### Immediate Actions (0-1h)

- [ ] Verify site is live and accessible
- [ ] Test login/signup flow
- [ ] Place a test order
- [ ] Monitor error logs
- [ ] Check analytics tracking
- [ ] Verify email delivery
- [ ] Test admin panel access

### Within 24 Hours

- [ ] Monitor performance metrics
- [ ] Check for JavaScript errors
- [ ] Review server logs
- [ ] Verify database connections
- [ ] Test all critical user flows
- [ ] Review security alerts
- [ ] Check storage usage

### Within 1 Week

- [ ] Conduct security audit
- [ ] Review user feedback
- [ ] Analyze performance data
- [ ] Check conversion rates
- [ ] Review error rates
- [ ] Optimize slow queries
- [ ] Plan hotfixes if needed

## 🛠️ Rollback Procedure

If issues occur:

1. **Immediate Rollback** (< 5 mins)
   ```bash
   vercel rollback
   ```

2. **Database Rollback**
   - Restore from latest backup
   - Run rollback migration if available

3. **Notify Users**
   - Enable maintenance mode
   - Send status update email
   - Update social media

## 📊 Success Metrics

Track these KPIs post-launch:

- **Performance:**  
  - Time to First Byte (TTFB) < 200ms
  - First Contentful Paint (FCP) < 1.5s
  - Largest Contentful Paint (LCP) < 2.5s
  - Cumulative Layout Shift (CLS) < 0.1

- **Reliability:**  
  - Uptime > 99.9%
  - Error rate < 0.1%
  - Failed requests < 1%

- **Business:**  
  - Conversion rate > 2%
  - Average session duration > 3 mins
  - Bounce rate < 40%

## 🆘 Support Contacts

- **Technical Issues:** tech@titanfit.com
- **Payment Issues:** billing@titanfit.com
- **Emergency Hotline:** +33 1 XX XX XX XX

---

**Last Updated:** 2026-01-13  
**Version:** 2.0.0  
**Deployment Engineer:** [Your Name]
