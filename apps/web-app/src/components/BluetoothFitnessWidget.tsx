'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bluetooth,
    BluetoothConnected,
    BluetoothOff,
    Heart,
    Bike,
    Footprints,
    Battery,
    Signal,
    X,
    Plus,
    Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
    bluetoothFitness,
    BluetoothDevice,
    HeartRateData,
    CyclingData,
    RunningData
} from '@/lib/bluetooth-fitness';

export default function BluetoothFitnessWidget() {
    const [isSupported, setIsSupported] = useState(true);
    const [connectedDevices, setConnectedDevices] = useState<BluetoothDevice[]>([]);
    const [connecting, setConnecting] = useState<string | null>(null);

    // Real-time data
    const [heartRate, setHeartRate] = useState<number | null>(null);
    const [cyclingSpeed, setCyclingSpeed] = useState<number | null>(null);
    const [cyclingCadence, setCyclingCadence] = useState<number | null>(null);
    const [runningSpeed, setRunningSpeed] = useState<number | null>(null);
    const [runningCadence, setRunningCadence] = useState<number | null>(null);

    useEffect(() => {
        setIsSupported(bluetoothFitness.isSupported());
        setConnectedDevices(bluetoothFitness.getConnectedDevices());
    }, []);

    const connectHeartRate = async () => {
        setConnecting('heart_rate');
        try {
            const device = await bluetoothFitness.connectHeartRateMonitor((data: HeartRateData) => {
                setHeartRate(data.heartRate);
            });
            setConnectedDevices(prev => [...prev.filter(d => d.type !== 'heart_rate'), device]);
            toast.success(`${device.name} connecté !`);
        } catch (error: any) {
            if (error.name !== 'NotFoundError') { // User cancelled
                toast.error('Impossible de connecter le capteur cardiaque');
            }
        } finally {
            setConnecting(null);
        }
    };

    const connectCycling = async () => {
        setConnecting('cycling');
        try {
            const device = await bluetoothFitness.connectCyclingSensor((data: CyclingData) => {
                if (data.speed !== undefined) setCyclingSpeed(Math.round(data.speed * 10) / 10);
                if (data.cadence !== undefined) setCyclingCadence(Math.round(data.cadence));
            });
            setConnectedDevices(prev => [...prev.filter(d => d.type !== 'cycling'), device]);
            toast.success(`${device.name} connecté !`);
        } catch (error: any) {
            if (error.name !== 'NotFoundError') {
                toast.error('Impossible de connecter le capteur vélo');
            }
        } finally {
            setConnecting(null);
        }
    };

    const connectRunning = async () => {
        setConnecting('running');
        try {
            const device = await bluetoothFitness.connectRunningSensor((data: RunningData) => {
                setRunningSpeed(Math.round(data.speed * 3.6 * 10) / 10); // m/s to km/h
                setRunningCadence(data.cadence);
            });
            setConnectedDevices(prev => [...prev.filter(d => d.type !== 'running'), device]);
            toast.success(`${device.name} connecté !`);
        } catch (error: any) {
            if (error.name !== 'NotFoundError') {
                toast.error('Impossible de connecter le capteur course');
            }
        } finally {
            setConnecting(null);
        }
    };

    if (!isSupported) {
        return (
            <div className="bg-zinc-900/50 border border-red-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 text-red-400">
                    <BluetoothOff className="w-6 h-6" />
                    <div>
                        <p className="font-bold">Bluetooth non supporté</p>
                        <p className="text-sm text-gray-500">
                            Utilise Chrome, Edge ou Opera sur ordinateur, ou Chrome sur Android.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const hasHeartRate = connectedDevices.some(d => d.type === 'heart_rate');
    const hasCycling = connectedDevices.some(d => d.type === 'cycling');
    const hasRunning = connectedDevices.some(d => d.type === 'running');

    return (
        <div className="space-y-4">
            {/* Connected Devices & Live Data */}
            <AnimatePresence>
                {connectedDevices.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 border border-[#D4AF37]/30 rounded-2xl p-6"
                    >
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <BluetoothConnected className="w-5 h-5 text-[#D4AF37]" />
                            Données en Direct
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {heartRate !== null && (
                                <LiveDataCard
                                    icon={<Heart className="w-5 h-5" />}
                                    label="Fréquence Cardiaque"
                                    value={heartRate}
                                    unit="bpm"
                                    color="text-red-500"
                                    bgColor="bg-red-500/10"
                                />
                            )}
                            {cyclingSpeed !== null && (
                                <LiveDataCard
                                    icon={<Bike className="w-5 h-5" />}
                                    label="Vitesse"
                                    value={cyclingSpeed}
                                    unit="km/h"
                                    color="text-blue-500"
                                    bgColor="bg-blue-500/10"
                                />
                            )}
                            {cyclingCadence !== null && (
                                <LiveDataCard
                                    icon={<Activity className="w-5 h-5" />}
                                    label="Cadence"
                                    value={cyclingCadence}
                                    unit="rpm"
                                    color="text-green-500"
                                    bgColor="bg-green-500/10"
                                />
                            )}
                            {runningSpeed !== null && (
                                <LiveDataCard
                                    icon={<Footprints className="w-5 h-5" />}
                                    label="Allure"
                                    value={runningSpeed}
                                    unit="km/h"
                                    color="text-purple-500"
                                    bgColor="bg-purple-500/10"
                                />
                            )}
                        </div>

                        {/* Connected devices list */}
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-xs text-gray-500 mb-2">Appareils connectés :</p>
                            <div className="flex flex-wrap gap-2">
                                {connectedDevices.map(device => (
                                    <span
                                        key={device.id}
                                        className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1"
                                    >
                                        <Signal className="w-3 h-3" />
                                        {device.name}
                                        {device.batteryLevel && (
                                            <span className="flex items-center gap-0.5 ml-1">
                                                <Battery className="w-3 h-3" />
                                                {device.batteryLevel}%
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Connect Devices */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Bluetooth className="w-5 h-5 text-[#D4AF37]" />
                    Connecter un Appareil
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <DeviceButton
                        onClick={connectHeartRate}
                        icon={<Heart className="w-6 h-6" />}
                        label="Ceinture Cardiaque"
                        description="Polar, Garmin, Wahoo..."
                        connected={hasHeartRate}
                        loading={connecting === 'heart_rate'}
                        color="text-red-400"
                    />
                    <DeviceButton
                        onClick={connectCycling}
                        icon={<Bike className="w-6 h-6" />}
                        label="Capteur Vélo"
                        description="Vitesse & Cadence"
                        connected={hasCycling}
                        loading={connecting === 'cycling'}
                        color="text-blue-400"
                    />
                    <DeviceButton
                        onClick={connectRunning}
                        icon={<Footprints className="w-6 h-6" />}
                        label="Foot Pod"
                        description="Allure & Cadence"
                        connected={hasRunning}
                        loading={connecting === 'running'}
                        color="text-purple-400"
                    />
                </div>

                <p className="text-xs text-gray-500 mt-4 text-center">
                    💡 Fonctionne avec la plupart des capteurs Bluetooth Low Energy (BLE)
                </p>
            </div>
        </div>
    );
}

function LiveDataCard({
    icon,
    label,
    value,
    unit,
    color,
    bgColor
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    unit: string;
    color: string;
    bgColor: string;
}) {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`${bgColor} rounded-xl p-4 text-center`}
        >
            <div className={`${color} flex justify-center mb-2`}>{icon}</div>
            <motion.p
                key={value}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold"
            >
                {value}
            </motion.p>
            <p className="text-xs text-gray-500">{unit}</p>
            <p className="text-xs text-gray-600 mt-1">{label}</p>
        </motion.div>
    );
}

function DeviceButton({
    onClick,
    icon,
    label,
    description,
    connected,
    loading,
    color
}: {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    description: string;
    connected: boolean;
    loading: boolean;
    color: string;
}) {
    return (
        <motion.button
            whileHover={loading ? {} : { scale: 1.02 }}
            whileTap={loading ? {} : { scale: 0.98 }}
            onClick={loading ? undefined : onClick}
            className={`p-4 rounded-xl border transition-all text-left ${connected
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-zinc-800/50 border-white/10 hover:border-[#D4AF37]/30'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <div className="flex items-start gap-3">
                <div className={`${color} mt-1`}>{icon}</div>
                <div className="flex-1">
                    <p className="font-medium">{label}</p>
                    <p className="text-xs text-gray-500">{description}</p>
                </div>
                {loading && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                        <Bluetooth className="w-4 h-4 text-[#D4AF37]" />
                    </motion.div>
                )}
                {connected && !loading && (
                    <span className="text-xs text-green-400">Connecté</span>
                )}
            </div>
        </motion.button>
    );
}
