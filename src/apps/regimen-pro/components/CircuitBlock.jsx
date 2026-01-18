import React from 'react';
import { ExerciseRow } from './ExerciseRow';

export const CircuitBlock = ({ block, logs = [] }) => {
    // Generate Round Groups (e.g., Round 1, Round 2, Round 3)
    // For a circuit, we usually iterate through all exercises per round
    const numRounds = 3; // This would come from block metadata

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2 px-2">
                <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase rounded border border-blue-500/30">
                    Circuit
                </div>
                <h3 className="font-bold text-sm tracking-tight">{block.label || 'Multi-Movement Circuit'}</h3>
            </div>

            {[...Array(numRounds)].map((_, rIdx) => (
                <div key={rIdx} className="bg-[#1a1a1a] rounded-2xl p-3 border border-[#222]">
                    <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3 ml-1 flex justify-between items-center">
                        <span>Round {rIdx + 1} of {numRounds}</span>
                        <span className="text-blue-500/50">Vertical Flow</span>
                    </div>
                    
                    <div className="space-y-2">
                        {block.exercises.map((ex, eIdx) => (
                            <ExerciseRow 
                                key={ex.id}
                                exercise={ex}
                                roundNumber={rIdx + 1}
                                onLog={() => {}}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
