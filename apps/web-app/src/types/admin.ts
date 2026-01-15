export type AdminStats = {
    totalUsers: number;
    activeUsers: number; // Logged in last 24h
    mrr: number;
    systemHealth: 'stable' | 'degraded' | 'critical';
    recentSignals: AdminSignal[];
    revenueHistory: { name: string; value: number }[];
};

export type AdminSignal = {
    id: string;
    type: 'signup' | 'sale' | 'alert' | 'system';
    message: string;
    timestamp: string;
    level: 'info' | 'warning' | 'success';
};
