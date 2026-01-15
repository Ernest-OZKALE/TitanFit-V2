# Modèles d'Emails TitanFit

Copiez ces modèles HTML dans votre Dashboard Supabase > Authentication > Email Templates.

## 1. Confirm Your Signup (Bienvenue)

**Subject**: Bienvenue dans l'Élite TitanFit

```html
<div style="font-family: sans-serif; background-color: #000; color: #fff; padding: 40px; text-align: center;">
  <img src="https://titanfit.app/icon.png" alt="TitanFit" width="80" style="margin-bottom: 20px;">
  
  <h1 style="color: #D4AF37; text-transform: uppercase; font-size: 24px; letter-spacing: 2px;">Bienvenue, Titan.</h1>
  
  <p style="color: #aaa; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
    Votre voyage vers l'excellence physique commence maintenant. Confirmez votre email pour débloquer l'accès au Bio-OS.
  </p>
  
  <a href="{{ .ConfirmationURL }}" style="background-color: #D4AF37; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; text-transform: uppercase;">
    Activer mon Compte
  </a>
  
  <p style="color: #555; font-size: 12px; margin-top: 40px;">
    Si vous n'avez pas créé de compte, ignorez cet email.
  </p>
</div>
```

## 2. Reset Password (Réinitialisation)

**Subject**: Réinitialisation de votre accès TitanFit

```html
<div style="font-family: sans-serif; background-color: #000; color: #fff; padding: 40px; text-align: center;">
  <img src="https://titanfit.app/icon.png" alt="TitanFit" width="80" style="margin-bottom: 20px;">
  
  <h1 style="color: #fff; text-transform: uppercase;">Sécurité d'Accès</h1>
  
  <p style="color: #aaa; font-size: 16px; margin-bottom: 30px;">
    Une demande de réinitialisation de mot de passe a été émise pour votre compte.
  </p>
  
  <a href="{{ .ConfirmationURL }}" style="border: 1px solid #D4AF37; color: #D4AF37; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; text-transform: uppercase;">
    Changer mon mot de passe
  </a>
  
  <p style="color: #555; font-size: 12px; margin-top: 40px;">
    Ce lien expire dans 24 heures.
  </p>
</div>
```

## 3. Invite User (Invitation)

**Subject**: Vous avez été invité sur TitanFit

```html
<div style="font-family: sans-serif; background-color: #000; color: #fff; padding: 40px; text-align: center;">
  <h1 style="color: #D4AF37;">Invitation Reçue</h1>
  <p>Vous avez été invité à rejoindre l'organisation TitanFit.</p>
  <a href="{{ .ConfirmationURL }}" style="background-color: #D4AF37; color: #000; padding: 10px 20px; text-decoration: none;">Accepter l'invitation</a>
</div>
```
