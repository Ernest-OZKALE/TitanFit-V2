# TitanFit V2 - Guide de Configuration des Webhooks

## 🪝 Présentation

Les Webhooks permettent à des services externes (comme Stripe) de notifier votre application d'événements en temps réel. Ce guide couvre la configuration et la gestion des webhooks pour TitanFit V2.

---

## 📋 Événements Supportés

### Événements de Paiement (Stripe)
- `payment_intent.succeeded` : Paiement réussi.
- `payment_intent.failed` : Échec du paiement.
- `customer.subscription.deleted` : Abonnement annulé.

### Événements Applicatifs
- `user.created` : Nouvel utilisateur enregistré.
- `order.completed` : Commande finalisée.

---

## 🔧 Instructions de Configuration

### 1. Webhooks Stripe

**Étape 1 : Créer le point de terminaison (Endpoint)**
L'endpoint doit être sécurisé et vérifier la signature de Stripe pour éviter les attaques par usurpation.

**Étape 2 : Configurer le Tableau de Bord Stripe**
1. Allez sur Stripe Dashboard → Webhooks.
2. Ajoutez l'URL : `https://votre-domaine.com/api/webhooks/stripe`.
3. Copiez la **Clé secrète de signature** dans votre fichier `.env.local`.

### 2. Webhooks Personnalisés
Vous pouvez également configurer votre propre système de webhooks pour notifier d'autres services (ex: CRM, Slack) lors d'événements TitanFit.

---

## 🔐 Bonnes Pratiques de Sécurité
- **Vérification de Signature** : Toujours valider la signature cryptographique du webhook.
- **HTTPS Uniquement** : Ne jamais accepter de webhooks via HTTP en production.
- **Log des Événements** : Conserver une trace de chaque webhook reçu et de son statut de traitement dans la table `webhook_logs`.

---
**Version** : 1.2  
**Contact Technique** : dev@titanfit.com
