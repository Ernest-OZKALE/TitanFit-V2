'use client';

import { useAuth } from '@/lib/auth-context';
import TitaniumBackground from '@/components/TitaniumBackground';
import { FocusHeader } from '@/components/dashboard/FocusHeader';
import { DailyStack } from '@/components/dashboard/DailyStack';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="relative min-h-screen pb-32">
            <TitaniumBackground />

            <div className="relative z-10 pt-10">
                <FocusHeader username={user?.email?.split('@')[0] || 'Titan'} />

                <div className="mt-12">
                    <DailyStack />
                </div>
            </div>
        </div>
    );
}
