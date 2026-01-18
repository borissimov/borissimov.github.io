import { useCallback } from 'react';
import { usePlan } from '../../../context/PlanContext';

export const useSectionLogic = (dayKey, sectionName, data) => {
    const { updateSection } = usePlan();

    const handleDragStart = useCallback((e, index) => {
        e.dataTransfer.setData('text/plain', index);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback((e, targetIndex) => {
        const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
        if (sourceIndex === targetIndex) return;
        
        const newItems = [...data.events];
        const [movedItem] = newItems.splice(sourceIndex, 1);
        newItems.splice(targetIndex, 0, movedItem);
        
        updateSection(dayKey, sectionName, { ...data, events: newItems });
    }, [dayKey, sectionName, data, updateSection]);

    const addItem = useCallback((defaultItem) => {
        const newItem = defaultItem || { title: "New Block", items: [] };
        updateSection(dayKey, sectionName, { ...data, events: [...data.events, newItem] });
    }, [dayKey, sectionName, data, updateSection]);

    const deleteItem = useCallback((index) => {
        if(!confirm("Delete this block?")) return;
        const newEvents = data.events.filter((_, i) => i !== index);
        updateSection(dayKey, sectionName, { ...data, events: newEvents });
    }, [dayKey, sectionName, data, updateSection]);

    return {
        handleDragStart,
        handleDragOver,
        handleDrop,
        addItem,
        deleteItem
    };
};
