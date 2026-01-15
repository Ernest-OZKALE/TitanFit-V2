# Page snapshot

```yaml
- generic [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e13]
  - generic [ref=e24]:
    - link "Retour à l'accueil" [ref=e25]:
      - /url: /
      - button "Retour à l'accueil" [ref=e26] [cursor=pointer]:
        - img
        - text: Retour à l'accueil
    - text: // @ts-ignore
    - generic [ref=e27]:
      - generic [ref=e28]:
        - heading "Bon retour" [level=2] [ref=e29]
        - paragraph [ref=e30]: L'arène vous attend.
      - generic [ref=e31]:
        - generic [ref=e32]:
          - generic [ref=e33]: Email
          - textbox "Email" [active] [ref=e34]:
            - /placeholder: titan@exemple.com
        - generic [ref=e35]:
          - generic [ref=e36]:
            - generic [ref=e37]: Mot de passe
            - link "Oublié ?" [ref=e38]:
              - /url: /forgot-password
          - textbox "Mot de passe" [ref=e39]:
            - /placeholder: ••••••••
            - text: wrongpassword
        - button "Se connecter" [ref=e40] [cursor=pointer]
      - paragraph [ref=e42]:
        - text: Pas encore de compte ?
        - link "Rejoindre l'élite" [ref=e43]:
          - /url: /signup
```