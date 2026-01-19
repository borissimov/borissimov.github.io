import React from 'react';
import { SequentialSetLogger } from './SequentialSetLogger';

export const StandardBlock = ({ block }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {block.exercises.map(ex => (
                <SequentialSetLogger key={ex.id} exercise={ex} blockId={block.id} />
            ))}
        </div>
    );
};