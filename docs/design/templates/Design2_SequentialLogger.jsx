import React, { useState } from 'react';
import { Check } from 'lucide-react';
import '../../shared-premium.css';

export const SequentialSetLogger = ({ exercise }) => {
    const [loggedSets, setLogs] = useState([]);
    const totalSets = parseInt(exercise.target_sets || 3);
    const currentSetNum = loggedSets.length + 1;

    const handleLog = () => {
        if (loggedSets.length >= totalSets) return;
        setLogs([...loggedSets, { 
            id: Date.now(), 
            weight: exercise.target_weight || '0', 
            reps: exercise.target_reps || '0', 
            rpe: exercise.target_rpe || '0' 
        }]);
    };

    const updateLog = (id, field, value) => {
        setLogs(prev => prev.map(log => 
            log.id === id ? { ...log, [field]: value } : log
        ));
    };

    const isComplete = loggedSets.length >= totalSets;

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr 1fr 52px',
        gap: '6px',
        alignItems: 'center',
        width: '100%'
    };

    const logInputStyle = {
        all: 'unset',
        backgroundColor: 'transparent',
        width: '100%',
        textAlign: 'center',
        fontSize: '16px',
        fontWeight: '900',
        color: '#fff',
        height: '32px',
        boxSizing: 'border-box'
    };

    return (
        <div style={{ 
            backgroundColor: isComplete ? '#161d16' : '#1a1a1a',
            padding: '8px 10px 4px 10px', 
            borderRadius: '0',
            borderBottom: '1px solid #333',
            marginBottom: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            {/* Row 1: Small Box + Exercise Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                <span style={{ 
                    fontSize: '10px', fontWeight: '900', padding: '2px 6px', 
                    backgroundColor: isComplete ? '#2ecc71' : '#f29b11',
                    color: '#000', borderRadius: '4px', textTransform: 'uppercase', flexShrink: 0
                }}>
                    {isComplete ? 'DONE' : `${currentSetNum}/${totalSets}`}
                </span>

                <h3 style={{ 
                    fontSize: '14px', fontWeight: '900', color: '#fff', margin: 0, 
                    textTransform: 'uppercase', letterSpacing: '-0.5px',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                    {exercise.name}
                </h3>
            </div>

            {/* Row 2: TARGETS ALIGNED RIGHT */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderBottom: '1px solid #222', paddingBottom: '4px', marginBottom: '2px' }}>
                <TargetItem label="KG" value={exercise.target_weight} />
                <TargetItem label="REPS" value={exercise.target_reps} />
                <TargetItem label="RPE" value={exercise.target_rpe} />
                <TargetItem label="TEMPO" value={exercise.target_tempo} />
            </div>

            {/* Input & Log Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {!isComplete && (
                    <div style={gridStyle}>
                        <input type="number" className="premium-input" style={{ height: '38px', fontSize: '18px' }} placeholder="Kg" />
                        <input type="number" className="premium-input" style={{ height: '38px', fontSize: '18px' }} placeholder="R" />
                        <input type="number" className="premium-input" style={{ height: '38px', fontSize: '18px', borderStyle: 'dashed' }} placeholder="RPE" />
                        <button 
                            onClick={handleLog}
                            style={{ 
                                all: 'unset', cursor: 'pointer', backgroundColor: '#222', color: '#f29b11',
                                width: '52px', height: '38px', display: 'flex', alignItems: 'center', 
                                justifyContent: 'center', borderRadius: '10px', border: '1px solid #333', flexShrink: 0
                            }}
                        >
                            <Check size={22} strokeWidth={4} />
                        </button>
                    </div>
                )}

                {/* Previous Logs */}
                {loggedSets.map((log, i) => (
                    <div key={log.id} style={gridStyle}>
                        <div style={{ backgroundColor: '#161d16', border: '1px solid #2ecc7122', borderRadius: '8px', overflow: 'hidden' }}>
                            <input 
                                type="number" 
                                value={log.weight} 
                                onChange={(e) => updateLog(log.id, 'weight', e.target.value)}
                                style={logInputStyle}
                            />
                        </div>
                        <div style={{ backgroundColor: '#161d16', border: '1px solid #2ecc7122', borderRadius: '8px', overflow: 'hidden' }}>
                            <input 
                                type="number" 
                                value={log.reps} 
                                onChange={(e) => updateLog(log.id, 'reps', e.target.value)}
                                style={logInputStyle}
                            />
                        </div>
                        <div style={{ backgroundColor: '#161d16', border: '1px solid #2ecc7122', borderRadius: '8px', overflow: 'hidden' }}>
                            <input 
                                type="number" 
                                value={log.rpe} 
                                onChange={(e) => updateLog(log.id, 'rpe', e.target.value)}
                                style={{ ...logInputStyle, color: '#2ecc71' }}
                            />
                        </div>
                        <div style={{ width: '52px', textAlign: 'center', fontSize: '16px', fontWeight: '900', color: '#2ecc71', opacity: 0.6 }}>
                            {i+1}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TargetItem = ({ label, value }) => {
    if (!value) return null;
    return (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            <span style={{ fontSize: '8px', fontWeight: '900', color: '#f29b11', textTransform: 'uppercase' }}>{label}:</span>
            <span style={{ fontSize: '13px', fontWeight: '900', color: '#fff' }}>{value}</span>
        </div>
    );
};
