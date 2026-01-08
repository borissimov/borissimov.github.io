import React, { useState, useEffect, useMemo } from 'react';
import { usePlan } from '../context/PlanContext';
import { DataModule } from '../data/DataModule';
import { Trash2, GripVertical, Plus, Pencil, Check, X, Minus, Download } from 'lucide-react';

// --- AUTOCOMPLETE COMPONENT ---
const ExerciseAutocomplete = ({ value, onChange, onSelect }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (value.length > 1) {
                const results = await DataModule.searchExercises(value);
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

const ExerciseLogger = ({ onLog, defaultWeight, defaultReps, defaultRpe }) => {
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");
    const [rpe, setRpe] = useState("");

    const handleLog = () => {
        const finalWeight = weight || defaultWeight || "BW";
        const finalReps = reps || defaultReps || "0";
        const finalRpe = rpe || defaultRpe || "-";
        onLog(finalWeight, finalReps, finalRpe);
        setWeight(""); setReps(""); setRpe("");
    };

    return (
        <div className="set-logger">
            <div className="set-inputs">
                <input type="number" placeholder="Kg" className="set-input" value={weight} onChange={e => setWeight(e.target.value)} />
                <input type="number" placeholder="Reps" className="set-input" value={reps} onChange={e => setReps(e.target.value)} />
                <input type="number" placeholder="RPE" className="set-input" value={rpe} onChange={e => setRpe(e.target.value)} />
                <button onClick={handleLog}>LOG</button>
            </div>
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

export const TrainingPanel = ({ data, dayKey }) => {
  const { isEditMode, toggleEditMode, updateSection, revertPlan, logExerciseSet, deleteExerciseSet, session, weekDates } = usePlan();
  
  const [dayLogs, setDayLogs] = useState({});
  const [checkedState, setCheckedState] = useState({});
  const [editingSet, setEditingSet] = useState(null);
  const [draftData, setDraftData] = useState(null);

  useEffect(() => {
      if (isEditMode) setDraftData(JSON.parse(JSON.stringify(data)));
      else setDraftData(null);
  }, [isEditMode]);

  const currentData = isEditMode && draftData ? draftData : data;

  const isModified = useMemo(() => {
      const defaultDay = DataModule.getDefaultPlan()[dayKey]?.training;
      if (!defaultDay) return false;
      const currentJson = JSON.stringify({
          exercises: data.exercises.map(e => ({ exercise: e.exercise, config: e.config, focus: e.focus, type: e.type })),
          instructions: data.instructions
      });
      const defaultJson = JSON.stringify({
          exercises: defaultDay.exercises.map(e => ({ exercise: e.exercise, config: e.config, focus: DataModule.cleanHtml(e.focus), type: e.type })),
          instructions: DataModule.cleanHtml(defaultDay.instructions)
      });
      return currentJson !== defaultJson;
  }, [data, dayKey]);

  useEffect(() => {
      const loadLogs = async () => {
          if (session?.user?.id && data.exercises) {
              // Pass the specific date for this week to filter logs
              const targetDate = weekDates[dayKey]?.fullDate;
              const syncedLogs = await DataModule.syncLogsForDay(session.user.id, dayKey, data.exercises, targetDate);
              setDayLogs(syncedLogs);
          } else {
              const localLogs = JSON.parse(localStorage.getItem(`training_logs_${dayKey}`) || '{}');
              setDayLogs(localLogs);
          }
      };
      loadLogs();
      const savedChecks = JSON.parse(localStorage.getItem(`training_state_${dayKey}`) || '[]');
      const checkMap = {};
      savedChecks.forEach(idx => checkMap[idx] = true);
      setCheckedState(checkMap);
  }, [dayKey, data.exercises, session, weekDates]);

  const handleSave = () => { updateSection(dayKey, 'training', draftData); toggleEditMode(); };
  const handleCancel = () => { toggleEditMode(); };
  const updateDraft = (newData) => setDraftData(newData);

  const handleDragStart = (e, index) => { e.dataTransfer.setData('text/plain', index); };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, targetIndex) => {
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (sourceIndex === targetIndex) return;
    const newExercises = [...draftData.exercises];
    const [movedItem] = newExercises.splice(sourceIndex, 1);
    newExercises.splice(targetIndex, 0, movedItem);
    updateDraft({ ...draftData, exercises: newExercises });
  };

  const addExercise = () => { updateDraft({ ...draftData, exercises: [...draftData.exercises, { exercise: "", config: "", focus: "", type: "Resistance" }] }); };
  const deleteExercise = (i) => { if(confirm("Delete?")) updateDraft({ ...draftData, exercises: draftData.exercises.filter((_, idx) => idx !== i) }); };
  
  const updateField = (index, field, value) => {
    const newExercises = [...draftData.exercises];
    newExercises[index][field] = value;
    updateDraft({ ...draftData, exercises: newExercises });
  };

  const handleSelectExercise = (index, libraryEx) => {
      const newExercises = [...draftData.exercises];
      const cfg = libraryEx.default_config || {};
      newExercises[index] = {
          exercise: libraryEx.name,
          type: libraryEx.type,
          config: libraryEx.default_config ? `${cfg.sets || 3} x ${cfg.reps || 10} @ ${cfg.rpe || 8} RPE` : "",
          focus: libraryEx.instructions || ""
      };
      updateDraft({ ...draftData, exercises: newExercises });
  };

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

  const handleLogSet = async (idx, weight, reps, rpe, exerciseName, focus, defaults) => {
      const logEntry = { exerciseIndex: idx, exercise: exerciseName, weight, reps, rpe, timestamp: new Date().toISOString(), dayKey }; // Added dayKey
      const savedLog = await logExerciseSet(logEntry);
      const newLogs = { ...dayLogs };
      if (!newLogs[idx]) newLogs[idx] = [];
      newLogs[idx].push(savedLog || logEntry);
      setDayLogs(newLogs);
      if (defaults.sets > 0 && newLogs[idx].length >= defaults.sets) toggleCheck(idx, true);
  };

  const deleteLoggedSet = async (exIdx, setIndex, logId) => {
      // Call Context to delete from Cloud & Local
      await deleteExerciseSet(logId, exIdx, setIndex);

      // Update UI state
      const newLogs = { ...dayLogs };
      newLogs[exIdx].splice(setIndex, 1);
      setDayLogs(newLogs);
  };

  const toggleCheck = (idx, forceState = null) => {
      setCheckedState(prev => {
          const newState = forceState !== null ? forceState : !prev[idx];
          const currentArr = JSON.parse(localStorage.getItem(`training_state_${dayKey}`) || '[]');
          let newArr;
          if (newState) { if (!currentArr.includes(idx)) newArr = [...currentArr, idx]; else newArr = currentArr; } 
          else { newArr = currentArr.filter(i => i !== idx); } 
          localStorage.setItem(`training_state_${dayKey}`, JSON.stringify(newArr));
          return { ...prev, [idx]: newState };
      });
  };

  const saveEditedSet = (exIdx, sIdx) => {
      const newLogs = { ...dayLogs };
      newLogs[exIdx][sIdx] = { ...newLogs[exIdx][sIdx], weight: editingSet.weight, reps: editingSet.reps, rpe: editingSet.rpe };
      setDayLogs(newLogs);
      localStorage.setItem(`training_logs_${dayKey}`, JSON.stringify(newLogs));
      setEditingSet(null);
  };

  const sortedExercises = currentData.exercises.map((ex, i) => ({ ...ex, originalIndex: i }))
      .sort((a, b) => {
          if (isEditMode) return a.originalIndex - b.originalIndex;
          return (checkedState[a.originalIndex] ? 1 : 0) - (checkedState[b.originalIndex] ? 1 : 0);
      });

  const restoreDefault = () => { if(confirm("Revert to System Default?")) revertPlan(); };
  const cleanWeight = (val) => val.toString().replace('kg','').replace('KG','').replace('BW','BW');

  const handleExport = () => {
      const exportObj = {
          date: weekDates[dayKey]?.fullDate || new Date().toISOString().split('T')[0],
          trainingTitle: data.title,
          exercises: data.exercises.map((ex, idx) => ({
              name: ex.exercise,
              type: ex.type,
              config: ex.config,
              loggedSets: dayLogs[idx] || []
          }))
      };
      
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `workout_${dayKey}_${exportObj.date}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

  return (
    <div className="pb-24">
      <h2 className="section-title px-4 pt-4">
        {currentData.title}
        <span className="header-actions">
            {!isEditMode && (
                <button onClick={handleExport} className="action-btn export-btn">
                    <Download size={12} /> Exp
                </button>
            )}
            
            {isEditMode ? (
                <>
                    <button onClick={handleCancel} className="action-btn">Cancel</button>
                    <button onClick={handleSave} className="action-btn edit-toggle-btn active-edit">Save</button>
                </>
            ) : (
                <button onClick={toggleEditMode} className="action-btn edit-toggle-btn">Edit</button>
            )}
            {isEditMode && isModified && <button onClick={restoreDefault} className="action-btn default-btn">Default</button>}
        </span>
      </h2>
      
      {isEditMode ? (
          <div className="mx-4 mb-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 uppercase font-bold">Type:</span>
                  <select 
                    className="edit-input-config" 
                    style={{width: 'auto'}}
                    value={currentData.day_type}
                    onChange={(e) => updateDraft({...currentData, day_type: e.target.value})}
                  >
                      <option value="Resistance">Resistance</option>
                      <option value="Cardio">Cardio</option>
                      <option value="Rest">Rest</option>
                  </select>
              </div>
              <textarea 
                className="edit-input-focus" 
                style={{minHeight: '80px'}}
                placeholder="Day Instructions..."
                value={currentData.instructions} 
                onChange={(e) => updateDraft({ ...currentData, instructions: e.target.value })}
              />
          </div>
      ) : (
          <RenderFormattedText text={currentData.instructions} className="instructions mx-4" />
      )}

      <div className="px-4">
        {sortedExercises.map((ex) => {
            const idx = ex.originalIndex;
            const isCompleted = checkedState[idx];
            const logs = dayLogs[idx] || [];
            const defaults = parseDefaults(ex.config);
            const isResistance = ex.type === 'Resistance';
            
            return (
              <div 
                key={idx} 
                className={`card training-${ex.type || 'Resistance'} ${isCompleted && !isEditMode ? 'completed' : ''}`}
                draggable={isEditMode}
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
              >
                <div className="card-content">
                  <div className="card-title">
                    {!isEditMode && <input type="checkbox" className="exercise-check" checked={!!isCompleted} onChange={() => toggleCheck(idx)} />}
                    {isEditMode && <GripVertical className="text-gray-500 cursor-grab" size={20} />}
                    
                    <div style={{ flexGrow: 1 }}>
                        {isEditMode ? (
                            <div className="flex flex-col gap-1">
                                <ExerciseAutocomplete 
                                    value={ex.exercise} 
                                    onChange={(val) => updateField(idx, 'exercise', val)}
                                    onSelect={(libraryEx) => handleSelectExercise(idx, libraryEx)}
                                />
                                <select 
                                    className="edit-input-config" 
                                    style={{width: 'auto', fontSize: '0.7rem', padding: '2px'}}
                                    value={ex.type} 
                                    onChange={(e) => updateField(idx, 'type', e.target.value)}
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
                          <input className="edit-input-config" value={ex.config} onChange={(e) => updateField(idx, 'config', e.target.value)} />
                      ) : (
                          <div className="card-config">{ex.config}</div>
                      )}
                  </div>

                  {(ex.focus || isEditMode) && (
                      <div className="mb-2">
                          {isEditMode ? (
                              <textarea className="edit-input-focus" value={ex.focus} onChange={(e) => updateField(idx, 'focus', e.target.value)} />
                          ) : (
                              <RenderFormattedText text={ex.focus} className="card-focus" />
                          )}
                      </div>
                  )}
                  
                  {!isEditMode && isResistance && (
                    <div className="set-module"> 
                        <ExerciseLogger defaultWeight="" defaultReps={defaults.reps} defaultRpe={defaults.rpe} onLog={(w, r, p) => handleLogSet(idx, w, r, p, ex.exercise, ex.focus, defaults)} />
                        
                        {logs.length > 0 && (
                            <div className="set-history">
                                {logs.map((l, i) => {
                                    const isEditing = editingSet?.exIdx === idx && editingSet?.sIdx === i;
                                    return (
                                        <div key={i} className="set-row">
                                            {isEditing ? (
                                                <div className="inline-edit-group">
                                                    <input type="number" className="inline-input-mini" value={editingSet.weight} onChange={v => setEditingSet({...editingSet, weight: v.target.value})} />
                                                    <input type="number" className="inline-input-mini" value={editingSet.reps} onChange={v => setEditingSet({...editingSet, reps: v.target.value})} />
                                                    <input type="number" className="inline-input-mini" value={editingSet.rpe} onChange={v => setEditingSet({...editingSet, rpe: v.target.value})} />
                                                    <button onClick={() => saveEditedSet(idx, i)} className="icon-btn save"><Check size={18}/></button>
                                                    <button onClick={() => setEditingSet(null)} className="icon-btn delete"><X size={18}/></button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="set-index">{i+1}.</div>
                                                    <div className="set-data-text">
                                                        <span className="set-label">KG:</span><span className="set-value">{cleanWeight(l.weight)}</span>
                                                        <span className="set-label">REPS:</span><span className="set-value">{l.reps}</span>
                                                        <span className="set-label">RPE:</span><span className="set-value">{l.rpe}</span>
                                                    </div>
                                                    <div className="set-actions">
                                                        <button onClick={() => setEditingSet({ exIdx: idx, sIdx: i, weight: l.weight.toString().replace('kg','').replace('BW',''), reps: l.reps, rpe: l.rpe === '-' ? '' : l.rpe })} className="icon-btn edit"><Pencil size={14} /></button>
                                                        <button onClick={() => deleteLoggedSet(idx, i, l.id)} className="icon-btn delete"><Trash2 size={14} /></button>
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
                {isEditMode && <button onClick={() => deleteExercise(idx)} className="exercise-delete-btn"><X size={20} /></button>}
              </div>
            );
        })}
      </div>
      {isEditMode && <button onClick={addExercise} className="add-btn-dashed mx-4">+ Add Item</button>}
    </div>
  );
};