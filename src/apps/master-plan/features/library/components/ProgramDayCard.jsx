import React from 'react';
import { Play, ChevronRight } from 'lucide-react';
import { formatSnapshot } from '../../../shared/utils/formatting.jsx';

export const ProgramDayCard = ({
    day,
    recommendedDayId,
    selectedDayId,
    setSelectedDay,
    startSession,
    onNavigate,
    retroactiveDate
}) => {
    const isRecommended = day.id === recommendedDayId;
    const isSelected = day.id === selectedDayId;
    const lastDone = day.last_session ? new Date(day.last_session.end_time).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase() : 'NEVER';
    const preview = day.exercisePreview || [];
    
    return (
        <div 
            onClick={() => setSelectedDay(day.id)} 
            className={`premium-card ${isRecommended && !isSelected ? 'animate-breathe-orange' : ''}`} 
            style={{ 
                padding: '0', 
                overflow: 'hidden',
                cursor: 'pointer', 
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                borderColor: isSelected ? '#f29b11' : isRecommended ? '#f29b1144' : '#222',
                backgroundColor: isSelected ? 'rgba(242, 155, 17, 0.05)' : '#1a1a1a',
                height: 'fit-content'
            }}
        >
            <div style={{ padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '15px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '9px', fontWeight: '900', color: isSelected ? '#f29b11' : '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            DAY {day.sequence_number}
                        </span>
                        {isRecommended && <span style={{ fontSize: '8px', fontWeight: '900', backgroundColor: '#f29b11', color: '#000', padding: '1px 5px', borderRadius: '3px' }}>REC</span>}
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '900', margin: 0, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
                        {day.label}
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '8px', fontWeight: '900', color: '#444' }}>LAST</span>
                            <span style={{ fontSize: '11px', fontWeight: '900', color: day.last_session ? '#2ecc71' : '#444' }}>{lastDone}</span>
                        </div>
                        {preview.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <span style={{ fontSize: '8px', fontWeight: '900', color: '#444' }}>SCOPE</span>
                                <span style={{ fontSize: '11px', color: '#888', fontWeight: '900' }}>{preview.length} EX</span>
                            </div>
                        )}
                    </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isSelected ? (
                        <button 
                            onClick={(e) => { e.stopPropagation(); startSession(day.id, retroactiveDate).then(() => onNavigate('session')); }} 
                            style={{ all: 'unset', backgroundColor: '#f29b11', color: '#000', width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
                            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <Play size={20} fill="currentColor" style={{ marginLeft: '2px' }} />
                        </button>
                    ) : (
                        <ChevronRight size={20} color={isRecommended ? '#f29b1188' : '#333'} />
                    )}
                </div>
            </div>

            {isSelected && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300" style={{ padding: '0 15px 15px 15px' }}>
                    <div style={{ borderTop: '1px solid #222', paddingTop: '15px' }}>
                        {preview.length === 0 ? (
                            <p style={{ fontSize: '10px', color: '#444', fontWeight: '900', textAlign: 'center', letterSpacing: '1px' }}>
                                NO TARGETS PRESCRIBED
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {preview.map((ex, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '12px', color: '#fff', fontWeight: '900', textTransform: 'uppercase' }}>{ex.name}</div>
                                            {ex.snapshot && <div style={{ opacity: 0.6 }}>{formatSnapshot(ex.snapshot)}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};