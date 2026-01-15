'use client';

import WorkInProgress from '@/components/ui/WorkInProgress';

export default function SpotifyWorkoutPlaylists() {
    return (
        <WorkInProgress
            feature="Spotify Integration"
            description="Le contrôle musical nécessite une authentification Spotify Premium OAuth complète."
            requiredApi="Spotify Web API"
        />
    );
}
