import React, { useState, useEffect } from 'react';
import { DataManager } from '../../../data/DataManager';
import { ChevronLeft, Plus, Trash2, GripVertical, Save, X } from 'lucide-react';

export const RoutineEditor = ({ routineId, onClose }) => {
    const [routine, setRoutine] = useState(null);
    const [days, setDays] = useState([]);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await DataManager.getRoutineDetails(routineId);
            if (data) {
                setRoutine(data);
                setDays(data.days || []);
            }
            setLoading(false);
        };
        load();
    }, [routineId]);

    const updateDay = (index, field, value) => {
        const newDays = [...days];
        newDays[index][field] = value;
        setDays(newDays);
        setHasChanges(true);
    };

    const updateExercise = (dayIdx, exIdx, field, value) => {
        const newDays = [...days];
        const exercises = [...(newDays[dayIdx].exercises || [])];
        exercises[exIdx] = { ...exercises[exIdx], [field]: value };
        newDays[dayIdx].exercises = exercises;
        setDays(newDays);
        setHasChanges(true);
    };

    const addExercise = (dayIdx) => {
        const newDays = [...days];
        const exercises = newDays[dayIdx].exercises || [];
        newDays[dayIdx].exercises = [...exercises, { exercise: "", config: "3 x 10 @ 8 RPE", focus: "", type: "Resistance" }];
        setDays(newDays);
        setHasChanges(true);
    };

    const removeExercise = (dayIdx, exIdx) => {
        const newDays = [...days];
        newDays[dayIdx].exercises = newDays[dayIdx].exercises.filter((_, i) => i !== exIdx);
        setDays(newDays);
        setHasChanges(true);
    };

    const addDay = () => {
        setDays([
            ...days, 
            { 
                day_number: days.length + 1, 
                title: `Day ${days.length + 1}`, 
                day_type: 'Resistance', 
                exercises: [], 
                instructions: '' 
            }
        ]);
        setHasChanges(true);
        setSelectedDayIndex(days.length); // Select new day
    };

    const removeDay = (index) => {
        if (confirm("Remove this day and all its exercises?")) {
            const newDays = days.filter((_, i) => i !== index);
            setDays(newDays);
            setHasChanges(true);
            if (selectedDayIndex >= newDays.length) setSelectedDayIndex(Math.max(0, newDays.length - 1));
        }
    };

    const handleSave = async () => {
        if (!routineId) return;
        setLoading(true);
        await DataManager.updateRoutineStructure(routineId, days);
        setHasChanges(false);
        setLoading(false);
    };

    if (loading && !routine) return <div className="p-8 text-center text-gray-500">Loading Editor...</div>;

    const currentDay = days[selectedDayIndex];

    return (
        <div className="flex flex-col h-full bg-black text-white">
            {/* Header - Sticky */}
            <div className="flex items-center justify-between p-4 border-b border-[#222] bg-[#111] sticky top-0 z-10 shadow-md">
                <button onClick={onClose} className="action-btn" style={{ background: '#222', border: '1px solid #444' }}>
                    <ChevronLeft size={16} /> Back
                </button>
                <div className="text-sm font-bold tracking-wide" style={{ color: 'var(--training-accent)' }}>{routine?.name}</div>
                <button 
                    onClick={handleSave} 
                    disabled={!hasChanges}
                    className={`action-btn ${hasChanges ? 'active-edit' : 'opacity-50'}`}
                    style={{ background: hasChanges ? 'var(--training-accent)' : '#222', color: hasChanges ? '#000' : '#888', border: hasChanges ? 'none' : '1px solid #444' }}
                >
                    <Save size={14} /> Save
                </button>
            </div>

            {/* Horizontal Day Selector */}
            <div className="bg-[#0a0a0a] border-b border-[#222] pt-3 px-2 pb-0">
                <div className="flex overflow-x-auto gap-1 no-scrollbar pb-0">
                    {days.map((day, idx) => {
                        const isActive = selectedDayIndex === idx;
                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedDayIndex(idx)}
                                className={`flex-shrink-0 px-4 py-3 text-xs font-bold uppercase tracking-wider border-t border-x rounded-t-lg transition-all relative top-[1px] ${
                                    isActive 
                                    ? 'bg-[#111] text-white border-[#222] border-b-transparent z-10' 
                                    : 'bg-transparent text-gray-600 border-transparent hover:text-gray-400 hover:bg-[#11111150]'
                                }`}
                            >
                                {day.title || `Day ${idx + 1}`}
                            </button>
                        );
                    })}
                    <button 
                        onClick={addDay}
                        className="flex-shrink-0 px-3 py-2 text-gray-600 hover:text-[var(--training-accent)] transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#111]">
                {currentDay ? (
                    <div className="max-w-2xl mx-auto space-y-6">
                        
                        {/* Day Settings Card */}
                        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#333] shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-full mr-4">
                                    <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Day Label</label>
                                    <input 
                                        className="w-full bg-transparent text-lg font-bold text-white border-b border-[#333] focus:border-[var(--training-accent)] outline-none py-1 placeholder-gray-700 transition-colors"
                                        value={currentDay.title || ""}
                                        placeholder="e.g. Push Day"
                                        onChange={(e) => updateDay(selectedDayIndex, 'title', e.target.value)}
                                    />
                                </div>
                                <button 
                                    onClick={() => removeDay(selectedDayIndex)} 
                                    className="icon-btn delete"
                                    title="Delete Day"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Focus Type</label>
                                <div className="flex bg-black p-1 rounded-lg border border-[#333]">
                                    {['Resistance', 'Cardio', 'Rest'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => updateDay(selectedDayIndex, 'day_type', type)}
                                            className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-md transition-all ${
                                                currentDay.day_type === type 
                                                ? 'bg-[#222] text-white shadow-sm ring-1 ring-[#444]' 
                                                : 'text-gray-600 hover:text-gray-400'
                                            }`}
                                            style={currentDay.day_type === type ? { 
                                                color: type === 'Resistance' ? 'var(--training-accent)' : type === 'Cardio' ? 'var(--cardio-accent)' : '#ccc'
                                            } : {}}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Exercise List Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                                Exercises ({currentDay.exercises?.length || 0})
                            </h3>
                        </div>

                        {/* Exercises */}
                        <div className="space-y-4">
                            {(currentDay.exercises || []).map((ex, exIdx) => (
                                <div 
                                    key={exIdx} 
                                    className={`card training-${ex.type || 'Resistance'}`} 
                                    style={{ position: 'relative', overflow: 'visible' }}
                                >
                                    <div className="card-content">
                                        <div className="card-title justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                                <GripVertical size={20} className="text-gray-500 cursor-grab" />
                                                <input 
                                                    className="edit-input-title"
                                                    value={ex.exercise}
                                                    placeholder="Exercise Name"
                                                    onChange={(e) => updateExercise(selectedDayIndex, exIdx, 'exercise', e.target.value)}
                                                />
                                            </div>
                                            <button 
                                                onClick={() => removeExercise(selectedDayIndex, exIdx)} 
                                                className="exercise-delete-btn"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <div className="mb-2 flex items-center gap-2">
                                            <input 
                                                className="edit-input-config flex-1"
                                                value={ex.config}
                                                placeholder="3 x 10 @ 8 RPE"
                                                onChange={(e) => updateExercise(selectedDayIndex, exIdx, 'config', e.target.value)}
                                            />
                                            <select 
                                                className="edit-input-config w-auto"
                                                style={{ width: 'auto', fontSize: '0.7rem', padding: '2px' }}
                                                value={ex.type}
                                                onChange={(e) => updateExercise(selectedDayIndex, exIdx, 'type', e.target.value)}
                                            >
                                                <option value="Resistance">Resistance</option>
                                                <option value="Cardio">Cardio</option>
                                            </select>
                                        </div>

                                        <div className="mb-2">
                                            <textarea 
                                                className="edit-input-focus"
                                                rows={2}
                                                value={ex.focus}
                                                placeholder="Notes, cues, tempo..."
                                                onChange={(e) => updateExercise(selectedDayIndex, exIdx, 'focus', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => addExercise(selectedDayIndex)}
                            className="add-btn-dashed mt-4"
                        >
                            <Plus size={16} className="inline mr-2" /> Add Item
                        </button>
                        
                        <div className="h-8"></div> {/* Spacer */}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                        <GripVertical size={48} className="mb-4" />
                        <p className="text-sm font-bold uppercase">Select a day to edit</p>
                    </div>
                )}
            </div>
        </div>
    );
};
