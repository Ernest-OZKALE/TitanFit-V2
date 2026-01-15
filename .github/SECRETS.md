# TitanFit V2 - GitHub Secrets Configuration

Add these secrets in GitHub Repository Settings → Secrets and variables → Actions

## Required Secrets

### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Vercel Deployment
```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=team_xxxxxxxxxxxxx
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxx
```

**How to get Vercel credentials:**
1. Go to https://vercel.com/account/tokens
2. Create new token → Copy to `VERCEL_TOKEN`
3. Run `vercel login` in terminal
4. Run `vercel link` in project directory
5. Copy values from `.vercel/project.json`:
   - `orgId` → `VERCEL_ORG_ID`
   - `projectId` → `VERCEL_PROJECT_ID`

### CodeCov (Optional - for coverage reports)
```
CODECOV_TOKEN=your-codecov-token
```

Get from: https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO/settings

## Environment Variables

### Production (.env.production)
All variables from `.env.example` should be set in Vercel dashboard:
- Settings → Environment Variables
- Add for "Production" environment

### Preview (.env.preview)
Same variables but for staging/preview deployments

## Security Notes

- ⚠️ Never commit secrets to repository
- ✅ Use GitHub Encrypted Secrets
- ✅ Rotate tokens every 90 days
- ✅ Use different keys for dev/staging/prod
