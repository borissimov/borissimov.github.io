import React from 'react';
import { ExerciseRow } from './ExerciseRow';

export const CircuitBlock = ({ block }) => {
    return (
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
    );
};