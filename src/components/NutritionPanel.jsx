import React from 'react';
import { usePlan } from '../context/PlanContext';
import { Trash2 } from 'lucide-react';

export const NutritionPanel = ({ data, dayKey }) => {
  const { isEditMode, daysMap, updateSection } = usePlan();

  const updateNutrition = (newData) => {
      updateSection(dayKey, 'nutrition', newData);
  };

  const addItem = (eventIdx) => {
      const newEvents = [...data.events];
      newEvents[eventIdx].items.push({ name: "New Item", dosage: "100 g" });
      updateNutrition({ ...data, events: newEvents });
  };

  const deleteItem = (eventIdx, itemIdx) => {
      if(!confirm("Delete item?")) return;
      const newEvents = [...data.events];
      newEvents[eventIdx].items.splice(itemIdx, 1);
      updateNutrition({ ...data, events: newEvents });
  };

  const updateItem = (eventIdx, itemIdx, field, value) => {
      const newEvents = [...data.events];
      newEvents[eventIdx].items[itemIdx][field] = value;
      updateNutrition({ ...data, events: newEvents });
  };

  const addEvent = () => {
      updateNutrition({ ...data, events: [...data.events, { time: "Meal Time", action: "New Meal", items: [] }] });
  };

  const deleteEvent = (eventIdx) => {
      if(!confirm("Delete meal?")) return;
      const newEvents = [...data.events];
      newEvents.splice(eventIdx, 1);
      updateNutrition({ ...data, events: newEvents });
  };

  const updateEvent = (eventIdx, field, value) => {
      const newEvents = [...data.events];
      newEvents[eventIdx][field] = value;
      updateNutrition({ ...data, events: newEvents });
  };

  // Helper to persist checkbox state (since it's UI state, not data model state usually, but we store it in LS separately in original app)
  // For React refactor, we can just toggle a local state or use the same LS key approach.
  // We'll stick to the "DataModule" helper approach for consistency with the HTML version's behavior.
  const toggleCheck = (id, checked) => {
      // Accessing the raw localStorage helper exposed on window for compatibility or implementing a hook.
      // Since we want "React best practices", this should ideally be in context, but for visual parity:
      const s = JSON.parse(localStorage.getItem('nutrition_plan_checkboxes') || '{}');
      s[id] = checked;
      localStorage.setItem('nutrition_plan_checkboxes', JSON.stringify(s));
      // Force re-render is handled by parent context refresh usually, but here we might need local state update.
      // A quick hack for this specific legacy feature without full refactor:
      window.dispatchEvent(new Event('storage')); // Simple trigger if we were listening, but we aren't.
      // We'll just rely on React state if we move this state to the main data object later.
      // For now, let's just force update via a dummy state or context.
      // Actually, let's just make it a controlled input reading from LS directly? No, that's slow.
      // We will allow the input to be uncontrolled with defaultChecked for now to keep it simple and fast.
  };

  const getCheckState = (id) => {
      return (JSON.parse(localStorage.getItem('nutrition_plan_checkboxes') || '{}'))[id] || false;
  };

  return (
    <div className="pb-24">
      <h2 className="section-title text-green-500 px-4 pt-4">{data.title}</h2>
      
      <div className="summary-box nutrition mx-4">
        <div className="summary-row"><span>Input:</span> <span className="font-mono text-white">{data.input}</span></div>
        <div className="summary-row"><span>Output:</span> <span className="font-mono text-white">{data.output}</span></div>
        <div className="summary-row border-t border-gray-700 mt-2 pt-2"><span>Deficit:</span> <span className="font-bold text-green-400">{data.deficit}</span></div>
      </div>

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
                    <span className="event-title">{ev.time !== "Meal Time" ? `${ev.time} - ` : ""}{ev.action}</span>
                )}
                {isEditMode && <button onClick={() => deleteEvent(evIdx)} className="text-red-500"><Trash2 size={16}/></button>}
            </div>

            {/* List */}
            <div className="supplements-list-container">
                {ev.items.map((item, itIdx) => {
                    const id = `${dayKey}-nutri-${evIdx}-${itIdx}`;
                    
                    // Parse Dosage vs Macros
                    // HTML version had: "300 g <span class='macro-stats'>(p:54...)"
                    // We need to robustly handle this string.
                    let cleanDosage = item.dosage;
                    let macros = "";
                    
                    // Regex to extract macros if they exist in parens or span
                    // Try to split by known macro patterns or HTML tags
                    const htmlStrip = item.dosage.replace(/<[^>]*>?/gm, ''); // Remove spans
                    // Typically: "300 g (p:54...)"
                    const parenMatch = htmlStrip.match(/(.*)(\(.*\))$/);
                    
                    if (parenMatch) {
                        cleanDosage = parenMatch[1].trim();
                        macros = parenMatch[2].trim();
                    } else {
                        cleanDosage = htmlStrip;
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
                                            value={item.dosage} // Edit full raw string
                                            onChange={(e) => updateItem(evIdx, itIdx, 'dosage', e.target.value)}
                                        />
                                    ) : (
                                        <>
                                            <span className="dosage-text">{cleanDosage}</span>
                                            {macros && <span className="sub-text">{macros}</span>}
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
                    + Add Food
                </button>
            )}
          </div>
        ))}
      </div>

      {isEditMode && (
        <div className="px-4">
            <button onClick={addEvent} className="add-btn-dashed flex justify-center items-center gap-2">
                <Plus size={16} /> Add Meal
            </button>
        </div>
      )}
    </div>
  );
};