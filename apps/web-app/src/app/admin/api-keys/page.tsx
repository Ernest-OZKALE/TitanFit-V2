'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Eye, EyeOff, Copy, Plus, Trash2 } from 'lucide-react';

interface ApiKey {
    id: string;
    name: string;
    key: string;
    created_at: string;
    last_used?: string;
}

export default function ApiKeysPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
    const [newKeyName, setNewKeyName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        // Simulated API keys (in production, fetch from secure storage)
        setApiKeys([
            {
                id: '1',
                name: 'Stripe API Key',
                key: 'sk_live_••••••••••••••••••••••••51eC09',
                created_at: '2026-01-10T10:00:00Z',
                last_used: '2026-01-13T12:30:00Z'
            },
            {
                id: '2',
                name: 'OpenAI API Key',
                key: 'sk-••••••••••••••••••••••••••••••••••••••ABCD',
                created_at: '2026-01-12T14:00:00Z'
            }
        ]);
    }, []);

    const handleCreateKey = () => {
        if (!newKeyName.trim()) return;

        const newKey: ApiKey = {
            id: Date.now().toString(),
            name: newKeyName,
            key: `sk_${Math.random().toString(36).substring(2)}`,
            created_at: new Date().toISOString()
        };

        setApiKeys([...apiKeys, newKey]);
        setNewKeyName('');
        setIsCreating(false);
    };

    const handleDeleteKey = (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette clé API ?')) {
            setApiKeys(apiKeys.filter(k => k.id !== id));
        }
    };

    const toggleKeyVisibility = (id: string) => {
        setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (key: string) => {
        navigator.clipboard.writeText(key);
        alert('Clé copiée dans le presse-papier !');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Gestion des <span className="text-[#D4AF37]">Clés API</span>
                    </h1>
                    <p className="text-slate-500 mt-1">Gérez vos intégrations et clés d'API tierces</p>
                </div>
                <Button
                    onClick={() => setIsCreating(true)}
                    className="bg-[#D4AF37] hover:bg-[#B8860B] text-black font-bold"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Clé
                </Button>
            </div>

            {/* Security Warning */}
            <Card className="border-0 shadow-sm bg-yellow-50 border-yellow-200">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <Key className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                            <p className="font-semibold text-yellow-900 mb-1">🔐 Sécurité Important</p>
                            <p className="text-sm text-yellow-800">
                                Ne partagez jamais vos clés API. Elles donnent accès à vos ressources sensibles.
                                Utilisez des variables d'environnement en production.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Create New Key Form */}
            {isCreating && (
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle>Créer une Nouvelle Clé API</CardTitle>
                        <CardDescription>Donnez un nom descriptif à votre clé</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="keyName">Nom de la Clé</Label>
                                <Input
                                    id="keyName"
                                    placeholder="ex: Stripe Production API"
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleCreateKey} className="bg-[#D4AF37] hover:bg-[#B8860B] text-black">
                                    Créer la Clé
                                </Button>
                                <Button onClick={() => setIsCreating(false)} variant="outline">
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* API Keys List */}
            <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                    <Card key={apiKey.id} className="border-0 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg text-slate-900">{apiKey.name}</h3>
                                        <p className="text-sm text-slate-500">
                                            Créée le {new Date(apiKey.created_at).toLocaleDateString('fr-FR')}
                                        </p>
                                        {apiKey.last_used && (
                                            <p className="text-xs text-slate-400">
                                                Dernière utilisation: {new Date(apiKey.last_used).toLocaleDateString('fr-FR')}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => handleDeleteKey(apiKey.id)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Key Display */}
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-slate-100 rounded-md p-3 font-mono text-sm">
                                        {showKeys[apiKey.id] ? apiKey.key : apiKey.key.replace(/[a-zA-Z0-9]/g, '•')}
                                    </div>
                                    <Button
                                        onClick={() => toggleKeyVisibility(apiKey.id)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        {showKeys[apiKey.id] ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => copyToClipboard(apiKey.key)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                                    <Button variant="ghost" size="sm" className="text-xs">
                                        Régénérer
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-xs">
                                        Permissions
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-xs">
                                        Historique
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {apiKeys.length === 0 && !isCreating && (
                <Card className="border-0 shadow-sm">
                    <CardContent className="py-12">
                        <div className="text-center">
                            <Key className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune clé API</h3>
                            <p className="text-slate-600 mb-4">Commencez par créer votre première clé API</p>
                            <Button onClick={() => setIsCreating(true)} className="bg-[#D4AF37] hover:bg-[#B8860B] text-black">
                                <Plus className="h-4 w-4 mr-2" />
                                Créer une clé
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Best Practices */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">📘 Bonnes Pratiques</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                            <span className="text-[#D4AF37]">•</span>
                            <span>Utilisez des clés différentes pour dev/staging/production</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#D4AF37]">•</span>
                            <span>Stockez les clés dans des variables d'environnement (.env)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#D4AF37]">•</span>
                            <span>Régénérez régulièrement vos clés (tous les 90 jours)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#D4AF37]">•</span>
                            <span>Limitez les permissions aux seules fonctionnalités nécessaires</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#D4AF37]">•</span>
                            <span>Surveillez l'utilisation de vos clés pour détecter les anomalies</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
