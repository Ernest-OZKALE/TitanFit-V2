'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, Shield, Ban, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    role: 'admin' | 'user' | 'trainer';
    status: 'active' | 'inactive' | 'banned';
    created_at: string;
    avatar_url?: string;
}

/**
 * UserManager Component
 * Provides a high-end interface for admin user management
 */
export const UserManager: React.FC = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async (query = '') => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/users?search=${encodeURIComponent(query)}`);
            const data = await response.json();
            if (data.users) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers(search);
    };

    const updateStatus = async (userId: string, status: string) => {
        try {
            const response = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, status }),
            });
            if (response.ok) {
                fetchUsers(search);
            }
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* SEARCH & ACTIONS */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <form onSubmit={handleSearch} className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un utilisateur (Nom, Email)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-titan-gold/50 transition-all font-mono text-sm"
                    />
                </form>
                <Button className="w-full md:w-auto bg-titan-gold text-black hover:bg-titan-gold/90 font-bold px-6">
                    <UserPlus size={18} className="mr-2" />
                    Ajouter Utilisateur
                </Button>
            </div>

            {/* USERS TABLE/LIST */}
            <GlassCard noPadding>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs font-mono uppercase tracking-widest">
                                <th className="px-6 py-4">Utilisateur</th>
                                <th className="px-6 py-4">Rôle</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4">Inscription</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-6 py-4">
                                                <div className="h-10 bg-white/5 rounded-lg w-full" />
                                            </td>
                                        </tr>
                                    ))
                                ) : users.map((user) => (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        key={user.id}
                                        className="group hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-titan-gold/20 to-transparent flex items-center justify-center border border-white/10 text-titan-gold font-bold">
                                                    {(user.full_name || user.email).charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white leading-none mb-1">{user.full_name || 'Sans nom'}</p>
                                                    <p className="text-xs font-mono text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Shield size={14} className={user.role === 'admin' ? 'text-titan-gold' : 'text-gray-500'} />
                                                <span className={`text-xs font-mono capitalize ${user.role === 'admin' ? 'text-titan-gold' : 'text-gray-400'}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {user.status === 'active' ? (
                                                    <CheckCircle size={14} className="text-green-500" />
                                                ) : (
                                                    <XCircle size={14} className="text-red-500" />
                                                )}
                                                <span className={`text-xs font-mono capitalize ${user.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                                                    {user.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-mono text-gray-500">
                                                {format(new Date(user.created_at), 'dd MMM yyyy', { locale: fr })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {user.status === 'active' ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() => updateStatus(user.id, 'inactive')}
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                    >
                                                        <Ban size={16} />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() => updateStatus(user.id, 'active')}
                                                        className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="icon-sm" className="text-gray-400 hover:text-white">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {!loading && users.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-gray-500 font-mono text-sm">Aucun utilisateur trouvé.</p>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};
