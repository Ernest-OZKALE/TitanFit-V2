import { PremiumNavbar } from "@/components/PremiumNavbar";
import TitanFooter from "@/components/layout/TitanFooter";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-gray-300 selection:bg-[#D4AF37] selection:text-black font-sans">
            <PremiumNavbar />

            <main className="container mx-auto px-6 py-32 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Conditions Générales d'Utilisation (CGU)</h1>
                <p className="text-sm text-gray-500 mb-12 font-mono">Dernière mise à jour : 20 Janvier 2026</p>

                <div className="prose prose-invert prose-titanium max-w-none space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Avertissement Médical (DISCLAIMER)</h2>
                        <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl">
                            <p className="text-red-200 font-bold mb-2">⚠️ À LIRE IMPÉRATIVEMENT</p>
                            <p className="text-sm leading-relaxed">
                                TitanFit n'est pas un dispositif médical. Les scores "Energy Bank", "Strain" ou "Recovery" sont des estimations algorithmiques basées sur vos données et ne remplacent pas un avis médical professionnel.
                                Consultez toujours un médecin avant de commencer un programme d'entraînement intensif.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Accès Premium</h2>
                        <p>
                            L'accès à certaines fonctionnalités avancées (Titan Intelligence, Programmes Pro) nécessite un abonnement actif.
                            L'abonnement est géré via Stripe. Vous pouvez annuler à tout moment depuis votre Dashboard.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Responsabilité</h2>
                        <p>
                            En utilisant TitanFit, vous reconnaissez participer à des activités physiques comportant des risques.
                            TitanFit Technologies ne saurait être tenu responsable des blessures survenant durant l'exécution des exercices proposés.
                            L'utilisateur est seul responsable de la bonne exécution des mouvements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Code de Conduite</h2>
                        <p>
                            TitanFit est une communauté d'élite. Tout comportement toxique, harcèlement ou triche dans les Leaderboards entraînera une suspension immédiate du compte sans remboursement.
                        </p>
                    </section>
                </div>
            </main>

        </div>
    );
}
