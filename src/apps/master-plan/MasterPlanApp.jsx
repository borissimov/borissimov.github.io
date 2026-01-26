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
        sessionHistory, fetchDayHistory, activeHistorySession, fetchSessionDetails,
        globalHistory, fetchGlobalHistory, uniqueExercises, fetchUniqueExercises, activeExerciseHistory, fetchExerciseHistory,
        retroactiveDate, deleteSessionRecord, dailyVolumes,
        lastView, setLastView
    } = useProgramStore();

    // 1. Hooks
    const elapsed = useSessionTimer(activeSession, retroactiveDate);
    const { scrollerRef, scrollHandlers, dragMoved } = useDraggableScroll();

    // 2. Local UI State
    const [showAbandonModal, setShowAbandonModal] = useState(false);
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [historyTab, setHistoryTab] = useState('timeline');
    const [isGridExpanded, setIsGridExpanded] = useState(false);
    const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
    const [expandedActivityId, setExpandedActivityId] = useState(null);

    // 3. Derived State
    const scrollerDates = useMemo(() => {
        const dates = [];
        const start = new Date();
        start.setDate(start.getDate() - 14); 
        for (let i = 0; i < 28; i++) { 
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            dates.push(d);
        }
        return dates;
    }, []);

    const activitiesOnSelectedDate = useMemo(() => {
        return globalHistory.filter(s => {
            // Standardize both to YYYY-MM-DD for comparison
            const dateStr = new Date(s.end_time).toLocaleDateString('en-CA'); // en-CA gives YYYY-MM-DD
            const selectedStr = selectedCalendarDate.toLocaleDateString('en-CA');
            return dateStr === selectedStr;
        });
    }, [globalHistory, selectedCalendarDate]);

    const stats = useMemo(() => {
        const today = new Date();
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toDateString();
        });
        
        const weekCount = globalHistory.filter(s => {
            const date = new Date(s.end_time).toDateString();
            return last7Days.includes(date);
        }).length;

        let streak = 0;
        let checkDate = new Date();
        const todayHasLog = globalHistory.some(s => new Date(s.end_time).toDateString() === checkDate.toDateString());
        if (!todayHasLog) checkDate.setDate(checkDate.getDate() - 1);

        while (true) {
            const hasActivity = globalHistory.some(s => new Date(s.end_time).toDateString() === checkDate.toDateString());
            if (hasActivity) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else break;
        }
        return { streak, weekCount };
    }, [globalHistory]);

    const globalStats = useMemo(() => {
        return activeSession?.blocks?.reduce((acc, block) => {
            (block.items || []).forEach(item => {
                const target = parseInt(item.target_sets || 3);
                const logged = (activeSession?.logs[item.id] || []).length;
                acc.totalTarget += target;
                acc.totalLogged += Math.min(logged, target);
            });
            return acc;
        }, { totalTarget: 0, totalLogged: 0 }) || { totalTarget: 0, totalLogged: 0 };
    }, [activeSession]);

    const globalPercent = globalStats.totalTarget > 0 ? (globalStats.totalLogged / globalStats.totalTarget) * 100 : 0;
    const workoutLabel = programDays.find(d => d.id === activeSession?.program_day_id)?.label || 'Activity';

    // 4. Effects
    useEffect(() => {
        if (!activeSession && programDays.length === 0) fetchProgramManifest();
        if (currentView === 'master-agenda' || (currentView === null && lastView === 'master-agenda')) { 
            fetchGlobalHistory(); 
            fetchUniqueExercises(); 
        }
    }, [currentView, lastView, activeSession, fetchProgramManifest, fetchGlobalHistory, fetchUniqueExercises]);

    useEffect(() => {
        setExpandedActivityId(null);
    }, [selectedCalendarDate]);

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
    
    // Updated to navigate to library with context
    const handlePrepareActivity = () => {
        const isToday = selectedCalendarDate.toDateString() === new Date().toDateString();
        useProgramStore.setState({ retroactiveDate: isToday ? null : selectedCalendarDate.toISOString() });
        onNavigate('library');
    };

    const handleToggleActivityExpansion = (sessionId) => {
        if (expandedActivityId === sessionId) setExpandedActivityId(null);
        else { setExpandedActivityId(sessionId); fetchSessionDetails(sessionId); }
    };

    const handleExportJson = (sessionId) => {
        const session = activeHistorySession;
        if (!session || session.id !== sessionId) return;

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

    const getDateStyle = (dateObj) => {
        if (!dateObj) return {};
        const isToday = dateObj.toDateString() === new Date().toDateString();
        const hasActivity = globalHistory.some(s => new Date(s.end_time).toDateString() === dateObj.toDateString());
        return { color: isToday ? '#2ecc71' : hasActivity ? '#f29b11' : '#666', fontWeight: isToday ? '900' : '800' };
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
                    globalHistory={globalHistory}
                    stats={stats}
                    selectedCalendarDate={selectedCalendarDate}
                    setSelectedCalendarDate={setSelectedCalendarDate}
                    isGridExpanded={isGridExpanded}
                    setIsGridExpanded={setIsGridExpanded}
                    historyTab={historyTab}
                    setHistoryTab={setHistoryTab}
                    scrollerRef={scrollerRef}
                    scrollerDates={scrollerDates}
                    scrollHandlers={scrollHandlers}
                    activitiesOnSelectedDate={activitiesOnSelectedDate}
                    handleToggleActivityExpansion={handleToggleActivityExpansion}
                    handleExportJson={handleExportJson}
                    setConfirmDeleteId={setConfirmDeleteId}
                    programDays={programDays}
                    handlePrepareActivity={handlePrepareActivity}
                    isLoading={isLoading}
                    activeHistorySession={activeHistorySession}
                    getDateStyle={getDateStyle}
                    expandedActivityId={expandedActivityId}
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