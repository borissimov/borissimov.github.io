import React from 'react';
import { LayoutGrid, History, X, Play, ChevronRight } from 'lucide-react';
import { formatSnapshot } from '../../shared/utils/formatting.jsx';

/**
 * Library View: The "Program Library" activity selector.
 */
export const LibraryView = ({
    onExit,
    onNavigate,
    activeSession,
    workoutLabel,
    elapsed,
    programDays,
    recommendedDayId,
    selectedDayId,
    setSelectedDay,
    startSession,
    setShowAbandonModal
}) => {
    return (
        <div className="app-container-v2" style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <header style={{ display: 'flex', alignItems: 'center', height: '54px' }}>
                <button onClick={onExit} style={{ all: 'unset', cursor: 'pointer', padding: '10px 5px' }} title="Back to Portal"><LayoutGrid size={24} color="#f29b11" /></button>
                <h1 style={{ flex: 1, textAlign: 'center', fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>PROGRAM <span style={{ color: '#f29b11' }}>LIBRARY</span></h1>
                <button onClick={() => onNavigate('master-agenda')} style={{ all: 'unset', cursor: 'pointer', padding: '10px 5px' }} title="Switch to Master Agenda"><History size={24} color="#f29b11" /></button>
            </header>

            {activeSession && (
                <div style={{ backgroundColor: 'transparent', border: '1px solid #2ecc71', padding: '12px', borderRadius: '8px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div onClick={() => onNavigate('session')} style={{ flex: 1, cursor: 'pointer' }}><p style={{ fontSize: '10px', fontWeight: '900', color: '#2ecc71', textTransform: 'uppercase', margin: 0 }}>Active Session in Progress</p><p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{workoutLabel} • {elapsed}</p></div>
                    <button onClick={() => setShowAbandonModal(true)} style={{ all: 'unset', padding: '10px', cursor: 'pointer', opacity: 0.6 }}><X size={20} color="#ef4444" /></button>
                </div>
            )}

            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {programDays.map((day) => {
                        const isRecommended = day.id === recommendedDayId;
                        const isSelected = day.id === selectedDayId;
                        const lastDone = day.last_session ? new Date(day.last_session.end_time).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase() : 'NEVER';
                        const preview = day.exercisePreview || [];
                        
                        return (
                            <div key={day.id} onClick={() => setSelectedDay(day.id)} className={isRecommended && !isSelected ? 'animate-breathe-orange' : ''} style={{ backgroundColor: 'transparent', border: '1px solid #222', padding: '10px 15px', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.2s ease', borderLeft: isSelected ? '4px solid #f29b11' : isRecommended ? '4px solid #f29b1188' : '4px solid transparent' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '10px' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <span style={{ fontSize: '10px', fontWeight: '900', color: '#666', textTransform: 'uppercase' }}>Day {day.sequence_number}</span>
                                        <h3 style={{ fontSize: '16px', fontWeight: '900', margin: '1px 0', color: isSelected ? '#f29b11' : '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{day.label}</h3>
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '1px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: '800', color: day.last_session ? '#2ecc71' : '#444' }}>LAST: {lastDone}</span>
                                            {preview.length > 0 && <span style={{ fontSize: '11px', color: '#444', fontWeight: '800' }}>| {preview.length} EX</span>}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {isSelected ? (
                                            <button onClick={(e) => { e.stopPropagation(); startSession(day.id).then(() => onNavigate('session')); }} style={{ all: 'unset', backgroundColor: '#f29b11', color: '#000', padding: '6px 15px', borderRadius: '6px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>Start <Play size={10} fill="currentColor" /></button>
                                        ) : (
                                            <>{isRecommended && <span style={{ fontSize: '9px', fontWeight: '900', backgroundColor: '#f29b1122', color: '#f29b11', padding: '2px 6px', borderRadius: '4px' }}>REC</span>}<ChevronRight size={18} color="#333" /></>
                                        )}
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-200" style={{ marginTop: '15px' }}>
                                        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            {preview.length === 0 ? <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>NO EXERCISES IN MAIN PHASE</p> :
                                             preview.map((ex, i) => (
                                                <div key={i} style={{ padding: '8px 0', borderBottom: i < preview.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                                    <div style={{ fontSize: '13px', color: '#fff', fontWeight: '900', textTransform: 'uppercase' }}>{ex.name}</div>
                                                    {ex.snapshot && <div>{formatSnapshot(ex.snapshot)}</div>}
                                                </div>
                                             ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
