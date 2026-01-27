import React from 'react';
import { SessionBlock } from './components/SessionBlock';

// Components
import { SessionHeader } from './components/SessionHeader';
import { SessionFocusBanner } from './components/SessionFocusBanner';
import { SessionFooter } from './components/SessionFooter';

/**
 * Session View: The active training logger.
 * Refactored into clean Orchestrator Pattern.
 */
export const SessionView = ({
    onNavigate,
    activeSession,
    workoutLabel,
    elapsed,
    retroactiveDate,
    globalPercent,
    setShowAbandonModal,
    setShowFinishModal,
    lastView
}) => {
    return (
        <div className="app-container-v2 viewport-constrained" style={{ padding: '0' }}>
            <SessionHeader 
                onBack={() => onNavigate(lastView || 'library')}
                workoutLabel={workoutLabel}
                elapsed={elapsed}
                retroactiveDate={retroactiveDate}
                globalPercent={globalPercent}
                onAbandon={() => setShowAbandonModal(true)}
            />

            {activeSession.sessionFocus && (
                <SessionFocusBanner focus={activeSession.sessionFocus} />
            )}

            <div className="scrollable-content" style={{ paddingBottom: '100px' }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr', 
                    gap: '0',
                    borderTop: '1px solid #222'
                }}>
                    {activeSession.blocks.map((block, idx) => (
                        <div key={block.id} style={{ 
                            padding: '8px 10px', 
                            borderBottom: '1px solid #222', 
                            borderRight: '1px solid #222'
                        }}>
                            <SessionBlock block={block} index={idx} totalBlocks={activeSession.blocks.length} />
                        </div>
                    ))}
                </div>
            </div>
            
            <SessionFooter 
                globalPercent={globalPercent}
                onFinish={() => setShowFinishModal(true)}
            />
        </div>
    );
};
