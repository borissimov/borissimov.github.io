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

    return (
        <div style={{ padding: '0 0 4px 0', marginBottom: '8px' }}>
            {/* Header: Name + Targets on the SAME LINE */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'baseline', 
                marginBottom: '2px',
                borderBottom: '1px solid #222',
                paddingBottom: '2px'
            }}>
                <h3 style={{ 
                    fontSize: '14px', 
                    fontWeight: '900', 
                    color: '#fff', 
                    margin: 0, 
                    textTransform: 'uppercase',
                    letterSpacing: '-0.5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flex: 1,
                    marginRight: '10px'
                }}>
                    {exercise.name}
                </h3>
                
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <TargetItem label="KG" value={exercise.target_weight} />
                    <TargetItem label="REPS" value={exercise.target_reps} />
                    <TargetItem label="RPE" value={exercise.target_rpe} />
                    <TargetItem label="TEMPO" value={exercise.target_tempo} />
                </div>
            </div>

            {/* Progress: 1 / 3 SETS - Tightened gap above/below */}
            <div style={{ textAlign: 'center', marginBottom: '2px', display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>
                    {currentSetNum > totalSets ? totalSets : currentSetNum}
                </span>
                <span style={{ fontSize: '24px', fontWeight: '900', color: '#fff', opacity: 0.2 }}>/</span>
                <span style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>
                    {totalSets}
                </span>
                <span style={{ fontSize: '9px', fontWeight: '900', color: '#f29b11', textTransform: 'uppercase', letterSpacing: '1px', marginLeft: '2px' }}>
                    SETS
                </span>
            </div>

            {/* Active Input Row - Minimized margins */}
            {loggedSets.length < totalSets && (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '2px' }}>
                    <input type="number" className="premium-input" style={{ height: '36px', fontSize: '16px', flex: 1.2 }} placeholder="Kg" />
                    <input type="number" className="premium-input" style={{ height: '36px', fontSize: '16px', flex: 1 }} placeholder="R" />
                    <input type="number" className="premium-input" style={{ height: '36px', fontSize: '16px', flex: 1, borderStyle: 'dashed' }} placeholder="RPE" />
                    <button 
                        onClick={handleLog}
                        style={{ 
                            all: 'unset', cursor: 'pointer', backgroundColor: '#222', color: '#f29b11',
                            width: '44px', height: '36px', display: 'flex', alignItems: 'center', 
                            justifyContent: 'center', borderRadius: '8px', border: '1px solid #333'
                        }}
                    >
                        <Check size={20} strokeWidth={4} />
                    </button>
                </div>
            )}

            {/* Previous Logs - Growing downwards with zero bottom margin on container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                {loggedSets.map((log, i) => (
                    <div key={log.id} style={{ 
                        display: 'flex', justifyContent: 'space-between', padding: '4px 12px', 
                        backgroundColor: '#161d16', borderRadius: '6px', border: '1px solid #2ecc7111'
                    }}>
                        <span style={{ fontSize: '8px', fontWeight: '900', color: '#2ecc71', textTransform: 'uppercase' }}>SET {i+1}</span>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '900', color: '#fff' }}>{log.weight}kg</span>
                            <span style={{ fontSize: '11px', fontWeight: '900', color: '#fff' }}>{log.reps} reps</span>
                            <span style={{ fontSize: '11px', fontWeight: '900', color: '#2ecc71' }}>RPE {log.rpe}</span>
                        </div>
                        <Check size={10} color="#2ecc71" strokeWidth={3} />
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