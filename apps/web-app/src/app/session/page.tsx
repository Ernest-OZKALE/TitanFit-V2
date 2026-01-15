"use client";

import { SessionPlayer } from "@/components/training/SessionPlayer";

export default function SessionPage() {
    return (
        <div className="min-h-screen bg-black">
            {/* Fullscreen Player - No Navigation Dock to avoid distraction */}
            <SessionPlayer />
        </div>
    );
}
