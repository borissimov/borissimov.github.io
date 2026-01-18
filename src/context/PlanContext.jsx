import React, { createContext, useContext } from 'react';
import { DataManager } from '../data/DataManager';
import { useAuth } from '../apps/legacy-tracker/hooks/useAuth';
import { useTimer } from '../apps/legacy-tracker/hooks/useTimer';
import { useChecklist } from '../apps/legacy-tracker/hooks/useChecklist';
import { useRoutine } from '../apps/legacy-tracker/hooks/useRoutine';

const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
    const auth = useAuth();
    const timer = useTimer();
    const routine = useRoutine(auth.session, auth.setLoading);
    const checklist = useChecklist(auth.session, routine.weekDates);

    // Legacy Helpers (used by components)
    const logExerciseSet = React.useCallback(async (entry) => {
        if (!auth.session?.user?.id) return null;
        const targetDate = routine.weekDates[entry.dayKey]?.fullDate;
        const newLog = await DataManager.addLog(auth.session.user.id, { ...entry, dayKey: entry.dayKey, scheduledDate: targetDate });
        const localLogs = DataManager.getTrainingLogs(entry.dayKey);
        const idx = entry.exerciseIndex;
        if (!localLogs[idx]) localLogs[idx] = [];
        localLogs[idx].push(newLog || entry);
        DataManager.saveTrainingLogs(entry.dayKey, localLogs);
        return newLog;
    }, [auth.session?.user?.id, routine.weekDates]);

    const deleteExerciseSet = React.useCallback(async (logId, exerciseIndex, setIndex) => {
        if (logId) await DataManager.deleteLog(logId);
        const localLogs = DataManager.getTrainingLogs(routine.currentDay);
        if (localLogs[exerciseIndex]) {
            localLogs[exerciseIndex].splice(setIndex, 1);
            DataManager.saveTrainingLogs(routine.currentDay, localLogs);
        }
    }, [routine.currentDay]);

    const revertPlan = React.useCallback(async () => {
        if(!auth.session) return;
        auth.setLoading(true);
        await DataManager.revertToDefault(auth.session.user.id);
        // Force reload via routine hook logic or reload page for simplicity in legacy revert
        window.location.reload();
    }, [auth.session, auth.setLoading]);

    const contextValue = React.useMemo(() => ({
        ...auth,
        ...routine,
        ...timer,
        ...checklist,
        logExerciseSet,
        deleteExerciseSet,
        revertPlan,
        daysMap: DataManager.getDaysMap(),
    }), [auth, routine, timer, checklist, logExerciseSet, deleteExerciseSet, revertPlan]);

    return (
        <PlanContext.Provider value={contextValue}>
            {children}
        </PlanContext.Provider>
    );
};

export const usePlan = () => useContext(PlanContext);