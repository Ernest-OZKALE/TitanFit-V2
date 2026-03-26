'use client';

import WorkInProgress from '@/components/ui/WorkInProgress';

export default function HealthyRestaurantFinder() {
    return (
        <WorkInProgress
            feature="Restaurant Finder"
            description="La recherche géolocalisée nécessite l'API Google Places (Payant à l'usage) pour trouver les restaurants autour de vous."
            requiredApi="Google Maps/Places API"
        />
    );
}
