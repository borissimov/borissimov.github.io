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

        const dayIndex = new Date().getDay();
        const mapKeys = Object.keys(DataModule.getDaysMap());
        const adjustedIndex = (dayIndex === 0) ? 6 : dayIndex - 1;
        setCurrentDay(mapKeys[adjustedIndex]);

        return () => subscription.unsubscribe();
    }, []);

    const loadData = async (userId) => {
        setLoading(true);
        const data = await DataModule.loadPlan(userId);
        setPlanData(data);
        setLoading(false);
    };

    const updateSection = async (dayKey, sectionName, sectionData) => {
        if (!planData || !session) return;
        
        // Optimistic Update
        const optimistic = { ...planData };
        optimistic[dayKey][sectionName] = sectionData;
        setPlanData(optimistic);

        // Async Save (Forks if needed)
        const refreshedData = await DataModule.updateSection(session.user.id, dayKey, sectionName, sectionData);
        if (refreshedData) setPlanData(refreshedData); // Update with server state (new IDs)
    };

    const revertPlan = async () => {
        if(!session) return;
        setLoading(true);
        const refreshedData = await DataModule.revertToDefault(session.user.id);
        if(refreshedData) setPlanData(refreshedData);
        setLoading(false);
    };

    const logExerciseSet = async (entry) => {
        if (!session?.user?.id) return;
        await DataModule.addLog(session.user.id, { ...entry, dayKey: currentDay });
        
        const localLogs = DataModule.getTrainingLogs(currentDay);
        const idx = entry.exerciseIndex;
        if (!localLogs[idx]) localLogs[idx] = [];
        localLogs[idx].push(entry);
        DataModule.saveTrainingLogs(currentDay, localLogs);
    };

    const toggleEditMode = () => setIsEditMode(!isEditMode);

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
            logExerciseSet,
            revertPlan, // New exposed function
            daysMap: DataModule.getDaysMap()
        }}>
            {children}
        </PlanContext.Provider>
    );
};

export const usePlan = () => useContext(PlanContext);
