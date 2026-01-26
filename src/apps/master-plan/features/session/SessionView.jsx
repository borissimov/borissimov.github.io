import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { SessionBlock } from './components/SessionBlock';
import { getProgressColor } from '../../shared/utils/formatting.jsx';
import { getActiveSchema } from '../../../../supabaseClient';

/**
 * Session View: The active training logger.
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
            <div style={{ position: 'sticky', top: 0, left: 0, zIndex: 100, backgroundColor: '#121212' }}>
                <div style={{ height: '3px', width: '100%', backgroundColor: '#222' }}>
                    <div style={{ height: '100%', width: `${globalPercent}%`, backgroundColor: getProgressColor(globalPercent), boxShadow: `0 0 10px ${getProgressColor(globalPercent)}88`, transition: 'all 0.5s ease-out' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', height: '54px', borderBottom: '1px solid #222' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                        <button onClick={() => onNavigate(lastView || 'library')} style={{ all: 'unset', cursor: 'pointer', padding: '10px 5px' }}>
                            <ArrowLeft size={20} color="#f29b11" />
                        </button>
                        <h2 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                            {workoutLabel}
                        </h2>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, position: 'relative' }}>
                        {retroactiveDate ? (
                            <span style={{ fontSize: '12px', fontWeight: '900', color: '#f29b11', textTransform: 'uppercase' }}>
                                {new Date(retroactiveDate).toLocaleDateString()}
                            </span>
                        ) : (
                            <span style={{ fontSize: '18px', fontWeight: '900', color: '#f29b11', fontVariantNumeric: 'tabular-nums' }}>
                                {elapsed}
                            </span>
                        )}
                        
                        {getActiveSchema() === 'v3_dev' && (
                            <span style={{ position: 'absolute', bottom: '-12px', left: '50%', transform: 'translateX(-50%)', fontSize: '7px', color: '#ef4444', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                Sandbox Mode
                            </span>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: '12px', fontWeight: '900', color: getProgressColor(globalPercent), transition: 'color 0.5s ease' }}>
                            {Math.round(globalPercent)}%
                        </span>
                        <button onClick={() => setShowAbandonModal(true)} style={{ all: 'unset', cursor: 'pointer', opacity: 0.4, padding: '10px 5px' }}>
                            <X size={20} color="#fff" />
                        </button>
                    </div>
                </div>
            </div>

            {activeSession.sessionFocus && (
                <div style={{ padding: '10px 15px', borderBottom: '1px solid #222', backgroundColor: 'rgba(242, 155, 17, 0.02)' }}>
                    <p style={{ fontSize: '9px', color: '#f29b11', fontWeight: '900', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '1px' }}>SESSION FOCUS</p>
                    <p style={{ fontSize: '11px', color: '#ccc', fontStyle: 'italic', lineHeight: '1.4' }}>{activeSession.sessionFocus}</p>
                </div>
            )}

            <div style={{ paddingBottom: '100px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {activeSession.blocks.map((block, idx) => (
                        <div key={block.id} className="premium-card" style={{ padding: '8px 10px', borderRadius: '0', border: 'none', borderBottom: '1px solid #222', marginBottom: 0, backgroundColor: 'transparent' }}>
                            <SessionBlock block={block} index={idx} totalBlocks={activeSession.blocks.length} />
                        </div>
                    ))}
                </div>
                <div style={{ padding: '20px 15px 60px' }}>
                    <button 
                        className={globalPercent >= 100 ? "premium-btn-primary animate-pulse-bright-green" : "premium-btn-primary"} 
                        style={{ backgroundColor: globalPercent >= 100 ? '#2ecc71' : 'transparent', border: globalPercent >= 100 ? 'none' : `2px solid #f29b11`, color: globalPercent >= 100 ? '#000' : '#f29b11', boxShadow: globalPercent >= 100 ? '0 0 30px rgba(46, 204, 113, 0.4)' : '0 4px 20px rgba(0,0,0,0.5)', fontWeight: '900', fontSize: '16px', height: '54px' }} 
                        onClick={() => setShowFinishModal(true)}
                    >
                        End activity
                    </button>
                </div>
            </div>
        </div>
    );
};