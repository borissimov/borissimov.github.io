import React from 'react';
import { Check } from 'lucide-react';
import '../../shared-premium.css';

export const ExerciseRow = ({ 
    exercise, 
    setNumber, 
    roundNumber, 
    isLogged, 
    onLog, 
    actualData = {}
}) => {
    const isCardio = exercise.type === 'Cardio' || 
                     ['Running', 'Biking', 'Swimming', 'Walking'].some(v => exercise.name.includes(v));

    return (
        <div style={{ 
            backgroundColor: isLogged ? '#161d16' : '#1a1a1a',
            padding: '12px 10px',
            borderRadius: '0',
            borderBottom: '1px solid #333',
            marginBottom: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            {/* Header Row: Name + Targets */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                gap: '10px'
            }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <span style={{ 
                        fontSize: '9px', 
                        fontWeight: '900', 
                        padding: '2px 6px', 
                        backgroundColor: isLogged ? '#2ecc71' : '#333',
                        color: isLogged ? '#000' : '#888',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        flexShrink: 0
                    }}>
                        {roundNumber ? `R${roundNumber}` : `S${setNumber}`}
                    </span>
                    <h3 style={{ 
                        fontSize: '14px', 
                        fontWeight: '900', 
                        color: '#fff', 
                        margin: 0, 
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {exercise.name}
                    </h3>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    {!isCardio ? (
                        <>
                            <TargetItem label="KG" value={exercise.target_weight} />
                            <TargetItem label="REPS" value={exercise.target_reps} />
                            <TargetItem label="RPE" value={exercise.target_rpe} />
                        </>
                    ) : (
                        <>
                            <TargetItem label="TIME" value={exercise.target_time} />
                            <TargetItem label="INT" value={exercise.target_intensity} />
                        </>
                    )}
                </div>
            </div>

            {/* Input Row */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {!isCardio ? (
                    <>
                        <input type="number" className="premium-input" style={{ height: '38px', fontSize: '16px', flex: 1.2 }} placeholder="Kg" />
                        <input type="number" className="premium-input" style={{ height: '38px', fontSize: '16px', flex: 1 }} placeholder="R" />
                        <input type="number" className="premium-input" style={{ height: '38px', fontSize: '16px', flex: 1, borderStyle: 'dashed' }} placeholder="RPE" />
                    </>
                ) : (
                    <>
                        <input type="text" className="premium-input" style={{ height: '38px', fontSize: '16px', flex: 1.5 }} placeholder="Time" />
                        <input type="number" className="premium-input" style={{ height: '38px', fontSize: '16px', flex: 1 }} placeholder="HR" />
                    </>
                )}

                <button 
                    onClick={() => onLog({})}
                    style={{ 
                        all: 'unset', cursor: 'pointer', flexShrink: 0,
                        backgroundColor: isLogged ? '#2ecc71' : '#222',
                        color: isLogged ? '#000' : '#f29b11',
                        width: '44px', height: '38px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '10px', border: isLogged ? 'none' : '1px solid #333'
                    }}
                >
                    <Check size={20} strokeWidth={4} />
                </button>
            </div>
        </div>
    );
};

const TargetItem = ({ label, value }) => {
    if (!value) return null;
    return (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            <span style={{ fontSize: '8px', fontWeight: '900', color: '#f29b11', textTransform: 'uppercase' }}>{label}:</span>
            <span style={{ fontSize: '12px', fontWeight: '900', color: '#fff' }}>{value}</span>
        </div>
    );
};
