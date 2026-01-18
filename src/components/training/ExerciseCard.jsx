import React, { useState } from 'react';
import { DataManager } from '../../data/DataManager';
import { SetLogger } from './SetLogger';
import { Trash2, GripVertical, Pencil, Check, X } from 'lucide-react';

// Inline simple helper components to keep this file self-contained
const ExerciseAutocomplete = ({ value, onChange, onSelect }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [show, setShow] = useState(false);

    React.useEffect(() => {
        const fetchSuggestions = async () => {
            if (value.length > 1) {
                const results = await DataManager.searchExercises(value);
                setSuggestions(results);
                setShow(true);
            } else {
                setSuggestions([]);
                setShow(false);
            }
        };
        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <input 
                className="edit-input-title" 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                onBlur={() => setTimeout(() => setShow(false), 200)}
                onFocus={() => value.length > 1 && setShow(true)}
                placeholder="Search exercise library..."
            />
            {show && suggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                    {suggestions.map(s => (
                        <div 
                            key={s.id} 
                            className="suggestion-item"
                            onClick={() => {
                                onSelect(s);
                                setShow(false);
                            }}
                        >
                            <div style={{fontWeight:'bold'}}>{s.name}</div>
                            <div style={{fontSize:'0.7rem', opacity:0.6}}>{s.type}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const RenderFormattedText = ({ text, className }) => {
    if (!text) return null;
    const lines = text.split('\n').filter(l => l.trim() !== "");
    if (lines.length === 0) return null;
    return (
        <div className={className}>
            <ul>
                {lines.map((line, i) => <li key={i}>{line}</li>)}
            </ul>
        </div>
    );
};

export const ExerciseCard = ({ 
    ex, 
    idx, 
    isEditMode, 
    isCompleted, 
    logs, 
    onToggleCheck, 
    onUpdateField, 
    onDeleteExercise, 
    onDragStart, 
    onDragOver, 
    onDrop,
    onLogSet,
    onDeleteSet,
    onUpdateSet
}) => {
    const [editingSet, setEditingSet] = useState(null);

    const parseDefaults = (configStr) => {
        const defaults = { sets: 0, reps: "", rpe: "" };
        if (!configStr) return defaults;
        const setsMatch = configStr.match(/(\d+)\s*x/);
        if (setsMatch) defaults.sets = parseInt(setsMatch[1]);
        const repsMatch = configStr.match(/x\s*([\d\-\w]+)/);
        if (repsMatch) defaults.reps = repsMatch[1];
        const rpeMatch = configStr.match(/@\s*([\d\-\.]+)/);
        if (rpeMatch) defaults.rpe = rpeMatch[1];
        return defaults;
    };

    const defaults = parseDefaults(ex.config);
    const isResistance = ex.type === 'Resistance';
    const isCardio = ex.type === 'Cardio';
    const cleanWeight = (val) => val ? val.toString().replace('kg','').replace('KG','').replace('BW','') : '-';

    const handleSelectExercise = (libraryEx) => {
        // ... (existing logic)
        onUpdateField(idx, 'exercise', libraryEx.name);
        onUpdateField(idx, 'type', libraryEx.type);
        const cfg = libraryEx.default_config || {};
        onUpdateField(idx, 'config', libraryEx.default_config ? `${cfg.sets || 3} x ${cfg.reps || 10} @ ${cfg.rpe || 8} RPE` : "");
        onUpdateField(idx, 'focus', libraryEx.instructions || "");
    };

    const saveEditedSet = (sIdx) => {
        onUpdateSet(idx, sIdx, editingSet);
        setEditingSet(null);
    };

    return (
        <div 
            className={`card training-${ex.type || 'Resistance'} ${isCompleted && !isEditMode ? 'completed' : ''}`}
            draggable={isEditMode}
            onDragStart={(e) => onDragStart(e, idx)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, idx)}
        >
            <div className="card-content">
                <div className="card-title">
                    {!isEditMode && <input type="checkbox" className="exercise-check" checked={!!isCompleted} onChange={() => onToggleCheck(idx)} />}
                    {isEditMode && <GripVertical className="text-gray-500 cursor-grab" size={20} />}
                    
                    <div style={{ flexGrow: 1 }}>
                        {isEditMode ? (
                            <div className="flex flex-col gap-1">
                                <ExerciseAutocomplete 
                                    value={ex.exercise} 
                                    onChange={(val) => onUpdateField(idx, 'exercise', val)}
                                    onSelect={handleSelectExercise}
                                />
                                <select 
                                    className="edit-input-config"
                                    style={{width: 'auto', fontSize: '0.7rem', padding: '2px'}}
                                    value={ex.type} 
                                    onChange={(e) => onUpdateField(idx, 'type', e.target.value)}
                                >
                                    <option value="Resistance">Resistance</option>
                                    <option value="Cardio">Cardio</option>
                                    <option value="Rest">Rest</option>
                                </select>
                            </div>
                        ) : (
                            <span>{idx + 1}. {ex.exercise}</span>
                        )}
                    </div>
                </div>

                <div className="mb-2">
                    {isEditMode ? (
                        <input className="edit-input-config" value={ex.config} onChange={(e) => onUpdateField(idx, 'config', e.target.value)} />
                    ) : (
                        defaults.sets > 0 ? (
                        <div className="card-config" style={{ gap: '10px' }}>
                            <div><span className="set-label">SETS:</span><span className="set-value">{defaults.sets}</span></div>
                            <div><span className="set-label">REPS:</span><span className="set-value">{defaults.reps}</span></div>
                            {defaults.rpe && <div><span className="set-label">{isCardio ? 'INT:' : 'RPE:'}</span><span className="set-value">{defaults.rpe}{isCardio ? '%' : ''}</span></div>}
                        </div>
                        ) : (
                        <div className="card-config">{ex.config}</div>
                        )
                    )}
                </div>

                {(ex.focus || isEditMode) && (
                    <div className="mb-2">
                        {isEditMode ? (
                            <textarea className="edit-input-focus" value={ex.focus} onChange={(e) => onUpdateField(idx, 'focus', e.target.value)} />
                        ) : (
                            <RenderFormattedText text={ex.focus} className="card-focus" />
                        )}
                    </div>
                )}
                
                {!isEditMode && (isResistance || isCardio) && (
                <div className="set-module"> 
                    <SetLogger 
                        type={ex.type}
                        defaultWeight="" 
                        defaultReps={defaults.reps} 
                        defaultRpe={defaults.rpe} 
                        onLog={(w, r, p, t, d, i) => onLogSet(idx, w, r, p, ex.exercise, ex.focus, defaults, t, d, i)} 
                    />
                    
                    {logs.length > 0 && (
                        <div className="set-history">
                            {logs.map((l, i) => {
                                const isEditing = editingSet?.sIdx === i;
                                return (
                                    <div key={i} className="set-row">
                                        {isEditing ? (
                                            <div className="inline-edit-group">
                                                {!isCardio && <input type="text" className="inline-input-mini" value={editingSet.weight} onChange={v => setEditingSet({...editingSet, weight: v.target.value})} />}
                                                {!isCardio && <input type="number" className="inline-input-mini" value={editingSet.reps} onChange={v => setEditingSet({...editingSet, reps: v.target.value})} />}
                                                {isCardio && <input type="number" className="inline-input-mini" value={editingSet.duration_minutes} onChange={v => setEditingSet({...editingSet, duration_minutes: v.target.value})} placeholder="Min" />}
                                                <input type="number" className="inline-input-mini" value={isCardio ? (editingSet.intensity || editingSet.rpe || '') : (editingSet.rpe || '')} onChange={v => setEditingSet({...editingSet, [isCardio ? 'intensity' : 'rpe']: v.target.value})} />
                                                {!isCardio && <input type="text" className="inline-input-mini" value={editingSet.tempo || ''} onChange={v => setEditingSet({...editingSet, tempo: v.target.value})} placeholder="Tempo" />}
                                                <button onClick={() => saveEditedSet(i)} className="icon-btn save"><Check size={18}/></button>
                                                <button onClick={() => setEditingSet(null)} className="icon-btn delete"><X size={18}/></button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="set-index">{i+1}.</div>
                                                <div className="set-data-text">
                                                    {isCardio ? (
                                                        <>
                                                            <span className="set-label">MINS:</span><span className="set-value">{l.duration_minutes}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="set-label">KG:</span><span className="set-value">{cleanWeight(l.weight)}</span>
                                                            <span className="set-label">REPS:</span><span className="set-value">{l.reps}</span>
                                                        </>
                                                    )}
                                                    
                                                    <span className="set-label">{isCardio ? 'INT:' : 'RPE:'}</span>
                                                    <span className="set-value">
                                                        {isCardio ? (l.intensity || l.rpe) + '%' : l.rpe}
                                                    </span>

                                                    {l.tempo && <><span className="set-label">T:</span><span className="set-value">{l.tempo}</span></>}
                                                </div>
                                                <div className="set-actions">
                                                    <button onClick={() => setEditingSet({ sIdx: i, weight: l.weight, reps: l.reps, rpe: l.rpe, intensity: l.intensity, duration_minutes: l.duration_minutes, tempo: l.tempo })} className="icon-btn edit"><Pencil size={14} /></button>
                                                    <button onClick={() => onDeleteSet(idx, i, l.id)} className="icon-btn delete"><Trash2 size={14} /></button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                )}
            </div>
            {isEditMode && <button onClick={() => onDeleteExercise(idx)} className="exercise-delete-btn"><X size={20} /></button>}
        </div>
    );
};
