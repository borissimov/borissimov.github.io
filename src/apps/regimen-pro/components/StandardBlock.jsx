import React from 'react';
import { SequentialSetLogger } from './SequentialSetLogger';
import { Dumbbell } from 'lucide-react';

export const StandardBlock = ({ block }) => {
    return (
        <div>
            <div className="section-header" style={{ marginBottom: '12px' }}>
                <Dumbbell size={14} /> {block.label || 'STRENGTH BLOCK'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {block.exercises.map(ex => (
                    <SequentialSetLogger key={ex.id} exercise={ex} blockId={block.id} />
                ))}
            </div>
        </div>
    );
};