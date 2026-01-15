'use client';

import React from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
    const { language, setLanguage } = useI18n();

    return (
        <div className="flex items-center gap-2 bg-zinc-800/50 p-1 rounded-lg border border-white/5">
            <Globe className="w-4 h-4 text-gray-500 ml-2" />
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-sm text-gray-300 border-none focus:ring-0 cursor-pointer py-1 pr-8 pl-1"
            >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
            </select>
        </div>
    );
}
