'use client';

import { useState, useEffect } from 'react';
import { openMeteoAPI, googleMapsAPI, unsplashAPI } from '@/lib/api-services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Search, Star } from 'lucide-react';

interface Restaurant {
    name: string;
    rating: number;
    address: string;
    lat: number;
    lng: number;
}

export default function HealthyRestaurantFinder() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);

    const getUserLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                }
            );
        }
    };

    const searchNearbyRestaurants = async () => {
        if (!userLocation) {
            getUserLocation();
            return;
        }

        setLoading(true);
        try {
            const results = await googleMapsAPI.findHealthyRestaurants(
                userLocation.lat,
                userLocation.lon,
                3000 // 3km radius
            );
            setRestaurants(results);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            // Fallback to mock data
            setRestaurants([
                {
                    name: 'Green Bowl',
                    rating: 4.5,
                    address: '12 Rue de la Santé, Paris',
                    lat: userLocation.lat + 0.01,
                    lng: userLocation.lon + 0.01
                },
                {
                    name: 'Fit Kitchen',
                    rating: 4.7,
                    address: '45 Avenue du Sport, Paris',
                    lat: userLocation.lat - 0.01,
                    lng: userLocation.lon - 0.01
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Restaurants Healthy Près de Toi
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button
                    onClick={searchNearbyRestaurants}
                    disabled={loading}
                    className="w-full"
                >
                    <Search className="h-4 w-4 mr-2" />
                    {loading ? 'Recherche...' : 'Trouver des Restaurants'}
                </Button>

                <div className="space-y-3">
                    {restaurants.map((restaurant, idx) => (
                        <div key={idx} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-green-900">{restaurant.name}</h3>
                                <div className="flex items-center gap-1 text-yellow-600">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="text-sm font-semibold">{restaurant.rating}</span>
                                </div>
                            </div>
                            <p className="text-sm text-green-700">{restaurant.address}</p>
                            <Button
                                size="sm"
                                variant="outline"
                                className="mt-2"
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`, '_blank')}
                            >
                                <MapPin className="h-3 w-3 mr-1" />
                                Voir sur la carte
                            </Button>
                        </div>
                    ))}
                </div>

                {restaurants.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <MapPin className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p>Clique sur le bouton pour trouver des restaurants healthy</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
