import { useState, useEffect, useCallback, useRef } from 'react';
import { DataManager } from '../data/DataManager';
import { getStartOfWeek, getLocalDateString } from '../utils/dateUtils';

export const useRoutine = (session, setLoading) => {
    const [planData, setPlanData] = useState(null);
    const [currentDay, setCurrentDay] = useState(() => {
        const now = new Date();
        const keys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const dayKeyIndex = (now.getDay() === 0) ? 6 : now.getDay() - 1;
        return keys[dayKeyIndex];
    });
    const [isEditMode, setIsEditMode] = useState(false);
    
    const [weekOffset, setWeekOffset] = useState(0); 
    const [weekDates, setWeekDates] = useState({});
    const [dailyMods, setDailyMods] = useState({});
    const [weekNumber, setWeekNumber] = useState(1);
    const [year, setYear] = useState(2026);

    const nextWeek = () => setWeekOffset(prev => prev + 1);
    const prevWeek = () => setWeekOffset(prev => prev - 1);

    const resetToToday = () => {
        setWeekOffset(0);
        const now = new Date();
        const keys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const dayKeyIndex = (now.getDay() === 0) ? 6 : now.getDay() - 1;
        setCurrentDay(keys[dayKeyIndex]);
    };

    const lastFetchRef = useRef("");

    const loadData = async (userId, startStr, endStr, isBackground = false) => {
        const key = `${userId}-${startStr}-${endStr}`;
        if (key === lastFetchRef.current) return;
        lastFetchRef.current = key;

        if (!isBackground) setLoading(true);
        const data = await DataManager.loadRawRoutine(userId, startStr, endStr);
        setPlanData(data || { days: [] });
        
        // --- SYNC MODIFICATIONS ---
        if (data?.modifications) {
            const modsMap = {};
            data.modifications.forEach(m => { modsMap[m.date] = m.modified_data; });
            setDailyMods(prev => ({ ...prev, ...modsMap }));
        }
        
        if (!isBackground) setLoading(false);
    };

    // Helper to generate week map for any offset
    const getWeekMap = useCallback((offset) => {
        const now = new Date();
        const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (offset * 7));
        const monday = getStartOfWeek(targetDate);
        
        const keys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const datesMap = {};
        
        keys.forEach((key, index) => {
            const current = new Date(monday);
            current.setDate(monday.getDate() + index);
            
            let cycleLabel = null;
            let cycleDayIndex = 0; 

            if (planData && planData.startDate && planData.days.length > 0) {
                const start = new Date(planData.startDate);
                const currentNoTime = new Date(current.getFullYear(), current.getMonth(), current.getDate());
                const startNoTime = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                
                const diffTime = currentNoTime - startNoTime;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays >= 0) {
                    const cycleLen = planData.days.length;
                    cycleDayIndex = diffDays % cycleLen;
                    const dayDef = planData.days[cycleDayIndex];
                    cycleLabel = dayDef ? (dayDef.title || `Day ${dayDef.day_number}`) : `Day ${cycleDayIndex + 1}`;
                }
            }

            datesMap[key] = {
                dateObj: current,
                label: current.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
                fullDate: getLocalDateString(current),
                cycleLabel,
                cycleDayIndex
            };
        });
        return datesMap;
    }, [planData]);

    // 1. Calculate Week Dates & Labels (Depends on planData for labels)
    useEffect(() => {
        const currentMap = getWeekMap(weekOffset);
        
        const monday = currentMap['mon'].dateObj;
        const d = new Date(monday);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
        const week1 = new Date(d.getFullYear(), 0, 4);
        const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
        
        setWeekNumber(weekNum);
        setYear(monday.getFullYear());
        
        setWeekDates(prev => {
            if (JSON.stringify(prev) === JSON.stringify(currentMap)) return prev;
            return currentMap;
        });

        // Initial Day Set
        if (weekOffset === 0 && !currentDay) {
            const now = new Date();
            const keys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            const dayKeyIndex = (now.getDay() === 0) ? 6 : now.getDay() - 1;
            setCurrentDay(keys[dayKeyIndex]);
        }
    }, [weekOffset, planData, getWeekMap, currentDay]); // planData is safe here as it only updates local state

    // 2. Data Fetching (Depends ONLY on weekOffset/Session - BREAKS LOOP)
    useEffect(() => {
        if (session?.user?.id) {
            // Re-calculate range purely from offset to avoid planData dependency
            const now = new Date();
            const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (weekOffset * 7));
            const monday = getStartOfWeek(targetDate);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            
            const mondayStr = getLocalDateString(monday);
            const sundayStr = getLocalDateString(sunday);
            
            loadData(session.user.id, mondayStr, sundayStr, true);
        }
    }, [weekOffset, session?.user?.id]); // REMOVED planData dependency!

    const resolveDayData = useCallback((map, dayKey) => {
        if (!map[dayKey] || !planData || !planData.days) return null;
        
        const date = map[dayKey].fullDate;
        const { cycleDayIndex } = map[dayKey];
        if (cycleDayIndex === undefined || cycleDayIndex < 0) return null;

        const rawDay = planData.days[cycleDayIndex];
        if (!rawDay) return null;

        let legacyNutrition = { meal_plan: [], notes: "No Plan" };
        let legacySupplements = { stack: [], notes: "No Stack" };
        const defaultPlan = DataManager.getDefaultPlan();
        const legacyKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const legacyKey = legacyKeys[cycleDayIndex % 7]; 
        if (defaultPlan[legacyKey]) {
            legacyNutrition = defaultPlan[legacyKey].nutrition;
            legacySupplements = defaultPlan[legacyKey].supplements;
        }

        const templateData = {
            training: { 
                title: DataManager.cleanHtml(rawDay.title), 
                day_type: rawDay.day_type,
                instructions: DataManager.cleanHtml(rawDay.instructions), 
                exercises: (rawDay.exercises || []).map(ex => ({
                    ...ex,
                    focus: DataManager.cleanHtml(ex.focus),
                    type: ex.type || 'Resistance' 
                }))
            },
            nutrition: legacyNutrition, 
            supplements: legacySupplements
        };

        if (dailyMods[date] && dailyMods[date].training) {
            templateData.training = { ...templateData.training, ...dailyMods[date].training };
        }

        return templateData;
    }, [planData, dailyMods]);

    const getResolvedDayData = useCallback((dayKey) => {
        return resolveDayData(weekDates, dayKey);
    }, [weekDates, resolveDayData]);

    const updateSection = useCallback(async (dayKey, sectionName, sectionData) => {
        if (!session) return;
        const date = weekDates[dayKey]?.fullDate;
        if (!date) return;

        const existingMod = dailyMods[date] || {};
        const newMod = { ...existingMod, [sectionName]: sectionData };
        setDailyMods(prev => ({ ...prev, [date]: newMod }));
        await DataManager.saveDailyModification(session.user.id, date, newMod);
    }, [session, weekDates, dailyMods]);

    return {
        planData,
        currentDay,
        setCurrentDay,
        isEditMode,
        setIsEditMode, // Expose setter
        toggleEditMode: () => setIsEditMode(!isEditMode),
        weekOffset,
        weekDates,
        weekNumber,
        year,
        nextWeek,
        prevWeek,
        resetToToday,
        getResolvedDayData,
        updateSection,
        updateTraining: (dk, nd) => updateSection(dk, 'training', nd),
        getWeekMap,
        resolveDayData,
        setWeekOffset
    };
};