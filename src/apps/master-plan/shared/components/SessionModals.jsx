import React from 'react';
import { AlertTriangle, Trophy, AlertCircle, Trash2, Moon, Sun } from 'lucide-react';

/**
 * Session Modals: Shared confirmation dialogs for critical actions.
 */
export const SessionModals = ({
    showAbandonModal,
    setShowAbandonModal,
    handleAbandonSession,
    showFinishModal,
    setShowFinishModal,
    handleFinalizeSession,
    isSaving,
    globalPercent,
    confirmDeleteId,
    setConfirmDeleteId,
    handleDeleteLog,
    isDeleting,
    showSleepConfirm,
    setShowSleepConfirm,
    handleStartSleep,
    showWakeUpConfirm,
    setShowWakeUpConfirm,
    handleEndSleep,
    showSessionConflict,
    setShowSessionConflict
}) => {
    const modalOverlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
    const modalContentStyle = { backgroundColor: '#121212', border: '1px solid #222', borderRadius: '16px', padding: '25px', width: '100%', maxWidth: '400px', textAlign: 'center' };

    return (
        <>
            {showAbandonModal && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalContentStyle, borderColor: '#ef4444' }}>
                        <AlertTriangle size={48} color="#ef4444" style={{ margin: '0 auto 20px' }} />
                        <h2 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', color: '#fff', marginBottom: '10px' }}>Abandon Activity?</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button className="premium-btn-primary" style={{ backgroundColor: '#fff', color: '#000' }} onClick={() => setShowAbandonModal(false)}>RESUME TRAINING</button>
                            <button onClick={handleAbandonSession} style={{ all: 'unset', color: '#ef4444', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', padding: '10px' }}>Yes, Abandon Activity</button>
                        </div>
                    </div>
                </div>
            )}

            {showFinishModal && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalContentStyle, borderColor: globalPercent >= 100 ? '#2ecc71' : '#f29b11' }}>
                        {globalPercent >= 100 ? <Trophy size={48} color="#2ecc71" style={{ margin: '0 auto 20px' }} className="animate-bounce" /> : <AlertCircle size={48} color="#f29b11" style={{ margin: '0 auto 20px' }} />}
                        <h2 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', color: '#fff', marginBottom: '10px' }}>{globalPercent >= 100 ? 'Activity Accomplished' : 'Finish Early?'}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button className="premium-btn-primary" style={{ backgroundColor: globalPercent >= 100 ? '#2ecc71' : '#fff', color: '#000' }} onClick={handleFinalizeSession} disabled={isSaving}>{isSaving ? 'SYNCING...' : 'FINALIZE & SAVE'}</button>
                            <button onClick={() => setShowFinishModal(false)} style={{ all: 'unset', color: '#666', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer', padding: '10px' }}>Wait, I missed something</button>
                        </div>
                    </div>
                </div>
            )}

            {confirmDeleteId && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalContentStyle, borderColor: '#ef4444' }}>
                        <Trash2 size={48} color="#ef4444" style={{ margin: '0 auto 20px' }} />
                        <h2 style={{ fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', color: '#fff', marginBottom: '10px' }}>Delete Activity?</h2>
                        <p style={{ fontSize: '12px', color: '#666', marginBottom: '25px' }}>This action is permanent and will remove all logged sets for this workout.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button className="premium-btn-primary" style={{ backgroundColor: '#ef4444', color: '#fff' }} onClick={handleDeleteLog} disabled={isDeleting}>{isDeleting ? 'DELETING...' : 'YES, DELETE PERMANENTLY'}</button>
                            <button className="premium-btn-secondary" onClick={() => setConfirmDeleteId(null)}>CANCEL</button>
                        </div>
                    </div>
                </div>
            )}

            {/* SLEEP CONFIRMATION */}
            {showSleepConfirm && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalContentStyle, borderColor: '#3b82f6' }}>
                        <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <Moon size={32} color="#3b82f6" fill="#3b82f6" />
                        </div>
                        <h2 style={{ fontSize: '18px', fontWeight: '900', margin: '0 0 10px', color: '#fff' }}>START RECOVERY?</h2>
                        <p style={{ fontSize: '13px', color: '#888', margin: '0 0 25px' }}>Initiating Sleep Protocol. SYSTEM will enter low-power mode.</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setShowSleepConfirm(false)} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #333', backgroundColor: 'transparent', color: '#fff', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}>Cancel</button>
                            <button onClick={handleStartSleep} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}>Initiate</button>
                        </div>
                    </div>
                </div>
            )}

            {/* WAKE UP CONFIRMATION */}
            {showWakeUpConfirm && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalContentStyle, borderColor: '#f29b11' }}>
                        <div style={{ backgroundColor: 'rgba(242, 155, 17, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <Sun size={32} color="#f29b11" />
                        </div>
                        <h2 style={{ fontSize: '18px', fontWeight: '900', margin: '0 0 10px', color: '#fff' }}>WAKE UP?</h2>
                        <p style={{ fontSize: '13px', color: '#888', margin: '0 0 25px' }}>Are you ready to end the recovery log and sync data?</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setShowWakeUpConfirm(false)} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #333', backgroundColor: 'transparent', color: '#fff', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}>Sleep</button>
                            <button onClick={handleEndSleep} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#f29b11', color: '#000', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}>Wake Up</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ACTIVE SESSION WARNING */}
            {showSessionConflict && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalContentStyle, borderColor: '#ef4444' }}>
                        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <AlertCircle size={32} color="#ef4444" />
                        </div>
                        <h2 style={{ fontSize: '18px', fontWeight: '900', margin: '0 0 10px', color: '#fff' }}>CONFLICT DETECTED</h2>
                        <p style={{ fontSize: '13px', color: '#888', margin: '0 0 25px' }}>A mission is already active. Please finish or abandon the current activity before starting a new one.</p>
                        <button onClick={() => setShowSessionConflict(false)} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#fff', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}>Acknowledged</button>
                    </div>
                </div>
            )}
        </>
    );
};
