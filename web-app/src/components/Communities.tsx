'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Users, Plus, Lock, Globe } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Community {
    id: string;
    name: string;
    description: string;
    members: number;
    isPrivate: boolean;
    category: string;
}

const mockCommunities: Community[] = [
    {
        id: '1',
        name: 'Prise de Masse 2024',
        description: 'Groupe pour ceux qui veulent prendre du muscle cette année',
        members: 342,
        isPrivate: false,
        category: 'Musculation'
    },
    {
        id: '2',
        name: 'Runners Paris',
        description: 'Communauté de coureurs parisiens',
        members: 128,
        isPrivate: false,
        category: 'Cardio'
    }
];

export default function Communities() {
    const [communities, setCommunities] = useState(mockCommunities);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newCommunity, setNewCommunity] = useState({
        name: '',
        description: '',
        isPrivate: false,
        category: 'Musculation'
    });

    const createCommunity = () => {
        if (!newCommunity.name.trim()) return;

        const community: Community = {
            id: `c${Date.now()}`,
            name: newCommunity.name,
            description: newCommunity.description,
            members: 1,
            isPrivate: newCommunity.isPrivate,
            category: newCommunity.category
        };

        setCommunities([community, ...communities]);
        setNewCommunity({ name: '', description: '', isPrivate: false, category: 'Musculation' });
        setShowCreateForm(false);
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
                                checked={newCommunity.isPrivate}
                                onChange={(e) => setNewCommunity({ ...newCommunity, isPrivate: e.target.checked })}
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
                                            {community.isPrivate ? (
                                                <Lock className="h-4 w-4 text-gray-500" />
                                            ) : (
                                                <Globe className="h-4 w-4 text-green-500" />
                                            )}
                                        </h3>
                                        <p className="text-xs text-gray-500">{community.category}</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">{community.description}</p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users className="h-4 w-4" />
                                    <span>{community.members} membres</span>
                                </div>
                                <Button size="sm">Rejoindre</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {communities.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p>Aucune communauté pour le moment</p>
                    <Button className="mt-4" onClick={() => setShowCreateForm(true)}>
                        Créer la Première Communauté
                    </Button>
                </div>
            )}
        </div>
    );
}
