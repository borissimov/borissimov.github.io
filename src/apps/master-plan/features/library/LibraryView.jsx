import React, { useState } from 'react';
import { LayoutGrid, History, X, PlusCircle, ChevronDown, Check, Edit2, Archive, AlertTriangle, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { ProgramDayCard } from './components/ProgramDayCard';
import { useProgramStore } from '../../stores/useProgramStore';

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
    const { programs, activeProgramId, setActiveProgramId, archiveProgram, unarchiveProgram, showArchivedPrograms, setShowArchivedPrograms } = useProgramStore();
    const [showSwitcher, setShowSwitcher] = useState(false);
    const [programToArchive, setProgramToArchive] = useState(null);

    const activeProgram = programs.find(p => p.id === activeProgramId);

    const handleConfirmArchive = async () => {
        if (programToArchive) {
            await archiveProgram(programToArchive.id);
            setProgramToArchive(null);
        }
    };

    return (
        <div className="app-container-v2" style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
            <header style={{ display: 'flex', alignItems: 'center', height: '54px', gap: '10px' }}>
                <button onClick={onExit} style={{ all: 'unset', cursor: 'pointer', padding: '10px 5px' }} title="Back to Portal"><LayoutGrid size={24} color="#f29b11" /></button>
                
                <div 
                    onClick={() => setShowSwitcher(!showSwitcher)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                >
                    <h1 style={{ fontSize: '16px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {activeProgram?.name || 'SELECT PROGRAM'}
                    </h1>
                    <ChevronDown size={16} color="#f29b11" style={{ transform: showSwitcher ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>

                <button onClick={() => onNavigate('master-agenda')} style={{ all: 'unset', cursor: 'pointer', padding: '10px 5px' }} title="Switch to Master Agenda"><History size={24} color="#f29b11" /></button>
            </header>

            {/* PROGRAM SWITCHER OVERLAY */}
            {showSwitcher && (
                <div 
                    style={{ position: 'absolute', top: '54px', left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1000, padding: '20px', display: 'flex', flexDirection: 'column' }}
                    onClick={() => setShowSwitcher(false)}
                >
                    <div className="animate-in slide-in-from-top-4 duration-200" style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
                        <p style={{ fontSize: '10px', fontWeight: '900', color: '#666', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Your Programs:</p>
                        {programs.map(prog => {
                            const isArchived = !!prog.archived_at;
                            return (
                                <div 
                                    key={prog.id}
                                    onClick={(e) => { 
                                        if (isArchived) return; // Prevent selection of archived ones without restore
                                        e.stopPropagation(); 
                                        setActiveProgramId(prog.id); 
                                        setShowSwitcher(false); 
                                    }}
                                    style={{ 
                                        padding: '12px 15px', 
                                        backgroundColor: activeProgramId === prog.id ? 'rgba(242, 155, 17, 0.1)' : '#111', 
                                        borderRadius: '8px', 
                                        border: activeProgramId === prog.id ? '1px solid #f29b11' : '1px solid #222',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        opacity: isArchived ? 0.4 : 1
                                    }}
                                >
                                    <span style={{ fontSize: '13px', fontWeight: '900', color: activeProgramId === prog.id ? '#f29b11' : '#fff', textTransform: 'uppercase', flex: 1 }}>
                                        {prog.name} {isArchived && "(ARCHIVED)"}
                                    </span>
                                    
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        {!isArchived ? (
                                            <>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onNavigate('builder', { programId: prog.id }); }}
                                                    style={{ all: 'unset', opacity: 0.6, cursor: 'pointer' }}
                                                >
                                                    <Edit2 size={16} color="#fff" />
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setProgramToArchive(prog); }}
                                                    style={{ all: 'unset', opacity: 0.6, cursor: 'pointer' }}
                                                >
                                                    <Archive size={16} color="#ef4444" />
                                                </button>
                                            </>
                                        ) : (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); unarchiveProgram(prog.id); }}
                                                style={{ all: 'unset', opacity: 0.8, cursor: 'pointer' }}
                                                title="Restore Program"
                                            >
                                                <RotateCcw size={16} color="#2ecc71" />
                                            </button>
                                        )}
                                        {activeProgramId === prog.id && !isArchived && <Check size={16} color="#f29b11" />}
                                    </div>
                                </div>
                            );
                        })}
                        
                        <div 
                            onClick={(e) => { e.stopPropagation(); onNavigate('builder'); }}
                            style={{ padding: '15px', border: '1px dashed #f29b1144', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', cursor: 'pointer' }}
                        >
                            <PlusCircle size={18} color="#f29b11" />
                            <span style={{ fontSize: '12px', fontWeight: '900', color: '#f29b11', textTransform: 'uppercase' }}>Create New Program</span>
                        </div>
                    </div>

                    {/* FOOTER TOGGLE */}
                    <div style={{ padding: '20px 0', borderTop: '1px solid #222', marginTop: 'auto' }}>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setShowArchivedPrograms(!showArchivedPrograms); }}
                            style={{ all: 'unset', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: '0 auto' }}
                        >
                            {showArchivedPrograms ? <EyeOff size={14} color="#666" /> : <Eye size={14} color="#666" />}
                            <span style={{ fontSize: '10px', fontWeight: '900', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {showArchivedPrograms ? "Hide Archived" : "Show Archived Programs"}
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {/* ARCHIVE CONFIRMATION MODAL */}
            {programToArchive && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                        <AlertTriangle size={48} color="#ef4444" style={{ margin: '0 auto 15px' }} />
                        <h2 style={{ fontSize: '18px', fontWeight: '900', margin: '0 0 10px' }}>ARCHIVE PROGRAM?</h2>
                        <p style={{ fontSize: '14px', color: '#888', margin: '0 0 20px', lineHeight: '1.5' }}>
                            This will remove "{programToArchive.name}" from your library. <br/>
                            <span style={{ color: '#fff' }}>Your historical training data will be preserved.</span>
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={() => setProgramToArchive(null)}
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #333', backgroundColor: 'transparent', color: '#fff', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmArchive}
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: '#fff', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}
                            >
                                Archive
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeSession && (
                <div style={{ backgroundColor: 'transparent', border: '1px solid #2ecc71', padding: '12px', borderRadius: '8px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div onClick={() => onNavigate('session')} style={{ flex: 1, cursor: 'pointer' }}><p style={{ fontSize: '10px', fontWeight: '900', color: '#2ecc71', textTransform: 'uppercase', margin: 0 }}>Active Session in Progress</p><p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{workoutLabel} • {elapsed}</p></div>
                    <button onClick={() => setShowAbandonModal(true)} style={{ all: 'unset', padding: '10px', cursor: 'pointer', opacity: 0.6 }}><X size={20} color="#ef4444" /></button>
                </div>
            )}

            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {programDays.length === 0 ? (
                        <div style={{ padding: '40px 20px', textAlign: 'center', opacity: 0.5 }}>
                            <p style={{ fontSize: '12px', fontWeight: '800' }}>NO TRAINING DAYS DEFINED FOR THIS PROGRAM</p>
                        </div>
                    ) : programDays.map((day) => (
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