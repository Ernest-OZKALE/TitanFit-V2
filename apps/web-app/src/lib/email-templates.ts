/**
 * Email Templates for TitanFit V2
 * Premium HTML email templates with "Liquid Titanium" styling
 */

const BASE_STYLES = `
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
    background-color: #0a0a0a; 
    color: #ffffff; 
    margin: 0; 
    padding: 0; 
  }
  .container { 
    max-width: 600px; 
    margin: 0 auto; 
    padding: 40px 20px; 
  }
  .header { 
    text-align: center; 
    padding: 20px 0; 
    border-bottom: 1px solid rgba(212, 175, 55, 0.2); 
  }
  .logo { 
    font-size: 28px; 
    font-weight: 900; 
    color: #ffffff; 
  }
  .logo span { 
    color: #D4AF37; 
  }
  .content { 
    padding: 40px 20px; 
  }
  .button { 
    display: inline-block; 
    background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%); 
    color: #000000 !important; 
    padding: 16px 32px; 
    text-decoration: none; 
    border-radius: 8px; 
    font-weight: 700; 
    text-transform: uppercase; 
    letter-spacing: 1px; 
    margin: 20px 0;
  }
  .stat-box { 
    background: rgba(255, 255, 255, 0.05); 
    border: 1px solid rgba(255, 255, 255, 0.1); 
    border-radius: 12px; 
    padding: 20px; 
    margin: 20px 0; 
    text-align: center;
  }
  .stat-value { 
    font-size: 36px; 
    font-weight: 900; 
    color: #D4AF37; 
  }
  .stat-label { 
    font-size: 12px; 
    text-transform: uppercase; 
    color: #888888; 
    letter-spacing: 2px;
  }
  .footer { 
    text-align: center; 
    padding: 30px; 
    border-top: 1px solid rgba(255, 255, 255, 0.1); 
    color: #666666; 
    font-size: 12px; 
  }
  .gold { color: #D4AF37; }
  h1, h2 { color: #ffffff; }
`;

const wrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">TITAN<span>FIT.</span></div>
    </div>
    ${content}
    <div class="footer">
      <p>© ${new Date().getFullYear()} TitanFit. All rights reserved.</p>
      <p><a href="{unsubscribe_url}" style="color: #666;">Unsubscribe</a> | <a href="{preferences_url}" style="color: #666;">Email Preferences</a></p>
    </div>
  </div>
</body>
</html>
`;

// ============================================
// WELCOME EMAIL
// ============================================
export const welcomeEmail = (username: string) => wrapper(`
  <div class="content">
    <h1>Bienvenue dans l'élite, ${username} 💪</h1>
    <p style="color: #cccccc; line-height: 1.6;">
      Tu viens de rejoindre la communauté TitanFit. Ici, on ne fait pas semblant. 
      On construit des physiques légendaires, séance après séance.
    </p>
    
    <div class="stat-box">
      <div class="stat-value">0</div>
      <div class="stat-label">Séances Complétées</div>
      <p style="color: #888; margin-top: 10px;">Commence aujourd'hui. Ta transformation débute maintenant.</p>
    </div>
    
    <div style="text-align: center;">
      <a href="{app_url}/dashboard" class="button">Accéder au Dashboard</a>
    </div>
    
    <p style="color: #888; font-size: 14px; margin-top: 30px;">
      <strong class="gold">Ton premier objectif:</strong> Log ta première séance d'entraînement.
    </p>
  </div>
`);

// ============================================
// SUBSCRIPTION CONFIRMATION
// ============================================
export const subscriptionConfirmationEmail = (username: string, planName: string = 'Titan Pro') => wrapper(`
  <div class="content">
    <h1>🔥 Bienvenue chez les ${planName}s, ${username}</h1>
    <p style="color: #cccccc; line-height: 1.6;">
      Tu as débloqué le niveau supérieur. Accès illimité à toutes les fonctionnalités premium.
    </p>
    
    <div class="stat-box" style="border-color: rgba(212, 175, 55, 0.4);">
      <div class="stat-value" style="font-size: 24px;">${planName}</div>
      <div class="stat-label">Ton Nouveau Statut</div>
    </div>
    
    <h2 style="font-size: 16px; color: #D4AF37; text-transform: uppercase; letter-spacing: 2px;">Ce qui t'attend :</h2>
    <ul style="color: #cccccc; line-height: 2;">
      <li>🤖 AI Coach Personnel - Conseils sur mesure 24/7</li>
      <li>📸 Titan Vision - Analyse nutritionnelle par photo</li>
      <li>🧪 Fridge Alchemist - Recettes AI selon tes ingrédients</li>
      <li>📊 Analytics Avancés - Prédictions et tendances</li>
      <li>🏆 Leaderboard VIP - Compete avec l'élite</li>
    </ul>
    
    <div style="text-align: center;">
      <a href="{app_url}/dashboard" class="button">Explorer les Features Pro</a>
    </div>
  </div>
`);

// ============================================
// SUBSCRIPTION CANCELLATION
// ============================================
export const subscriptionCancellationEmail = (username: string) => wrapper(`
  <div class="content">
    <h1>On se revoit bientôt, ${username}</h1>
    <p style="color: #cccccc; line-height: 1.6;">
      Ton abonnement Titan Pro a été annulé. Tu conserves l'accès jusqu'à la fin de ta période de facturation.
    </p>
    
    <div class="stat-box">
      <p style="color: #888;">Tes données d'entraînement et ton historique seront préservés.</p>
    </div>
    
    <p style="color: #cccccc; line-height: 1.6;">
      Si c'est une erreur ou si tu changes d'avis, tu peux te réabonner à tout moment :
    </p>
    
    <div style="text-align: center;">
      <a href="{app_url}/settings" class="button">Gérer Mon Abonnement</a>
    </div>
    
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Une question ? Réponds à cet email, on est là pour toi.
    </p>
  </div>
`);

// ============================================
// STREAK REMINDER (Risk of losing streak)
// ============================================
export const streakReminderEmail = (username: string, currentStreak: number) => wrapper(`
  <div class="content">
    <h1>⚠️ Ton streak est en danger, ${username}</h1>
    <p style="color: #cccccc; line-height: 1.6;">
      Tu n'as pas logué de séance aujourd'hui. Ne laisse pas ${currentStreak} jours de discipline s'envoler.
    </p>
    
    <div class="stat-box" style="border-color: rgba(239, 68, 68, 0.4);">
      <div class="stat-value" style="color: #EF4444;">${currentStreak}🔥</div>
      <div class="stat-label">Jours de Streak</div>
      <p style="color: #EF4444; font-size: 12px; margin-top: 10px;">DERNIÈRE CHANCE AUJOURD'HUI</p>
    </div>
    
    <div style="text-align: center;">
      <a href="{app_url}/training" class="button">Sauver Mon Streak</a>
    </div>
    
    <p style="color: #888; font-size: 14px; margin-top: 20px;">
      Même une séance courte compte. 10 minutes suffisent pour maintenir ta série.
    </p>
  </div>
`);

// ============================================
// WORKOUT REMINDER (No workout in 48h)
// ============================================
export const workoutReminderEmail = (username: string, daysSinceLastWorkout: number) => wrapper(`
  <div class="content">
    <h1>Les gains n'attendent pas, ${username}</h1>
    <p style="color: #cccccc; line-height: 1.6;">
      Ça fait ${daysSinceLastWorkout} jours depuis ta dernière séance. Le muscle ne se construit pas au repos.
    </p>
    
    <div class="stat-box">
      <div class="stat-value">${daysSinceLastWorkout}</div>
      <div class="stat-label">Jours Sans Training</div>
    </div>
    
    <p style="color: #D4AF37; font-weight: 600;">
      "La discipline, c'est de faire ce qu'on doit faire, même quand on n'en a pas envie."
    </p>
    
    <div style="text-align: center;">
      <a href="{app_url}/training" class="button">Reprendre L'Entraînement</a>
    </div>
  </div>
`);

// ============================================
// ACHIEVEMENT UNLOCKED
// ============================================
export const achievementUnlockedEmail = (
    username: string,
    achievementName: string,
    achievementDescription: string,
    xpEarned: number
) => wrapper(`
  <div class="content">
    <h1 style="text-align: center;">🏆 ACHIEVEMENT DÉBLOQUÉ</h1>
    
    <div class="stat-box" style="border-color: rgba(212, 175, 55, 0.6); background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(184, 134, 11, 0.05) 100%);">
      <div class="stat-value" style="font-size: 48px;">🎖️</div>
      <div style="font-size: 20px; font-weight: 700; color: #D4AF37; margin: 10px 0;">${achievementName}</div>
      <p style="color: #cccccc;">${achievementDescription}</p>
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
        <span class="gold" style="font-weight: 700;">+${xpEarned} XP</span>
      </div>
    </div>
    
    <p style="color: #cccccc; text-align: center;">
      Continue comme ça, ${username}. Chaque achievement te rapproche de la légende.
    </p>
    
    <div style="text-align: center;">
      <a href="{app_url}/achievements" class="button">Voir Tous Mes Achievements</a>
    </div>
  </div>
`);

// ============================================
// WEEKLY DIGEST
// ============================================
export const weeklyDigestEmail = (
    username: string,
    stats: {
        workouts: number;
        totalMinutes: number;
        caloriesBurned: number;
        streak: number;
        weeklyGoalMet: boolean;
    }
) => wrapper(`
  <div class="content">
    <h1>📊 Ton Bilan Hebdo, ${username}</h1>
    <p style="color: #cccccc; line-height: 1.6;">
      Voici comment tu as performé cette semaine. ${stats.weeklyGoalMet ? 'Objectifs atteints. Bravo! 🔥' : 'On fait mieux la semaine prochaine.'}
    </p>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 30px 0;">
      <div class="stat-box" style="margin: 0;">
        <div class="stat-value">${stats.workouts}</div>
        <div class="stat-label">Séances</div>
      </div>
      <div class="stat-box" style="margin: 0;">
        <div class="stat-value">${stats.totalMinutes}</div>
        <div class="stat-label">Minutes</div>
      </div>
      <div class="stat-box" style="margin: 0;">
        <div class="stat-value">${stats.caloriesBurned}</div>
        <div class="stat-label">Calories</div>
      </div>
      <div class="stat-box" style="margin: 0;">
        <div class="stat-value">${stats.streak}🔥</div>
        <div class="stat-label">Streak</div>
      </div>
    </div>
    
    <div style="text-align: center;">
      <a href="{app_url}/progress" class="button">Voir Analytics Complets</a>
    </div>
  </div>
`);

// ============================================
// PASSWORD RESET
// ============================================
export const passwordResetEmail = (resetLink: string) => wrapper(`
  <div class="content">
    <h1>Réinitialisation de mot de passe</h1>
    <p style="color: #cccccc; line-height: 1.6;">
      Tu as demandé à réinitialiser ton mot de passe TitanFit. 
      Clique sur le bouton ci-dessous pour créer un nouveau mot de passe.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" class="button">Réinitialiser Mon Mot de Passe</a>
    </div>
    
    <p style="color: #888; font-size: 14px;">
      Ce lien expire dans 1 heure. Si tu n'as pas fait cette demande, ignore cet email.
    </p>
    
    <p style="color: #666; font-size: 12px; margin-top: 30px;">
      Pour des raisons de sécurité, ne partage jamais ce lien avec qui que ce soit.
    </p>
  </div>
`);

// ============================================
// EMAIL VERIFICATION
// ============================================
export const emailVerificationEmail = (username: string, verificationLink: string) => wrapper(`
  <div class="content">
    <h1>Confirme ton email, ${username}</h1>
    <p style="color: #cccccc; line-height: 1.6;">
      Une dernière étape pour activer ton compte TitanFit. 
      Clique sur le bouton pour vérifier ton adresse email.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationLink}" class="button">Vérifier Mon Email</a>
    </div>
    
    <p style="color: #888; font-size: 14px;">
      Si le bouton ne fonctionne pas, copie ce lien dans ton navigateur :
      <br><span style="color: #D4AF37; word-break: break-all;">${verificationLink}</span>
    </p>
  </div>
`);

// Export all templates
export const emailTemplates = {
    welcome: welcomeEmail,
    subscriptionConfirmation: subscriptionConfirmationEmail,
    subscriptionCancellation: subscriptionCancellationEmail,
    streakReminder: streakReminderEmail,
    workoutReminder: workoutReminderEmail,
    achievementUnlocked: achievementUnlockedEmail,
    weeklyDigest: weeklyDigestEmail,
    passwordReset: passwordResetEmail,
    emailVerification: emailVerificationEmail,
};
