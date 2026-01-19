import React from 'react';
import { Check, History } from 'lucide-react';

export const ExerciseRow = ({ 
    exercise, 
    setNumber, 
    roundNumber, 
    isLogged, 
    onLog, 
    actualData = {}
}) => {
    return (
        <div className="regimen-pro-root font-sans">
        <div className={`group flex flex-col gap-3 p-4 rounded-[24px] transition-all duration-500 border ${
            isLogged 
            ? 'bg-green-950/20 border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.1)]' 
            : 'bg-[#161616] border-white/5 hover:border-[#f29b11]/30 shadow-xl'
        }`}>
            {/* Header: Label & Info */}
            <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-3">
                    <div className={`text-[10px] font-black px-2.5 py-1 rounded-lg tracking-widest ${
                        isLogged ? 'bg-green-500 text-black' : 'bg-[#222] text-gray-500 group-hover:text-[#f29b11]'
                    }`}>
                        {roundNumber ? `RD ${roundNumber}` : `SET ${setNumber}`}
                    </div>
                    <span className="text-sm font-black text-white uppercase tracking-tight">{exercise.name}</span>
                </div>
                
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/40 border border-white/5">
                    <History size={12} className="text-[#f29b11]" />
                    <span className="text-[10px] font-black text-[#f29b11] uppercase tracking-wider">
                        {exercise.target_weight} <span className="text-gray-600">x</span> {exercise.target_reps}
                    </span>
                </div>
            </div>

            {/* Controls: Inputs & Log Button */}
            <div className="flex gap-3 items-center">
                <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="relative group/input">
                        <input 
                            type="number" 
                            inputMode="decimal"
                            placeholder="0.0"
                            className="w-full bg-black border-2 border-[#222] group-hover/input:border-[#f29b11]/20 rounded-2xl py-4 text-center text-xl font-black text-white focus:border-[#f29b11] focus:ring-4 focus:ring-[#f29b11]/10 outline-none transition-all shadow-inner"
                            defaultValue={actualData.weight}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-700 uppercase tracking-widest pointer-events-none">Kg</div>
                    </div>
                    <div className="relative group/input">
                        <input 
                            type="number" 
                            inputMode="numeric"
                            placeholder="0"
                            className="w-full bg-black border-2 border-[#222] group-hover/input:border-[#f29b11]/20 rounded-2xl py-4 text-center text-xl font-black text-white focus:border-[#f29b11] focus:ring-4 focus:ring-[#f29b11]/10 outline-none transition-all shadow-inner"
                            defaultValue={actualData.reps}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-700 uppercase tracking-widest pointer-events-none">Reps</div>
                    </div>
                </div>

                <button 
                    onClick={() => onLog({ weight: 0, reps: 0 })}
                    className={`h-[60px] w-16 flex items-center justify-center rounded-2xl border-2 transition-all duration-300 active:scale-90 ${
                        isLogged 
                        ? 'bg-green-500 border-green-400 text-black shadow-[0_0_25px_rgba(34,197,94,0.4)]' 
                        : 'bg-[#1a1a1a] border-[#222] text-gray-600 hover:border-[#f29b11] hover:text-[#f29b11] hover:shadow-[0_0_20px_rgba(242,155,17,0.15)]'
                    }`}
                >
                    <Check size={32} strokeWidth={4} />
                </button>
            </div>
        </div>
        </div>
    );
};