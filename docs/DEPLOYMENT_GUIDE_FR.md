# 🚀 Guide de Déploiement TitanFit V2

Ce guide t'explique étape par étape comment mettre ton site en ligne.

## Étape 1 : Mettre la Base de Données en Place (Supabase)

C'est ici que tu dois "taper les trucs SQL".

1.  Connecte-toi à ton compte [Supabase](https://supabase.com/dashboard).
2.  Ouvre ton projet (celui que tu as créé au début).
3.  Dans le menu de gauche, clique sur l'icône **SQL Editor** (ça ressemble à une invite de commande `>_`).
4.  Clique sur **+ New Query** (Nouvelle requête).
5.  Tu vas devoir copier-coller le contenu de **7 fichiers** que j'ai créés sur ton ordinateur.
    *   *Astuce : Tu peux copier le contenu directement depuis VS Code.*

### Les fichiers à copier (dans l'ordre) :

1.  Ouvre `database-schema.sql`, copie TOUT le texte, colle-le dans Supabase, et clique sur **RUN** (en bas à droite).
    *   *Attends que ça dise "Success".*
2.  Efface l'éditeur Supabase, ouvre `cms-admin-schema.sql`, copie, colle, clique sur **RUN**.
3.  Efface, ouvre `workout-schema.sql`, copie, colle, **RUN**.
4.  Efface, ouvre `ai-coaching-schema.sql`, copie, colle, **RUN**.
5.  Efface, ouvre `progress-schema.sql`, copie, colle, **RUN**.
6.  Efface, ouvre `social-schema.sql`, copie, colle, **RUN**.
7.  Efface, ouvre `notifications-schema.sql`, copie, colle, **RUN**.

**Félicitations !** Ta base de données est prête.

---

## Étape 2 : Configurer le Stockage des Images (Supabase Storage)

1.  Toujours sur Supabase, dans le menu gauche, clique sur **Storage** (icône de dossier ou image).
2.  Clique sur **+ New Bucket**.
3.  Nomme-le exactement : `avatars`
4.  Coche "Public bucket".
5.  Clique sur **Save**.
6.  Refais pareil pour un deuxième bucket nommé : `post_images`

---

## Étape 3 : Mettre le Site en Ligne (Vercel)

C'est là qu'on "appuie sur déployer".

1.  Va sur [Vercel.com](https://vercel.com) et connecte-toi (souvent avec ton compte GitHub).
2.  Clique sur **Add New...** > **Project**.
3.  Tu devrais voir ton repo `titanfit-v2` dans la liste (si tu as bien fait le `git push`). Clique sur **Import**.
4.  **Important : Variables d'environnement**.
    *   Avant de cliquer sur Deploy, descends à la section "Environment Variables".
    *   Ajoute `NEXT_PUBLIC_SUPABASE_URL` avec la valeur de ton URL Supabase (dispo dans les Settings Supabase > API).
    *   Ajoute `NEXT_PUBLIC_SUPABASE_ANON_KEY` avec ta clé anon publique (dispo au même endroit).
5.  Clique sur **Deploy**.

Vercel va travailler pendant 1 ou 2 minutes... et tu auras ton lien (ex: `titanfit-v2.vercel.app`) !

---

## Étape 4 : Devenir Admin

Une fois le site en ligne :
1.  Va sur ton site et inscris-toi (`Sign up`).
2.  Retourne sur Supabase > SQL Editor.
3.  Tape ceci (remplace l'email par le tien) et clique sur RUN :

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'ton_email@exemple.com';
```

Voilà, tu es le boss de ton application ! 👑
