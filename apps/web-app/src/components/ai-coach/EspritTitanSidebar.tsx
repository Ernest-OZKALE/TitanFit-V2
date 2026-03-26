'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { TrendingUp, Brain, Zap, Activity } from 'lucide-react';

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { id: 'performances', label: 'Performances', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'focus', label: 'Focus Mental', icon: <Brain className="w-5 h-5" /> },
    { id: 'energie', label: 'Énergie', icon: <Zap className="w-5 h-5" /> },
];

interface HealthMetrics {
    pouls: number;
    vfc: number;
    forme: number;
}

interface EspritTitanSidebarProps {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    healthMetrics?: HealthMetrics;
}

export function EspritTitanSidebar({
    activeTab = 'performances',
    onTabChange,
    healthMetrics = { pouls: 42, vfc: 128, forme: 98 }
}: EspritTitanSidebarProps) {
    const { user } = useAuth();
    const [currentTab, setCurrentTab] = useState(activeTab);

    const handleTabClick = (tabId: string) => {
        setCurrentTab(tabId);
        onTabChange?.(tabId);
    };

    // Obtenir les initiales de l'utilisateur
    const getInitials = () => {
        const name = user?.user_metadata?.username || user?.email?.split('@')[0] || 'U';
        return name.charAt(0).toUpperCase();
    };

    const getUserName = () => {
        return user?.user_metadata?.username || user?.email?.split('@')[0] || 'Utilisateur';
    };

    return (
        <aside className="esprit-sidebar">
            <div className="esprit-sidebar-content">
                {/* Profil utilisateur */}
                <div className="esprit-profile">
                    <div className="esprit-avatar">
                        {getInitials()}
                    </div>
                    <div className="esprit-profile-info">
                        <h3>{getUserName()}</h3>
                        <span className="esprit-badge">MEMBRE TITAN</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="esprit-nav">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleTabClick(item.id)}
                            className={`esprit-nav-item ${currentTab === item.id ? 'active' : ''}`}
                        >
                            <span className="esprit-nav-icon">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Widget État Actuel */}
                <div className="esprit-health-widget">
                    <div className="esprit-health-header">
                        <span className="esprit-health-title">État Actuel</span>
                        <Activity className="esprit-health-icon" />
                    </div>

                    <div className="esprit-health-metrics">
                        <div className="esprit-metric">
                            <span className="esprit-metric-label">Pouls</span>
                            <span className="esprit-metric-value">{healthMetrics.pouls} bpm</span>
                        </div>
                        <div className="esprit-metric">
                            <span className="esprit-metric-label">VFC</span>
                            <span className="esprit-metric-value">{healthMetrics.vfc} ms</span>
                        </div>
                        <div className="esprit-metric">
                            <span className="esprit-metric-label">Forme</span>
                            <span className="esprit-metric-value highlight">{healthMetrics.forme}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
