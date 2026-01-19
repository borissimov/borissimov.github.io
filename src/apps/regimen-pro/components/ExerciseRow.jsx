import React, { useState } from 'react';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import { useTrainingStore } from '../stores/useTrainingStore';
import '../../shared-premium.css';

export const ExerciseRow = ({ 
    exercise, 
    onLog
}) => {
    const { collapsedExercises, toggleExerciseCollapse, setExerciseCollapsed } = useTrainingStore();
    const [exerciseLogs, setExerciseLogs] = useState([]);
    const totalRounds = 3; 
    
    const currentRoundNum = exerciseLogs.length + 1;
    const isFullyDone = exerciseLogs.length >= totalRounds;
    const isCollapsed = collapsedExercises.includes(exercise.id);

    const isCardio = exercise.type === 'Cardio' || 
                     ['Running', 'Biking', 'Swimming', 'Walking'].some(v => exercise.name.includes(v));

    const handleLocalLog = () => {
        if (isFullyDone) return;
        const newLogs = [...exerciseLogs, { 
            id: Date.now(), 
            round: currentRoundNum,
            weight: exercise.target_weight || '0', 
            reps: exercise.target_reps || '0', 
            rpe: exercise.target_rpe || '0' 
        }];
        setExerciseLogs(newLogs);
        onLog && onLog(newLogs);
        if (newLogs.length >= totalRounds) setExerciseCollapsed(exercise.id, true);
    };

    const updateLog = (id, field, value) => {
        setExerciseLogs(prev => prev.map(log => log.id === id ? { ...log, [field]: value } : log));
    };

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
            backgroundColor: isFullyDone ? '#161d16' : '#1a1a1a',
            padding: '8px 10px', 
            borderBottom: '1px solid #333',
            marginBottom: '4px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            {/* ROW 1: Name and Indicator */}
            <div 
                onClick={() => toggleExerciseCollapse(exercise.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
                <span style={{ 
                    fontSize: '9px', fontWeight: '900', padding: '2px 6px', 
                    backgroundColor: isFullyDone ? '#2ecc71' : '#f29b11',
                    color: '#000', borderRadius: '4px', textTransform: 'uppercase', flexShrink: 0
                }}>
                    {isFullyDone ? 'DONE' : `${currentRoundNum}/${totalRounds}`}
                </span>
                <h3 style={{ fontSize: '14px', fontWeight: '900', color: isFullyDone ? '#2ecc71' : '#fff', margin: 0, textTransform: 'uppercase', flex: 1 }}>
                    {exercise.name}
                </h3>
                {isCollapsed ? <ChevronRight size={14} color="#444" /> : <ChevronDown size={14} color="#444" />}
            </div>

            {/* EXPANDABLE SECTION */}
            {!isCollapsed && (
                <div style={{ marginTop: '8px' }}>
                    {/* ROW 2: Targets Aligned Right */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderBottom: '1px solid #222', paddingBottom: '4px', marginBottom: '8px' }}>
                        {!isCardio ? (
                            <>
                                <TargetItem label="KG" value={exercise.target_weight} />
                                <TargetItem label="REPS" value={exercise.target_reps} />
                                <TargetItem label="RPE" value={exercise.target_rpe} />
                                <TargetItem label="TEMPO" value={exercise.target_tempo} />
                            </>
                        ) : (
                            <>
                                <TargetItem label="TIME" value={exercise.target_time} />
                                <TargetItem label="INT" value={exercise.target_intensity} />
                            </>
                        )}
                    </div>

                    {/* ROW 3: Active Input */}
                    {!isFullyDone && (
                        <div style={{...gridStyle, marginBottom: '8px'}}>
                            {!isCardio ? (
                                <>
                                    <input type="number" className="premium-input" style={{ height: '38px', fontSize: '18px' }} placeholder="Kg" />
                                    <input type="number" className="premium-input" style={{ height: '38px', fontSize: '18px' }} placeholder="R" />
                                    <input type="number" className="premium-input" style={{ height: '38px', fontSize: '18px', borderStyle: 'dashed' }} placeholder="RPE" />
                                </>
                            ) : (
                                <>
                                    <input type="text" className="premium-input" style={{ height: '38px', fontSize: '18px', gridColumn: 'span 2' }} placeholder="Time" />
                                    <input type="number" className="premium-input" style={{ height: '38px', fontSize: '18px' }} placeholder="HR" />
                                </>
                            )}
                            <button onClick={handleLocalLog} style={{ all: 'unset', cursor: 'pointer', backgroundColor: '#222', color: '#f29b11', width: '52px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', border: '1px solid #333' }}>
                                <Check size={22} strokeWidth={4} />
                            </button>
                        </div>
                    )}

                    {/* ROW 4+: History */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {exerciseLogs.map((log) => (
                            <div key={log.id} style={gridStyle}>
                                <div style={{ backgroundColor: '#161d16', border: '1px solid #2ecc7122', borderRadius: '8px', overflow: 'hidden' }}>
                                    <input type="number" value={log.weight} onChange={(e) => updateLog(log.id, 'weight', e.target.value)} style={logInputStyle} />
                                </div>
                                <div style={{ backgroundColor: '#161d16', border: '1px solid #2ecc7122', borderRadius: '8px', overflow: 'hidden' }}>
                                    <input type="number" value={log.reps} onChange={(e) => updateLog(log.id, 'reps', e.target.value)} style={logInputStyle} />
                                </div>
                                <div style={{ backgroundColor: '#161d16', border: '1px solid #2ecc7122', borderRadius: '8px', overflow: 'hidden' }}>
                                    <input type="number" value={log.rpe} onChange={(e) => updateLog(log.id, 'rpe', e.target.value)} style={{ ...logInputStyle, color: '#2ecc71' }} />
                                </div>
                                <div style={{ width: '52px', textAlign: 'center', fontSize: '16px', fontWeight: '900', color: '#2ecc71', opacity: 0.6 }}>{log.round}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
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