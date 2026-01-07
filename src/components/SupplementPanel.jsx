import React from 'react';
import { usePlan } from '../context/PlanContext';
import { Trash2, Plus } from 'lucide-react';

export const SupplementPanel = ({ data, dayKey }) => {
  const { isEditMode, daysMap, updateSection } = usePlan();

  const updateSupplements = (newData) => {
      updateSection(dayKey, 'supplements', newData);
  };

  const addItem = (eventIdx) => {
      const newEvents = [...data.events];
      newEvents[eventIdx].items.push({ name: "New Supp", dosage: "1 dose" });
      updateSupplements({ ...data, events: newEvents });
  };

  const deleteItem = (eventIdx, itemIdx) => {
      if(!confirm("Delete item?")) return;
      const newEvents = [...data.events];
      newEvents[eventIdx].items.splice(itemIdx, 1);
      updateSupplements({ ...data, events: newEvents });
  };

  const updateItem = (eventIdx, itemIdx, field, value) => {
      const newEvents = [...data.events];
      newEvents[eventIdx].items[itemIdx][field] = value;
      updateSupplements({ ...data, events: newEvents });
  };

  const addEvent = () => {
      updateSupplements({ ...data, events: [...data.events, { time: "00:00", action: "Timing", items: [] }] });
  };

  const deleteEvent = (eventIdx) => {
      if(!confirm("Delete event?")) return;
      const newEvents = [...data.events];
      newEvents.splice(eventIdx, 1);
      updateSupplements({ ...data, events: newEvents });
  };

  const updateEvent = (eventIdx, field, value) => {
      const newEvents = [...data.events];
      newEvents[eventIdx][field] = value;
      updateSupplements({ ...data, events: newEvents });
  };

  const toggleCheck = (id, checked) => {
      const s = JSON.parse(localStorage.getItem('nutrition_plan_checkboxes') || '{}');
      s[id] = checked;
      localStorage.setItem('nutrition_plan_checkboxes', JSON.stringify(s));
  };

  const getCheckState = (id) => {
      return (JSON.parse(localStorage.getItem('nutrition_plan_checkboxes') || '{}'))[id] || false;
  };

  return (
    <div className="pb-24">
      <h2 className="section-title text-blue-500 px-4 pt-4">{data.title}</h2>

      <div className="px-4 space-y-6">
        {data.events.map((ev, evIdx) => (
          <div key={evIdx} className="bg-neutral-900 rounded-lg p-3 border border-gray-800">
            {/* Header */}
            <div className="event-header">
                {isEditMode ? (
                    <input 
                        className="bg-transparent text-white font-bold w-full border-b border-gray-700 focus:outline-none"
                        value={ev.action}
                        onChange={(e) => updateEvent(evIdx, 'action', e.target.value)}
                    />
                ) : (
                    <span className="event-title">{ev.time && ev.time !== "00:00" ? `${ev.time} - ` : ""}{ev.action}</span>
                )}
                {isEditMode && <button onClick={() => deleteEvent(evIdx)} className="text-red-500"><Trash2 size={16}/></button>}
            </div>

            {/* List */}
            <div className="supplements-list-container">
                {ev.items.map((item, itIdx) => {
                    const id = `${dayKey}-supp-${evIdx}-${itIdx}`;
                    
                    // Logic: Split "1 scoop (5g)"
                    let mainDose = item.dosage;
                    let subDose = "";
                    
                    // Check for parenthesis
                    const parenMatch = item.dosage.match(/(.*)(\(.*\))$/);
                    if (parenMatch) {
                        mainDose = parenMatch[1].trim();
                        subDose = parenMatch[2].trim();
                    }

                    return (
                        <div key={itIdx} className="list-item-row">
                            <label className="list-label">
                                <span className="left-side">
                                    {!isEditMode && (
                                        <input 
                                            type="checkbox" 
                                            defaultChecked={getCheckState(id)} 
                                            onChange={(e) => toggleCheck(id, e.target.checked)} 
                                        />
                                    )}
                                    {isEditMode ? (
                                        <input 
                                            className="inline-edit-input"
                                            value={item.name}
                                            onChange={(e) => updateItem(evIdx, itIdx, 'name', e.target.value)}
                                        />
                                    ) : (
                                        <span className="item-name">{item.name}</span>
                                    )}
                                </span>
                                
                                <span className="right-side">
                                    {isEditMode ? (
                                        <input 
                                            className="inline-edit-input text-right"
                                            value={item.dosage}
                                            onChange={(e) => updateItem(evIdx, itIdx, 'dosage', e.target.value)}
                                        />
                                    ) : (
                                        <>
                                            <span className="dosage-text">{mainDose}</span>
                                            {subDose && <span className="sub-text">{subDose}</span>}
                                        </>
                                    )}
                                </span>
                            </label>
                            
                            {isEditMode && (
                                <button onClick={() => deleteItem(evIdx, itIdx)} className="delete-item-btn">×</button>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {isEditMode && (
                <button onClick={() => addItem(evIdx)} className="w-full text-center text-xs text-gray-500 border border-dashed border-gray-700 mt-3 py-2 rounded hover:text-white transition-colors">
                    + Add Supplement
                </button>
            )}
          </div>
        ))}
      </div>

      {isEditMode && (
        <div className="px-4">
            <button onClick={addEvent} className="add-btn-dashed flex justify-center items-center gap-2">
                <Plus size={16} /> Add Timing
            </button>
        </div>
      )}
    </div>
  );
};