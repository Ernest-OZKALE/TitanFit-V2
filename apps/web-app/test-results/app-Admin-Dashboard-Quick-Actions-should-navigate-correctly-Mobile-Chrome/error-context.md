# Page snapshot

```yaml
- generic [ref=e1]:
  - alert [ref=e6]
  - generic [ref=e17]:
    - link "Retour à l'accueil" [ref=e18] [cursor=pointer]:
      - /url: /
      - button "Retour à l'accueil" [ref=e19]:
        - img
        - text: Retour à l'accueil
    - text: // @ts-ignore
    - generic [ref=e20]:
      - generic [ref=e21]:
        - heading "Bon retour" [level=2] [ref=e22]
        - paragraph [ref=e23]: L'arène vous attend.
      - generic [ref=e24]:
        - generic [ref=e25]:
          - generic [ref=e26]: Email
          - textbox "Email" [active] [ref=e27]:
            - /placeholder: titan@exemple.com
        - generic [ref=e28]:
          - generic [ref=e29]:
            - generic [ref=e30]: Mot de passe
            - link "Oublié ?" [ref=e31] [cursor=pointer]:
              - /url: /forgot-password
          - textbox "Mot de passe" [ref=e32]:
            - /placeholder: ••••••••
            - text: TestPassword123!
        - button "Se connecter" [ref=e33] [cursor=pointer]
      - paragraph [ref=e35]:
        - text: Pas encore de compte ?
        - link "Rejoindre l'élite" [ref=e36] [cursor=pointer]:
          - /url: /signup
```