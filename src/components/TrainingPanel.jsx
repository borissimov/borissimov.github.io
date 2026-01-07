import React, { useState, useEffect } from 'react';
import { usePlan } from '../context/PlanContext';
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
  const { isEditMode, toggleEditMode, updateSection, revertPlan, logExerciseSet } = usePlan();
  const [dayLogs, setDayLogs] = useState({});
  const [editingSet, setEditingSet] = useState(null);

  useEffect(() => {
      const savedLogs = JSON.parse(localStorage.getItem(`training_logs_${dayKey}`) || '{}');
      setDayLogs(savedLogs);
  }, [dayKey]);

  const handleLogSet = async (idx, weight, reps, rpe, exerciseName, focus) => {
      let tempo = "N/A";
      if(focus) {
          const match = focus.match(/Tempo:\s*([0-9-x]+)/i);
          if(match) tempo = match[1];
      }
      // Sanitize weight to be a number/string without duplicate units
      const cleanWeight = weight || "BW";
      
      const logEntry = { exerciseIndex: idx, exercise: exerciseName, weight: cleanWeight, reps: reps, rpe: rpe || "-", tempo: tempo, timestamp: new Date().toISOString() };
      await logExerciseSet(logEntry);
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
            return (
              <div key={idx} className="card training">
                <div className="card-content">
                  <h3 className="card-title">{idx + 1}. {ex.exercise}</h3>
                  <div className="card-config">{ex.config}</div>
                  {ex.focus && <div className="card-focus" dangerouslySetInnerHTML={{ __html: ex.focus }} />}
                  
                  {!isEditMode && (
                    <div className="mt-3">
                        <ExerciseLogger onLog={(w, r, p) => handleLogSet(idx, w, r, p, ex.exercise, ex.focus)} />
                        {logs.length > 0 && (
                            <div className="set-history">
                                {logs.map((l, i) => {
                                    const isEditingThis = editingSet?.exIdx === idx && editingSet?.sIdx === i;
                                    const weightLabel = l.weight.toString().includes('BW') ? 'BW' : `${l.weight} KG`;
                                    
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
                                                        <div className="log-pill">RPE {l.rpe}</div>
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
              </div>
            );
        })}
      </div>
    </div>
  );
};