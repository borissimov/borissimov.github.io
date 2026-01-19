import React from 'react';
import { usePlan } from '../../context/PlanContext';
import { 
    Activity, 
    HeartPulse, 
    Edit3, 
    History, 
    ChevronRight,
    Trophy
} from 'lucide-react';
import './HubApp.css';

export const HubApp = ({ setActiveApp }) => {
    const { session, logout, profile } = usePlan();

    const apps = [
        {
            id: 'regimen_standalone',
            title: 'Regimen Pro',
            desc: 'Standalone gym tracker. Fully optimized for mobile logs and cloud sync.',
            icon: <Activity size={28} />,
            badge: 'Stable',
            accent: '#f29b11',
            onClick: () => window.location.href = '/regimen.html'
        },
        {
            id: 'regimen_react',
            title: 'Regimen Pro (React)',
            desc: 'Next-gen engine. Block-based circuits and real-time analytics.',
            icon: <Trophy size={28} />,
            badge: 'Alpha',
            accent: '#f29b11',
            onClick: () => setActiveApp('regimen')
        },
        {
            id: 'bp',
            title: 'Health Tracker',
            desc: 'Log and monitor blood pressure, heart rate, and health metrics.',
            icon: <HeartPulse size={28} />,
            badge: 'New',
            accent: '#ef4444'
        },
        {
            id: 'legacy',
            title: 'Legacy Tracker',
            desc: 'Access original dashboard tools and historical planning data.',
            icon: <History size={28} />,
            badge: 'Stable',
            accent: '#666',
            onClick: () => setActiveApp('legacy')
        }
    ];

    return (
        <div className="hub-root">
            <div className="hub-glow-orange"></div>
            <div className="hub-glow-blue"></div>

            <div className="max-w-xl mx-auto">
                <header className="hub-header">
                    <h1 className="hub-title">
                        MASTER <span>PLAN</span>
                    </h1>
                    
                    <div className="hub-status-badge">
                        <div className="hub-status-pulse"></div>
                        <span style={{ fontSize: '10px', fontWeight: '900', color: '#555', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            {profile?.full_name || session?.user?.email.split('@')[0]} System Active
                        </span>
                    </div>
                </header>

                <div className="hub-card-grid">
                    {apps.map(app => (
                        <button
                            key={app.id}
                            onClick={app.onClick ? app.onClick : () => setActiveApp(app.id)}
                            className="hub-card"
                        >
                            <div className="hub-card-icon" style={{ color: app.accent }}>
                                {app.icon}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div className="hub-card-title">
                                    {app.title}
                                    <span className="hub-card-badge">{app.badge}</span>
                                </div>
                                <p className="hub-card-desc">
                                    {app.desc}
                                </p>
                            </div>

                            <ChevronRight size={20} color="#333" />
                        </button>
                    ))}
                </div>

                <footer className="hub-footer">
                    <button onClick={logout} className="hub-signout-btn">
                        Terminate Session
                    </button>
                    <p style={{ fontSize: '9px', fontWeight: '900', color: '#333', marginTop: '30px', textTransform: 'uppercase', letterSpacing: '4px' }}>
                        Arch v2.0 • Build Stable
                    </p>
                </footer>
            </div>
        </div>
    );
};
