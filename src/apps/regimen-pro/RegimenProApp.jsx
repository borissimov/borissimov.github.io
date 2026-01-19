import React, { useEffect } from 'react';
import { useTrainingStore } from './stores/useTrainingStore';
import { TrainingBlock } from './components/TrainingBlock';
import { ArrowLeft, Play, X, Activity, Loader2, CheckCircle2, Coffee, Check } from 'lucide-react';
import '../shared-premium.css';

const RegimenProApp = ({ onExit }) => {
    const { 
        activeSession, 
        startSession, 
        finishSession,
        resetStore, 
        fetchRoutineDays, 
        availableRoutineDays, 
        recommendedDayId, 
        selectedDayId, 
        setSelectedDay,
        isLoading 
    } = useTrainingStore();

    useEffect(() => {
        if (!activeSession) {
            fetchRoutineDays();
        }
    }, [activeSession, fetchRoutineDays]);

    const globalStats = activeSession?.blocks?.reduce((acc, block) => {
        block.exercises.forEach(ex => {
            const target = parseInt(ex.target_sets || 3);
            const logged = (activeSession?.logs[ex.id] || []).length;
            acc.totalTarget += target;
            acc.totalLogged += Math.min(logged, target);
        });
        return acc;
    }, { totalTarget: 0, totalLogged: 0 }) || { totalTarget: 0, totalLogged: 0 };

    const globalPercent = globalStats.totalTarget > 0 ? (globalStats.totalLogged / globalStats.totalTarget) * 100 : 0;

    return (
        <div className="app-container-v2">
            
            {!activeSession ? (
                <div style={{ padding: '20px 10px' }}>
                    <header style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                        <button onClick={onExit} style={{ all: 'unset', cursor: 'pointer' }}>
                            <ArrowLeft size={24} color="#f29b11" />
                        </button>
                        <h1 style={{ flex: 1, textAlign: 'center', fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginRight: '24px' }}>
                            Ready to <span style={{ color: '#f29b11' }}>Train?</span>
                        </h1>
                    </header>

                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '100px 0', opacity: 0.5 }}>
                            <Loader2 className="animate-spin" size={40} color="#f29b11" style={{ margin: '0 auto' }} />
                            <p style={{ marginTop: '10px', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase' }}>Synchronizing Plan...</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <p style={{ fontSize: '10px', fontWeight: '900', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', marginLeft: '4px' }}>
                                SELECT ROUTINE DAY
                            </p>
                            
                            {availableRoutineDays.map((day) => {
                                const isRecommended = day.id === recommendedDayId;
                                const isSelected = day.id === selectedDayId;
                                
                                return (
                                    <div 
                                        key={day.id}
                                        onClick={() => setSelectedDay(day.id)}
                                        className={isRecommended && !isSelected ? 'animate-breathe-orange' : ''}
                                        style={{
                                            backgroundColor: isSelected ? '#1a1a1a' : '#0a0a0a',
                                            border: `1px solid ${isSelected ? '#f29b11' : '#222'}`,
                                            padding: '16px 15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            borderLeft: isSelected ? '4px solid #f29b11' : isRecommended ? '4px solid #f29b1188' : '4px solid transparent'
                                        }}
                                    >
                                        <div>
                                            <span style={{ fontSize: '9px', fontWeight: '900', color: '#666', textTransform: 'uppercase' }}>Day {day.sequence_number}</span>
                                            <h3 style={{ fontSize: '16px', fontWeight: '900', margin: 0, color: isSelected ? '#f29b11' : '#fff' }}>{day.label}</h3>
                                        </div>
                                        
                                        {isRecommended && !isSelected && (
                                            <span style={{ fontSize: '8px', fontWeight: '900', backgroundColor: '#f29b1122', color: '#f29b11', padding: '2px 6px', borderRadius: '4px' }}>RECOMMENDED</span>
                                        )}
                                        
                                        {isSelected && (
                                            <CheckCircle2 size={18} color="#f29b11" />
                                        )}
                                    </div>
                                );
                            })}

                            {selectedDayId && (
                                <button 
                                    className="premium-btn-primary" 
                                    style={{ marginTop: '20px' }}
                                    onClick={() => startSession(selectedDayId)}
                                >
                                    Start Session
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ) : activeSession.isRestDay ? (
                /* REST DAY VIEW */
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', backgroundColor: '#1a1a1a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <Coffee size={40} color="#f29b11" />
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase' }}>Rest & Recover</h2>
                    <p style={{ color: '#666', marginBottom: '40px' }}>No training scheduled for this phase of the cycle. Focus on hydration and mobility.</p>
                    <button className="premium-btn-primary" onClick={finishSession}>
                        COMPLETE REST DAY
                    </button>
                    <button className="premium-btn-secondary" style={{ marginTop: '10px' }} onClick={() => resetStore()}>
                        Back to Selector
                    </button>
                </div>
            ) : (
                /* TRAINING SESSION VIEW */
                <div style={{ width: '100%', margin: '0' }}>
                    <div style={{ position: 'sticky', top: 0, left: 0, zIndex: 100, backgroundColor: '#121212', paddingBottom: '8px' }}>
                        <div style={{ height: '3px', width: '100%', backgroundColor: '#222' }}>
                            <div style={{ height: '100%', width: `${globalPercent}%`, backgroundColor: '#f29b11', boxShadow: '0 0 8px #f29b1188', transition: 'width 0.5s ease-out' }} />
                        </div>
                    </div>

                    <header style={{ display: 'flex', alignItems: 'center', padding: '10px', marginBottom: '5px' }}>
                        <button onClick={onExit} style={{ all: 'unset', cursor: 'pointer' }}>
                            <ArrowLeft size={24} color="#f29b11" />
                        </button>
                        <h1 style={{ flex: 1, textAlign: 'center', fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginRight: '34px' }}>
                            Training <span style={{ color: '#f29b11' }}>App</span>
                        </h1>
                    </header>

                    <div style={{ paddingBottom: '80px' }}>
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', width: '100%' }}>
                            {activeSession.blocks.map((block, idx) => (
                                <div key={block.id} className="premium-card" style={{ padding: '8px 10px', borderRadius: '0', borderLeft: 'none', borderRight: 'none', marginBottom: '0', borderTop: 'none' }}>
                                    <TrainingBlock block={block} index={idx} totalBlocks={activeSession.blocks.length} />
                                </div>
                            ))}
                        </div>

                        {/* FINISH SESSION ACTION */}
                        <div style={{ padding: '20px 15px' }}>
                            <button 
                                className="premium-btn-primary" 
                                style={{ backgroundColor: globalPercent >= 100 ? '#2ecc71' : '#f29b11', color: globalPercent >= 100 ? '#000' : '#000' }}
                                onClick={finishSession}
                            >
                                <Check size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                {globalPercent >= 100 ? 'FINISH WORKOUT' : 'FINISH EARLY'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegimenProApp;