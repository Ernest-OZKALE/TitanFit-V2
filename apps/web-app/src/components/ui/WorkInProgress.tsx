import { Construction, Sparkles, Lock } from 'lucide-react';
import { Button } from './button';

interface WorkInProgressProps {
    feature: string;
    description: string;
    requiredApi?: string;
}

export default function WorkInProgress({ feature, description, requiredApi }: WorkInProgressProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-black/50 border border-yellow-500/20 rounded-2xl backdrop-blur-sm min-h-[300px]">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Construction className="w-8 h-8 text-yellow-500" />
            </div>

            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
                Zone en Travaux
            </h3>

            <div className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-yellow-500/20">
                {feature}
            </div>

            <p className="text-gray-400 max-w-sm mb-6">
                {description}
            </p>

            {requiredApi && (
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                    <Lock className="w-3 h-3" />
                    Nécessite intégration : <span className="text-gray-300 font-mono">{requiredApi}</span>
                </div>
            )}
        </div>
    );
}
