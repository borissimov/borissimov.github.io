import { useState, useEffect, useCallback, useRef } from 'react';
import { DataManager } from '../../../data/DataManager';
import { usePlan } from '../../../context/PlanContext';

export const useTrainingLogic = (dayKey, exercises) => {
    const { session, weekDates, logExerciseSet, deleteExerciseSet } = usePlan();
    const [dayLogs, setDayLogs] = useState({});
    const [checkedState, setCheckedState] = useState({});
    
    // In-memory cache to prevent flickering on rapid switching
    const logCache = useRef({});
    const statusCache = useRef({});

    // 1. Fetch Logs & Status
    useEffect(() => {
        const loadLogs = async () => {
            const targetDate = weekDates[dayKey]?.fullDate;
            if (!targetDate) return;

            // HIT CACHE
            if (logCache.current[targetDate]) {
                setDayLogs(logCache.current[targetDate]);
                if (statusCache.current[targetDate]) {
                    setCheckedState(statusCache.current[targetDate]);
                }
                // Optional: Background refresh if needed, but for now trust cache + mutation updates
            } else {
                // MISS - Fetch
                if (session?.user?.id && exercises) {
                    // Sync Logs
                    const syncedLogs = await DataManager.syncLogsForDay(session.user.id, dayKey, exercises, targetDate);
                    logCache.current[targetDate] = syncedLogs;
                    setDayLogs(syncedLogs);
                    
                    // Sync Checkmarks Status
                    const completedIndices = await DataManager.syncExerciseStatus(session.user.id, targetDate);
                    const dbMap = {};
                    completedIndices.forEach(i => dbMap[i] = true);
                    
                    // Merge with local state
                    const local = JSON.parse(localStorage.getItem(`training_state_${dayKey}`) || '[]');
                    const localMap = {};
                    local.forEach(i => localMap[i] = true);
                    const finalState = { ...localMap, ...dbMap };
                    
                    statusCache.current[targetDate] = finalState;
                    setCheckedState(finalState);
                } else {
                    // Fallback to local
                    const localLogs = JSON.parse(localStorage.getItem(`training_logs_${dayKey}`) || '{}');
                    setDayLogs(localLogs);
                    
                    const savedChecks = JSON.parse(localStorage.getItem(`training_state_${dayKey}`) || '[]');
                    const checkMap = {};
                    savedChecks.forEach(idx => checkMap[idx] = true);
                    setCheckedState(checkMap);
                }
            }
        };
        loadLogs();
    }, [dayKey, exercises, session, weekDates]);

    // 2. Handlers
    const toggleExerciseCheck = useCallback((idx) => {
        const targetDate = weekDates[dayKey]?.fullDate;
        
        setCheckedState(prev => {
            const newState = !prev[idx];
            const currentArr = JSON.parse(localStorage.getItem(`training_state_${dayKey}`) || '[]');
            let newArr;
            if (newState) { 
                if (!currentArr.includes(idx)) newArr = [...currentArr, idx]; 
                else newArr = currentArr; 
            } else { 
                newArr = currentArr.filter(i => i !== idx); 
            } 
            localStorage.setItem(`training_state_${dayKey}`, JSON.stringify(newArr));
            
            // DB Update
            if (session?.user?.id && targetDate) {
                 DataManager.saveExerciseStatus(session.user.id, targetDate, dayKey, idx, newState);
            }
            
            const nextState = { ...prev, [idx]: newState };
            if (targetDate) statusCache.current[targetDate] = nextState;
            return nextState;
        });
    }, [dayKey, session, weekDates]);

    const addSet = useCallback(async (idx, weight, reps, rpe, exerciseName, focus, defaults, tempo, duration, intensity) => {
        const targetDate = weekDates[dayKey]?.fullDate || new Date().toISOString().split('T')[0];
        const logEntry = { 
            exerciseIndex: idx, 
            exercise: exerciseName, 
            weight, 
            reps, 
            rpe, 
            tempo, 
            duration, 
            intensity, 
            timestamp: new Date().toISOString(), 
            dayKey,
            scheduledDate: targetDate 
        }; 
        
        const savedLog = await logExerciseSet(logEntry);
        
        setDayLogs(prevLogs => {
            const newLogs = { ...prevLogs };
            if (!newLogs[idx]) newLogs[idx] = [];
            newLogs[idx].push(savedLog || logEntry);
            
            // Update Cache
            if (targetDate) logCache.current[targetDate] = newLogs;

            if (defaults.sets > 0 && newLogs[idx].length >= defaults.sets) {
                setTimeout(() => toggleExerciseCheck(idx), 0);
            }
            return newLogs;
        });
    }, [dayKey, weekDates, logExerciseSet, toggleExerciseCheck]);

    const removeSet = useCallback(async (exIdx, setIndex, logId) => {
        await deleteExerciseSet(logId, exIdx, setIndex);
        setDayLogs(prevLogs => {
            const newLogs = { ...prevLogs };
            if (newLogs[exIdx]) {
                newLogs[exIdx].splice(setIndex, 1);
            }
            const targetDate = weekDates[dayKey]?.fullDate;
            if (targetDate) logCache.current[targetDate] = newLogs;
            return newLogs;
        });
    }, [deleteExerciseSet, dayKey, weekDates]);

    const updateSet = useCallback((exIdx, sIdx, updatedData) => {
        setDayLogs(prevLogs => {
            const newLogs = { ...prevLogs };
            if (newLogs[exIdx] && newLogs[exIdx][sIdx]) {
                newLogs[exIdx][sIdx] = { ...newLogs[exIdx][sIdx], ...updatedData };
                localStorage.setItem(`training_logs_${dayKey}`, JSON.stringify(newLogs));
                
                const targetDate = weekDates[dayKey]?.fullDate;
                if (targetDate) logCache.current[targetDate] = newLogs;
            }
            return newLogs;
        });
    }, [dayKey, weekDates]);

    return {
        dayLogs,
        checkedState,
        addSet,
        removeSet,
        updateSet,
        toggleExerciseCheck
    };
};
