import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useProgramStore } from '../../stores/useProgramStore';

// Components
import { EditorHeader } from './components/EditorHeader';
import { EditorDay } from './components/EditorDay';

/**
 * Program Editor: Nested accordion builder for training programs.
 * Refactored into a clean Orchestrator Pattern.
 */
export const ProgramEditorView = ({ onNavigate, navState = null }) => {
    const programId = navState?.programId;
    const { uniqueExercises, fetchUniqueExercises, saveProgram, fetchProgramDetails } = useProgramStore();
    
    const [programName, setProgramName] = useState("NEW PROGRAM");
    const [days, setDays] = useState([]);
    const [expandedDayId, setExpandedDayId] = useState(null);
    const [activeSearch, setActiveSearch] = useState(null); // { blockId }
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isHydrating, setIsHydrating] = useState(!!programId);

    // 1. Lifecycle
    useEffect(() => {
        fetchUniqueExercises();
        if (programId) loadProgramForEdit();
        else {
            const firstDay = { id: crypto.randomUUID(), label: 'DAY 1', sequence_number: 1, blocks: [] };
            setDays([firstDay]);
            setExpandedDayId(firstDay.id);
        }
    }, [programId]);

    const loadProgramForEdit = async () => {
        try {
            const data = await fetchProgramDetails(programId);
            setProgramName(data.name);
            setDays(data.days);
            if (data.days.length > 0) setExpandedDayId(data.days[0].id);
        } catch (err) {
            console.error("Failed to hydrate builder:", err);
            onNavigate('library');
        } finally {
            setIsHydrating(false);
        }
    };

    // 2. Computed State
    const filteredLibrary = useMemo(() => {
        if (!searchTerm) return uniqueExercises.slice(0, 10);
        return uniqueExercises.filter(ex => ex.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 10);
    }, [uniqueExercises, searchTerm]);

    // 3. Handlers
    const handleAddDay = () => {
        const nextDayNum = days.length + 1;
        const newDay = { id: crypto.randomUUID(), label: `DAY ${nextDayNum}`, sequence_number: nextDayNum, blocks: [] };
        setDays([...days, newDay]);
        setExpandedDayId(newDay.id);
    };

    const handleSave = async () => {
        if (!programName || days.length === 0) {
            alert("Please provide a program name and at least one day.");
            return;
        }
        setIsSaving(true);
        try {
            await saveProgram(programName, days, programId);
            onNavigate('library');
        } catch (err) {
            alert("Error saving program: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // --- DAY CRUD ---
    const updateDayLabel = (id, label) => setDays(days.map(d => d.id === id ? { ...d, label } : d));
    const deleteDay = (id) => setDays(days.filter(d => d.id !== id).map((d, i) => ({ ...d, sequence_number: i + 1 })));

    // --- BLOCK CRUD ---
    const addBlock = (dayId, type) => {
        setDays(days.map(d => d.id !== dayId ? d : {
            ...d,
            blocks: [...d.blocks, { id: crypto.randomUUID(), label: type === 'STANDARD' ? 'Main Lift' : 'Circuit', block_type: type, sort_order: d.blocks.length + 1, items: [] }]
        }));
    };
    const updateBlock = (dayId, blockId, field, value) => {
        setDays(days.map(d => d.id !== dayId ? d : { ...d, blocks: d.blocks.map(b => b.id === blockId ? { ...b, [field]: value } : b) }));
    };
    const deleteBlock = (dayId, blockId) => {
        setDays(days.map(d => d.id !== dayId ? d : { ...d, blocks: d.blocks.filter(b => b.id !== blockId).map((b, i) => ({ ...b, sort_order: i + 1 })) }));
    };

    // --- ITEM CRUD ---
    const addItem = (dayId, blockId, exName) => {
        setDays(days.map(d => d.id !== dayId ? d : {
            ...d,
            blocks: d.blocks.map(b => b.id !== blockId ? b : {
                ...b,
                items: [...b.items, { id: crypto.randomUUID(), name: exName, target_sets: 3, target_reps: "8-12", target_weight: "-", target_rpe: "8", tempo: "2010", metric_type: "LOAD_REP", sort_order: b.items.length + 1 }]
            })
        }));
        setActiveSearch(null);
        setSearchTerm("");
    };
    const updateItem = (dayId, blockId, itemId, field, value) => {
        setDays(days.map(d => d.id !== dayId ? d : {
            ...d,
            blocks: d.blocks.map(b => b.id !== blockId ? b : { ...b, items: b.items.map(i => i.id === itemId ? { ...i, [field]: value } : i) })
        }));
    };
    const deleteItem = (dayId, blockId, itemId) => {
        setDays(days.map(d => d.id !== dayId ? d : {
            ...d,
            blocks: d.blocks.map(b => b.id !== blockId ? b : { ...b, items: b.items.filter(i => i.id !== itemId).map((i, idx) => ({ ...i, sort_order: idx + 1 })) })
        }));
    };

    if (isHydrating) {
        return (
            <div className="app-container-v2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 size={32} color="#f29b11" className="animate-spin" style={{ marginBottom: '15px' }} />
                    <p style={{ fontSize: '12px', fontWeight: '900', color: '#f29b11', letterSpacing: '2px' }}>DEEP LOADING PROGRAM DATA...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container-v2" style={{ padding: '0' }}>
            <EditorHeader 
                onBack={() => onNavigate('library')}
                programName={programName}
                setProgramName={setProgramName}
                onSave={handleSave}
                isSaving={isSaving}
            />

            <div style={{ padding: '15px', paddingBottom: '100px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {days.map((day) => (
                        <EditorDay 
                            key={day.id}
                            day={day}
                            isExpanded={expandedDayId === day.id}
                            onToggle={() => setExpandedDayId(expandedDayId === day.id ? null : day.id)}
                            onUpdateLabel={(val) => updateDayLabel(day.id, val)}
                            onDelete={() => deleteDay(day.id)}
                            onAddBlock={(type) => addBlock(day.id, type)}
                            onUpdateBlock={(blockId, field, val) => updateBlock(day.id, blockId, field, val)}
                            onDeleteBlock={(blockId) => deleteBlock(day.id, blockId)}
                            onAddItemToBlock={(blockId, ex) => addItem(day.id, blockId, ex)}
                            onUpdateItemInBlock={(blockId, itemId, field, val) => updateItem(day.id, blockId, itemId, field, val)}
                            onDeleteItemFromBlock={(blockId, itemId) => deleteItem(day.id, blockId, itemId)}
                            activeSearch={activeSearch}
                            setActiveSearch={setActiveSearch}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            filteredLibrary={filteredLibrary}
                        />
                    ))}

                    <button onClick={handleAddDay} className="premium-btn-secondary" style={{ borderStyle: 'dashed', height: '60px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Plus size={18} /> ADD TRAINING DAY
                    </button>
                </div>
            </div>
        </div>
    );
};
