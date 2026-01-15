'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Users, Plus, Lock, Globe, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Community {
    id: string;
    name: string;
    description: string;
    members_count: number;
    is_private: boolean;
    category: string;
}

export default function Communities() {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newCommunity, setNewCommunity] = useState({
        name: '',
        description: '',
        is_private: false,
        category: 'Musculation'
    });

    useEffect(() => {
        fetchCommunities();
    }, []);

    const fetchCommunities = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('communities')
            .select('*')
            .order('members_count', { ascending: false });

        if (error) {
            console.error(error);
            toast.error("Erreur chargement communautés");
        } else {
            setCommunities(data || []);
        }
        setLoading(false);
    };

    const createCommunity = async () => {
        if (!newCommunity.name.trim()) return;

        const { error } = await supabase.from('communities').insert([{
            name: newCommunity.name,
            description: newCommunity.description,
            category: newCommunity.category,
            is_private: newCommunity.is_private,
            members_count: 1
        }]);

        if (error) {
            toast.error("Erreur lors de la création.");
        } else {
            toast.success("Communauté créée !");
            setShowCreateForm(false);
            setNewCommunity({ name: '', description: '', is_private: false, category: 'Musculation' });
            fetchCommunities();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Communautés</h2>
                <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer
                </Button>
            </div>

            {/* Create Community Form */}
            {showCreateForm && (
                <Card className="border-purple-200 bg-purple-50">
                    <CardHeader>
                        <CardTitle>Nouvelle Communauté</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Nom</label>
                            <Input
                                placeholder="Ex: Club Musculation Paris"
                                value={newCommunity.name}
                                onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Description</label>
                            <Textarea
                                placeholder="Décrivez votre communauté..."
                                value={newCommunity.description}
                                onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="private"
                                checked={newCommunity.is_private}
                                onChange={(e) => setNewCommunity({ ...newCommunity, is_private: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <label htmlFor="private" className="text-sm">Communauté privée (sur invitation uniquement)</label>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={createCommunity} className="flex-1">
                                Créer la Communauté
                            </Button>
                            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                                Annuler
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Communities List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {communities.map(community => (
                        <Card key={community.id} className="hover:shadow-lg transition">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                            <Users className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg flex items-center gap-2">
                                                {community.name}
                                                {community.is_private ? (
                                                    <Lock className="h-4 w-4 text-gray-500" />
                                                ) : (
                                                    <Globe className="h-4 w-4 text-green-500" />
                                                )}
                                            </h3>
                                            <p className="text-xs text-gray-500">{community.category}</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{community.description}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Users className="h-4 w-4" />
                                        <span>{community.members_count || 0} membres</span>
                                    </div>
                                    <Button size="sm" onClick={() => toast.success("Vous avez rejoint " + community.name)}>
                                        Rejoindre
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && communities.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p>Aucune communauté pour le moment.</p>
                    <p className="text-sm mb-4">Soyez le premier à en créer une !</p>
                    <Button onClick={() => setShowCreateForm(true)}>
                        Créer la Première Communauté
                    </Button>
                </div>
            )}
        </div>
    );
}
