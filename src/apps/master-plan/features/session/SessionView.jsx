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
        <div className="app-container-v2" style={{ padding: '0' }}>
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

            <div style={{ paddingBottom: '100px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {activeSession.blocks.map((block, idx) => (
                        <div key={block.id} className="premium-card" style={{ padding: '8px 10px', borderRadius: '0', border: 'none', borderBottom: '1px solid #222', marginBottom: 0, backgroundColor: 'transparent' }}>
                            <SessionBlock block={block} index={idx} totalBlocks={activeSession.blocks.length} />
                        </div>
                    ))}
                </div>
                
                <SessionFooter 
                    globalPercent={globalPercent}
                    onFinish={() => setShowFinishModal(true)}
                />
            </div>
        </div>
    );
};
