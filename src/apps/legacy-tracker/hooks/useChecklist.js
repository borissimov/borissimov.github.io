import { useState, useEffect } from 'react';
import { DataManager } from '../../../data/DataManager';

export const useChecklist = (session, weekDates) => {
    const [checklistState, setChecklistState] = useState({});

    useEffect(() => {
        if (session?.user?.id && Object.keys(weekDates).length > 0) {
            DataManager.syncChecklistLogs(session.user.id, weekDates).then((dbState) => {
                const local = JSON.parse(localStorage.getItem('nutrition_plan_checkboxes') || '{}');
                setChecklistState({ ...local, ...dbState });
            });
        } else {
             const local = JSON.parse(localStorage.getItem('nutrition_plan_checkboxes') || '{}');
             setChecklistState(local);
        }
    }, [session, weekDates]);

    const toggleChecklist = (itemId, isChecked, dayKey, itemData = {}) => {
        const date = weekDates[dayKey]?.fullDate;
        if (!date) return;

        const stateKey = `${date}_${itemId}`;
        const newState = { ...checklistState, [stateKey]: isChecked };
        setChecklistState(newState);
        
        const local = JSON.parse(localStorage.getItem('nutrition_plan_checkboxes') || '{}');
        local[stateKey] = isChecked;
        localStorage.setItem('nutrition_plan_checkboxes', JSON.stringify(local));

        DataManager.saveCheckboxState(session?.user?.id, itemId, isChecked, date, dayKey, itemData);
    };

    return { checklistState, toggleChecklist };
};
