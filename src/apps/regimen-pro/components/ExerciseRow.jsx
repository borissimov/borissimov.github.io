import React, { useState } from 'react';
import { Check, ChevronDown, ChevronRight, Clock, Dumbbell, AlertCircle, BookOpen } from 'lucide-react';
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

    // TEST: Expanded by default
    const [showTechnique, setShowTechnique] = useState(true);
    const logs = activeSession?.logs[exercise.id] || [];
    const totalSets = parseInt(exercise.target_sets || 3);
    const isComplete = logs.length >= totalSets;
    const hasStarted = logs.length > 0;

    const isActive = activeFocusId === exercise.id;
    const isSystemChoice = systemStep?.exerciseId === exercise.id;
    
    // CIRCUIT ROUND LOGIC
    const currentRoundNum = isSystemChoice ? systemStep.round : (logs.length + 1);

    // DYNAMIC TARGET LOGIC (High Detail Support)
    const currentSetTarget = exercise.set_targets?.find(t => t.set === currentRoundNum) || null;
    const targetWeight = currentSetTarget?.weight || exercise.target_weight;
    const targetReps = currentSetTarget?.reps || exercise.target_reps;
    const targetRpe = currentSetTarget?.rpe || exercise.target_rpe;
    const targetTempo = currentSetTarget?.tempo || exercise.target_tempo;
    const setLabel = currentSetTarget?.label || null;

    // SMART TYPE DETECTION
    const isCardio = exercise.name?.toLowerCase().includes('swim') || 
                     exercise.name?.toLowerCase().includes('плуване') ||
                     exercise.name?.toLowerCase().includes('разходка');
                     
    const isTimed = isCardio || (targetReps && String(targetReps).toLowerCase().match(/[sсекminмин]/i));

    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [rpe, setRpe] = useState('');

    const handleLocalLog = () => {
        if (isComplete) return;
        addLogEntry(exercise.id, blockId, {
            round: currentRoundNum,
            weight: weight || targetWeight, 
            reps: reps || targetReps, 
            rpe: rpe || targetRpe || 9,
            targetWeight,
            targetReps,
            targetRpe
        }, true);
        setWeight(''); setReps(''); setRpe('');
    };

    const getAccentColor = () => {
        if (isComplete) return '#2ecc71'; 
        if (isActive || isSystemChoice) return '#f29b11';   
        if (hasStarted) return '#2ecc71'; 
        return '#666'; 
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
            backgroundColor: isActive ? '#1a1a1a' : isComplete ? '#161d16' : 'transparent',
            padding: '8px 10px', borderBottom: '1px solid #333', marginBottom: '2px', display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box',
            borderLeft: `4px solid ${getAccentColor()}`,
            transition: 'all 0.3s ease',
            opacity: isActive || isComplete || isSystemChoice || hasStarted ? 1 : 0.6 
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div onClick={() => toggleFocus(exercise.id, blockId)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1, minWidth: 0 }}>
                    <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '900', 
                        padding: '2px 6px', 
                        backgroundColor: getAccentColor(), 
                        color: '#000', 
                        borderRadius: '4px', 
                        minWidth: '40px', 
                        textAlign: 'center',
                        letterSpacing: '0.5px'
                    }}>
                        {isComplete ? 'DONE' : `${logs.length}/${totalSets}`}
                    </span>
                    <h3 style={{ fontSize: '14px', fontWeight: '900', color: isComplete ? '#2ecc71' : '#fff', margin: 0, textTransform: 'uppercase', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exercise.name}</h3>
                </div>

                {isActive && exercise.technique && (
                    <button onClick={() => setShowTechnique(!showTechnique)} style={{ all: 'unset', cursor: 'pointer', padding: '4px' }}>
                        <BookOpen size={14} color={showTechnique ? '#f29b11' : '#444'} />
                    </button>
                )}

                <div onClick={() => toggleFocus(exercise.id, blockId)} style={{ cursor: 'pointer' }}>
                    {isActive ? <ChevronDown size={14} color={getAccentColor()} /> : <ChevronRight size={14} color="#444" />}
                </div>
            </div>

            {isActive && (
                <div style={{ marginTop: '12px' }}>
                    {showTechnique && exercise.technique && (
                        <div className="animate-in fade-in slide-in-from-top-1 duration-200" style={{ backgroundColor: 'rgba(242, 155, 17, 0.05)', border: '1px solid rgba(242, 155, 17, 0.1)', borderRadius: '6px', padding: '10px', marginBottom: '12px' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#ccc', fontStyle: 'italic', lineHeight: '1.5' }}>
                                <span style={{ color: '#f29b11', fontWeight: '900', fontStyle: 'normal', fontSize: '9px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Technique Note:</span>
                                {exercise.technique}
                            </p>
                        </div>
                    )}

                    {!isComplete && (
                        <>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #222' }}>
                                {isTimed ? <Clock size={14} color="#f29b11" /> : <Dumbbell size={14} color="#f29b11" />}
                                {setLabel && (
                                    <span style={{ 
                                        fontSize: '12px', 
                                        fontWeight: '900', 
                                        color: '#000', 
                                        backgroundColor: '#f29b11', 
                                        padding: '2px 6px', 
                                        borderRadius: '4px', 
                                        textTransform: 'uppercase' 
                                    }}>
                                        {setLabel}
                                    </span>
                                )}
                                {targetTempo && !isTimed && (
                                    <span style={{ fontSize: '12px', fontWeight: '900', color: '#fff', letterSpacing: '1px' }}>
                                        TEMPO: <span style={{ color: '#f29b11' }}>{targetTempo}</span>
                                    </span>
                                )}
                            </div>

                            <div style={{...gridStyle, marginBottom: '4px'}}>
                                <div style={{ fontSize: '11px', fontWeight: '900', color: '#f29b11', textAlign: 'center' }}>
                                    {isCardio ? 'DIST' : 'KG'} <span style={{ color: '#fff', fontSize: '13px', letterSpacing: '0.5px' }}>{targetWeight}</span>
                                </div>
                                <div style={{ fontSize: '11px', fontWeight: '900', color: '#f29b11', textAlign: 'center' }}>
                                    {isTimed ? 'TIME' : 'REPS'} <span style={{ color: '#fff', fontSize: '13px', letterSpacing: '0.5px' }}>{targetReps}</span>
                                </div>
                                <div style={{ fontSize: '11px', fontWeight: '900', color: '#f29b11', textAlign: 'center' }}>
                                    RPE <span style={{ color: '#fff', fontSize: '13px', letterSpacing: '0.5px' }}>{targetRpe}</span>
                                </div>
                                <div></div>
                            </div>

                            <div style={gridStyle}>
                                <input type="text" inputMode="decimal" className="premium-input" style={{ height: '42px', fontSize: '20px' }} value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="-" />
                                <input type="text" inputMode="decimal" className="premium-input" style={{ height: '42px', fontSize: '20px' }} value={reps} onChange={(e) => setReps(e.target.value)} placeholder="-" />
                                <input type="text" inputMode="decimal" className="premium-input" style={{ height: '42px', fontSize: '20px' }} value={rpe} onChange={(e) => setRpe(e.target.value)} placeholder="-" />
                                <button onClick={handleLocalLog} style={{ all: 'unset', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.05)', color: getAccentColor(), width: '52px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', border: `1px solid ${getAccentColor()}` }}>
                                    <Check size={24} strokeWidth={4} />
                                </button>
                            </div>
                        </>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                        {logs.map((log) => (
                            <div key={log.id} style={gridStyle}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '9px', fontWeight: '900', color: '#f29b11', marginBottom: '2px', opacity: 0.5 }}>T: {log.targetWeight || '-'}</div>
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}><input type="text" inputMode="decimal" value={log.weight} onChange={(e) => updateLogEntry(exercise.id, log.id, 'weight', e.target.value)} style={logInputStyle} /></div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '9px', fontWeight: '900', color: '#f29b11', marginBottom: '2px', opacity: 0.5 }}>T: {log.targetReps || '-'}</div>
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}><input type="text" inputMode="decimal" value={log.reps} onChange={(e) => updateLogEntry(exercise.id, log.id, 'reps', e.target.value)} style={logInputStyle} /></div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '9px', fontWeight: '900', color: '#f29b11', marginBottom: '2px', opacity: 0.5 }}>T: {log.targetRpe || '-'}</div>
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}><input type="text" inputMode="decimal" value={log.rpe} onChange={(e) => updateLogEntry(exercise.id, log.id, 'rpe', e.target.value)} style={{ ...logInputStyle, color: '#2ecc71' }} /></div>
                                </div>
                                <div style={{ width: '52px', textAlign: 'center', fontSize: '16px', fontWeight: '900', color: '#2ecc71', opacity: 0.6, marginTop: '12px' }}>{log.round}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};