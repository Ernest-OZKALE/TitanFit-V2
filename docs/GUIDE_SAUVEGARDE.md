# TitanFit V2 - Documentation Sauvegarde & Restauration

## 🔄 Stratégie de Sauvegarde

### Sauvegardes Automatiques (Supabase)
Supabase effectue des sauvegardes quotidiennes automatiques. La rétention dépend de votre plan :
- **Pro** : 7 jours  
- **Team** : 14 jours  

### Processus de Sauvegarde Manuelle

#### 1. Base de Données (SQL)
**Via le Dashboard Supabase :**
1. Allez dans Database → Backups.
2. Cliquez sur "Create Backup".
3. Téléchargez le fichier `.sql`.

**Via le CLI :**
```bash
supabase db dump -f sauvegarde_$(date +%Y%m%d).sql
```

#### 2. Stockage (Fichiers Media)
Il est conseillé de synchroniser régulièrement votre bucket `media` vers un stockage froid (S3 ou local).

---

## 🔙 Processus de Restauration

### Restauration de la Base de Données
**Attention :** La restauration écrase les données actuelles.
1. Allez dans Database → Backups.
2. Sélectionnez la sauvegarde souhaitée.
3. Cliquez sur "Restore".

---

## 📅 Calendrier de Maintenance
| Type | Fréquence | Rétention | Support |
|------|-----------|-----------|---------|
| **Base de données** | Quotidien (Auto) | 14 jours | Supabase |
| **Fichiers Media** | Hebdomadaire | 30 jours | Cloud Storage |
| **Variables d'env** | À chaque modif | Indéfini | Gestionnaire de clés |

---

## 🔐 Bonnes Pratiques de Sécurité
- ✅ Chiffrer toutes les sauvegardes exportées (AES-256).
- ✅ Tester le processus de restauration une fois par mois.
- ✅ Limiter l'accès aux sauvegardes aux seuls administrateurs système.

---
**Version :** 1.1  
**Responsable :** Équipe DevOps Titan Architect
