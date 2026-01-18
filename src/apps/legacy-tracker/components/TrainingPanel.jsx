import React, { useState, useEffect, useMemo } from 'react';
import { usePlan } from '../../../context/PlanContext';
import { DataManager } from '../../../data/DataManager';
import { useTrainingLogic } from '../hooks/useTrainingLogic';
import { ExerciseCard } from './training/ExerciseCard';
import { Download } from 'lucide-react';

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
  const { isEditMode, toggleEditMode, updateSection, revertPlan, weekDates } = usePlan();
  
  // Custom Hook for Logic
  const { 
      dayLogs, 
      checkedState, 
      addSet, 
      removeSet, 
      updateSet, 
      toggleExerciseCheck 
  } = useTrainingLogic(dayKey, data.exercises);

  const [draftData, setDraftData] = useState(null);

  useEffect(() => {
      if (isEditMode) setDraftData(JSON.parse(JSON.stringify(data)));
      else setDraftData(null);
  }, [isEditMode, data]);

  const currentData = isEditMode && draftData ? draftData : data;

  const isModified = useMemo(() => {
      const defaultDay = DataManager.getDefaultPlan()[dayKey]?.training;
      if (!defaultDay) return false;
      if (defaultDay.title !== data.title) return false;

      const currentJson = JSON.stringify({
          exercises: data.exercises.map(e => ({ exercise: e.exercise, config: e.config, focus: e.focus, type: e.type })),
          instructions: data.instructions
      });
      const defaultJson = JSON.stringify({
          exercises: defaultDay.exercises.map(e => ({ exercise: e.exercise, config: e.config, focus: DataManager.cleanHtml(e.focus), type: e.type })),
          instructions: DataManager.cleanHtml(defaultDay.instructions)
      });
      return currentJson !== defaultJson;
  }, [data, dayKey]);

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

  const sortedExercises = currentData.exercises.map((ex, i) => ({ ...ex, originalIndex: i }))
      .sort((a, b) => {
          if (isEditMode) return a.originalIndex - b.originalIndex;
          return (checkedState[a.originalIndex] ? 1 : 0) - (checkedState[b.originalIndex] ? 1 : 0);
      });

  const restoreDefault = () => { if(confirm("Revert to System Default?")) revertPlan(); };

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
        {sortedExercises.map((ex) => (
            <ExerciseCard 
                key={ex.originalIndex}
                ex={ex}
                idx={ex.originalIndex}
                isEditMode={isEditMode}
                isCompleted={checkedState[ex.originalIndex]}
                logs={dayLogs[ex.originalIndex] || []}
                onToggleCheck={toggleExerciseCheck}
                onUpdateField={updateField}
                onDeleteExercise={deleteExercise}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onLogSet={addSet}
                onDeleteSet={removeSet}
                onUpdateSet={updateSet}
            />
        ))}
      </div>
      {isEditMode && <button onClick={addExercise} className="add-btn-dashed mx-4">+ Add Item</button>}
    </div>
  );
};
