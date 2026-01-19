import React, { useState } from 'react';
import { useTrainingStore } from './stores/useTrainingStore';
import { TrainingBlock } from './components/TrainingBlock';
import { ArrowLeft, Play, X, Activity } from 'lucide-react';
import '../shared-premium.css';

const RegimenProApp = ({ onExit }) => {
    const { activeSession, startSession, resetStore } = useTrainingStore();

    // GLOBAL PROGRESS CALCULATION
    const globalStats = activeSession?.blocks.reduce((acc, block) => {
        block.exercises.forEach(ex => {
            const target = parseInt(ex.target_sets || 3);
            const logged = (activeSession?.logs[ex.id] || []).length;
            acc.totalTarget += target;
            acc.totalLogged += Math.min(logged, target);
        });
        return acc;
    }, { totalTarget: 0, totalLogged: 0 }) || { totalTarget: 0, totalLogged: 0 };

    const globalPercent = globalStats.totalTarget > 0 
        ? (globalStats.totalLogged / globalStats.totalTarget) * 100 
        : 0;

    return (
        <div className="app-container-v2" style={{ paddingTop: '10px' }}>
            <div style={{ width: '100%', margin: '0' }}>
                
                {/* Compact Header (Static) */}
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
                        {/* FIXED GLOBAL PROGRESS BAR */}
                        <div style={{ 
                            position: 'sticky', 
                            top: 0, 
                            left: 0, 
                            zIndex: 100, 
                            backgroundColor: '#121212', 
                            paddingBottom: '8px', 
                            marginTop: '-10px' 
                        }}>
                            <div style={{ height: '3px', width: '100%', backgroundColor: '#222' }}>
                                <div style={{ 
                                    height: '100%', 
                                    width: `${globalPercent}%`, 
                                    backgroundColor: '#f29b11', 
                                    boxShadow: '0 0 8px #f29b1188',
                                    transition: 'width 0.5s ease-out' 
                                }} />
                            </div>
                        </div>

                        {/* Compact Session Meta */}
                        <div className="premium-card" style={{ padding: '8px 15px', marginBottom: '8px', borderRadius: '0', borderLeft: 'none', borderRight: 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '9px', color: '#666', fontWeight: '800', textTransform: 'uppercase', margin: 0 }}>Active Session</p>
                                    <p style={{ fontSize: '12px', fontWeight: 'bold', margin: 0 }}>{new Date(activeSession.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '14px', fontWeight: '900', color: '#f29b11', margin: 0 }}>{Math.round(globalPercent)}%</p>
                                    <p style={{ fontSize: '8px', color: '#444', fontWeight: 'bold', margin: 0 }}>TOTAL COMPLETION</p>
                                </div>
                                <button onClick={resetStore} style={{ all: 'unset', cursor: 'pointer', color: '#ef4444', marginLeft: '10px' }}>
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Blocks with zero gap for seamless feed */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', width: '100%' }}>
                            {activeSession.blocks.map((block, idx) => (
                                <div key={block.id} className="premium-card" style={{ padding: '8px 10px', borderRadius: '0', borderLeft: 'none', borderRight: 'none', marginBottom: '0', borderTop: 'none' }}>
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
