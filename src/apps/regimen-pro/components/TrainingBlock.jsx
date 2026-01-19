import React from 'react';
import { CircuitBlock } from './CircuitBlock';
import { StandardBlock } from './StandardBlock';

export const TrainingBlock = ({ block, index, totalBlocks }) => {
    return (
        <div>
            {block.block_type === 'CIRCUIT' ? (
                <CircuitBlock block={block} />
            ) : (
                <StandardBlock block={block} />
            )}
        </div>
    );
};