import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getActiveSchema, setActiveSchema } from '../../supabaseClient';
import { 
    Activity, 
    HeartPulse, 
    Edit3, 
    History, 
    ChevronRight,
    Trophy,
    Terminal,
    AlertCircle,
    FlaskConical
} from 'lucide-react';
import './HubApp.css';

export const HubApp = ({ setActiveApp }) => {
    const { session, logout, profile } = useAuth();
    const [showSchemaModal, setShowSchemaModal] = useState(false);
    const activeSchema = getActiveSchema();

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
            title: 'Master Plan',
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
        }
    ];

    const toggleSchema = () => {
        const next = activeSchema === 'v3' ? 'v3_dev' : 'v3';
        setActiveSchema(next);
    };

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
                        <div className="hub-status-pulse" style={{ backgroundColor: activeSchema === 'v3_dev' ? '#ef4444' : '#2ecc71' }}></div>
                        <span style={{ fontSize: '10px', fontWeight: '900', color: '#555', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            {profile?.full_name || session?.user?.email.split('@')[0]} System Active {activeSchema === 'v3_dev' && "(SANDBOX)"}
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

                {/* ENVIRONMENT CONTROL */}
                <div style={{ marginTop: '30px', padding: '0 20px' }}>
                    <div 
                        onClick={() => setShowSchemaModal(true)}
                        style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #222', borderRadius: '12px', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
                    >
                        <div style={{ padding: '10px', backgroundColor: activeSchema === 'v3_dev' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(242, 155, 17, 0.1)', borderRadius: '8px' }}>
                            <FlaskConical size={20} color={activeSchema === 'v3_dev' ? '#ef4444' : '#f29b11'} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '11px', fontWeight: '900', color: '#fff', margin: 0, textTransform: 'uppercase' }}>Environment: {activeSchema === 'v3' ? 'PROD (v3)' : 'SANDBOX (v3_dev)'}</p>
                            <p style={{ fontSize: '9px', color: '#555', margin: '4px 0 0' }}>{activeSchema === 'v3' ? 'Using stable production data.' : 'Using experimental sandbox playground.'}</p>
                        </div>
                        <span style={{ fontSize: '9px', fontWeight: '900', color: '#f29b11' }}>CHANGE</span>
                    </div>
                </div>

                <footer className="hub-footer">
                    <button onClick={logout} className="hub-signout-btn">
                        Terminate Session
                    </button>
                    
                    <button 
                        onClick={() => window.location.href = '/recover.html'}
                        style={{ all: 'unset', display: 'block', margin: '20px auto 0', fontSize: '10px', fontWeight: '900', color: '#f29b11', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', opacity: 0.6 }}
                    >
                        Emergency Data Recovery
                    </button>

                    <button 
                        onClick={() => window.location.href = '/forensic.html'}
                        style={{ all: 'unset', display: 'block', margin: '10px auto 0', fontSize: '10px', fontWeight: '900', color: '#0f0', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', opacity: 0.6 }}
                    >
                        Forensic Memory Scan
                    </button>

                    <p style={{ fontSize: '9px', fontWeight: '900', color: '#333', marginTop: '30px', textTransform: 'uppercase', letterSpacing: '4px' }}>
                        Arch v2.0 • Build Stable
                    </p>
                </footer>
            </div>

            {/* SCHEMA SWITCH MODAL */}
            {showSchemaModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '16px', padding: '25px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                        <AlertCircle size={48} color="#f29b11" style={{ margin: '0 auto 20px' }} />
                        <h2 style={{ fontSize: '18px', fontWeight: '900', margin: '0 0 10px', color: '#fff' }}>SWITCH ENVIRONMENT?</h2>
                        <p style={{ fontSize: '13px', color: '#888', lineHeight: '1.6', margin: '0 0 25px' }}>
                            Switching to **{activeSchema === 'v3' ? 'SANDBOX' : 'PROD'}** will reload the app. <br/>
                            Training data is isolated between schemas.
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={() => setShowSchemaModal(false)}
                                style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #333', backgroundColor: 'transparent', color: '#fff', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}
                            >
                                Stay
                            </button>
                            <button 
                                onClick={toggleSchema}
                                style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#f29b11', color: '#000', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}
                            >
                                Switch & Reload
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
