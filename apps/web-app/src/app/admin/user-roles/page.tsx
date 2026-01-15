'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Crown,
    Star,
    Users,
    UserPlus,
    UserMinus,
    Search,
    Check,
    X,
    Clock,
    Sparkles,
    Trophy,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Role {
    id: string;
    name: string;
    display_name: string;
    description?: string;
    badge_color: string;
    priority: number;
    is_system: boolean;
    user_count?: number;
}

interface UserRoleAssignment {
    id: string;
    granted_at: string;
    expires_at?: string;
    reason?: string;
    role: Role;
}

export default function AdminUserRolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [showGrantModal, setShowGrantModal] = useState(false);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await fetch('/api/admin/user-roles');
            const data = await response.json();
            setRoles(data.roles || []);
        } catch (error) {
            console.error('Error fetching roles:', error);
            toast.error('Erreur de chargement');
        } finally {
            setLoading(false);
        }
    };

    const getRoleIcon = (name: string) => {
        const icons: Record<string, React.ReactNode> = {
            super_admin: <Shield className="w-5 h-5" />,
            admin: <Crown className="w-5 h-5" />,
            moderator: <Star className="w-5 h-5" />,
            vip: <Sparkles className="w-5 h-5" />,
            beta_tester: <Zap className="w-5 h-5" />,
            influencer: <Trophy className="w-5 h-5" />,
            coach: <Users className="w-5 h-5" />,
        };
        return icons[name] || <Star className="w-5 h-5" />;
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="w-7 h-7 text-[#D4AF37]" />
                        Rôles Utilisateurs
                    </h1>
                    <p className="text-gray-500">Gérez les permissions et accès spéciaux</p>
                </div>
                <Button
                    onClick={() => setShowGrantModal(true)}
                    className="bg-[#D4AF37] text-black hover:bg-[#B8860B]"
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Attribuer un Rôle
                </Button>
            </div>

            {/* Roles Grid */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">Chargement...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roles.map((role) => (
                        <motion.div
                            key={role.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-zinc-900/50 border border-white/10 rounded-xl p-5 cursor-pointer
                                     hover:border-[#D4AF37]/30 transition-all"
                            onClick={() => setSelectedRole(role)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div
                                    className="p-3 rounded-xl"
                                    style={{ backgroundColor: `${role.badge_color}20` }}
                                >
                                    <div style={{ color: role.badge_color }}>
                                        {getRoleIcon(role.name)}
                                    </div>
                                </div>
                                {role.is_system && (
                                    <span className="text-xs bg-zinc-700 px-2 py-1 rounded">Système</span>
                                )}
                            </div>

                            <h3 className="font-bold text-lg" style={{ color: role.badge_color }}>
                                {role.display_name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">{role.description}</p>

                            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                                <span className="text-sm text-gray-400">
                                    <Users className="w-4 h-4 inline mr-1" />
                                    {role.user_count || 0} utilisateurs
                                </span>
                                <span className="text-xs text-gray-600">Priorité: {role.priority}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Grant Role Modal */}
            <AnimatePresence>
                {showGrantModal && (
                    <GrantRoleModal
                        roles={roles}
                        onClose={() => setShowGrantModal(false)}
                        onSuccess={fetchRoles}
                    />
                )}
            </AnimatePresence>

            {/* Role Detail Modal */}
            <AnimatePresence>
                {selectedRole && (
                    <RoleDetailModal
                        role={selectedRole}
                        onClose={() => setSelectedRole(null)}
                        onUpdate={fetchRoles}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function GrantRoleModal({ roles, onClose, onSuccess }: any) {
    const [userEmail, setUserEmail] = useState('');
    const [selectedRoleId, setSelectedRoleId] = useState('');
    const [reason, setReason] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [saving, setSaving] = useState(false);
    const [foundUser, setFoundUser] = useState<any>(null);

    const searchUser = async () => {
        if (!userEmail) return;
        // In a real app, you'd search for the user
        // For now, we'll just set the email as the "user"
        setFoundUser({ email: userEmail, id: 'user-id-placeholder' });
        toast.info('Utilisateur trouvé (simulation)');
    };

    const grantRole = async () => {
        if (!foundUser || !selectedRoleId) {
            toast.error('Sélectionnez un utilisateur et un rôle');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch('/api/admin/user-roles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: foundUser.id,
                    role_id: selectedRoleId,
                    reason,
                    expires_at: expiresAt || undefined,
                }),
            });

            if (response.ok) {
                toast.success('Rôle attribué');
                onSuccess();
                onClose();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Erreur');
            }
        } catch {
            toast.error('Erreur serveur');
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md"
                onClick={(e?: any) => e?.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-[#D4AF37]" />
                    Attribuer un Rôle
                </h2>

                <div className="space-y-4">
                    {/* Search User */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email de l'utilisateur</label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={userEmail}
                                onChange={e => setUserEmail(e.target.value)}
                                placeholder="user@example.com"
                                className="flex-1 bg-zinc-800 border border-white/10 rounded-lg px-4 py-2"
                            />
                            <Button variant="outline" onClick={searchUser}>
                                <Search className="w-4 h-4" />
                            </Button>
                        </div>
                        {foundUser && (
                            <p className="text-sm text-green-400 mt-1">
                                <Check className="w-4 h-4 inline" /> Utilisateur trouvé
                            </p>
                        )}
                    </div>

                    {/* Select Role */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Rôle à attribuer</label>
                        <select
                            value={selectedRoleId}
                            onChange={e => setSelectedRoleId(e.target.value)}
                            className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2"
                        >
                            <option value="">Sélectionner un rôle</option>
                            {roles.map((role: Role) => (
                                <option key={role.id} value={role.id}>
                                    {role.display_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Raison (optionnel)</label>
                        <input
                            type="text"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder="Promotion suite à..."
                            className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2"
                        />
                    </div>

                    {/* Expiration */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Expire le (optionnel)</label>
                        <input
                            type="date"
                            value={expiresAt}
                            onChange={e => setExpiresAt(e.target.value)}
                            className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2"
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Annuler
                    </Button>
                    <Button
                        onClick={grantRole}
                        disabled={saving || !foundUser || !selectedRoleId}
                        className="flex-1 bg-[#D4AF37] text-black hover:bg-[#B8860B]"
                    >
                        {saving ? 'Attribution...' : 'Attribuer'}
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function RoleDetailModal({ role, onClose, onUpdate }: any) {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // In a real app, fetch users with this role
    useEffect(() => {
        setLoading(false);
        // Simulated users
        setUsers([
            { id: '1', email: 'user1@example.com', granted_at: new Date().toISOString() },
            { id: '2', email: 'user2@example.com', granted_at: new Date().toISOString() },
        ]);
    }, [role.id]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-auto"
                onClick={(e?: any) => e?.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2
                        className="text-xl font-bold"
                        style={{ color: role.badge_color }}
                    >
                        {role.display_name}
                    </h2>
                    <button onClick={onClose}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-gray-500 mb-4">{role.description}</p>

                <h3 className="font-medium mb-3">
                    Utilisateurs avec ce rôle ({users.length})
                </h3>

                <div className="space-y-2">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg"
                        >
                            <div>
                                <p className="font-medium">{user.email}</p>
                                <p className="text-xs text-gray-500">
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    Depuis {new Date(user.granted_at).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                            <button className="text-red-400 hover:bg-red-500/10 p-2 rounded">
                                <UserMinus className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
