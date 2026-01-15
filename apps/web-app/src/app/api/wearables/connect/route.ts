/**
 * GET /api/wearables/connect
 * Get connection info - Web Bluetooth is handled client-side
 */

import { NextResponse } from 'next/server';

// Supported device types via Web Bluetooth (FREE - no third party!)
const BLUETOOTH_DEVICES = {
    heart_rate: { name: 'Ceinture Cardiaque', icon: '❤️', description: 'Polar, Garmin, Wahoo...' },
    cycling: { name: 'Capteur Vélo', icon: '🚴', description: 'Vitesse & Cadence' },
    running: { name: 'Foot Pod', icon: '👟', description: 'Allure & Cadence' },
} as const;

export async function GET() {
    return NextResponse.json({
        method: 'web_bluetooth',
        description: 'Connexion directe via Web Bluetooth API (gratuit)',
        supported_devices: Object.entries(BLUETOOTH_DEVICES).map(([key, info]) => ({
            type: key,
            ...info,
        })),
        browser_support: {
            chrome: true,
            edge: true,
            opera: true,
            firefox: false,
            safari: false,
            android_chrome: true,
            ios: false,
        },
        instructions: [
            '1. Cliquez sur le type d\'appareil à connecter',
            '2. Autorisez l\'accès Bluetooth dans le navigateur',
            '3. Sélectionnez votre appareil dans la liste',
            '4. Les données s\'affichent en temps réel',
        ],
    });
}
