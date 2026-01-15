'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { UserPlus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { variants } from '@/lib/animation-utils';

interface AddUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUserCreated: () => void;
}

export function AddUserDialog({ open, onOpenChange, onUserCreated }: AddUserDialogProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate inputs
            if (!email || !password) {
                throw new Error('Email et mot de passe sont requis');
            }

            if (password.length < 6) {
                throw new Error('Le mot de passe doit contenir au moins 6 caractères');
            }

            // Create user via Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role,
                    }
                }
            });

            if (authError) throw authError;

            if (!authData.user) {
                throw new Error('Erreur lors de la création de l\'utilisateur');
            }

            // Create profile entry
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authData.user.id,
                    email: email,
                    full_name: fullName,
                    role: role,
                });

            if (profileError) {
                console.error('Profile creation error:', profileError);
                // Don't throw - authUser is created, profile can be created later
            }

            // Reset form
            setEmail('');
            setPassword('');
            setFullName('');
            setRole('user');

            // Notify parent and close dialog
            onUserCreated();
            onOpenChange(false);
        } catch (err: any) {
            console.error('Error creating user:', err);
            setError(err.message || 'Erreur lors de la création de l\'utilisateur');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] border-2 border-[#D4AF37]/30 bg-white rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-black text-slate-900">
                        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F5C518] shadow-lg">
                            <UserPlus className="h-6 w-6 text-black" />
                        </div>
                        <span>Ajouter un Utilisateur</span>
                    </DialogTitle>
                    <DialogDescription className="text-slate-600 text-base">
                        Créez un nouveau compte utilisateur pour votre plateforme TitanFit.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <motion.div
                        className="grid gap-5 py-6"
                        initial="hidden"
                        animate="visible"
                        variants={variants.staggerContainer}
                    >
                        {/* Full Name */}
                        <motion.div variants={variants.slideUp} className="grid gap-2.5">
                            <Label htmlFor="fullName" className="text-sm font-semibold text-slate-700">
                                Nom complet
                            </Label>
                            <Input
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
                                className="input-standard h-12 text-base transition-all focus:scale-[1.01] focus:shadow-gold"
                            />
                        </motion.div>

                        {/* Email */}
                        <motion.div variants={variants.slideUp} className="grid gap-2.5">
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                                Email <span className="text-[#D4AF37]">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                required
                                className="input-standard h-12 text-base transition-all focus:scale-[1.01] focus:shadow-gold"
                            />
                        </motion.div>

                        {/* Password */}
                        <motion.div variants={variants.slideUp} className="grid gap-2.5">
                            <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                                Mot de passe <span className="text-[#D4AF37]">*</span>
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Minimum 6 caractères"
                                required
                                minLength={6}
                                className="input-standard h-12 text-base transition-all focus:scale-[1.01] focus:shadow-gold"
                            />
                        </motion.div>

                        {/* Role */}
                        <motion.div variants={variants.slideUp} className="grid gap-2.5">
                            <Label htmlFor="role" className="text-sm font-semibold text-slate-700">
                                Rôle
                            </Label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger className="select-standard h-12 text-base transition-all focus:scale-[1.01] focus:shadow-gold">
                                    <SelectValue placeholder="Sélectionner un rôle" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-2 border-[#D4AF37]/20 rounded-lg shadow-xl">
                                    <SelectItem value="user" className="hover:bg-[#D4AF37]/10 cursor-pointer">
                                        Utilisateur
                                    </SelectItem>
                                    <SelectItem value="coach" className="hover:bg-[#D4AF37]/10 cursor-pointer">
                                        Coach
                                    </SelectItem>
                                    <SelectItem value="admin" className="hover:bg-[#D4AF37]/10 cursor-pointer">
                                        Admin
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </motion.div>

                        {/* Error Message */}
                        {error && (
                            <motion.div variants={variants.slideUp} className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                                <p className="text-sm font-medium text-red-600">{error}</p>
                            </motion.div>
                        )}
                    </motion.div>

                    <DialogFooter className="gap-3 sm:gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="flex-1 h-12 border-2 border-slate-200 hover:bg-slate-50 font-semibold transition-all duration-200"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 h-12 bg-gradient-to-r from-[#D4AF37] to-[#F5C518] text-black font-bold hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all duration-300 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Création...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-5 w-5" />
                                    Créer l'utilisateur
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
