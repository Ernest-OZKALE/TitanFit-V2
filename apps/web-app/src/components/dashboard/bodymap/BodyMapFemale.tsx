'use client';

import { BodyMapProps } from './types';
import { MUSCLE_DATA } from '@/lib/muscle-data';
import { useState } from 'react';

// HELPER: Path generator with "Puzzle Piece" logic (Same as Male, distinct paths)
const Path = ({
    d,
    id,
    zone,
    activeId,
    hoveredId,
    mode,
    onSelect,
    setHover
}: { d: string, id: string, zone: string, activeId: string | null, hoveredId: string | null, mode: 'beginner' | 'advanced', onSelect: any, setHover: any }) => {

    // Color Logic
    const data = MUSCLE_DATA[id];
    let isActive = false;

    if (mode === 'beginner') {
        const currentZone = data?.zone;
        const selectedZone = activeId ? MUSCLE_DATA[activeId]?.zone : null;
        const hoveredZone = hoveredId ? MUSCLE_DATA[hoveredId]?.zone : null;
        isActive = (currentZone === selectedZone) || (currentZone === hoveredZone);
    } else {
        isActive = (activeId === id) || (hoveredId === id);
    }

    let fill = 'transparent';
    let stroke = 'rgba(255, 255, 255, 0.6)';

    if (isActive) {
        fill = '#D4AF37'; // Titan Gold
        stroke = '#D4AF37';
    }

    return (
        <path
            d={d}
            fill={fill}
            stroke={stroke}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cursor-pointer transition-all duration-300 hover:fill-white/20"
            onClick={(e) => { e.stopPropagation(); onSelect(id); }}
            onMouseEnter={() => setHover(id)}
            onMouseLeave={() => setHover(null)}
        />
    );
};

export default function BodyMapFemale({ onMuscleSelect, selectedMuscle, view, mode, zoomZone, setZoomZone }: BodyMapProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const p = (d: string, id: string, zone: string) => (
        <Path d={d} id={id} zone={zone} activeId={selectedMuscle} hoveredId={hoveredId} mode={mode} onSelect={onMuscleSelect} setHover={setHoveredId} />
    );

    return (
        <g transform="translate(0, 0) scale(1)">
            {/* --------------------------------------------------------------------------------
                FRONT VIEW (FEMALE) - MEDICAL ANATOMY
               -------------------------------------------------------------------------------- */}
            {view === 'front' && (
                <g transform="translate(45, 20) scale(0.8)">
                    {/* Head Outline (Reference) */}
                    <path d="M200,50 Q230,50 230,90 Q230,120 200,130 Q170,120 170,90 Q170,50 200,50 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                    {/* NECK (Sternocleidomastoid) */}
                    {p("M192,120 L195,135 L185,135 Z", "traps-upper", "neck")}
                    {p("M208,120 L205,135 L215,135 Z", "traps-upper", "neck")}

                    {/* TRAPS Upper */}
                    {p("M175,135 L195,135 L192,120 Z", "traps-upper", "back")}
                    {p("M225,135 L205,135 L208,120 Z", "traps-upper", "back")}

                    {/* SHOULDERS (Deltoids - Smooth) */}
                    {/* Front */}
                    {p("M175,135 L160,140 L165,160 L180,150 Z", "delt-front", "shoulders")}
                    {p("M225,135 L240,140 L235,160 L220,150 Z", "delt-front", "shoulders")}
                    {/* Side */}
                    {p("M160,140 L150,145 L155,165 L165,160 Z", "delt-side", "shoulders")}
                    {p("M240,140 L250,145 L245,165 L235,160 Z", "delt-side", "shoulders")}

                    {/* CHEST (Pectoralis) */}
                    {/* Upper */}
                    {p("M180,150 L220,150 L215,165 Q200,170 185,165 Z", "chest-upper", "chest")}
                    {/* Main/Lower (Breast structure implied muscle) */}
                    {p("M185,165 Q200,170 215,165 L210,185 L190,185 Z", "chest-mid", "chest")}

                    {/* ARMS */}
                    {/* Biceps */}
                    {p("M155,165 L150,200 L165,200 L165,170 Z", "biceps-long", "arms")}
                    {p("M245,165 L250,200 L235,200 L235,170 Z", "biceps-long", "arms")}

                    {/* Forearms */}
                    {p("M150,200 L145,240 L160,240 L165,200 Z", "forearms", "arms")}
                    {p("M250,200 L255,240 L240,240 L235,200 Z", "forearms", "arms")}

                    {/* CORE */}
                    {/* Abs (Rectus) */}
                    {p("M190,185 L210,185 L208,215 L192,215 Z", "abs-rectus", "core")} // Upper
                    {p("M192,215 L208,215 L206,240 L194,240 Z", "abs-rectus", "core")} // Mid
                    {p("M194,240 L206,240 L205,260 L195,260 Z", "abs-rectus", "core")} // Lower (Navel)

                    {/* Obliques (Curved Waist) */}
                    {p("M180,185 L190,185 L194,240 L170,220 Z", "obliques", "core")}
                    {p("M220,185 L210,185 L206,240 L230,220 Z", "obliques", "core")}

                    {/* LEGS */}
                    {/* Quads (Rectus Femoris) */}
                    {p("M185,260 L215,260 L210,360 L190,360 Z", "quad-rectus", "legs")}

                    {/* Quads (Vastus Outer - Curvy Hips) */}
                    {p("M170,260 L185,260 L190,350 L160,340 L160,280 Z", "quad-vastus", "legs")}
                    {p("M230,260 L215,260 L210,350 L240,340 L240,280 Z", "quad-vastus", "legs")}

                    {/* Adductors (Inner Thigh) */}
                    {p("M190,280 L210,280 L205,330 L195,330 Z", "adductors", "legs")}

                    {/* Calves (Front) */}
                    {p("M185,390 L195,390 L200,470 L190,470 Z", "calves", "legs")}
                    {p("M215,390 L205,390 L200,470 L210,470 Z", "calves", "legs")}
                </g>
            )}

            {/* --------------------------------------------------------------------------------
                BACK VIEW (FEMALE)
               -------------------------------------------------------------------------------- */}
            {view === 'back' && (
                <g transform="translate(45, 20) scale(0.8)">
                    {/* TRAPS */}
                    {p("M190,120 L210,120 L200,170 Z", "traps-mid", "back")}

                    {/* Rear Delts */}
                    {p("M160,140 L175,140 L170,160 L155,155 Z", "delt-rear", "shoulders")}
                    {p("M240,140 L225,140 L230,160 L245,155 Z", "delt-rear", "shoulders")}

                    {/* LATS (V-Taper but strictly feminine) */}
                    {p("M180,170 L220,170 L210,220 L190,220 Z", "lats", "back")}

                    {/* Erectors (Lower Back) */}
                    {p("M190,220 L210,220 L205,260 L195,260 Z", "erectors", "back")}

                    {/* Glutes (Maximus - Round) */}
                    {p("M170,260 L230,260 L230,320 L170,320 Z", "glutes-max", "legs")}

                    {/* Hamstrings */}
                    {p("M175,320 L200,320 L195,390 L180,390 Z", "hamstrings", "legs")}
                    {p("M225,320 L200,320 L205,390 L220,390 Z", "hamstrings", "legs")}

                    {/* Calves (Back) */}
                    {p("M180,400 L200,400 L195,460 L185,460 Z", "calves", "legs")}
                    {p("M220,400 L200,400 L205,460 L215,460 Z", "calves", "legs")}
                </g>
            )}
        </g>
    );
}
