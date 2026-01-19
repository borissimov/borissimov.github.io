import React from 'react';
import { Check, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { useTrainingStore } from '../stores/useTrainingStore';
import '../../shared-premium.css';

export const ExerciseRow = ({ 
    exercise, 
    blockId,
    onLog
}) => {
    const { 
        systemStep, 
        activeFocusId, 
        activeSession,
        addLogEntry, 
        updateLogEntry,
        toggleFocus 
    } = useTrainingStore();

    const logs = activeSession?.logs[exercise.id] || [];
    const totalRounds = 3; 
    const isComplete = logs.length >= totalRounds;

    // VISUAL STATES
    const isExpanded = activeFocusId === exercise.id;
    const isSystemChoice = systemStep?.exerciseId === exercise.id;

    // RED LOGIC: Turn Red if (System Choice) AND (User is looking at something else later)
    const isMissed = !isComplete && isSystemChoice && activeFocusId && activeFocusId !== exercise.id;

    const isCardio = exercise.type === 'Cardio' || 
                     ['Running', 'Biking', 'Swimming', 'Walking'].some(v => exercise.name.includes(v));

    const handleLocalLog = () => {
        addLogEntry(exercise.id, blockId, {
            round: isSystemChoice ? systemStep.round : 1,
            weight: exercise.target_weight, reps: exercise.target_reps, rpe: exercise.target_rpe
        }, true);
    };

    const getAccentColor = () => {
        if (isComplete) return '#2ecc71'; 
        if (isMissed) return '#ef4444';   
        if (isExpanded || isSystemChoice) return '#f29b11';   
        return '#333';
    };

    const gridStyle = { display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 52px', gap: '6px', alignItems: 'center', width: '100%' };
    const logInputStyle = { all: 'unset', backgroundColor: 'transparent', width: '100%', textAlign: 'center', fontSize: '16px', fontWeight: '900', color: '#fff', height: '32px' };

    return (
        <div style={{ 
            backgroundColor: isExpanded ? '#1a1a1a' : isComplete ? '#161d16' : '#0a0a0a',
            padding: '8px 10px', borderBottom: '1px solid #333', marginBottom: '2px', display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box',
            borderLeft: `4px solid ${getAccentColor()}`,
            transition: 'all 0.3s ease',
            opacity: isExpanded || isComplete || isMissed || isSystemChoice ? 1 : 0.4
        }}>
            {/* Header: ALWAYS VISIBLE */}
            <div onClick={() => toggleFocus(exercise.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <span style={{ 
                    fontSize: '9px', fontWeight: '900', padding: '2px 6px', 
                    backgroundColor: getAccentColor(), color: '#000', borderRadius: '4px' 
                }}>
                    {isComplete ? 'DONE' : `${logs.length + 1}/${totalRounds}`}
                </span>
                <h3 style={{ fontSize: '14px', fontWeight: '900', color: isComplete ? '#2ecc71' : isMissed ? '#ef4444' : '#fff', margin: 0, textTransform: 'uppercase', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {exercise.name}
                </h3>
                {isMissed && <AlertTriangle size={12} color="#ef4444" style={{ marginRight: '8px' }} />}
                {isExpanded ? <ChevronDown size={14} color={getAccentColor()} /> : <ChevronRight size={14} color="#444" />}
            </div>

            {/* EXPANDABLE CONTENT: Hidden when minimized */}
            {isExpanded && (
                <div style={{ marginTop: '8px' }}>
                    {/* Row 2: Targets */}
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

                    {/* Row 3: Inputs */}
                    {!isComplete && (
                        <div style={{...gridStyle, marginBottom: '12px'}}>
                            {!isCardio ? (
                                <>
                                    <input type="number" className="premium-input" style={{ height: '38px' }} placeholder="Kg" />
                                    <input type="number" className="premium-input" style={{ height: '38px' }} placeholder="R" />
                                    <input type="number" className="premium-input" style={{ height: '38px' }} placeholder="RPE" />
                                </>
                            ) : (
                                <>
                                    <input type="text" className="premium-input" style={{ height: '38px', gridColumn: 'span 2' }} placeholder="Time" />
                                    <input type="number" className="premium-input" style={{ height: '38px' }} placeholder="HR" />
                                </>
                            )}
                            <button onClick={handleLocalLog} style={{ all: 'unset', cursor: 'pointer', backgroundColor: '#222', color: getAccentColor(), width: '52px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', border: `1px solid ${getAccentColor()}` }}>
                                <Check size={22} strokeWidth={4} />
                            </button>
                        </div>
                    )}

                    {/* Row 4: History (NOW INSIDE EXPANDED) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {logs.map((log) => (
                            <div key={log.id} style={gridStyle}>
                                <div style={{ backgroundColor: '#161d16', border: '1px solid #2ecc7122', borderRadius: '8px' }}>
                                    <input type="number" value={log.weight} onChange={(e) => updateLogEntry(exercise.id, log.id, 'weight', e.target.value)} style={logInputStyle} />
                                </div>
                                <div style={{ backgroundColor: '#161d16', border: '1px solid #2ecc7122', borderRadius: '8px' }}>
                                    <input type="number" value={log.reps} onChange={(e) => updateLogEntry(exercise.id, log.id, 'reps', e.target.value)} style={logInputStyle} />
                                </div>
                                <div style={{ backgroundColor: '#161d16', border: '1px solid #2ecc7122', borderRadius: '8px' }}>
                                    <input type="number" value={log.rpe} onChange={(e) => updateLogEntry(exercise.id, log.id, 'rpe', e.target.value)} style={{ ...logInputStyle, color: '#2ecc71' }} />
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