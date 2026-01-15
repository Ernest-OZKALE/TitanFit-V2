'use client';

import { MuscleGroup, SubTarget } from '@/lib/exercise-db';

interface MuscleAnatomyProps {
    target: MuscleGroup;
    subTarget: SubTarget;
    className?: string;
}

export function MuscleAnatomy({ target, subTarget, className = "" }: MuscleAnatomyProps) {
    // View Logic
    const isBackView = ['Dos', 'Ischios', 'Fessiers', 'Mollets', 'Deltoïde Postérieur', 'Lombaires', 'Trapèzes'].includes(target) || ['Deltoïde Postérieur', 'Lombaires', 'Ischios', 'Mollets', 'Fessiers', 'Rhomboides', 'Grand Dorsal', 'Trapèzes'].includes(subTarget);

    // Medical Style Guidelines
    const STROKE = "#334155"; // Slate-700 (Outline)
    const FILL_BASE = "#ffffff"; // White (Body)
    const FILL_ACTIVE = "#F87171"; // Red-400 (Muscle)
    const STROKE_WIDTH = "1.5";

    return (
        <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
            <svg viewBox="0 0 200 450" className="h-full w-auto drop-shadow-sm">
                <defs>
                    <clipPath id="bodyClip">
                        {/* Silhouette Clipping to keep muscles inside */}
                        {isBackView ? <path d="M100,20 Q115,20 120,40 L135,45 L150,55 L160,110 L155,160 L165,220 L155,250 L140,245 L135,310 L145,360 L140,420 L125,440 L115,440 L110,380 L105,320 L100,280 L95,320 L90,380 L85,440 L75,440 L60,420 L55,360 L65,310 L60,245 L45,250 L35,220 L45,160 L40,110 L50,55 L65,45 L80,40 Q85,20 100,20 Z" /> :
                            <path d="M100,20 Q115,20 120,40 L135,45 L150,55 L160,110 L150,150 L165,220 L155,250 L140,245 L135,310 L145,360 L140,420 L125,440 L115,440 L110,380 L105,320 L100,280 L95,320 L90,380 L85,440 L75,440 L60,420 L55,360 L65,310 L60,245 L45,250 L35,220 L45,150 L50,110 L50,55 L65,45 L80,40 Q85,20 100,20 Z" />}
                    </clipPath>
                </defs>

                {isBackView ? (
                    <BackBody base={FILL_BASE} active={FILL_ACTIVE} stroke={STROKE} width={STROKE_WIDTH} target={target} subTarget={subTarget} />
                ) : (
                    <FrontBody base={FILL_BASE} active={FILL_ACTIVE} stroke={STROKE} width={STROKE_WIDTH} target={target} subTarget={subTarget} />
                )}
            </svg>

            <div className="absolute bottom-4 right-0 px-3 py-1 bg-white/50 backdrop-blur-sm border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {isBackView ? 'Dos' : 'Face'}
            </div>
        </div>
    );
}

// --- ORGANIC PATHS ---

const FrontBody = ({ base, active, stroke, width, target, subTarget }: any) => {
    const is = (t: string) => subTarget?.includes(t) || target === t;
    const fill = (t: string) => (is(t) ? active : base);

    return (
        <g stroke={stroke} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round">
            {/* HEAD */}
            <path d="M100,20 Q112,20 115,35 L115,45 L100,50 L85,45 L85,35 Q88,20 100,20 Z" fill={base} />

            {/* TRAPS */}
            <path d="M85,45 L65,55 L100,60" fill={fill('Trapèzes')} />
            <path d="M115,45 L135,55 L100,60" fill={fill('Trapèzes')} />

            {/* SHOULDERS */}
            <path d="M65,55 Q55,65 55,80 Q58,95 70,100 L80,75 Z" fill={fill('Épaules') || fill('Deltoïde Antérieur')} />
            <path d="M135,55 Q145,65 145,80 Q142,95 130,100 L120,75 Z" fill={fill('Épaules') || fill('Deltoïde Antérieur')} />

            {/* PECS */}
            <path d="M100,60 L80,75 L82,105 Q100,115 100,100 Z" fill={fill('Pectoraux') || fill('Sternal')} />
            <path d="M100,60 L120,75 L118,105 Q100,115 100,100 Z" fill={fill('Pectoraux') || fill('Sternal')} />
            {/* Upper Chest (Clavicular) */}
            <path d="M100,60 L80,55 L70,70 L100,75 Z" fill={fill('Pectoraux') || fill('Claviculaire')} opacity="0.5" stroke="none" />
            <path d="M100,60 L120,55 L130,70 L100,75 Z" fill={fill('Pectoraux') || fill('Claviculaire')} opacity="0.5" stroke="none" />

            {/* ABS (Six Pack) */}
            <path d="M100,100 L85,105 L88,140 L100,145 L112,140 L115,105 Z" fill={fill('Abdos') || fill('Grand Droit')} />

            {/* OBLIQUES */}
            <path d="M85,105 L70,115 L75,145 L88,140 Z" fill={fill('Obliques') || fill('Abdos')} />
            <path d="M115,105 L130,115 L125,145 L112,140 Z" fill={fill('Obliques') || fill('Abdos')} />

            {/* ARMS (Biceps/Triceps visible front) */}
            <path d="M70,100 L60,130 L80,125 Z" fill={fill('Biceps') || fill('Bras')} />
            <path d="M130,100 L140,130 L120,125 Z" fill={fill('Biceps') || fill('Bras')} />
            {/* Forearms */}
            <path d="M60,130 L50,165 L70,160 Z" fill={fill('Avant-bras') || fill('Bras')} />
            <path d="M140,130 L150,165 L130,160 Z" fill={fill('Avant-bras') || fill('Bras')} />

            {/* QUADS */}
            <path d="M100,145 L80,160 Q70,200 85,230 L95,220 L100,180 Z" fill={fill('Quadriceps') || fill('Jambes')} />
            <path d="M100,145 L120,160 Q130,200 115,230 L105,220 L100,180 Z" fill={fill('Quadriceps') || fill('Jambes')} />

            {/* CALVES */}
            <path d="M95,235 Q85,260 90,290 L98,285 Z" fill={fill('Mollets')} />
            <path d="M105,235 Q115,260 110,290 L102,285 Z" fill={fill('Mollets')} />
        </g>
    );
};

const BackBody = ({ base, active, stroke, width, target, subTarget }: any) => {
    const is = (t: string) => subTarget?.includes(t) || target === t;
    const fill = (t: string) => (is(t) ? active : base);

    return (
        <g stroke={stroke} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round">
            {/* HEAD */}
            <path d="M100,20 Q112,20 115,35 L115,45 L100,50 L85,45 L85,35 Q88,20 100,20 Z" fill={base} />

            {/* TRAPS */}
            <path d="M100,45 L80,50 L90,80 L100,90 L110,80 L120,50 Z" fill={fill('Trapèzes') || fill('Dos')} />

            {/* SHOULDERS (Rear Dels) */}
            <path d="M80,50 L60,60 L70,80 L90,80 Z" fill={fill('Deltoïde Postérieur') || fill('Épaules')} />
            <path d="M120,50 L140,60 L130,80 L110,80 Z" fill={fill('Deltoïde Postérieur') || fill('Épaules')} />

            {/* LATS */}
            <path d="M90,80 L75,110 L100,135 L125,110 L110,80 L100,90 Z" fill={fill('Grand Dorsal') || fill('Dos')} />

            {/* LOWER BACK */}
            <path d="M100,135 L90,150 L110,150 Z" fill={fill('Lombaires') || fill('Dos')} />

            {/* TRICEPS */}
            <path d="M70,80 L65,115 L80,110 Z" fill={fill('Triceps') || fill('Bras')} />
            <path d="M130,80 L135,115 L120,110 Z" fill={fill('Triceps') || fill('Bras')} />

            {/* GLUTES */}
            <path d="M100,150 L80,160 Q85,190 100,185 Z" fill={fill('Fessiers') || fill('Jambes')} />
            <path d="M100,150 L120,160 Q115,190 100,185 Z" fill={fill('Fessiers') || fill('Jambes')} />

            {/* HAMSTRINGS */}
            <path d="M90,190 L85,230 L98,225 Z" fill={fill('Ischios') || fill('Jambes')} />
            <path d="M110,190 L115,230 L102,225 Z" fill={fill('Ischios') || fill('Jambes')} />

            {/* CALVES */}
            <path d="M90,235 Q80,260 88,290 L95,285 Z" fill={fill('Mollets')} />
            <path d="M110,235 Q120,260 112,290 L105,285 Z" fill={fill('Mollets')} />
        </g>
    );
};
