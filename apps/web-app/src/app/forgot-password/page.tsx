'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import TitaniumBackground from '@/components/TitaniumBackground';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({
                type: 'success',
                text: 'Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.'
            });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen relative overflow-hidden text-gray-100 flex items-center justify-center font-sans">
            <TitaniumBackground />
            <div className="absolute inset-0 bg-black/70 z-0 pointer-events-none" />

            <div className="relative z-10 w-full max-w-md px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
                >
                    <Link href="/login" className="inline-flex items-center text-gray-400 hover:text-[#D4AF37] mb-6 transition-colors text-sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour à la connexion
                    </Link>

                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Mot de passe oublié ?</h1>
                    <p className="text-gray-400 mb-8">
                        Entrez votre email pour recevoir le lien de réinitialisation.
                    </p>

                    {message?.type === 'success' ? (
                        <div className="bg-green-900/20 border border-green-500/50 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-green-400 mb-2">Email envoyé</h3>
                            <p className="text-sm text-green-200/80">{message.text}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-300">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="votre@email.com"
                                        required
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
                                {loading ? 'Envoi...' : 'Envoyer le lien'}
                            </Button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
