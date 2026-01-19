import React from 'react';
import { ExerciseRow } from './ExerciseRow';
import { RefreshCcw } from 'lucide-react';

export const CircuitBlock = ({ block }) => {
    const numRounds = 3; 

    return (
        <div className="space-y-6">
            <div className="section-header">
                <RefreshCcw size={14} /> {block.label || 'CIRCUIT'}
            </div>

            {[...Array(numRounds)].map((_, rIdx) => (
                <div key={rIdx} style={{ marginBottom: '25px' }}>
                    <div style={{ 
                        fontSize: '10px', 
                        fontWeight: '900', 
                        color: '#444', 
                        textTransform: 'uppercase', 
                        letterSpacing: '1px',
                        marginBottom: '10px',
                        borderBottom: '1px solid #222',
                        paddingBottom: '4px'
                    }}>
                        Round {rIdx + 1}
                    </div>
                    
                    <div>
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
    );
};
