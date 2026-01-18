import React from 'react';
import { usePlan } from '../../context/PlanContext';
import { 
    Activity, 
    HeartPulse, 
    Edit3, 
    History, 
    User,
    ChevronRight
} from 'lucide-react';

export const HubApp = ({ setActiveApp }) => {
    const { session, logout, profile } = usePlan();

    const apps = [
        {
            id: 'regimen_standalone',
            title: 'Regimen Pro',
            desc: 'Standalone gym tracker. Fully optimized for mobile logs and cloud sync.',
            icon: <Activity size={24} />,
            badge: 'Stable',
            accent: '#f29b11',
            onClick: () => window.location.href = '/regimen.html'
        },
        {
            id: 'regimen_react',
            title: 'Regimen Pro (React)',
            desc: 'New integrated version. Porting in progress.',
            icon: <Activity size={24} />,
            badge: 'Migration',
            accent: '#f29b11',
            onClick: () => setActiveApp('regimen')
        },
        {
            id: 'bp',
            title: 'Health Tracker',
            desc: 'Log and monitor blood pressure, heart rate, and health metrics.',
            icon: <HeartPulse size={24} />,
            badge: 'New',
            accent: '#ef4444'
        },
        {
            id: 'editor',
            title: 'Routine Editor',
            desc: 'Design complex training cycles, circuits, and progression rules.',
            icon: <Edit3 size={24} />,
            badge: 'In Design',
            accent: '#3b82f6'
        },
        {
            id: 'legacy',
            title: 'Legacy Tracker',
            desc: 'Access original dashboard tools and historical planning data.',
            icon: <History size={24} />,
            badge: 'Stable',
            accent: '#a3a3a3'
        }
    ];

    return (
        <div style={{
            backgroundColor: '#121212',
            color: '#ececec',
            minHeight: '100vh',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: '20px'
        }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '40px' }}>
                
                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h1 style={{ 
                        color: '#f29b11', 
                        fontSize: '28px', 
                        fontWeight: '900', 
                        textTransform: 'uppercase', 
                        letterSpacing: '3px',
                        margin: '0 0 10px 0'
                    }}>
                        Master Plan
                    </h1>
                    <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        backgroundColor: '#1e1e1e',
                        padding: '6px 15px',
                        borderRadius: '20px',
                        border: '1px solid #333'
                    }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4caf50' }}></div>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#b0b0b0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {profile?.full_name || session?.user?.email.split('@')[0]} Online
                        </span>
                    </div>
                </header>

                {/* App Grid */}
                <div style={{ display: 'grid', gap: '16px' }}>
                    {apps.map(app => (
                        <button
                            key={app.id}
                            onClick={app.onClick ? app.onClick : () => setActiveApp(app.id)}
                            className="hub-card"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                padding: '24px',
                                backgroundColor: '#1e1e1e',
                                border: '1px solid #333',
                                borderRadius: '16px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                width: '100%',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{
                                backgroundColor: '#252525',
                                padding: '12px',
                                borderRadius: '12px',
                                color: app.accent,
                                border: `1px solid ${app.accent}33`,
                                flexShrink: 0
                            }}>
                                {app.icon}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#fff' }}>
                                        {app.title}
                                    </h3>
                                    <span style={{ 
                                        fontSize: '9px', 
                                        fontWeight: '900', 
                                        textTransform: 'uppercase', 
                                        backgroundColor: '#2a2a2a', 
                                        color: '#888',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        border: '1px solid #333'
                                    }}>
                                        {app.badge}
                                    </span>
                                </div>
                                <p style={{ fontSize: '13px', color: '#b0b0b0', margin: 0, lineHeight: '1.4' }}>
                                    {app.desc}
                                </p>
                            </div>

                            <ChevronRight size={20} color="#444" />
                            
                            {/* Hover Styling via Inline CSS helper */}
                            <style>{`
                                .hub-card:hover {
                                    border-color: #f29b11 !important;
                                    transform: translateY(-2px);
                                    background-color: #252525 !important;
                                }
                                .hub-card:active {
                                    transform: translateY(0);
                                }
                            `}</style>
                        </button>
                    ))}
                </div>

                {/* System Footer */}
                <footer style={{ marginTop: '60px', borderTop: '1px solid #1e1e1e', paddingTop: '30px', textAlign: 'center' }}>
                    <button 
                        onClick={logout}
                        style={{
                            background: 'transparent',
                            border: '1px solid #333',
                            color: '#ef4444',
                            padding: '10px 25px',
                            borderRadius: '10px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            cursor: 'pointer'
                        }}
                    >
                        Sign Out of Master Plan
                    </button>
                    <p style={{ fontSize: '10px', color: '#444', marginTop: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Architecture v2.0 • Build Stable
                    </p>
                </footer>
            </div>
        </div>
    );
};