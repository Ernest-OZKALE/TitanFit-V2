'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';

interface WorkoutTimerProps {
    defaultDuration?: number; // secondes
}

export default function WorkoutTimer({ defaultDuration = 60 }: WorkoutTimerProps) {
    const [timeLeft, setTimeLeft] = useState(defaultDuration);
    const [isRunning, setIsRunning] = useState(false);
    const [duration, setDuration] = useState(defaultDuration);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => {
                    if (time <= 1) {
                        setIsRunning(false);
                        // Play notification sound
                        if (typeof Audio !== 'undefined') {
                            const audio = new Audio('/notification.mp3');
                            audio.play().catch(() => { });
                        }
                        // Haptic vibration for mobile
                        if ('vibrate' in navigator) {
                            navigator.vibrate([200, 100, 200, 100, 200]);
                        }
                        return 0;
                    }
                    return time - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const toggleTimer = () => setIsRunning(!isRunning);

    const resetTimer = () => {
        setTimeLeft(duration);
        setIsRunning(false);
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Timer de Repos
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center">
                    <div className="text-6xl font-bold text-purple-600 mb-4">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                    <div className="flex gap-2 justify-center mb-4">
                        {[30, 60, 90, 120].map(secs => (
                            <Button
                                key={secs}
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setDuration(secs);
                                    setTimeLeft(secs);
                                    setIsRunning(false);
                                }}
                                className={duration === secs ? 'bg-purple-100' : ''}
                            >
                                {secs}s
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 justify-center">
                    <Button
                        size="lg"
                        onClick={toggleTimer}
                        className="w-32"
                    >
                        {isRunning ? (
                            <>
                                <Pause className="h-5 w-5 mr-2" />
                                Pause
                            </>
                        ) : (
                            <>
                                <Play className="h-5 w-5 mr-2" />
                                Démarrer
                            </>
                        )}
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={resetTimer}
                    >
                        <RotateCcw className="h-5 w-5" />
                    </Button>
                </div>

                {timeLeft === 0 && (
                    <div className="text-center p-4 bg-green-100 rounded-lg animate-pulse">
                        <p className="font-bold text-green-700">Repos terminé ! 💪</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
