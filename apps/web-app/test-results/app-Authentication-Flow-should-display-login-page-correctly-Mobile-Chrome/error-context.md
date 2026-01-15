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
        - heading "Bon retour" [level=2] [ref=e27]
        - paragraph [ref=e28]: L'arène vous attend.
      - generic [ref=e29]:
        - generic [ref=e30]:
          - generic [ref=e31]: Email
          - textbox "Email" [ref=e32]:
            - /placeholder: titan@exemple.com
        - generic [ref=e33]:
          - generic [ref=e34]:
            - generic [ref=e35]: Mot de passe
            - link "Oublié ?" [ref=e36] [cursor=pointer]:
              - /url: /forgot-password
          - textbox "Mot de passe" [ref=e37]:
            - /placeholder: ••••••••
        - button "Se connecter" [ref=e38] [cursor=pointer]
      - paragraph [ref=e40]:
        - text: Pas encore de compte ?
        - link "Rejoindre l'élite" [ref=e41] [cursor=pointer]:
          - /url: /signup
```