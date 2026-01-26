import React from 'react';
import { X } from 'lucide-react';

export const ActiveSessionBanner = ({ onNavigate, onAbandon, workoutLabel, elapsed }) => (
    <div style={{ backgroundColor: 'transparent', border: '1px solid #2ecc71', padding: '12px', borderRadius: '8px', marginTop: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div onClick={() => onNavigate('session')} style={{ flex: 1, cursor: 'pointer' }}>
            <p style={{ fontSize: '10px', fontWeight: '900', color: '#2ecc71', textTransform: 'uppercase', margin: 0 }}>Active Session in Progress</p>
            <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{workoutLabel} • {elapsed}</p>
        </div>
        <button onClick={onAbandon} style={{ all: 'unset', padding: '10px', cursor: 'pointer', opacity: 0.6 }}>
            <X size={20} color="#ef4444" />
        </button>
    </div>
);
