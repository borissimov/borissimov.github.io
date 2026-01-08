import React, { createContext, useState, useEffect, useContext } from 'react';
import { DataModule } from '../data/DataModule';
import { supabase } from '../supabaseClient';

const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [planData, setPlanData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentDay, setCurrentDay] = useState('pon');
    const [isEditMode, setIsEditMode] = useState(false);
    
    const [weekOffset, setWeekOffset] = useState(0); 
    const [weekDates, setWeekDates] = useState({});
    const [weekNumber, setWeekNumber] = useState(1);
    const [year, setYear] = useState(2026);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if(session) loadData(session.user.id);
            else setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if(session) loadData(session.user.id);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Helper: Safe Local Date String (YYYY-MM-DD)
    const getLocalDateString = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    // Helper: Get Start of Week (Monday) ensuring Local Time
    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    };

    useEffect(() => {
        const now = new Date();
        // Calculate target "Today" based on offset
        // We use setDate to jump weeks securely
        const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (weekOffset * 7));
        
        const monday = getStartOfWeek(targetDate);

        // ISO Week Number Logic
        const d = new Date(monday);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
        const week1 = new Date(d.getFullYear(), 0, 4);
        const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
        
        setWeekNumber(weekNum);
        setYear(monday.getFullYear());

        const keys = ['pon', 'vto', 'sry', 'che', 'pet', 'sab', 'ned'];
        const datesMap = {};
        
        keys.forEach((key, index) => {
            const current = new Date(monday);
            current.setDate(monday.getDate() + index);
            
            datesMap[key] = {
                dateObj: current,
                label: current.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
                fullDate: getLocalDateString(current)
            };
        });
        setWeekDates(datesMap);

        if (weekOffset === 0) {
            const dayKeyIndex = (now.getDay() === 0) ? 6 : now.getDay() - 1;
            setCurrentDay(keys[dayKeyIndex]);
        } else {
            setCurrentDay('pon');
        }

    }, [weekOffset]);

    const loadData = async (userId) => {
        setLoading(true);
        const data = await DataModule.loadPlan(userId);
        setPlanData(data);
        setLoading(false);
    };

    const updateSection = async (dayKey, sectionName, sectionData) => {
        if (!planData || !session) return;
        const optimistic = { ...planData };
        optimistic[dayKey][sectionName] = sectionData;
        setPlanData(optimistic);
        const refreshedData = await DataModule.updateSection(session.user.id, dayKey, sectionName, sectionData);
        if (refreshedData) setPlanData(refreshedData);
    };

    const updateTraining = (dayKey, newData) => updateSection(dayKey, 'training', newData);

    const revertPlan = async () => {
        if(!session) return;
        setLoading(true);
        const refreshedData = await DataModule.revertToDefault(session.user.id);
        if(refreshedData) setPlanData(refreshedData);
        setLoading(false);
    };

    const logExerciseSet = async (entry) => {
        if (!session?.user?.id) return null;
        
        // Use the explicitly calculated date from our map
        // This ensures the log is attached to the day visible in the UI
        const targetDate = weekDates[entry.dayKey]?.fullDate;
        
        console.log(`[PlanContext] Logging for ${entry.dayKey}: ${targetDate}`);

        const newLog = await DataModule.addLog(session.user.id, { ...entry, dayKey: entry.dayKey, scheduledDate: targetDate });
        
        const localLogs = DataModule.getTrainingLogs(entry.dayKey);
        const idx = entry.exerciseIndex;
        if (!localLogs[idx]) localLogs[idx] = [];
        localLogs[idx].push(newLog || entry);
        DataModule.saveTrainingLogs(entry.dayKey, localLogs);
        return newLog;
    };

    const deleteExerciseSet = async (logId, exerciseIndex, setIndex) => {
        if (logId) await DataModule.deleteLog(logId);
        const localLogs = DataModule.getTrainingLogs(currentDay);
        if (localLogs[exerciseIndex]) {
            localLogs[exerciseIndex].splice(setIndex, 1);
            DataModule.saveTrainingLogs(currentDay, localLogs);
        }
    };

    const toggleEditMode = () => setIsEditMode(!isEditMode);

    const logout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setPlanData(null);
    };

    const nextWeek = () => setWeekOffset(prev => prev + 1);
    const prevWeek = () => setWeekOffset(prev => prev - 1);

    return (
        <PlanContext.Provider value={{
            session,
            loading,
            planData,
            currentDay,
            setCurrentDay,
            isEditMode,
            toggleEditMode,
            updateSection,
            updateTraining,
            logExerciseSet,
            deleteExerciseSet,
            revertPlan,
            logout, 
            daysMap: DataModule.getDaysMap(),
            weekDates,
            weekOffset,
            weekNumber,
            year,
            nextWeek,
            prevWeek
        }}>
            {children}
        </PlanContext.Provider>
    );
};

export const usePlan = () => useContext(PlanContext);
