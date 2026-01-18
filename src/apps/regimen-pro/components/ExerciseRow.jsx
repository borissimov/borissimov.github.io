import React from 'react';
import { Check, Trash2 } from 'lucide-react';

export const ExerciseRow = ({ 
    exercise, 
    setNumber, 
    roundNumber, 
    isLogged, 
    onLog, 
    onDelete,
    actualData = {}
}) => {
    return (
        <div className={`flex items-center gap-2 p-2 rounded-lg transition-all ${isLogged ? 'bg-green-500/10' : 'bg-[#252525]'}`}>
            <div className="w-6 text-[10px] font-black text-gray-500 text-center">
                {roundNumber ? `R${roundNumber}` : `S${setNumber}`}
            </div>
            
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{exercise.name}</p>
                <p className="text-[9px] text-gray-500 uppercase tracking-tighter">
                    Target: {exercise.target_reps} @ {exercise.target_weight}
                </p>
            </div>

            <div className="flex gap-1 items-center">
                <input 
                    type="number" 
                    placeholder="Kg"
                    className="w-12 bg-black/40 border border-[#333] rounded py-1 text-center text-xs focus:border-[#f29b11] outline-none"
                    defaultValue={actualData.weight}
                />
                <input 
                    type="number" 
                    placeholder="R"
                    className="w-10 bg-black/40 border border-[#333] rounded py-1 text-center text-xs focus:border-[#f29b11] outline-none"
                    defaultValue={actualData.reps}
                />
                <button 
                    onClick={() => onLog({ weight: 0, reps: 0, rpe: 0 })}
                    className={`ml-1 p-2 rounded-md border ${isLogged ? 'bg-green-500 border-green-500 text-black' : 'border-[#f29b11] text-[#f29b11]'}`}
                >
                    <Check size={14} strokeWidth={3} />
                </button>
            </div>
        </div>
    );
};
