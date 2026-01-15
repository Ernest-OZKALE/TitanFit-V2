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

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signIn } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Attempting login with:', email);
            const { error } = await signIn(email, password);

            if (error) {
                console.error('Login error:', error);
                setError(error.message || 'Erreur de connexion');
                setLoading(false);
            } else {
                console.log('Login successful, redirecting...');
                // Force la redirection avec un fallback
                router.replace('/dashboard');
                // Si router.replace ne fonctionne pas après 500ms, force avec window.location
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 500);
            }
        } catch (err) {
            console.error('Unexpected login error:', err);
            setError('Une erreur inattendue est survenue.');
            setLoading(false);
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
                        <h1 className="text-6xl font-black mb-6 tracking-tight">
                            <span className="text-white">Titan</span>
                            <span className="text-[#D4AF37]">Fit</span>
                        </h1>
                    </Link>
                    <p className="text-2xl mb-8 font-light text-gray-300">Votre Voyage Fitness <br />Commence Ici.</p>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 group">
                            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform text-[#D4AF37]">📊</div>
                            <div>
                                <h3 className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">Suivi Intelligent</h3>
                                <p className="text-sm text-gray-400">Enregistrez vos repas et suivez vos macros</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 group">
                            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform text-[#D4AF37]">🤖</div>
                            <div>
                                <h3 className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">Coach IA</h3>
                                <p className="text-sm text-gray-400">Conseils nutritionnels sur mesure</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 group">
                            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform text-[#D4AF37]">🏆</div>
                            <div>
                                <h3 className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">Mode Élite</h3>
                                <p className="text-sm text-gray-400">Atteignez le sommet de votre potentiel</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right side - Login Form */}
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
                        <h2 className="text-3xl font-bold text-white mb-2">Bon retour</h2>
                        <p className="text-gray-400">L'arène vous attend.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-gray-300 text-sm font-medium ml-1">Mot de passe</Label>
                                <Link href="/forgot-password" className="text-xs text-[#D4AF37] hover:underline">Oublié ?</Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all rounded-xl"
                            />
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
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            Pas encore de compte ?{' '}
                            <Link href="/signup" className="text-[#D4AF37] font-semibold hover:text-[#F5C518] transition-colors">
                                Rejoindre l'élite
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
