# TitanFit V2 - Backup & Restore Documentation

## 🔄 Backup Strategy

### Automated Backups (Supabase)

Supabase provides automatic daily backups for all paid plans. Backups are stored for:
- **Pro Plan**: 7 days
- **Team Plan**: 14 days  
- **Enterprise**: Custom retention

### Manual Backup Process

#### 1. Database Backup

**Via Supabase Dashboard:**
```
1. Go to Supabase Dashboard → Database → Backups
2. Click "Create Backup"
3. Name: titanfit_backup_YYYY-MM-DD
4. Download .sql file
```

**Via CLI:**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Create backup
supabase db dump -f backup_$(date +%Y%m%d).sql

# Backup with data
supabase db dump --data-only -f data_backup_$(date +%Y%m%d).sql
```

#### 2. Storage Backup (Media Files)

**Backup storage bucket:**
```bash
# Using Supabase CLI
supabase storage cp --recursive media/ ./backups/media-$(date +%Y%m%d)/

# Or via Node.js script
node scripts/backup-storage.js
```

**Storage backup script** (`scripts/backup-storage.js`):
```javascript
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function backupStorage() {
  const { data: files } = await supabase.storage.from('media').list();
  
  for (const file of files) {
    const { data } = await supabase.storage.from('media').download(file.name);
    const buffer = await data.arrayBuffer();
    fs.writeFileSync(
      path.join(__dirname, '../backups/media', file.name),
      Buffer.from(buffer)
    );
  }
  
  console.log(`Backed up ${files.length} files`);
}

backupStorage();
```

#### 3. Environment Variables Backup

```bash
# Export all env vars to encrypted file
gpg --encrypt --recipient admin@titanfit.com .env.local > .env.backup.gpg

# Store in secure location (DO NOT commit to git)
```

---

## 🔙 Restore Process

### Database Restore

**Via Supabase Dashboard:**
```
1. Database → Backups
2. Select backup
3. Click "Restore"
4. Confirm (WARNING: overwrites current data)
```

**Via CLI:**
```bash
# Restore from backup file
supabase db reset --db-url postgresql://[connection-string]
psql [connection-string] < backup_YYYYMMDD.sql
```

### Storage Restore

```bash
# Restore media files
supabase storage cp --recursive ./backups/media-YYYYMMDD/ media/
```

### Full System Restore

```bash
# 1. Restore database
psql $DATABASE_URL < backup.sql

# 2. Restore storage
node scripts/restore-storage.js

# 3. Restore environment
gpg --decrypt .env.backup.gpg > .env.local

# 4. Rebuild application
npm run build

# 5. Deploy
vercel --prod
```

---

## 📅 Backup Schedule

### Production Environment

| Type | Frequency | Retention | Storage |
|------|-----------|-----------|---------|
| **Database** | Daily (auto) | 14 days | Supabase |
| **Storage** | Weekly | 30 days | S3/Cloudflare |
| **Env Vars** | On change | Indefinite | 1Password |
| **Code** | On commit | Indefinite | GitHub |

### Manual Backups

- **Before major deployments**
- **Before schema migrations**
- **Monthly full backup**
- **Before configuration changes**

---

## 🔐 Security Best Practices

### Backup Storage
- ✅ Encrypt all backups (GPG/AES-256)
- ✅ Store in multiple locations (3-2-1 rule)
- ✅ Test restore process monthly
- ✅ Limit access (admin only)
- ✅ Use separate AWS/GCP account for backups

### Access Control
```bash
# Restrict backup access
chmod 600 backup_*.sql
chown admin:admin backup_*.sql

# Encrypt before transmission
tar czf - backup/ | gpg --encrypt > backup.tar.gz.gpg
```

---

## 📋 Backup Checklist

### Weekly Backup
- [ ] Export database (.sql)
- [ ] Backup storage bucket
- [ ] Export user data CSV
- [ ] Backup environment config
- [ ] Test one random backup restore

### Monthly Full Backup
- [ ] Complete database dump
- [ ] All storage buckets
- [ ] All environment variables
- [ ] Configuration files
- [ ] Documentation
- [ ] Verify backup integrity
- [ ] Update disaster recovery plan

---

## 🚨 Disaster Recovery Plan

### RTO/RPO Targets
- **Recovery Time Objective (RTO)**: 4 hours
- **Recovery Point Objective (RPO)**: 24 hours

### Emergency Contacts
- **DevOps Lead**: tech@titanfit.com
- **Database Admin**: db@titanfit.com  
- **Supabase Support**: support@supabase.io

### Recovery Steps
1. **Assess damage** (< 30 min)
2. **Notify stakeholders** (< 1 hour)
3. **Restore from backup** (1-2 hours)
4. **Verify data integrity** (< 1 hour)
5. **Resume operations** (< 30 min)
6. **Post-mortem** (within 48h)

---

## 🛠️ Automation Scripts

### Automated Daily Backup (Cron)

```bash
# Add to crontab
0 2 * * * /home/admin/scripts/daily-backup.sh

# daily-backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d)
supabase db dump -f /backups/db_$DATE.sql
tar czf /backups/media_$DATE.tar.gz /var/www/public/media
gpg --encrypt --recipient admin@titanfit.com /backups/db_$DATE.sql
rm /backups/db_$DATE.sql
# Upload to S3
aws s3 cp /backups/ s3://titanfit-backups/$(date +%Y/%m/) --recursive
# Clean old backups (>30 days)
find /backups -mtime +30 -delete
```

---

**Last Updated**: 2026-01-13  
**Version**: 1.0  
**Owner**: DevOps Team
