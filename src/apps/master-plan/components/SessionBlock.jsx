import React, { useEffect } from 'react';
import { CircuitBlock } from './CircuitBlock';
import { LinearBlock } from './LinearBlock';
import { useProgramStore } from '../stores/useProgramStore';
import { ChevronDown, ChevronRight, CheckCircle2, Dumbbell, RefreshCcw, Layout } from 'lucide-react';

export const SessionBlock = ({ block, index, totalBlocks }) => {
    const { expandedBlockId, setExpandedBlock, activeSession } = useProgramStore();

    // REAL-TIME SET-BASED PROGRESS (V3 Shape: items)
    const items = block.items || [];
    const stats = items.reduce((acc, item) => {
        const target = parseInt(item.target_sets || 3);
        const logged = (activeSession?.logs[item.id] || []).length;
        acc.totalTargetSets += target;
        acc.totalLoggedSets += Math.min(logged, target); 
        if (logged >= target) acc.completedItems++;
        return acc;
    }, { totalTargetSets: 0, totalLoggedSets: 0, completedItems: 0 });

    const totalItems = items.length;
    const progressPercent = stats.totalTargetSets > 0 ? (stats.totalLoggedSets / stats.totalTargetSets) * 100 : 0;
    const isBlockDone = stats.completedItems === totalItems;
    
    // ACCORDION LOGIC
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
                            {block.label?.toUpperCase() || 'SESSION BLOCK'}
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
                        <LinearBlock block={block} />
                    )}
                </div>
            )}
        </div>
    );
};