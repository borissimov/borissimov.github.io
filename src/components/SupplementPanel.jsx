import React, { useState } from 'react';
import { usePlan } from '../context/PlanContext';
import { useSectionLogic } from '../hooks/useSectionLogic';
import { Trash2, GripVertical } from 'lucide-react';

export const SupplementPanel = ({ data, dayKey }) => {
  const { isEditMode, toggleEditMode, checklistState, toggleChecklist, weekDates } = usePlan();
  
  const { handleDragStart, handleDragOver, handleDrop, addItem, deleteItem } = useSectionLogic(dayKey, 'supplements', data);

  const toggleCheck = (id, item) => {
      const date = weekDates[dayKey]?.fullDate;
      const stateKey = `${date}_${id}`;
      const isChecked = checklistState[stateKey];
      toggleChecklist(id, !isChecked, dayKey, item);
  };

  const onAddItem = () => addItem({ title: "New Supp", items: [] });

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
                            const date = weekDates[dayKey]?.fullDate;
                            const stateKey = `${date}_${uniqueId}`;
                            const isChecked = checklistState[stateKey];

                            return (
                                <div key={itemIdx} className={`nutr-row ${isChecked ? 'completed' : ''}`}>
                                    <div className="nutr-left">
                                        {!isEditMode && (
                                            <input 
                                                type="checkbox" 
                                                className="supplement-check"
                                                checked={!!isChecked} 
                                                onChange={() => toggleCheck(uniqueId, item)}
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
            <button onClick={onAddItem} className="add-btn-dashed">+ Add Block</button>
          </div>
      )}
    </div>
  );
};