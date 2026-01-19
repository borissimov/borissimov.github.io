import React from 'react';
import { ExerciseRow } from './ExerciseRow';
import { RefreshCcw } from 'lucide-react';

export const CircuitBlock = ({ block }) => {
    // CurrentRound is handled by the group completion logic or session state in V2
    // For this prototype, we'll keep it simple: all exercises are visible and manage their own 3 rounds.
    
    return (
        <div style={{ padding: '0 0 12px 0' }}>
            <div className="section-header" style={{ marginBottom: '16px' }}>
                <RefreshCcw size={14} /> {block.label || 'CIRCUIT'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {block.exercises.map((ex) => (
                    <ExerciseRow 
                        key={ex.id}
                        exercise={ex}
                        roundNumber={1} // In V2, this will be driven by the session's active round
                        onLog={() => {}}
                    />
                ))}
            </div>
        </div>
    );
};