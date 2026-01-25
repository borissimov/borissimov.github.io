import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Save, Plus, Trash2, ChevronDown, ChevronRight, Settings, RefreshCcw, Dumbbell, X, Search, GripVertical, Loader2 } from 'lucide-react';
import { useProgramStore } from '../../stores/useProgramStore';

/**
 * Program Editor: Nested accordion builder for training programs.
 */
export const ProgramEditorView = ({ onNavigate, programId = null }) => {
    const { uniqueExercises, fetchUniqueExercises, saveProgram, isLoading } = useProgramStore();
    
    const [programName, setProgramName] = useState("NEW PROGRAM");
    const [days, setDays] = useState([]);
    const [expandedDayId, setExpandedDayId] = useState(null);
    const [activeSearch, setActiveSearch] = useState(null); // { dayId, blockId }
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchUniqueExercises();
    }, [fetchUniqueExercises]);

    const filteredLibrary = useMemo(() => {
        if (!searchTerm) return uniqueExercises.slice(0, 10);
        return uniqueExercises.filter(ex => ex.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 10);
    }, [uniqueExercises, searchTerm]);

    const handleAddDay = () => {
        const nextDayNum = days.length + 1;
        const newDay = { id: crypto.randomUUID(), label: `DAY ${nextDayNum}`, sequence_number: nextDayNum, blocks: [] };
        setDays([...days, newDay]);
        setExpandedDayId(newDay.id);
    };

    const handleDeleteDay = (id) => {
        setDays(days.filter(d => d.id !== id).map((d, i) => ({ ...d, sequence_number: i + 1 })));
    };

    const handleAddBlock = (dayId, type = 'STANDARD') => {
        setDays(days.map(d => {
            if (d.id !== dayId) return d;
            return {
                ...d,
                blocks: [...d.blocks, {
                    id: crypto.randomUUID(),
                    label: type === 'STANDARD' ? 'Main Lift' : 'Metabolic Circuit',
                    block_type: type,
                    sort_order: d.blocks.length + 1,
                    items: []
                }]
            };
        }));
    };

    const handleDeleteBlock = (dayId, blockId) => {
        setDays(days.map(d => {
            if (d.id !== dayId) return d;
            return { ...d, blocks: d.blocks.filter(b => b.id !== blockId).map((b, i) => ({ ...b, sort_order: i + 1 })) };
        }));
    };

    const handleAddExercise = (dayId, blockId, exName) => {
        setDays(days.map(d => {
            if (d.id !== dayId) return d;
            return {
                ...d,
                blocks: d.blocks.map(b => {
                    if (b.id !== blockId) return b;
                    return {
                        ...b,
                        items: [...b.items, {
                            id: crypto.randomUUID(),
                            name: exName,
                            target_sets: 3,
                            target_reps: "8-12",
                            target_weight: "-",
                            target_rpe: "8",
                            tempo: "2010",
                            metric_type: "LOAD_REP",
                            sort_order: b.items.length + 1
                        }]
                    };
                })
            };
        }));
        setActiveSearch(null);
        setSearchTerm("");
    };

    const updateItem = (dayId, blockId, itemId, field, value) => {
        setDays(days.map(d => {
            if (d.id !== dayId) return d;
            return {
                ...d,
                blocks: d.blocks.map(b => {
                    if (b.id !== blockId) return b;
                    return {
                        ...b,
                        items: b.items.map(i => i.id === itemId ? { ...i, [field]: value } : i)
                    };
                })
            };
        }));
    };

    const handleDeleteItem = (dayId, blockId, itemId) => {
        setDays(days.map(d => {
            if (d.id !== dayId) return d;
            return {
                ...d,
                blocks: d.blocks.map(b => {
                    if (b.id !== blockId) return b;
                    return { ...b, items: b.items.filter(i => i.id !== itemId).map((i, idx) => ({ ...i, sort_order: idx + 1 })) };
                })
            };
        }));
    };

    const updateBlock = (dayId, blockId, field, value) => {
        setDays(days.map(d => {
            if (d.id !== dayId) return d;
            return { ...d, blocks: d.blocks.map(b => b.id === blockId ? { ...b, [field]: value } : b) };
        }));
    };

    const handleSave = async () => {
        if (!programName || days.length === 0) {
            alert("Please provide a program name and at least one day.");
            return;
        }
        setIsSaving(true);
        try {
            await saveProgram(programName, days);
            onNavigate('library');
        } catch (err) {
            alert("Error saving program: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '4px', marginTop: '8px' };
    const miniInputStyle = { all: 'unset', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid #333', borderRadius: '4px', padding: '4px', fontSize: '10px', color: '#fff', textAlign: 'center' };

    return (
        <div className="app-container-v2" style={{ padding: '0' }}>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', height: '54px', borderBottom: '1px solid #222', backgroundColor: '#121212', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => onNavigate('library')} style={{ all: 'unset', cursor: 'pointer', padding: '10px 5px' }}>
                        <ArrowLeft size={20} color="#f29b11" />
                    </button>
                    <input 
                        value={programName}
                        onChange={(e) => setProgramName(e.target.value.toUpperCase())}
                        style={{ all: 'unset', fontSize: '14px', fontWeight: '900', color: '#fff', width: '180px', borderBottom: '1px dashed #444' }}
                    />
                </div>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{ all: 'unset', backgroundColor: '#f29b11', color: '#000', padding: '6px 15px', borderRadius: '6px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', opacity: isSaving ? 0.5 : 1 }}
                >
                    {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} fill="currentColor" />}
                    {isSaving ? 'Saving...' : 'Save'}
                </button>
            </header>

            <div style={{ padding: '15px', paddingBottom: '100px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {days.map((day, dIdx) => {
                        const isExpanded = expandedDayId === day.id;
                        return (
                            <div key={day.id} className="premium-card" style={{ padding: '0', overflow: 'hidden', border: isExpanded ? '1px solid #f29b1144' : '1px solid #222' }}>
                                <div 
                                    onClick={() => setExpandedDayId(isExpanded ? null : day.id)}
                                    style={{ padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isExpanded ? 'rgba(242, 155, 17, 0.05)' : 'transparent', cursor: 'pointer' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '10px', fontWeight: '900', color: '#f29b11' }}>DAY {day.sequence_number}</span>
                                        <input 
                                            value={day.label}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => { const newDays = [...days]; newDays[dIdx].label = e.target.value; setDays(newDays); }}
                                            style={{ all: 'unset', fontSize: '14px', fontWeight: '900', color: '#fff' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteDay(day.id); }} style={{ all: 'unset', opacity: 0.4 }}><Trash2 size={16} color="#ef4444" /></button>
                                        {isExpanded ? <ChevronDown size={18} color="#f29b11" /> : <ChevronRight size={18} color="#444" />}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '1px solid #222' }}>
                                        {day.blocks.map((block) => (
                                            <div key={block.id} style={{ borderLeft: '2px solid #333', paddingLeft: '15px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        {block.block_type === 'CIRCUIT' ? <RefreshCcw size={14} color="#2ecc71" /> : <Dumbbell size={14} color="#f29b11" />}
                                                        <input value={block.label} onChange={(e) => updateBlock(day.id, block.id, 'label', e.target.value)} style={{ all: 'unset', fontSize: '11px', fontWeight: '900', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }} />
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <button onClick={() => updateBlock(day.id, block.id, 'block_type', block.block_type === 'STANDARD' ? 'CIRCUIT' : 'STANDARD')} style={{ all: 'unset', fontSize: '9px', fontWeight: '900', color: '#666', border: '1px solid #333', padding: '2px 6px', borderRadius: '4px' }}>TYPE</button>
                                                        <button onClick={() => handleDeleteBlock(day.id, block.id)} style={{ all: 'unset', opacity: 0.4 }}><X size={14} color="#ef4444" /></button>
                                                    </div>
                                                </div>
                                                
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                                                    {block.items.map((item) => (
                                                        <div key={item.id} style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid #222' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <h4 style={{ fontSize: '12px', fontWeight: '900', color: '#fff', margin: 0, textTransform: 'uppercase' }}>{item.name}</h4>
                                                                <button onClick={() => handleDeleteItem(day.id, block.id, item.id)} style={{ all: 'unset', opacity: 0.3 }}><X size={12} color="#ef4444" /></button>
                                                            </div>
                                                            <div style={gridStyle}>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                                    <span style={{ fontSize: '7px', fontWeight: '900', color: '#f29b11' }}>SETS</span>
                                                                    <input type="number" value={item.target_sets} onChange={(e) => updateItem(day.id, block.id, item.id, 'target_sets', e.target.value)} style={miniInputStyle} />
                                                                </div>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                                    <span style={{ fontSize: '7px', fontWeight: '900', color: '#f29b11' }}>REPS</span>
                                                                    <input value={item.target_reps} onChange={(e) => updateItem(day.id, block.id, item.id, 'target_reps', e.target.value)} style={miniInputStyle} />
                                                                </div>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                                    <span style={{ fontSize: '7px', fontWeight: '900', color: '#f29b11' }}>KG</span>
                                                                    <input value={item.target_weight} onChange={(e) => updateItem(day.id, block.id, item.id, 'target_weight', e.target.value)} style={miniInputStyle} />
                                                                </div>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                                    <span style={{ fontSize: '7px', fontWeight: '900', color: '#f29b11' }}>RPE</span>
                                                                    <input value={item.target_rpe} onChange={(e) => updateItem(day.id, block.id, item.id, 'target_rpe', e.target.value)} style={miniInputStyle} />
                                                                </div>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                                    <span style={{ fontSize: '7px', fontWeight: '900', color: '#f29b11' }}>TEMPO</span>
                                                                    <input value={item.tempo} onChange={(e) => updateItem(day.id, block.id, item.id, 'tempo', e.target.value)} style={miniInputStyle} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {activeSearch?.blockId === block.id ? (
                                                    <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #f29b1144', borderRadius: '8px', padding: '10px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', borderBottom: '1px solid #222', paddingBottom: '8px' }}>
                                                            <Search size={14} color="#f29b11" />
                                                            <input 
                                                                autoFocus
                                                                placeholder="Search Library..."
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                style={{ all: 'unset', fontSize: '12px', color: '#fff', flex: 1 }}
                                                            />
                                                            <button onClick={() => setActiveSearch(null)} style={{ all: 'unset' }}><X size={14} color="#666" /></button>
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            {filteredLibrary.map(ex => (
                                                                <button 
                                                                    key={ex} 
                                                                    onClick={() => handleAddExercise(day.id, block.id, ex)}
                                                                    style={{ all: 'unset', padding: '8px', fontSize: '11px', color: '#ccc', textAlign: 'left', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.02)' }}
                                                                >
                                                                    {ex.toUpperCase()}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => setActiveSearch({ dayId: day.id, blockId: block.id })}
                                                        className="premium-btn-secondary" 
                                                        style={{ height: '32px', width: 'auto', padding: '0 15px', fontSize: '10px', borderStyle: 'dashed' }}
                                                    >
                                                        <Plus size={12} /> ADD EXERCISE
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => handleAddBlock(day.id, 'STANDARD')} className="premium-btn-secondary" style={{ flex: 1, height: '40px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Plus size={14} /> BLOCK</button>
                                            <button onClick={() => handleAddBlock(day.id, 'CIRCUIT')} className="premium-btn-secondary" style={{ flex: 1, height: '40px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#2ecc71', borderColor: 'rgba(46, 204, 113, 0.2)' }}><RefreshCcw size={14} /> CIRCUIT</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <button onClick={handleAddDay} className="premium-btn-secondary" style={{ borderStyle: 'dashed', height: '60px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Plus size={18} /> ADD TRAINING DAY</button>
                </div>
            </div>
        </div>
    );
};