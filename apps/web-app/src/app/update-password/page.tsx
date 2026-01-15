'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, CheckCircle } from 'lucide-react';
import TitaniumBackground from '@/components/TitaniumBackground';
import { motion } from 'framer-motion';

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès !' });
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen relative overflow-hidden text-gray-100 flex items-center justify-center font-sans">
            <TitaniumBackground />
            <div className="absolute inset-0 bg-black/70 z-0 pointer-events-none" />

            <div className="relative z-10 w-full max-w-md px-4">
                // @ts-ignore
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
                >
                    <h1 className="text-2xl font-black text-white mb-2 tracking-tight">Nouveau mot de passe</h1>
                    <p className="text-gray-400 mb-8 text-sm">
                        Entrez votre nouveau mot de passe sécurisé.
                    </p>

                    {message?.type === 'success' ? (
                        <div className="text-center animate-in fade-in zoom-in">
                            <CheckCircle className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">Succès !</h3>
                            <p className="text-gray-400 mb-4">Redirection vers le tableau de bord...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-300">Nouveau Mot de Passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl transition-all"
                                    />
                                </div>
                            </div>

                            {message?.type === 'error' && (
                                <p className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-500/30">
                                    {message.text}
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#F5C518] shadow-[0_0_20px_-5px_#D4AF37] transition-all rounded-xl"
                            >
                                {loading ? 'Mise à jour...' : 'Mettre à jour'}
                            </Button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
