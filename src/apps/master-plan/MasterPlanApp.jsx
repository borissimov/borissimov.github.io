import React, { useEffect, useState, useMemo } from 'react';
import { useProgramStore } from './stores/useProgramStore';

// Shared
import { useSessionTimer } from './shared/hooks/useSessionTimer';
import { useDraggableScroll } from './shared/hooks/useDraggableScroll';
import { getProgressColor } from './shared/utils/formatting.jsx';
import { SessionModals } from './shared/components/SessionModals';

// Features
import { LibraryView } from './features/library/LibraryView';
import { SessionView } from './features/session/SessionView';
import { MasterAgendaView } from './features/agenda/MasterAgendaView';
import { ProgramEditorView } from './features/builder/ProgramEditorView';

import '../shared-premium.css';

const MasterPlanApp = ({ onExit, currentView, onNavigate, navState }) => {
    const { 
        activeSession, startSession, finishSession, resetStore, fetchProgramManifest, programDays, recommendedDayId, selectedDayId, setSelectedDay, isLoading,
        activeHistorySession, fetchSessionDetails,
        globalHistory, fetchGlobalHistory, uniqueExercises, fetchUniqueExercises,
        retroactiveDate, deleteSessionRecord,
        lastView, setLastView,
        getSessionProgress, getWorkoutLabel, getHistoryStats, getActivitiesForDate
    } = useProgramStore();

    // 1. Hooks
    const elapsed = useSessionTimer(activeSession, retroactiveDate);

    // 2. Local UI State (Global Overlays)
    const [showAbandonModal, setShowAbandonModal] = useState(false);
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // 3. Derived State (Moved to Store Modules)
    const { percent: globalPercent } = getSessionProgress();
    const workoutLabel = getWorkoutLabel();
    const stats = getHistoryStats();

    // 4. Effects
    useEffect(() => {
        if (!activeSession && (programDays.length === 0 || currentView === 'library')) fetchProgramManifest();
        if (currentView === 'master-agenda' || (currentView === null && lastView === 'master-agenda')) { 
            fetchGlobalHistory(); 
            fetchUniqueExercises(); 
        }
    }, [currentView, lastView, activeSession, fetchProgramManifest, fetchGlobalHistory, fetchUniqueExercises]);

    // Track last relevant view
    useEffect(() => {
        if (currentView && currentView !== 'session' && currentView !== 'builder') {
            setLastView(currentView);
        }
        // Always collapse library cards on entry
        if (currentView === 'library') {
            setSelectedDay(null);
        }
    }, [currentView, setLastView, setSelectedDay]);

    // 5. Handlers
    const handleAbandonSession = () => { resetStore(); setShowAbandonModal(false); onNavigate(null); };
    const handleFinalizeSession = async () => {
        setIsSaving(true);
        try { await finishSession(); setShowFinishModal(false); onNavigate('master-agenda'); } 
        catch (e) { alert("Error saving: " + e.message); } 
        finally { setIsSaving(false); }
    };
    const handleDeleteLog = async () => {
        setIsDeleting(true);
        try { await deleteSessionRecord(confirmDeleteId); setConfirmDeleteId(null); } 
        catch (e) { alert("Delete failed: " + e.message); } 
        finally { setIsDeleting(false); }
    };
    
    // Logic for preparing a retroactive log
    const handlePrepareActivity = (selectedDate) => {
        const isToday = selectedDate.toDateString() === new Date().toDateString();
        useProgramStore.setState({ retroactiveDate: isToday ? null : selectedDate.toISOString() });
        onNavigate('library');
    };

    const handleExportJson = (logId) => {
        const session = activeHistorySession;
        if (!session || session.id !== logId) return;

        const durationMinutes = session.start_time 
            ? Math.round((new Date(session.end_time) - new Date(session.start_time)) / 60000)
            : 'Unknown';

        const exportData = {
            mission_brief_for_ai: "Analyze this training session. Compare actual Weight/Reps/RPE against targets. Identify performance leakage in tempo or duration. Determine if progressive overload was achieved. Calculate an approximated Kkal burn for the entire session based on tonnage and intensity. Suggest specific weight/rep adjustments for the next encounter.",
            session_metadata: {
                label: session.program_days?.label || 'Activity',
                date: new Date(session.end_time).toLocaleDateString(),
                start_time: session.start_time,
                end_time: session.end_time,
                duration_minutes: durationMinutes
            },
            exercise_data: session.groupedLogs.map(group => ({
                exercise_name: group.name,
                targets: group.targets,
                actual_sets: group.sets.map(s => ({
                    weight: s.weight,
                    reps: s.reps,
                    rpe: s.rpe,
                    set_number: s.set_number
                }))
            }))
        };

        const dateObj = new Date(session.end_time);
        const yy = String(dateObj.getFullYear()).slice(-2);
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const workoutName = (session.program_days?.label || 'Workout').replace(/\s+/g, '_');
        const fileName = `${yy}.${mm}.${dd}-${workoutName}.json`;

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 6. Navigation Router
    const renderView = () => {
        const effectiveView = currentView || lastView;

        if (currentView === 'session' && activeSession) {
            return (
                <SessionView 
                    onNavigate={onNavigate}
                    activeSession={activeSession}
                    workoutLabel={workoutLabel}
                    elapsed={elapsed}
                    retroactiveDate={retroactiveDate}
                    globalPercent={globalPercent}
                    setShowAbandonModal={setShowAbandonModal}
                    setShowFinishModal={setShowFinishModal}
                    lastView={lastView}
                />
            );
        }

        if (currentView === 'builder') {
            return (
                <ProgramEditorView 
                    onNavigate={onNavigate}
                    navState={navState}
                />
            );
        }

        if (effectiveView === 'master-agenda') {
            return (
                <MasterAgendaView 
                    onExit={onExit}
                    onNavigate={onNavigate}
                    onLogActivity={handlePrepareActivity}
                    handleExportJson={handleExportJson}
                    setConfirmDeleteId={setConfirmDeleteId}
                    activeSession={activeSession}
                    workoutLabel={workoutLabel}
                    elapsed={elapsed}
                    setShowAbandonModal={setShowAbandonModal}
                />
            );
        }

        return (
            <LibraryView 
                onExit={onExit}
                onNavigate={onNavigate}
                activeSession={activeSession}
                workoutLabel={workoutLabel}
                elapsed={elapsed}
                programDays={programDays}
                recommendedDayId={recommendedDayId}
                selectedDayId={selectedDayId}
                setSelectedDay={setSelectedDay}
                startSession={startSession}
                setShowAbandonModal={setShowAbandonModal}
                retroactiveDate={retroactiveDate}
            />
        );
    };

    return (
        <div className="master-plan-orchestrator">
            <SessionModals 
                showAbandonModal={showAbandonModal}
                setShowAbandonModal={setShowAbandonModal}
                handleAbandonSession={handleAbandonSession}
                showFinishModal={showFinishModal}
                setShowFinishModal={setShowFinishModal}
                handleFinalizeSession={handleFinalizeSession}
                isSaving={isSaving}
                globalPercent={globalPercent}
                confirmDeleteId={confirmDeleteId}
                setConfirmDeleteId={setConfirmDeleteId}
                handleDeleteLog={handleDeleteLog}
                isDeleting={isDeleting}
            />
            {renderView()}
        </div>
    );
};

export default MasterPlanApp;