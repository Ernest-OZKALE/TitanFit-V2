'use client';

import { useTheme } from '@/lib/theme-context';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

const themes = [
    { id: 'purple', name: 'Violet', from: 'from-purple-600', to: 'to-purple-400' },
    { id: 'blue', name: 'Bleu', from: 'from-blue-600', to: 'to-blue-400' },
    { id: 'red', name: 'Rouge Titan', from: 'from-red-600', to: 'to-orange-500' },
    { id: 'green', name: 'Vert', from: 'from-green-600', to: 'to-emerald-400' },
] as const;

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-gray-500" />
            <div className="flex gap-2">
                {themes.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTheme(t.id as any)}
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.from} ${t.to} transition-transform ${theme === t.id ? 'scale-110 ring-2 ring-offset-2 ring-current' : 'hover:scale-105'
                            }`}
                        title={t.name}
                    />
                ))}
            </div>
        </div>
    );
}
