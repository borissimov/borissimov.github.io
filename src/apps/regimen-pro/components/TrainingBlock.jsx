import React from 'react';
import { CircuitBlock } from './CircuitBlock';
import { StandardBlock } from './StandardBlock';

export const TrainingBlock = ({ block, index, totalBlocks }) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-[10px] font-black text-[#f29b11]/40 uppercase tracking-[0.3em] mb-4 text-center">
                Block {index + 1} of {totalBlocks}
            </div>
            
            {block.block_type === 'CIRCUIT' ? (
                <CircuitBlock block={block} />
            ) : (
                <StandardBlock block={block} />
            )}
            
            <div className="h-8 flex items-center justify-center">
                <div className="w-px h-full bg-gradient-to-b from-[#333] to-transparent"></div>
            </div>
        </div>
    );
};
