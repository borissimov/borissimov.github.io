import React, { useState } from 'react';
import { ProgramDayCard } from './components/ProgramDayCard';
import { useProgramStore } from '../../stores/useProgramStore';

// Components
import { LibraryHeader } from './components/LibraryHeader';
import { ProgramSwitcher } from './components/ProgramSwitcher';
import { ArchiveModal } from './components/ArchiveModal';
import { ActiveSessionBanner } from '../../shared/components/ActiveSessionBanner';

/**
 * Library View: The "Program Library" activity selector.
 * Refactored into Orchestrator Pattern.
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
    const { 
        programs, activeProgramId, setActiveProgramId, 
        archiveProgram, unarchiveProgram, 
        showArchivedPrograms, setShowArchivedPrograms 
    } = useProgramStore();
    
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
        <div className="app-container-v2 viewport-constrained">
            <div style={{ padding: '0 10px', borderBottom: '1px solid #222', flexShrink: 0 }}>
                <LibraryHeader 
                    onExit={onExit}
                    onNavigate={onNavigate}
                    onToggleSwitcher={() => setShowSwitcher(!showSwitcher)}
                    activeProgramName={activeProgram?.name}
                    showSwitcher={showSwitcher}
                />
            </div>

            {showSwitcher && (
                <ProgramSwitcher 
                    programs={programs}
                    activeProgramId={activeProgramId}
                    onSelect={(id) => { setActiveProgramId(id); setShowSwitcher(false); }}
                    onEdit={(id) => onNavigate('builder', { programId: id })}
                    onArchive={(prog) => setProgramToArchive(prog)}
                    onUnarchive={(id) => unarchiveProgram(id)}
                    onCreate={() => onNavigate('builder')}
                    showArchived={showArchivedPrograms}
                    onToggleShowArchived={() => setShowArchivedPrograms(!showArchivedPrograms)}
                    onClose={() => setShowSwitcher(false)}
                />
            )}

            {programToArchive && (
                <ArchiveModal 
                    programName={programToArchive.name}
                    onConfirm={handleConfirmArchive}
                    onCancel={() => setProgramToArchive(null)}
                />
            )}

            {activeSession && (
                <ActiveSessionBanner 
                    onNavigate={onNavigate}
                    onAbandon={() => setShowAbandonModal(true)}
                    workoutLabel={workoutLabel}
                    elapsed={elapsed}
                />
            )}

            <div className="scrollable-content" style={{ paddingBottom: '20px' }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr', 
                    gap: '8px'
                }}>
                    {programDays.length === 0 ? (
                        <div style={{ padding: '40px 20px', textAlign: 'center', opacity: 0.5, gridColumn: '1 / -1' }}>
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
