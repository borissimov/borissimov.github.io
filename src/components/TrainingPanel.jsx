import React, { useState, useEffect } from 'react';
import { usePlan } from '../context/PlanContext';
import { DataModule } from '../data/DataModule'; // Direct import for sync
import { Trash2, GripVertical, Plus, Pencil, Check, X } from 'lucide-react';

const ExerciseLogger = ({ onLog }) => {
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");
    const [rpe, setRpe] = useState("");

    const handleLog = () => {
        if (!reps) { alert("Enter reps"); return; }
        onLog(weight, reps, rpe);
        setWeight(""); setReps(""); setRpe("");
    };

    return (
        <div className="set-logger">
            <div className="set-inputs">
                <input type="number" placeholder="kg" className="set-input" value={weight} onChange={e => setWeight(e.target.value)} />
                <input type="number" placeholder="reps" className="set-input" value={reps} onChange={e => setReps(e.target.value)} />
                <input type="number" placeholder="RPE" className="set-input" value={rpe} onChange={e => setRpe(e.target.value)} />
                <button onClick={handleLog}>LOG</button>
            </div>
        </div>
    );
};

export const TrainingPanel = ({ data, dayKey }) => {
  const { isEditMode, toggleEditMode, updateSection, revertPlan, logExerciseSet, session } = usePlan();
  const [dayLogs, setDayLogs] = useState({});
  const [checkedState, setCheckedState] = useState({});
  const [editingSet, setEditingSet] = useState(null);

  // Sync Logic
  useEffect(() => {
      const loadLogs = async () => {
          // 1. Load Local Immediately (Fast)
          const localLogs = JSON.parse(localStorage.getItem(`training_logs_${dayKey}`) || '{}');
          setDayLogs(localLogs);

          // 2. Sync from Cloud (Slow but accurate)
          if (session?.user?.id && data.exercises) {
              const syncedLogs = await DataModule.syncLogsForDay(session.user.id, dayKey, data.exercises);
              setDayLogs(syncedLogs);
          }
      };
      loadLogs();
      
      // Load checks
      setCheckedState(DataModule.getTrainingState(dayKey));
  }, [dayKey, data.exercises, session]); // Re-run if day or routine changes

  const handleLogSet = async (idx, weight, reps, rpe, exerciseName, focus) => {
      let tempo = "N/A";
      if(focus) {
          const match = focus.match(/Tempo:\s*([0-9-x]+)/i);
          if(match) tempo = match[1];
      }
      const cleanWeight = weight || "BW";
      
      const logEntry = { exerciseIndex: idx, exercise: exerciseName, weight: cleanWeight, reps: reps, rpe: rpe || "-", tempo: tempo, timestamp: new Date().toISOString() };
      await logExerciseSet(logEntry);
      
      // Optimistic update
      const newLogs = { ...dayLogs };
      if (!newLogs[idx]) newLogs[idx] = [];
      newLogs[idx].push(logEntry);
      setDayLogs(newLogs);
  };

  const deleteLoggedSet = (idx, setIndex) => {
      if(!confirm("Delete log?")) return;
      const newLogs = { ...dayLogs };
      newLogs[idx].splice(setIndex, 1);
      setDayLogs(newLogs);
      localStorage.setItem(`training_logs_${dayKey}`, JSON.stringify(newLogs));
  };

  const startEditingSet = (exIdx, sIdx, log) => {
      setEditingSet({ exIdx, sIdx, weight: log.weight.toString().replace('kg', '').replace('BW', ''), reps: log.reps, rpe: log.rpe === '-' ? '' : log.rpe });
  };

  const saveEditedSet = (exIdx, sIdx) => {
      const newLogs = { ...dayLogs };
      newLogs[exIdx][sIdx] = { ...newLogs[exIdx][sIdx], weight: editingSet.weight === "" ? "BW" : editingSet.weight, reps: editingSet.reps, rpe: editingSet.rpe || "-" };
      setDayLogs(newLogs);
      localStorage.setItem(`training_logs_${dayKey}`, JSON.stringify(newLogs));
      setEditingSet(null);
  };

  const toggleCheck = (idx) => {
      const newState = !checkedState[idx];
      // Optimistic state
      setCheckedState(p => ({...p, [idx]: newState}));
      
      // Persist via Module logic which saves to LS array
      // Re-reading logic from DataModule for consistency
      let currentArr = DataModule.getTrainingState(dayKey);
      if (currentArr.includes(idx)) currentArr = currentArr.filter(i => i !== idx); else currentArr.push(idx);
      DataModule.saveTrainingState(dayKey, currentArr);
  };

  // Drag Drop Handlers (Keep existing logic)
  const handleDragStart = (e, index) => { e.dataTransfer.setData('text/plain', index); };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, targetIndex) => {
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (sourceIndex === targetIndex) return;
    const newExercises = [...data.exercises];
    const [movedItem] = newExercises.splice(sourceIndex, 1);
    newExercises.splice(targetIndex, 0, movedItem);
    updateSection(dayKey, 'training', { ...data, exercises: newExercises });
  };

  // Edit Wrappers
  const addExercise = () => { updateSection(dayKey, 'training', { ...data, exercises: [...data.exercises, { exercise: "New Exercise", config: "3 x 10 @ 8 RPE", focus: "Focus..." }] }); };
  const deleteExercise = (i) => { if(confirm("Delete?")) updateSection(dayKey, 'training', { ...data, exercises: data.exercises.filter((_, idx) => idx !== i) }); };
  const updateField = (i, f, v) => { const n = [...data.exercises]; n[i][f] = v; updateSection(dayKey, 'training', { ...data, exercises: n }); };

  return (
    <div className="pb-24">
      <h2 className="section-title px-4 pt-4">
        {data.title}
        <span className="header-actions">
            <button onClick={toggleEditMode} className="action-btn edit-toggle-btn">{isEditMode ? "Save" : "Edit"}</button>
            <button onClick={() => confirm("Revert?") && revertPlan()} className="action-btn default-btn">Default</button>
        </span>
      </h2>
      
      {data.instructions && <div className="instructions mx-4" dangerouslySetInnerHTML={{ __html: data.instructions }} />}

      <div className="px-4">
        {data.exercises.map((ex, idx) => {
            const logs = dayLogs[idx] || [];
            const isCompleted = checkedState[idx]; // Visual state from local hook
            
            return (
              <div 
                key={idx} 
                className={`card training ${isCompleted ? 'completed' : ''}`}
                draggable={isEditMode}
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
              >
                {!isEditMode && (
                    <input type="checkbox" className="checkbox" checked={!!isCompleted} onChange={() => toggleCheck(idx)} />
                )}
                {isEditMode && <div style={{cursor:'grab', color:'#666', marginTop:5}}><GripVertical size={20} /></div>}
                
                <div className="card-content">
                  {isEditMode ? (
                      <input className="bg-transparent text-orange-400 font-bold text-lg w-full border-b border-gray-700 mb-1 focus:outline-none" value={ex.exercise} onChange={(e) => updateField(idx, 'exercise', e.target.value)} />
                  ) : (
                      <h3 className="card-title">{idx + 1}. {ex.exercise}</h3>
                  )}

                  <div className="card-config">
                      {isEditMode ? (
                          <input className="bg-neutral-800 text-white font-mono text-sm px-2 py-1 rounded w-full" value={ex.config} onChange={(e) => updateField(idx, 'config', e.target.value)} />
                      ) : ex.config}
                  </div>

                  {(ex.focus || isEditMode) && (
                      <div className="card-focus">
                          {isEditMode ? (
                              <textarea className="w-full bg-neutral-900 border border-gray-700 p-2 rounded text-xs mt-2" value={ex.focus} onChange={(e) => updateField(idx, 'focus', e.target.value)} />
                          ) : <div dangerouslySetInnerHTML={{ __html: ex.focus }} />}
                      </div>
                  )}
                  
                  {!isEditMode && (
                    <div className="mt-3">
                        <ExerciseLogger onLog={(w, r, p) => handleLogSet(idx, w, r, p, ex.exercise, ex.focus)} />
                        {logs.length > 0 && (
                            <div className="set-history">
                                {logs.map((l, i) => {
                                    const isEditingThis = editingSet?.exIdx === idx && editingSet?.sIdx === i;
                                    const weightLabel = l.weight.toString().includes('BW') ? 'BW' : (l.weight.toString().includes('kg') ? l.weight : l.weight + ' KG');
                                    
                                    return (
                                        <div key={i} className="set-row">
                                            {isEditingThis ? (
                                                <div className="inline-edit-group">
                                                    <input type="number" className="inline-input-mini" value={editingSet.weight} onChange={e => setEditingSet({...editingSet, weight: e.target.value})} />
                                                    <input type="number" className="inline-input-mini" value={editingSet.reps} onChange={e => setEditingSet({...editingSet, reps: e.target.value})} />
                                                    <input type="number" className="inline-input-mini" value={editingSet.rpe} onChange={e => setEditingSet({...editingSet, rpe: e.target.value})} />
                                                    <button onClick={() => saveEditedSet(idx, i)} className="icon-btn icon-green ml-auto"><Check size={18}/></button>
                                                    <button onClick={() => setEditingSet(null)} className="icon-btn icon-red"><X size={18}/></button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="set-index">Set {i+1}</div>
                                                    <div className="set-data">
                                                        <div className="log-pill">{weightLabel}</div>
                                                        <div className="set-separator">x</div>
                                                        <div className="log-pill">{l.reps} reps</div>
                                                        <div className="set-separator">@</div>
                                                        <div className="log-pill rpe">RPE {l.rpe}</div>
                                                    </div>
                                                    <div className="set-actions">
                                                        <button onClick={() => startEditingSet(idx, i, l)} className="icon-btn edit"><Pencil size={14} /></button>
                                                        <button onClick={() => deleteLoggedSet(idx, i)} className="icon-btn delete"><Trash2 size={14} /></button>
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
                {isEditMode && <button onClick={() => deleteExercise(idx)} className="text-red-500"><Trash2 size={20} /></button>}
              </div>
            );
        })}
      </div>
    </div>
  );
};
