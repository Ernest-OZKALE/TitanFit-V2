import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-16 max-w-4xl mx-auto">
            <Link href="/">
                <Button variant="ghost" className="mb-8 text-gray-400 hover:text-white pl-0">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Retour
                </Button>
            </Link>

            <h1 className="text-4xl font-black mb-2 text-[#D4AF37]">Conditions Générales d'Utilisation</h1>
            <p className="text-gray-500 mb-12">Dernière mise à jour : 19 Janvier 2026</p>

            <div className="space-y-8 text-gray-300 leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-white mb-4">1. Acceptation des Conditions</h2>
                    <p>
                        En accédant et en utilisant TitanFit V2, vous acceptez d'être lié par les présentes conditions.
                        Si vous n'acceptez pas ces termes, veuillez ne pas utiliser nos services.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">2. Services Proposés</h2>
                    <p>
                        TitanFit fournit des outils de suivi fitness et nutritionnel. Ces outils sont à titre informatif
                        et ne remplacent pas un avis médical professionnel. Consultez toujours un médecin avant de commencer
                        un programme sportif.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">3. Compte Utilisateur</h2>
                    <p>
                        Vous êtes responsable de la confidentialité de votre compte et de votre mot de passe.
                        Toute activité effectuée sous votre compte relève de votre responsabilité.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">4. Propriété Intellectuelle</h2>
                    <p>
                        Tout le contenu de TitanFit (logos, textes, graphiques, code) est la propriété exclusive de TitanFit
                        ou de ses concédants de licence et ne peut être reproduit sans autorisation.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">5. Résiliation</h2>
                    <p>
                        Nous nous réservons le droit de suspendre ou de supprimer votre compte en cas de violation
                        de ces conditions, sans préavis.
                    </p>
                </section>
            </div>
        </div>
    );
}
