import React from 'react';
import { AlertTriangle, Trophy, AlertCircle, Trash2 } from 'lucide-react';

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
    isDeleting
}) => {
    return (
        <>
            {showAbandonModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="premium-card" style={{ border: `1px solid #ef4444`, textAlign: 'center', padding: '30px 20px', maxWidth: '400px', backgroundColor: '#121212' }}>
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
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="premium-card" style={{ border: `1px solid ${globalPercent >= 100 ? '#2ecc71' : '#f29b11'}`, textAlign: 'center', padding: '30px 20px', maxWidth: '400px', backgroundColor: '#121212' }}>
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
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="premium-card" style={{ border: `1px solid #ef4444`, textAlign: 'center', padding: '30px 20px', maxWidth: '400px', backgroundColor: '#121212' }}>
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
        </>
    );
};
