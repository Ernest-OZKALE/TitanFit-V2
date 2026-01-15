# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - generic [ref=e22]:
    - link "Retour à l'accueil" [ref=e23] [cursor=pointer]:
      - /url: /
      - button "Retour à l'accueil" [ref=e24]:
        - img
        - text: Retour à l'accueil
    - text: // @ts-ignore
    - generic [ref=e25]:
      - generic [ref=e26]:
        - heading "Créer un compte" [level=2] [ref=e27]
        - paragraph [ref=e28]: Rejoignez la légende en quelques secondes.
      - generic [ref=e29]:
        - generic [ref=e30]:
          - generic [ref=e31]: Nom d'utilisateur
          - textbox "Nom d'utilisateur" [ref=e32]:
            - /placeholder: titan_warrior
        - generic [ref=e33]:
          - generic [ref=e34]: Email
          - textbox "Email" [ref=e35]:
            - /placeholder: titan@exemple.com
        - generic [ref=e36]:
          - generic [ref=e37]: Mot de passe
          - textbox "Mot de passe" [ref=e38]:
            - /placeholder: ••••••••
          - paragraph [ref=e39]: Minimum 6 caractères
        - button "Rejoindre Gratuitement" [ref=e40] [cursor=pointer]
      - paragraph [ref=e42]:
        - text: Vous avez déjà un compte ?
        - link "Se connecter" [ref=e43] [cursor=pointer]:
          - /url: /login
```