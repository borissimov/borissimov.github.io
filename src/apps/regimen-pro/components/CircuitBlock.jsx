import React from 'react';
import { ExerciseRow } from './ExerciseRow';
import { RefreshCcw } from 'lucide-react';

export const CircuitBlock = ({ block }) => {
    const numRounds = 3; 

    return (
        <div className="regimen-pro-root font-sans">
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4 px-2">
                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <RefreshCcw className="text-blue-400" size={18} />
                </div>
                <div>
                    <h3 className="font-black text-sm uppercase tracking-wider">{block.label || 'Circuit'}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Vertical Flow Mode</p>
                </div>
            </div>

            {[...Array(numRounds)].map((_, rIdx) => (
                <div key={rIdx} className="relative pl-4 border-l-2 border-blue-500/20 space-y-3">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#121212] border-2 border-blue-500 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                    </div>
                    
                    <div className="text-[10px] font-black text-blue-500/60 uppercase tracking-[0.2em] mb-4 ml-2">
                        Round {rIdx + 1}
                    </div>
                    
                    <div className="space-y-3">
                        {block.exercises.map((ex) => (
                            <ExerciseRow 
                                key={`${rIdx}-${ex.id}`}
                                exercise={ex}
                                roundNumber={rIdx + 1}
                                onLog={() => {}}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
        </div>
    );
};