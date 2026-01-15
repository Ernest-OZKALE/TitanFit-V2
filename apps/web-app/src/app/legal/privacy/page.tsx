import { PremiumNavbar } from "@/components/PremiumNavbar";
import TitanFooter from "@/components/layout/TitanFooter";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-gray-300 selection:bg-[#D4AF37] selection:text-black font-sans">
            <PremiumNavbar />

            <main className="container mx-auto px-6 py-32 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Politique de Confidentialité</h1>
                <p className="text-sm text-gray-500 mb-12 font-mono">Dernière mise à jour : 20 Janvier 2026</p>

                <div className="prose prose-invert prose-titanium max-w-none space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Collecte des Données</h2>
                        <p>
                            Chez TitanFit, nous prenons votre vie privée au sérieux. Nous collectons les données suivantes pour faire fonctionner le "Bio-OS" :
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li><strong className="text-white">Données d'identité</strong> : Nom, Email, Photo de profil (via Google/Github/Email).</li>
                            <li><strong className="text-white">Données de santé</strong> : Poids, Taille, Pourcentage de graisse (si renseigné).</li>
                            <li><strong className="text-white">Données Biométriques (Optionnel)</strong> : Pas, Fréquence Cardiaque, Sommeil (via Apple Health / Google Fit). Ces données restent stockées localement ou cryptées.</li>
                            <li><strong className="text-white">Données d'entraînement</strong> : Historique des séances, performances, poids soulevés.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Utilisation des Données</h2>
                        <p>Vos données sont utilisées exclusivement pour :</p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li>Calculer votre "Energy Bank" et "Strain".</li>
                            <li>Générer des programmes d'entraînement personnalisés.</li>
                            <li>Améliorer nos algorithmes de prédiction (anonymisé).</li>
                        </ul>
                        <p className="mt-4 text-[#D4AF37]">
                            <strong className="uppercase text-xs tracking-widest border border-[#D4AF37] px-2 py-1 rounded mr-2">Important</strong>
                            Nous ne vendons JAMAIS vos données de santé à des tiers, assureurs ou courtiers en données.
                        </p>
                    </section>

                    <section id="cookies">
                        <h2 className="text-2xl font-bold text-white mb-4">3. Cookies & Stockage Local</h2>
                        <p>
                            Nous utilisons le <code>localStorage</code> de votre navigateur pour :
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li>Maintenir votre session active (Token Supabase).</li>
                            <li>Sauvegarder vos préférences d'interface (Thème, Affichage).</li>
                            <li>Stocker temporairement vos données "Hors Ligne" (PWA).</li>
                        </ul>
                    </section>
                </div>
            </main>

        </div>
    );
}
