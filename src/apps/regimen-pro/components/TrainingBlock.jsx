import React, { useEffect, useState } from 'react';
import { CircuitBlock } from './CircuitBlock';
import { StandardBlock } from './StandardBlock';
import { useTrainingStore } from '../stores/useTrainingStore';
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';

export const TrainingBlock = ({ block, index, totalBlocks }) => {
    const { collapsedBlocks, toggleBlockCollapse, setBlockCollapsed, activeSession } = useTrainingStore();
    
    const [hasAutoCollapsed, setHasAutoCollapsed] = useState(false);

    // COMPLETION: All exercises must have at least 'totalSets' logs
    const isBlockDone = block.exercises.every(ex => {
        const logs = activeSession?.logs[ex.id] || [];
        const targetSets = parseInt(ex.target_sets || 3);
        return logs.length >= targetSets;
    });

    const isCollapsed = collapsedBlocks.includes(block.id);

    // AUTO-COLLAPSE: Once per session when completion is hit
    useEffect(() => {
        if (isBlockDone && !hasAutoCollapsed) {
            setBlockCollapsed(block.id, true);
            setHasAutoCollapsed(true);
        }
    }, [isBlockDone, block.id, setBlockCollapsed, hasAutoCollapsed]);

    const accentColor = isBlockDone ? '#2ecc71' : '#f29b11';

    return (
        <div style={{ marginBottom: isCollapsed ? '4px' : '16px' }}>
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
                <div className="section-header" style={{ marginBottom: 0, color: accentColor }}>
                    {isBlockDone ? (
                        <CheckCircle2 size={14} color={accentColor} />
                    ) : (
                        isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />
                    )}
                    <span style={{ marginLeft: '4px' }}>{block.label?.toUpperCase() || 'TRAINING BLOCK'}</span>
                </div>
                
                {isCollapsed && (
                    <span style={{ fontSize: '10px', fontWeight: '900', color: isBlockDone ? accentColor : '#444', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {isBlockDone ? 'COMPLETE' : `${block.exercises.length} EXERCISES`}
                    </span>
                )}
            </div>
            
            {!isCollapsed && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
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