import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const ArchiveModal = ({ programName, onConfirm, onCancel }) => (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <AlertTriangle size={48} color="#ef4444" style={{ margin: '0 auto 15px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '900', margin: '0 0 10px' }}>ARCHIVE PROGRAM?</h2>
            <p style={{ fontSize: '14px', color: '#888', margin: '0 0 20px', lineHeight: '1.5' }}>
                This will remove "{programName}" from your library. <br/>
                <span style={{ color: '#fff' }}>Your historical training data will be preserved.</span>
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                    onClick={onCancel}
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #333', backgroundColor: 'transparent', color: '#fff', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}
                >
                    Cancel
                </button>
                <button 
                    onClick={onConfirm}
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: '#fff', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}
                >
                    Archive
                </button>
            </div>
        </div>
    </div>
);
