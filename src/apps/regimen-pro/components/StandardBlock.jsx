import React from 'react';
import { ExerciseRow } from './ExerciseRow';
import { Dumbbell } from 'lucide-react';

export const StandardBlock = ({ block }) => {
    return (
        <div className="regimen-pro-root font-sans">
        <div className="space-y-10">
            <div className="flex items-center gap-3 mb-4 px-2">
                <div className="p-2 bg-[#f29b11]/10 rounded-lg border border-[#f29b11]/20">
                    <Dumbbell className="text-[#f29b11]" size={18} />
                </div>
                <div>
                    <h3 className="font-black text-sm uppercase tracking-wider">{block.label || 'Strength Block'}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Standard Set Mode</p>
                </div>
            </div>

            <div className="space-y-8">
                {block.exercises.map(ex => (
                    <div key={ex.id} className="space-y-3">
                        {/* Compact sub-header for exercise name */}
                        <div className="flex items-center gap-2 px-1">
                            <div className="w-1 h-4 bg-[#f29b11] rounded-full"></div>
                            <h4 className="text-xs font-black uppercase text-gray-300 tracking-tight">{ex.name}</h4>
                        </div>

                        <div className="space-y-3">
                            {[...Array(parseInt(ex.target_sets || 3))].map((_, sIdx) => (
                                <ExerciseRow 
                                    key={sIdx}
                                    exercise={ex}
                                    setNumber={sIdx + 1}
                                    onLog={() => {}}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};