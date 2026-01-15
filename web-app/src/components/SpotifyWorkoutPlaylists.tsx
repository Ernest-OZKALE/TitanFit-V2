'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, SkipForward } from 'lucide-react';

interface Playlist {
    id: string;
    name: string;
    description: string;
    image: string;
    url: string;
}

export default function SpotifyWorkoutPlaylists() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);

    useEffect(() => {
        // Mock playlists (in production, would use Spotify API with OAuth)
        setPlaylists([
            {
                id: '1',
                name: 'Beast Mode 💪',
                description: 'Rap & Hip-Hop pour pousser lourd',
                image: '/playlist-beast.jpg',
                url: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP'
            },
            {
                id: '2',
                name: 'Cardio Beats 🏃',
                description: 'EDM & House pour le cardio',
                image: '/playlist-cardio.jpg',
                url: 'https://open.spotify.com/playlist/37i9dQZF1DX4eRPd9frC1m'
            },
            {
                id: '3',
                name: 'Power Metal 🤘',
                description: 'Metal & Rock pour l\'intensité',
                image: '/playlist-metal.jpg',
                url: 'https://open.spotify.com/playlist/37i9dQZF1DWWOaP4H0w5b0'
            },
            {
                id: '4',
                name: 'Focus Flow 🧘',
                description: 'Lo-fi pour yoga & étirements',
                image: '/playlist-chill.jpg',
                url: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn'
            }
        ]);
    }, []);

    const playPlaylist = (id: string, url: string) => {
        // Open Spotify playlist
        window.open(url, '_blank');
        setCurrentPlaying(id);
    };

    return (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-green-600" />
                    Playlists Workout Spotify
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {playlists.map(playlist => (
                        <div
                            key={playlist.id}
                            className="relative bg-white rounded-lg overflow-hidden shadow-sm border border-green-200 hover:shadow-md transition group"
                        >
                            <div className="aspect-square bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                                <Music className="h-16 w-16 text-white opacity-50" />
                            </div>
                            <div className="p-3">
                                <h3 className="font-bold text-green-900 mb-1">{playlist.name}</h3>
                                <p className="text-xs text-green-700 mb-2">{playlist.description}</p>
                                <Button
                                    size="sm"
                                    onClick={() => playPlaylist(playlist.id, playlist.url)}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                >
                                    {currentPlaying === playlist.id ? (
                                        <>
                                            <Pause className="h-3 w-3 mr-1" />
                                            En lecture
                                        </>
                                    ) : (
                                        <>
                                            <Play className="h-3 w-3 mr-1" />
                                            Écouter
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 p-3 bg-green-100 rounded-lg text-xs text-green-800">
                    💡 <strong>Astuce :</strong> Connecte ton compte Spotify pour sauvegarder tes playlists préférées et suivre ton historique d'écoute pendant les workouts.
                </div>
            </CardContent>
        </Card>
    );
}
