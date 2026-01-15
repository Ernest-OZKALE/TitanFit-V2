'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TitaniumBackground from '@/components/TitaniumBackground';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signUp } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);
        const { error } = await signUp(email, password, username);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            alert('Compte créé ! Vérifiez votre email pour confirmer.');
            router.push('/login');
        }
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden text-gray-100">
            {/* Background 3D */}
            <TitaniumBackground />

            {/* Overlay Gradient pour lisibilité */}
            <div className="absolute inset-0 bg-black/60 z-0" />

            {/* Left side - Branding (Glass Panel) */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">
                // @ts-ignore
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-xl p-12 rounded-3xl border border-white/10 glass-panel backdrop-blur-xl bg-black/30"
                >
                    <Link href="/">
                        <h1 className="text-6xl font-black mb-6 tracking-tight hover:opacity-80 transition-opacity">
                            <span className="text-white">Titan</span>
                            <span className="text-[#D4AF37]">Fit</span>
                        </h1>
                    </Link>
                    <p className="text-2xl mb-4 font-light text-gray-300">Commencez Votre Transformation.</p>
                    <p className="text-lg text-gray-400 mb-12 leading-relaxed">
                        Rejoignez l'élite et propulsez vos performances au niveau supérieur grâce à notre technologie IA.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 group">
                            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20 group-hover:scale-110 transition-transform">✓</div>
                            <div>
                                <h3 className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">Gratuit Pour Toujours</h3>
                                <p className="text-sm text-gray-500">Aucune carte bancaire requise pour démarrer</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 group">
                            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20 group-hover:scale-110 transition-transform">✓</div>
                            <div>
                                <h3 className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">Propulsé par l'IA</h3>
                                <p className="text-sm text-gray-500">Coaching intelligent adaptatif</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 group">
                            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20 group-hover:scale-110 transition-transform">✓</div>
                            <div>
                                <h3 className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">Confidentialité Totale</h3>
                                <p className="text-sm text-gray-500">Vos données restent privées</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right side - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
                {/* Back to Home Button */}
                <Link href="/" className="absolute top-6 left-6 lg:left-auto lg:right-10">
                    <Button variant="ghost" className="text-gray-400 hover:text-[#D4AF37] hover:bg-white/5 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour à l'accueil
                    </Button>
                </Link>

                // @ts-ignore
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-full max-w-md p-8 md:p-10 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl"
                >
                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-white mb-2">Créer un compte</h2>
                        <p className="text-gray-400">Rejoignez la légende en quelques secondes.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-gray-300 text-sm font-medium ml-1">Nom d'utilisateur</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="titan_warrior"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300 text-sm font-medium ml-1">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="titan@exemple.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-300 text-sm font-medium ml-1">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all rounded-xl"
                            />
                            <p className="text-xs text-gray-500 ml-1">Minimum 6 caractères</p>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/50">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-bold bg-[#D4AF37] text-black hover:bg-[#B8860B] border-none shadow-[0_0_20px_-5px_#D4AF37] hover:shadow-[0_0_30px_-5px_#D4AF37] transition-all rounded-xl uppercase tracking-wider"
                            disabled={loading}
                        >
                            {loading ? 'Création en cours...' : 'Rejoindre Gratuitement'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            Vous avez déjà un compte ?{' '}
                            <Link href="/login" className="text-[#D4AF37] font-semibold hover:text-[#F5C518] transition-colors">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
