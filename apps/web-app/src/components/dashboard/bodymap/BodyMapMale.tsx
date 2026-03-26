'use client';

import { BodyMapProps } from './types';
import { MUSCLE_DATA } from '@/lib/muscle-data';
import { useState } from 'react';

// HELPER: Path generator with "Puzzle Piece" logic
// Using distinct paths for every muscle belly.
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

    // Beginner Mode: Group highlighting (e.g. clicking Pecs highlights all chest)
    if (mode === 'beginner') {
        const currentZone = data?.zone;
        const selectedZone = activeId ? MUSCLE_DATA[activeId]?.zone : null;
        const hoveredZone = hoveredId ? MUSCLE_DATA[hoveredId]?.zone : null;
        isActive = (currentZone === selectedZone) || (currentZone === hoveredZone);
    } else {
        // Advanced Mode: Specific muscle highlighting
        isActive = (activeId === id) || (hoveredId === id);
    }

    // STYLE: Medical Outline
    // Default: Transparent with thin white outline.
    // Active: Gold Fill.

    let fill = 'transparent';
    let stroke = 'rgba(255, 255, 255, 0.6)'; // Clearer Visibility
    let opacity = 1;

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

export default function BodyMapMale({ onMuscleSelect, selectedMuscle, view, mode, zoomZone, setZoomZone }: BodyMapProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const p = (d: string, id: string, zone: string) => (
        <Path d={d} id={id} zone={zone} activeId={selectedMuscle} hoveredId={hoveredId} mode={mode} onSelect={onMuscleSelect} setHover={setHoveredId} />
    );

    return (
        <g transform="translate(0, 0) scale(1)">
            {/* --------------------------------------------------------------------------------
                FRONT VIEW - ANATOMICAL ACCURACY UPGRADE
               -------------------------------------------------------------------------------- */}
            {view === 'front' && (
                <g transform="translate(20, 20) scale(0.9)">

                    {/* NECK (Sternocleidomastoid) */}
                    {p("M192,100 L196,125 L182,125 Z", "traps-upper", "neck")}
                    {p("M208,100 L204,125 L218,125 Z", "traps-upper", "neck")}

                    {/* TRAPS UPPER (Visible from front) */}
                    {p("M170,125 L196,125 L192,100 L165,115 Z", "traps-upper", "back")}
                    {p("M230,125 L204,125 L208,100 L235,115 Z", "traps-upper", "back")}

                    {/* DELTOIDS (Shoulders) - 3 Heads */}
                    {/* Front Delt */}
                    {p("M165,125 Q150,130 145,155 L160,165 L175,135 Z", "delt-front", "shoulders")}
                    {p("M235,125 Q250,130 255,155 L240,165 L225,135 Z", "delt-front", "shoulders")}
                    {/* Side Delt */}
                    {p("M145,125 L135,135 L138,160 L145,155 Z", "delt-side", "shoulders")}
                    {p("M255,125 L265,135 L262,160 L255,155 Z", "delt-side", "shoulders")}

                    {/* CHEST (Pectoralis Major) */}
                    {/* Upper Chest (Clavicular) */}
                    {p("M175,135 L225,135 L220,155 Q200,160 180,155 Z", "chest-upper", "chest")}
                    {/* Mid Chest (Sternal) */}
                    {p("M180,155 Q200,160 220,155 L225,185 L175,185 Z", "chest-mid", "chest")}
                    {/* Lower Chest (Costal) - Rounded Bottom */}
                    {p("M175,185 L225,185 L215,195 Q200,190 185,195 Z", "chest-lower", "chest")}

                    {/* ARMS */}
                    {/* Biceps */}
                    {p("M145,160 L140,200 L160,200 L160,165 Z", "biceps-long", "arms")}
                    {p("M255,160 L260,200 L240,200 L240,165 Z", "biceps-long", "arms")}

                    {/* Forearms (Brachioradialis + Flexors) */}
                    {p("M140,200 L135,240 L155,245 L160,200 Z", "forearms", "arms")}
                    {p("M260,200 L265,240 L245,245 L240,200 Z", "forearms", "arms")}

                    {/* CORE */}
                    {/* Abs (Rectus Abdominis) - 6 Pack Definition */}
                    {p("M185,195 L215,195 L213,215 L187,215 Z", "abs-rectus", "core")} // Top Pair
                    {p("M187,215 L213,215 L211,235 L189,235 Z", "abs-rectus", "core")} // Mid Pair
                    {p("M189,235 L211,235 L210,255 L190,255 Z", "abs-rectus", "core")} // Low Pair

                    {/* Obliques (External) */}
                    {p("M175,190 L185,195 L190,255 L165,230 Z", "obliques", "core")}
                    {p("M225,190 L215,195 L210,255 L235,230 Z", "obliques", "core")}

                    {/* Serratus Anterior (The gills) */}
                    {p("M165,165 L175,175 L175,190 L160,180 Z", "obliques", "core")} // Simplified Serratus zone
                    {p("M235,165 L225,175 L225,190 L240,180 Z", "obliques", "core")}

                    {/* LEGS */}
                    {/* Quads (Rectus Femoris - Center) */}
                    {p("M185,260 L215,260 L210,360 L190,360 Z", "quad-rectus", "legs")}

                    {/* Quads (Vastus Lateralis - Outer sweep) */}
                    {p("M165,260 L185,260 L190,350 L160,330 Z", "quad-vastus", "legs")}
                    {p("M235,260 L215,260 L210,350 L240,330 Z", "quad-vastus", "legs")}

                    {/* Quads (Vastus Medialis - Teardrop) */}
                    {p("M190,350 L200,380 L185,380 Z", "quad-vastus", "legs")}
                    {p("M210,350 L200,380 L215,380 Z", "quad-vastus", "legs")}

                    {/* Adductors (Inner Thigh) */}
                    {p("M190,280 L210,280 L200,340 Z", "adductors", "legs")} // Simplified wedge

                    {/* Calves (Tibialis Anterior - Shin) */}
                    {p("M185,400 L195,400 L200,500 L190,500 Z", "calves", "legs")} // Left Shin
                    {p("M215,400 L205,400 L200,500 L210,500 Z", "calves", "legs")} // Right Shin

                    {/* Calves (Gastrocnemius - Outer Visible) */}
                    {p("M185,400 L170,430 L180,470 L190,460 Z", "calves", "legs")}
                    {p("M215,400 L230,430 L220,470 L210,460 Z", "calves", "legs")}
                </g>
            )}

            {/* --------------------------------------------------------------------------------
                BACK VIEW - MUSCULAR DEFINITION
               -------------------------------------------------------------------------------- */}
            {view === 'back' && (
                <g transform="translate(20, 20) scale(0.9)">
                    {/* Traps (Diamond Shape) */}
                    {p("M170,115 L230,115 L200,165 Z", "traps-mid", "back")}

                    {/* Rear Delts */}
                    {p("M145,130 L165,130 L160,150 L140,145 Z", "delt-rear", "shoulders")}
                    {p("M255,130 L235,130 L240,150 L260,145 Z", "delt-rear", "shoulders")}

                    {/* Teres Major/Minor (Under armpit) */}
                    {p("M160,150 L175,150 L175,170 L165,170 Z", "lats", "back")}
                    {p("M240,150 L225,150 L225,170 L235,170 Z", "lats", "back")}

                    {/* Lats (Wings) */}
                    {p("M175,170 L225,170 L210,230 L190,230 Z", "lats", "back")}
                    {p("M165,170 L175,170 L190,230 L175,210 Z", "lats", "back")} // Outer Lat Sweep
                    {p("M235,170 L225,170 L210,230 L225,210 Z", "lats", "back")}

                    {/* Erectors (Christmas Tree) */}
                    {p("M190,230 L210,230 L205,260 L195,260 Z", "erectors", "back")}

                    {/* Triceps (Back of arm) */}
                    {p("M140,160 L160,165 L155,200 L145,200 Z", "triceps-long", "arms")}
                    {p("M260,160 L240,165 L245,200 L255,200 Z", "triceps-long", "arms")}

                    {/* Glutes (Maximus) */}
                    {p("M170,260 L230,260 L230,320 L170,320 Z", "glutes-max", "legs")}

                    {/* Hamstrings */}
                    {p("M175,320 L200,320 L195,390 L180,390 Z", "hamstrings", "legs")}
                    {p("M225,320 L200,320 L205,390 L220,390 Z", "hamstrings", "legs")}

                    {/* Calves (Back - Gastroc) */}
                    {p("M180,400 L200,400 L195,460 L185,460 Z", "calves", "legs")}
                    {p("M220,400 L200,400 L205,460 L215,460 Z", "calves", "legs")}
                </g>
            )}
        </g>
    );
}
