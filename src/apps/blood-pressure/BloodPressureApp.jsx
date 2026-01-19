import React, { useState, useEffect } from 'react';
import { useHealthStore } from './stores/useHealthStore';
import { usePlan } from '../../context/PlanContext';
import { Heart, ArrowLeft, History, Plus } from 'lucide-react';
import '../shared-premium.css';

const BloodPressureApp = ({ onExit }) => {
    const { session } = usePlan();
    const { logs, addLog, fetchLogs, isSyncing } = useHealthStore();
    
    const [sys, setSys] = useState(120);
    const [dia, setDia] = useState(80);
    const [hr, setHr] = useState(70);

    useEffect(() => {
        if (session?.user?.id) fetchLogs(session.user.id);
    }, [session]);

    const handleSave = async () => {
        if (!session?.user?.id) return;
        await addLog(session.user.id, sys, dia, hr);
    };

    return (
        <div className="app-container-v2">
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                
                {/* Clean Header */}
                <header style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                    <button onClick={onExit} style={{ all: 'unset', cursor: 'pointer', padding: '10px' }}>
                        <ArrowLeft size={24} color="#f29b11" />
                    </button>
                    <h1 style={{ flex: 1, textAlign: 'center', fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginRight: '44px' }}>
                        Health <span style={{ color: '#f29b11' }}>Tracker</span>
                    </h1>
                </header>

                {/* Entry Card */}
                <div className="premium-card">
                    <div className="section-header">
                        <Heart size={14} fill="#f29b11" /> NEW RECORDING
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '20px' }}>
                        <div className="premium-input-group">
                            <label className="premium-input-label">SYS</label>
                            <input type="number" className="premium-input" value={sys} onChange={(e) => setSys(e.target.value)} />
                        </div>
                        <div className="premium-input-group">
                            <label className="premium-input-label">DIA</label>
                            <input type="number" className="premium-input" value={dia} onChange={(e) => setDia(e.target.value)} />
                        </div>
                        <div className="premium-input-group">
                            <label className="premium-input-label">PULSE</label>
                            <input type="number" className="premium-input" value={hr} onChange={(e) => setHr(e.target.value)} />
                        </div>
                    </div>

                    <button 
                        className="premium-btn-primary" 
                        onClick={handleSave}
                        disabled={isSyncing}
                    >
                        {isSyncing ? 'SYNCING...' : 'SAVE TO CLOUD'}
                    </button>
                </div>

                {/* History Section */}
                <div className="premium-card">
                    <div className="section-header">
                        <History size={14} /> RECENT TRENDS
                    </div>
                    
                    <div style={{ marginTop: '15px' }}>
                        {logs.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#666', fontSize: '12px' }}>No logs recorded.</p>
                        ) : (
                            logs.slice(0, 5).map((log, idx) => (
                                <div key={idx} className="premium-list-row">
                                    <div>
                                        <p style={{ fontSize: '13px', fontWeight: 'bold', margin: 0 }}>
                                            {log.metrics?.bp_sys}/{log.metrics?.bp_dia}
                                        </p>
                                        <p style={{ fontSize: '9px', color: '#666', textTransform: 'uppercase', fontWeight: '800' }}>
                                            {new Date(log.measured_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '13px', fontWeight: 'black', color: '#f29b11', margin: 0 }}>
                                            {log.metrics?.hr}
                                        </p>
                                        <p style={{ fontSize: '9px', color: '#666', textTransform: 'uppercase', fontWeight: '800' }}>BPM</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Return to Hub */}
                <button className="premium-btn-secondary" onClick={onExit} style={{ marginTop: '20px' }}>
                    Return to Hub
                </button>
            </div>
        </div>
    );
};

export default BloodPressureApp;