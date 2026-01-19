import React, { useEffect, useState } from 'react';
import { CircuitBlock } from './CircuitBlock';
import { StandardBlock } from './StandardBlock';
import { useTrainingStore } from '../stores/useTrainingStore';
import { ChevronDown, ChevronRight, CheckCircle2, Dumbbell, RefreshCcw, Layout } from 'lucide-react';

export const TrainingBlock = ({ block, index, totalBlocks }) => {
    const { collapsedBlocks, toggleBlockCollapse, setBlockCollapsed, activeSession } = useTrainingStore();
    
    const [hasAutoCollapsed, setHasAutoCollapsed] = useState(false);

    const isBlockDone = block.exercises.every(ex => {
        const logs = activeSession?.logs[ex.id] || [];
        const targetSets = parseInt(ex.target_sets || 3);
        return logs.length >= targetSets;
    });

    const isCollapsed = collapsedBlocks.includes(block.id);

    useEffect(() => {
        if (isBlockDone && !hasAutoCollapsed) {
            setBlockCollapsed(block.id, true);
            setHasAutoCollapsed(true);
        }
    }, [isBlockDone, block.id, setBlockCollapsed, hasAutoCollapsed]);

    const accentColor = isBlockDone ? '#2ecc71' : '#f29b11';

    // Select icon based on block type
    const getBlockIcon = () => {
        if (isBlockDone) return <CheckCircle2 size={16} color={accentColor} />;
        if (block.block_type === 'CIRCUIT') return <RefreshCcw size={16} color={accentColor} />;
        if (block.block_type === 'STANDARD') return <Dumbbell size={16} color={accentColor} />;
        return <Layout size={16} color={accentColor} />;
    };

    return (
        <div style={{ marginBottom: isCollapsed ? '4px' : '16px' }}>
            <div 
                onClick={() => toggleBlockCollapse(block.id)}
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    cursor: 'pointer',
                    padding: '12px 10px',
                    backgroundColor: isCollapsed ? '#111' : 'transparent',
                    borderBottom: isCollapsed ? '1px solid #222' : 'none'
                }}
            >
                <div className="section-header" style={{ marginBottom: 0, color: accentColor, gap: '10px' }}>
                    {getBlockIcon()}
                    <span style={{ marginLeft: '4px', fontSize: '13px', letterSpacing: '1px' }}>
                        {block.label?.toUpperCase() || 'TRAINING BLOCK'}
                    </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isCollapsed && (
                        <span style={{ fontSize: '9px', fontWeight: '900', color: isBlockDone ? accentColor : '#444', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {isBlockDone ? 'COMPLETE' : `${block.exercises.length} EX`}
                        </span>
                    )}
                    {isCollapsed ? <ChevronRight size={14} color="#444" /> : <ChevronDown size={14} color="#444" />}
                </div>
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