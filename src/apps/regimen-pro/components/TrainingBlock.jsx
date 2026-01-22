import React, { useEffect } from 'react';
import { CircuitBlock } from './CircuitBlock';
import { StandardBlock } from './StandardBlock';
import { useTrainingStore } from '../stores/useTrainingStore';
import { ChevronDown, ChevronRight, CheckCircle2, Dumbbell, RefreshCcw, Layout } from 'lucide-react';

export const TrainingBlock = ({ block, index, totalBlocks }) => {
    const { expandedBlockId, setExpandedBlock, activeSession } = useTrainingStore();

    // REAL-TIME SET-BASED PROGRESS
    const stats = block.exercises.reduce((acc, ex) => {
        const target = parseInt(ex.target_sets || 3);
        const logged = (activeSession?.logs[ex.id] || []).length;
        acc.totalTargetSets += target;
        acc.totalLoggedSets += Math.min(logged, target); 
        if (logged >= target) acc.completedExercises++;
        return acc;
    }, { totalTargetSets: 0, totalLoggedSets: 0, completedExercises: 0 });

    const totalExercises = block.exercises.length;
    const progressPercent = (stats.totalLoggedSets / stats.totalTargetSets) * 100;
    const isBlockDone = stats.completedExercises === totalExercises;
    
    // NEW ACCORDION LOGIC
    const isExpanded = expandedBlockId === block.id;

    const accentColor = isBlockDone ? '#2ecc71' : '#f29b11';

    const getBlockIcon = () => {
        if (isBlockDone) return <CheckCircle2 size={16} color={accentColor} />;
        if (block.block_type === 'CIRCUIT') return <RefreshCcw size={16} color={accentColor} />;
        if (block.block_type === 'STANDARD') return <Dumbbell size={16} color={accentColor} />;
        return <Layout size={16} color={accentColor} />;
    };

    return (
        <div style={{ marginBottom: isExpanded ? '16px' : '4px' }}>
            <div 
                onClick={() => setExpandedBlock(isExpanded ? null : block.id)}
                style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    backgroundColor: !isExpanded ? '#111' : 'transparent',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '12px 10px',
                }}>
                    <div className="section-header" style={{ marginBottom: 0, color: accentColor, gap: '10px' }}>
                        {getBlockIcon()}
                        <span style={{ marginLeft: '4px', fontSize: '11px', fontWeight: '900', letterSpacing: '1px', opacity: 0.8 }}>
                            {block.label?.toUpperCase() || 'TRAINING BLOCK'}
                        </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '900', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {Math.round(progressPercent)}%
                        </span>
                        {isExpanded ? <ChevronDown size={14} color="#444" /> : <ChevronRight size={14} color="#444" />}
                    </div>
                </div>

                {/* PROGRESS BAR (Edge-to-Edge) */}
                <div style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    height: '2px', 
                    width: `${progressPercent}%`, 
                    backgroundColor: accentColor,
                    transition: 'width 0.5s ease-out'
                }} />
            </div>
            
            {isExpanded && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
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