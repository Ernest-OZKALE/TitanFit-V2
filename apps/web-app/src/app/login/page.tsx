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
    const { signIn, signInWithOAuth, user } = useAuth();
    const router = useRouter();

    // If already authenticated, show a message and redirect button
    if (user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
                <div className="text-center p-8 bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] max-w-md">
                    <div className="text-4xl mb-4">👋</div>
                    <h1 className="text-2xl font-bold mb-2">Déjà connecté !</h1>
                    <p className="text-slate-500 mb-6">Tu es déjà authentifié en tant que <span className="text-[#D4AF37] font-semibold">{user.email}</span></p>
                    <Button onClick={() => router.push('/dashboard')} className="w-full bg-[#D4AF37] text-white hover:bg-[#B8860B] font-bold shadow-lg shadow-[#D4AF37]/20">
                        Aller au Dashboard
                    </Button>
                </div>
            </div>
        );
    }

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
                console.log('Login successful, waiting for cookies to sync...');
                // Attendre que les cookies soient synchronisés avant de rediriger
                // Utiliser window.location.href directement pour éviter la race condition avec le middleware
                await new Promise(resolve => setTimeout(resolve, 300));
                console.log('Redirecting to dashboard...');
                window.location.href = '/dashboard';
            }
        } catch (err) {
            console.error('Unexpected login error:', err);
            setError('Une erreur inattendue est survenue.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden text-slate-900 bg-white">
            {/* Background 3D */}
            <TitaniumBackground />

            {/* Overlay Gradient pour lisibilité - Pure White Fog */}
            <div className="absolute inset-0 bg-white/40 z-0 pointer-events-none" />

            {/* Left side - Branding (Glass Panel) */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-xl p-12 rounded-[2.5rem] border border-white/50 glass-panel backdrop-blur-2xl bg-white/60 shadow-[0_8px_40px_rgba(0,0,0,0.04)]"
                >
                    <Link href="/">
                        <h1 className="text-6xl font-black mb-6 tracking-tight">
                            <span className="text-slate-900">Titan</span>
                            <span className="text-[#D4AF37]">Fit</span>
                        </h1>
                    </Link>
                    <p className="text-2xl mb-8 font-light text-slate-600">Votre Voyage Fitness <br />Commence Ici.</p>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform text-[#D4AF37] shadow-sm">📊</div>
                            <div>
                                <h3 className="font-bold text-slate-900 group-hover:text-[#D4AF37] transition-colors">Suivi Intelligent</h3>
                                <p className="text-sm text-slate-500">Enregistrez vos repas et suivez vos macros</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform text-[#D4AF37] shadow-sm">🤖</div>
                            <div>
                                <h3 className="font-bold text-slate-900 group-hover:text-[#D4AF37] transition-colors">Coach Titan</h3>
                                <p className="text-sm text-slate-500">Conseils nutritionnels sur mesure</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform text-[#D4AF37] shadow-sm">🏆</div>
                            <div>
                                <h3 className="font-bold text-slate-900 group-hover:text-[#D4AF37] transition-colors">Mode Élite</h3>
                                <p className="text-sm text-slate-500">Atteignez le sommet de votre potentiel</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
                {/* Back to Home Button */}
                <Link href="/" className="absolute top-6 left-6 lg:left-auto lg:right-10 z-50">
                    <Button variant="ghost" className="text-slate-400 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour à l'accueil
                    </Button>
                </Link>


                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-full max-w-md p-8 md:p-10 rounded-[2.5rem] bg-white/80 border border-slate-200/60 backdrop-blur-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.05)]"
                >
                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Bon retour</h2>
                        <p className="text-slate-500">L'arène vous attend.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 text-sm font-medium ml-1">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="titan@exemple.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-slate-700 text-sm font-medium ml-1">Mot de passe</Label>
                                <Link href="/forgot-password" className="text-xs text-[#D4AF37] hover:underline font-medium">Oublié ?</Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all rounded-xl"
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/50">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-bold bg-[#D4AF37] text-white hover:bg-[#B8860B] border-none shadow-[0_10px_30px_-10px_#D4AF37] hover:shadow-[0_15px_30px_-5px_#D4AF37] transition-all rounded-xl uppercase tracking-wider"
                            disabled={loading}
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center">
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="px-4 text-xs text-slate-400 uppercase tracking-wider">ou continuer avec</span>
                        <div className="flex-1 h-px bg-slate-200"></div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => signInWithOAuth('google')}
                            className="flex items-center justify-center h-12 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-[#D4AF37]/50 transition-all group"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => signInWithOAuth('apple')}
                            className="flex items-center justify-center h-12 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-[#D4AF37]/50 transition-all group"
                        >
                            <svg className="w-5 h-5 fill-slate-900 group-hover:fill-black" viewBox="0 0 24 24">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => signInWithOAuth('github')}
                            className="flex items-center justify-center h-12 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-[#D4AF37]/50 transition-all group"
                        >
                            <svg className="w-5 h-5 fill-slate-900 group-hover:fill-black" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            Pas encore de compte ?{' '}
                            <Link href="/signup" className="text-[#D4AF37] font-semibold hover:text-[#B8860B] transition-colors">
                                Rejoindre l'élite
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
