import React, { useState } from 'react';
import { Check, ChevronDown, ChevronRight, Clock, Dumbbell, AlertCircle, BookOpen } from 'lucide-react';
import { useProgramStore } from '../../../stores/useProgramStore';
import { MetricInput } from './MetricInput';
import '../../../../shared-premium.css';

export const BlockItemRow = ({
    item,
    blockId,
    isCircuit = false
}) => {
    const {
        systemStep,
        activeFocusId,
        activeSession,
        addLogEntry,
        updateLogEntry,
        toggleFocus
    } = useProgramStore();

    if (!item) return null;

    const [showTechnique, setShowTechnique] = useState(true);
    const logs = activeSession?.logs[item.id] || [];
    const totalSets = parseInt(item.target_sets || 3);
    const isComplete = logs.length >= totalSets;
    const hasStarted = logs.length > 0;

    const isActive = activeFocusId === item.id;
    const isSystemChoice = systemStep?.itemId === item.id;
    
    const currentRoundNum = isSystemChoice ? systemStep.round : (logs.length + 1);

    const currentSetTarget = item.set_targets?.find(t => t.set === currentRoundNum) || null;
    const targetWeight = currentSetTarget?.weight || item.target_weight;
    const targetReps = currentSetTarget?.reps || item.target_reps;
    const targetRpe = currentSetTarget?.rpe || item.target_rpe;
    const targetTempo = item.tempo;
    const setLabel = currentSetTarget?.label || null;

    const isTimed = item.metric_type === 'DURATION';

    const handleLocalLog = (data) => {
        if (isComplete) return;
        addLogEntry(item.id, blockId, {
            ...data,
            round: currentRoundNum,
            targetWeight,
            targetReps,
            targetRpe
        }, isCircuit);
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
                <div onClick={() => toggleFocus(item.id, blockId)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1, minWidth: 0 }}>
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
                    <h3 style={{ fontSize: '14px', fontWeight: '900', color: isComplete ? '#2ecc71' : '#fff', margin: 0, textTransform: 'uppercase', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
                </div>

                {isActive && item.technique_cues && (
                    <button onClick={() => setShowTechnique(!showTechnique)} style={{ all: 'unset', cursor: 'pointer', padding: '4px' }}>
                        <BookOpen size={14} color={showTechnique ? '#f29b11' : '#444'} />
                    </button>
                )}

                <div onClick={() => toggleFocus(item.id, blockId)} style={{ cursor: 'pointer' }}>
                    {isActive ? <ChevronDown size={14} color={getAccentColor()} /> : <ChevronRight size={14} color="#444" />}
                </div>
            </div>

            {isActive && (
                <div style={{ marginTop: '12px' }}>
                    {showTechnique && item.technique_cues && (
                        <div className="animate-in fade-in slide-in-from-top-1 duration-200" style={{ backgroundColor: 'rgba(242, 155, 17, 0.05)', border: '1px solid rgba(242, 155, 17, 0.1)', borderRadius: '6px', padding: '10px', marginBottom: '12px' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#ccc', fontStyle: 'italic', lineHeight: '1.5' }}>
                                <span style={{ color: '#f29b11', fontWeight: '900', fontStyle: 'normal', fontSize: '9px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Technique Cue:</span>
                                {item.technique_cues}
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
                                    {isTimed ? 'TIME' : 'KG'} <span style={{ color: '#fff', fontSize: '13px', letterSpacing: '0.5px' }}>{targetWeight}</span>
                                </div>
                                <div style={{ fontSize: '11px', fontWeight: '900', color: '#f29b11', textAlign: 'center' }}>
                                    {isTimed ? 'TARGET' : 'REPS'} <span style={{ color: '#fff', fontSize: '13px', letterSpacing: '0.5px' }}>{targetReps}</span>
                                </div>
                                <div style={{ fontSize: '11px', fontWeight: '900', color: '#f29b11', textAlign: 'center' }}>
                                    RPE <span style={{ color: '#fff', fontSize: '13px', letterSpacing: '0.5px' }}>{targetRpe}</span>
                                </div>
                                <div></div>
                            </div>

                            <MetricInput 
                                item={item} 
                                onLog={handleLocalLog} 
                                isComplete={isComplete} 
                                accentColor={getAccentColor()} 
                            />
                        </>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                        {logs.map((log) => (
                            <div key={log.id} style={gridStyle}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '9px', fontWeight: '900', color: '#f29b11', marginBottom: '2px', opacity: 0.5 }}>T: {log.targetWeight || '-'}</div>
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}><input type="text" inputMode="decimal" value={log.weight} onChange={(e) => updateLogEntry(item.id, log.id, 'weight', e.target.value)} style={logInputStyle} /></div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '9px', fontWeight: '900', color: '#f29b11', marginBottom: '2px', opacity: 0.5 }}>T: {log.targetReps || '-'}</div>
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}><input type="text" inputMode="decimal" value={log.reps} onChange={(e) => updateLogEntry(item.id, log.id, 'reps', e.target.value)} style={logInputStyle} /></div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '9px', fontWeight: '900', color: '#f29b11', marginBottom: '2px', opacity: 0.5 }}>T: {log.targetRpe || '-'}</div>
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}><input type="text" inputMode="decimal" value={log.rpe} onChange={(e) => updateLogEntry(item.id, log.id, 'rpe', e.target.value)} style={{ ...logInputStyle, color: '#2ecc71' }} /></div>
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