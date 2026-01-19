import React from 'react';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import { useTrainingStore } from '../stores/useTrainingStore';
import '../../shared-premium.css';

export const SequentialSetLogger = ({ exercise, blockId }) => {
    const { 
        systemStep, 
        activeFocusId, 
        activeSession,
        addLogEntry, 
        updateLogEntry,
        toggleFocus 
    } = useTrainingStore();
    
    const logs = activeSession?.logs[exercise.id] || [];
    const totalSets = parseInt(exercise.target_sets || 3);
    const isComplete = logs.length >= totalSets;
    const hasStarted = logs.length > 0;

    const isActive = activeFocusId === exercise.id;
    const isSystemChoice = systemStep?.exerciseId === exercise.id;
    const currentSetNum = logs.length + 1;

    const handleLog = () => {
        addLogEntry(exercise.id, blockId, {
            weight: exercise.target_weight, reps: exercise.target_reps, rpe: exercise.target_rpe, set: currentSetNum
        }, false);
    };

    const getAccentColor = () => {
        if (isComplete) return '#2ecc71'; 
        if (isActive || isSystemChoice) return '#f29b11';   
        if (hasStarted) return '#2ecc71'; // Green badge for partial progress
        return '#666'; // Lightened from #333
    };

    const getAnimationClass = () => {
        if (isComplete) return '';
        if (isSystemChoice && !isActive) return 'animate-breathe-orange';
        return '';
    };

    const gridStyle = { display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 52px', gap: '6px', alignItems: 'center', width: '100%' };
    const logInputStyle = { all: 'unset', backgroundColor: 'transparent', width: '100%', textAlign: 'center', fontSize: '16px', fontWeight: '900', color: '#fff', height: '32px' };

    return (
        <div className={getAnimationClass()} style={{ 
            backgroundColor: isActive ? '#1a1a1a' : isComplete ? '#161d16' : '#0a0a0a',
            padding: '8px 10px', borderBottom: '1px solid #333', marginBottom: '2px', display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box',
            borderLeft: `4px solid ${getAccentColor()}`,
            transition: 'all 0.3s ease',
            opacity: isActive || isComplete || isSystemChoice || hasStarted ? 1 : 0.6 // Increased from 0.3
        }}>
            <div onClick={() => toggleFocus(exercise.id, blockId)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <span style={{ 
                    fontSize: '9px', fontWeight: '900', padding: '2px 6px', 
                    backgroundColor: getAccentColor(), color: '#000', borderRadius: '4px' 
                }}>
                    {isComplete ? 'DONE' : `${logs.length}/${totalSets}`}
                </span>
                
                <h3 style={{ fontSize: '14px', fontWeight: '900', color: isComplete ? '#2ecc71' : '#fff', margin: 0, textTransform: 'uppercase', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {exercise.name}
                </h3>

                {isActive ? <ChevronDown size={14} color={getAccentColor()} /> : <ChevronRight size={14} color="#444" />}
            </div>

            {isActive && (
                <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderBottom: '1px solid #222', paddingBottom: '4px', marginBottom: '8px' }}>
                        <TargetItem label="KG" value={exercise.target_weight} />
                        <TargetItem label="REPS" value={exercise.target_reps} />
                        <TargetItem label="RPE" value={exercise.target_rpe} />
                        <TargetItem label="TEMPO" value={exercise.target_tempo} />
                    </div>

                    {!isComplete && (
                        <div style={{...gridStyle, marginBottom: '12px'}}>
                            <input type="number" className="premium-input" style={{ height: '38px' }} placeholder="Kg" />
                            <input type="number" className="premium-input" style={{ height: '38px' }} placeholder="R" />
                            <input type="number" className="premium-input" style={{ height: '38px' }} placeholder="RPE" />
                            <button onClick={handleLog} style={{ all: 'unset', cursor: 'pointer', backgroundColor: '#222', color: getAccentColor(), width: '52px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', border: `1px solid ${getAccentColor()}` }}>
                                <Check size={22} strokeWidth={4} />
                            </button>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {logs.map((log, i) => (
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
                                <div style={{ width: '52px', textAlign: 'center', fontSize: '16px', fontWeight: '900', color: '#2ecc71', opacity: 0.6 }}>{i+1}</div>
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