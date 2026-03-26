'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, ArrowLeftRight } from 'lucide-react';

interface ProgressPhoto {
    id: string;
    url: string;
    date: string;
    weight?: number;
    notes?: string;
}

export default function ProgressPhotoGallery() {
    const [photos, setPhotos] = useState<ProgressPhoto[]>([
        {
            id: '1',
            url: '/placeholder-before.jpg',
            date: '2024-01-01',
            weight: 85,
            notes: 'Début du parcours'
        },
        {
            id: '2',
            url: '/placeholder-after.jpg',
            date: '2024-12-01',
            weight: 75,
            notes: 'Après 1 an'
        }
    ]);
    const [compareMode, setCompareMode] = useState(false);

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Photos de Progression</CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant={compareMode ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCompareMode(!compareMode)}
                        >
                            <ArrowLeftRight className="h-4 w-4 mr-2" />
                            Comparer
                        </Button>
                        <Button size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Ajouter
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {compareMode ? (
                    <div className="grid grid-cols-2 gap-4">
                        {photos.slice(0, 2).map((photo, idx) => (
                            <div key={photo.id} className="space-y-2">
                                <div className="relative aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
                                    <img
                                        src={photo.url}
                                        alt={`Photo ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                        {idx === 0 ? 'AVANT' : 'APRÈS'}
                                    </div>
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold">{new Date(photo.date).toLocaleDateString('fr-FR')}</p>
                                    {photo.weight && <p className="text-gray-600">{photo.weight} kg</p>}
                                    {photo.notes && <p className="text-gray-500 text-xs">{photo.notes}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {photos.map(photo => (
                            <div key={photo.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition">
                                <img src={photo.url} alt="Progress" className="w-full h-full object-cover" />
                            </div>
                        ))}
                        <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 transition">
                            <Upload className="h-8 w-8 text-gray-400" />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
