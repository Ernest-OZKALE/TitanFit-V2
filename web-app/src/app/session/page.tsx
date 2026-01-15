"use client";

import { SessionPlayer } from "@/components/training/SessionPlayer";

export default function SessionPage() {
    return (
        <div className="min-h-screen bg-slate-950">
            {/* Fullscreen Player - No Navigation Dock to avoid distraction */}
            <SessionPlayer />
        </div>
    );
}
