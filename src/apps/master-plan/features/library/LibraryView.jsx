import React from 'react';
import { LayoutGrid, History, X } from 'lucide-react';
import { ProgramDayCard } from './components/ProgramDayCard';

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
    setShowAbandonModal,
    retroactiveDate
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
                    {programDays.map((day) => (
                        <ProgramDayCard 
                            key={day.id}
                            day={day}
                            recommendedDayId={recommendedDayId}
                            selectedDayId={selectedDayId}
                            setSelectedDay={setSelectedDay}
                            startSession={startSession}
                            onNavigate={onNavigate}
                            retroactiveDate={retroactiveDate}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};