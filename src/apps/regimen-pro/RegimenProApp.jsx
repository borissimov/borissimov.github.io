import React, { useState } from 'react';
import { useTrainingStore } from './stores/useTrainingStore';
import { TrainingBlock } from './components/TrainingBlock';
import { ArrowLeft, Play, X, Activity } from 'lucide-react';
import '../shared-premium.css';

const RegimenProApp = ({ onExit }) => {
    const { activeSession, startSession, resetStore } = useTrainingStore();

    return (
        <div className="app-container-v2" style={{ paddingTop: '10px' }}>
            <div style={{ width: '100%', margin: '0' }}>
                
                {/* Compact Header */}
                <header style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', padding: '0 10px' }}>
                    <button onClick={onExit} style={{ all: 'unset', cursor: 'pointer', padding: '5px' }}>
                        <ArrowLeft size={24} color="#f29b11" />
                    </button>
                    <h1 style={{ flex: 1, textAlign: 'center', fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginRight: '34px' }}>
                        Regimen <span style={{ color: '#f29b11' }}>Pro</span>
                    </h1>
                </header>

                {!activeSession ? (
                    <div className="premium-card" style={{ textAlign: 'center', padding: '30px 20px' }}>
                        <div style={{ 
                            width: '50px', height: '50px', backgroundColor: '#252525', 
                            borderRadius: '50%', display: 'flex', alignItems: 'center', 
                            justifyContent: 'center', margin: '0 auto 15px' 
                        }}>
                            <Activity size={24} color="#f29b11" />
                        </div>
                        <h2 style={{ fontSize: '16px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '4px' }}>
                            Ready to Train?
                        </h2>
                        <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>
                            Your session is ready.
                        </p>
                        <button 
                            className="premium-btn-primary" 
                            style={{ width: '80%', padding: '12px' }}
                            onClick={() => startSession(new Date().toISOString().split('T')[0])}
                        >
                            Start Session
                        </button>
                    </div>
                ) : (
                    <div style={{ paddingBottom: '80px' }}>
                        {/* Compact Session Meta */}
                        <div className="premium-card" style={{ padding: '8px 15px', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '9px', color: '#666', fontWeight: '800', textTransform: 'uppercase', margin: 0 }}>Active Session</p>
                                    <p style={{ fontSize: '12px', fontWeight: 'bold', margin: 0 }}>{new Date(activeSession.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                                </div>
                                <button onClick={resetStore} style={{ all: 'unset', cursor: 'pointer', color: '#ef4444' }}>
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Blocks with minimal gap */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                            {activeSession.blocks.map((block, idx) => (
                                <div key={block.id} className="premium-card" style={{ padding: '12px 10px', borderRadius: '0', borderLeft: 'none', borderRight: 'none' }}>
                                    <TrainingBlock 
                                        block={block} 
                                        index={idx}
                                        totalBlocks={activeSession.blocks.length}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegimenProApp;
