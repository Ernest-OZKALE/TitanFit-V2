import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-16 max-w-4xl mx-auto">
            <Link href="/">
                <Button variant="ghost" className="mb-8 text-gray-400 hover:text-white pl-0">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Retour
                </Button>
            </Link>

            <h1 className="text-4xl font-black mb-2 text-[#D4AF37]">Politique de Confidentialité</h1>
            <p className="text-gray-500 mb-12">Dernière mise à jour : 19 Janvier 2026</p>

            <div className="space-y-8 text-gray-300 leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-white mb-4">1. Collecte des Données</h2>
                    <p>
                        Nous collectons les informations que vous nous fournissez directement :
                        données d'identification (nom, email), données de santé (poids, taille, objectifs),
                        et données d'activité (entrâinements, repas).
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">2. Utilisation des Données</h2>
                    <p>
                        Vos données sont utilisées exclusivement pour :
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Personnaliser votre expérience TitanFit.</li>
                            <li>Fournir des analyses via notre Coach IA (Gemini).</li>
                            <li>Améliorer nos algorithmes de recommandation.</li>
                        </ul>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">3. Protection et Partage</h2>
                    <p>
                        Nous ne vendons jamais vos données personnelles. Elles sont stockées de manière sécurisée
                        sur des serveurs (Supabase) utilisant le cryptage standard de l'industrie.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">4. Vos Droits (RGPD)</h2>
                    <p>
                        Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression
                        de vos données. Vous pouvez exercer ces droits directement depuis votre profil ou en nous contactant.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">5. Contact</h2>
                    <p>
                        Pour toute question concernant cette politique : <a href="mailto:privacy@titanfit.com" className="text-[#D4AF37] hover:underline">privacy@titanfit.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
}
