import React from 'react';
import { ExerciseRow } from './ExerciseRow';
import { RefreshCcw } from 'lucide-react';

export const CircuitBlock = ({ block }) => {
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
                        blockId={block.id}
                        onLog={() => {}}
                    />
                ))}
            </div>
        </div>
    );
};