import React from 'react';
import { CircuitBlock } from './CircuitBlock';
import { StandardBlock } from './StandardBlock';
import { useTrainingStore } from '../stores/useTrainingStore';
import { ChevronDown, ChevronRight } from 'lucide-react';

export const TrainingBlock = ({ block, index, totalBlocks }) => {
    const { collapsedBlocks, toggleBlockCollapse } = useTrainingStore();
    const isCollapsed = collapsedBlocks.includes(block.id);

    return (
        <div style={{ marginBottom: isCollapsed ? '4px' : '16px' }}>
            {/* Clickable Header for Minimizing */}
            <div 
                onClick={() => toggleBlockCollapse(block.id)}
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    cursor: 'pointer',
                    paddingBottom: isCollapsed ? '0' : '12px'
                }}
            >
                <div className="section-header" style={{ marginBottom: 0 }}>
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                    {block.label || 'TRAINING BLOCK'}
                </div>
                
                {isCollapsed && (
                    <span style={{ fontSize: '10px', fontWeight: '900', color: '#444', textTransform: 'uppercase' }}>
                        {block.exercises.length} EXERCISES
                    </span>
                )}
            </div>
            
            {/* Content Body - Only show if not collapsed */}
            {!isCollapsed && (
                <div>
                    {block.block_type === 'CIRCUIT' ? (
                        <CircuitBlock block={block} />
                    ) : (
                        <StandardBlock block={block} />
                    )}
                </div>
            )}
        </div>
    );
};
