import React from 'react';
import { ExerciseRow } from './ExerciseRow';

export const StandardBlock = ({ block }) => {
    return (
        <div className="space-y-4">
            {block.exercises.map(ex => (
                <div key={ex.id} className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#222]">
                    <h3 className="font-bold text-sm mb-3 ml-1">{ex.name}</h3>
                    <div className="space-y-2">
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
    );
};
