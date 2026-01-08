import React, { useState, useEffect } from 'react';
import { usePlan } from '../context/PlanContext';
import { DataModule } from '../data/DataModule';
import { Trash2, GripVertical } from 'lucide-react';

export const SupplementPanel = ({ data, dayKey }) => {
  const { isEditMode, toggleEditMode, updateSection } = usePlan();
  const [checkedState, setCheckedState] = useState({});

  useEffect(() => {
      const savedChecks = JSON.parse(localStorage.getItem('nutrition_plan_checkboxes') || '{}');
      setCheckedState(savedChecks);
  }, []);

  const toggleCheck = (id) => {
      setCheckedState(prev => {
          const newState = !prev[id];
          DataModule.saveCheckboxState(id, newState);
          return { ...prev, [id]: newState };
      });
  };

  const handleDragStart = (e, index) => { e.dataTransfer.setData('text/plain', index); };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, targetIndex) => {
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (sourceIndex === targetIndex) return;
    const newItems = [...data.events];
    const [movedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(targetIndex, 0, movedItem);
    updateSection(dayKey, 'supplements', { ...data, events: newItems });
  };

  const addItem = () => {
      updateSection(dayKey, 'supplements', { ...data, events: [...data.events, { title: "New Supp", items: [] }] });
  };

  const deleteItem = (index) => {
      if(!confirm("Delete?")) return;
      updateSection(dayKey, 'supplements', { ...data, events: data.events.filter((_, i) => i !== index) });
  };

  return (
    <div className="supplements-panel pb-24">
      <h2 className="section-title supplements px-4 pt-4">
        {data.title}
        <span className="header-actions">
            <button onClick={toggleEditMode} className="action-btn edit-toggle-btn">{isEditMode ? "Save" : "Edit"}</button>
        </span>
      </h2>

      <div className="px-4">
        {(!data.events || data.events.length === 0) ? (
            <div className="text-gray-500 text-center py-4 italic">No supplements scheduled.</div>
        ) : (
            data.events.map((event, idx) => (
                <div 
                    key={idx} 
                    className="card supplements"
                    draggable={isEditMode}
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, idx)}
                >
                    <div className="nutr-header">
                        <span className="nutr-time text-blue-400">{event.time}</span>
                        <span className="nutr-action">{event.action}</span>
                    </div>

                    <div className="nutr-body">
                        {event.items && event.items.map((item, itemIdx) => {
                            const uniqueId = `${dayKey}-supp-${idx}-${itemIdx}`;
                            const isChecked = checkedState[uniqueId];

                            return (
                                <div key={itemIdx} className="nutr-row">
                                    <div className="nutr-left">
                                        {!isEditMode && (
                                            <input 
                                                type="checkbox" 
                                                className="supplement-check"
                                                checked={!!isChecked} 
                                                onChange={() => toggleCheck(uniqueId)}
                                            />
                                        )}
                                        {isEditMode && <GripVertical className="text-gray-500 mr-2 cursor-grab" size={20} />}
                                        <div className="nutr-name">{item.name}</div>
                                    </div>
                                    <div className="nutr-right">
                                        <div className="nutr-dosage text-blue-200">{item.dosage}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {isEditMode && (
                        <button onClick={() => deleteItem(idx)} className="icon-btn delete mt-2 w-full flex justify-center"><Trash2 size={18} /></button>
                    )}
                </div>
            ))
        )}
      </div>

      {isEditMode && (
          <div className="px-4">
            <button onClick={addItem} className="add-btn-dashed">+ Add Block</button>
          </div>
      )}
    </div>
  );
};
