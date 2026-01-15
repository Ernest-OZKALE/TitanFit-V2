'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import TitaniumBackground from '@/components/TitaniumBackground';
import { motion } from 'framer-motion';
import BackButton from '@/components/BackButton';

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        bio: '',
        website: '',
        location: '',
        avatar_url: '',
        // Metrics
        weight_kg: 0,
        height_cm: 0,
        goal_type: 'lean',
    });

    useEffect(() => {
        if (!user) return;
        fetchProfile();
    }, [user]);

    async function fetchProfile() {
        // Fetch Profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user?.id)
            .single();

        // Fetch Metrics
        const { data: metrics } = await supabase
            .from('user_metrics') // Assuming this table exists from Onboarding logic
            .select('*')
            .eq('user_id', user?.id)
            .single();

        if (profile) {
            setFormData({
                username: profile.username || '',
                full_name: profile.full_name || '',
                bio: profile.bio || '',
                website: profile.website || '',
                location: profile.location || '',
                avatar_url: profile.avatar_url || '',
                weight_kg: metrics?.weight_kg || 0,
                height_cm: metrics?.height_cm || 0,
                goal_type: metrics?.goal_type || 'lean',
            });
        }
    }

    async function updateProfile(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setMessage(null);

        // 1. Update Profile
        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                username: formData.username,
                full_name: formData.full_name,
                bio: formData.bio,
                website: formData.website,
                location: formData.location,
                avatar_url: formData.avatar_url,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

        // 2. Update Metrics
        const { error: metricsError } = await supabase
            .from('user_metrics')
            .upsert({
                user_id: user.id,
                weight_kg: formData.weight_kg,
                height_cm: formData.height_cm,
                goal_type: formData.goal_type,
            });

        setLoading(false);

        if (profileError || metricsError) {
            setMessage({ type: 'error', text: 'Erreur : ' + (profileError?.message || metricsError?.message) });
        } else {
            setMessage({ type: 'success', text: 'Profil & Métriques mis à jour !' });
            setTimeout(() => router.push('/dashboard'), 1500);
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden text-gray-100 flex flex-col font-sans">
            <TitaniumBackground />
            <div className="absolute inset-0 bg-black/80 z-0 pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <BackButton />
                        <h1 className="text-xl font-bold text-white tracking-wide">Modifier le Profil</h1>
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 w-full">
                <form onSubmit={updateProfile}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Card className="border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl mb-6">
                            <CardHeader className="border-b border-white/5">
                                <CardTitle className="text-white">Profil Public</CardTitle>
                                <CardDescription className="text-gray-400">Ces informations seront visibles par les autres utilisateurs.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                {/* Avatar Upload */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-[#D4AF37] opacity-0 group-hover:opacity-20 rounded-full blur-xl transition-opacity duration-500"></div>
                                        <ImageUpload
                                            bucket="avatars"
                                            currentImage={formData.avatar_url}
                                            onUploadComplete={(url) => setFormData({ ...formData, avatar_url: url })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-gray-300">Nom d'utilisateur</Label>
                                    <Input
                                        id="username"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        placeholder="titan_elite"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                                    <textarea
                                        id="bio"
                                        rows={3}
                                        className="w-full min-h-[100px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-sm placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 resize-none transition-all"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        placeholder="Racontez votre parcours fitness..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-gray-300">Localisation</Label>
                                        <Input
                                            id="location"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="Paris, France"
                                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="website" className="text-gray-300">Site Web</Label>
                                        <Input
                                            id="website"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            placeholder="https://"
                                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl mb-6">
                            <CardHeader className="border-b border-white/5">
                                <CardTitle className="text-white">Détails Personnels</CardTitle>
                                <CardDescription className="text-gray-400">Informations privées pour l'administration.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name" className="text-gray-300">Nom Complet</Label>
                                    <Input
                                        id="full_name"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        placeholder="Jean Dupont"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                                    <Input
                                        id="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="bg-white/5 border-white/5 text-gray-500 cursor-not-allowed rounded-xl"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`p-4 rounded-xl mb-6 border ${message.type === 'success'
                                    ? 'bg-green-900/20 border-green-500/50 text-green-400'
                                    : 'bg-red-900/20 border-red-500/50 text-red-400'
                                    }`}
                            >
                                {message.text}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-[#D4AF37] text-black font-bold text-lg shadow-[0_0_20px_-5px_#D4AF37] hover:bg-[#F5C518] hover:shadow-[0_0_30px_-5px_#D4AF37] hover:scale-[1.02] transition-all rounded-xl uppercase tracking-wider"
                        >
                            {loading ? 'Sauvegarde...' : 'Sauvegarder le Profil'}
                            {!loading && <Save className="ml-2 h-5 w-5" />}
                        </Button>
                    </motion.div>
                </form>
            </div>
        </div>
    );
}
