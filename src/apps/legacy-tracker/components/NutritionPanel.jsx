import React, { useState } from 'react';
import { usePlan } from '../../../context/PlanContext';
import { useSectionLogic } from '../../../hooks/useSectionLogic';
import { Trash2, GripVertical } from 'lucide-react';

export const NutritionPanel = ({ data, dayKey }) => {
  const { isEditMode, toggleEditMode, checklistState, toggleChecklist, weekDates } = usePlan();
  
  const { handleDragStart, handleDragOver, handleDrop, addItem, deleteItem } = useSectionLogic(dayKey, 'nutrition', data);

  const toggleCheck = (id, item) => {
      const date = weekDates[dayKey]?.fullDate;
      const stateKey = `${date}_${id}`;
      const isChecked = checklistState[stateKey];
      toggleChecklist(id, !isChecked, dayKey, item);
  };

  const onAddItem = () => addItem({ title: "New Meal", details: "Details", items: [] });

  if (!data) return <div className="p-4 text-white">No Nutrition Data Loaded</div>;

  return (
    <div className="nutrition-panel pb-24">
      <h2 className="section-title nutrition px-4 pt-4">
        {data.title}
        <span className="header-actions">
            <button onClick={toggleEditMode} className="action-btn edit-toggle-btn">{isEditMode ? "Save" : "Edit"}</button>
        </span>
      </h2>

      <div className="card nutrition mx-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-center">
              <div><span className="text-gray-500 text-xs uppercase font-bold">Input</span><div className="text-white font-mono">{data.input}</div></div>
              <div><span className="text-gray-500 text-xs uppercase font-bold">Output</span><div className="text-white font-mono">{data.output}</div></div>
              <div className="col-span-2 pt-2 border-t border-gray-800"><span className="text-gray-500 text-xs uppercase font-bold">Deficit</span><div className="text-green-400 font-mono font-bold">{data.deficit}</div></div>
          </div>
      </div>

      <div className="px-4">
        {(!data.events || data.events.length === 0) ? (
            <div className="text-gray-500 text-center py-4 italic">No meals scheduled.</div>
        ) : (
            data.events.map((event, idx) => (
                <div 
                    key={idx} 
                    className="card nutrition"
                    draggable={isEditMode}
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, idx)}
                >
                    <div className="nutr-header">
                        <span className="nutr-time">{event.time}</span>
                        <span className="nutr-action">{event.action}</span>
                    </div>

                    <div className="nutr-body">
                        {event.items && event.items.map((item, itemIdx) => {
                            const uniqueId = `${dayKey}-nutr-${idx}-${itemIdx}`;
                            const date = weekDates[dayKey]?.fullDate;
                            const stateKey = `${date}_${uniqueId}`;
                            const isChecked = checklistState[stateKey];

                            return (
                                <div key={itemIdx} className={`nutr-row ${isChecked ? 'completed' : ''}`}>
                                    <div className="nutr-left">
                                        {!isEditMode && (
                                            <input 
                                                type="checkbox" 
                                                className="nutrition-check"
                                                checked={!!isChecked} 
                                                onChange={() => toggleCheck(uniqueId, item)}
                                            />
                                        )}
                                        {isEditMode && <GripVertical className="text-gray-500 mr-2 cursor-grab" size={20} />}
                                        <div className="nutr-name">{item.name}</div>
                                    </div>
                                    <div className="nutr-right">
                                        <div className="nutr-dosage" dangerouslySetInnerHTML={{ __html: item.dosage }}></div>
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
            <button onClick={onAddItem} className="add-btn-dashed">+ Add Meal Block</button>
          </div>
      )}
    </div>
  );
};