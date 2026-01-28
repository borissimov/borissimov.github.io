import React, { useState } from 'react';
import { Clock, X, Check } from 'lucide-react';

export const SleepEditModal = ({ log, onSave, onCancel }) => {
    const [start, setStart] = useState(new Date(log.start_time).toISOString().slice(0, 16));
    const [end, setEnd] = useState(new Date(log.end_time).toISOString().slice(0, 16));

    const handleSave = () => {
        onSave(log.id, {
            start_time: new Date(start).toISOString(),
            end_time: new Date(end).toISOString()
        });
    };

    const modalOverlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
    const modalContentStyle = { backgroundColor: '#121212', border: '1px solid #222', borderRadius: '16px', padding: '25px', width: '100%', maxWidth: '400px' };
    const inputGroupStyle = { marginBottom: '20px', textAlign: 'left' };
    const labelStyle = { fontSize: '10px', fontWeight: '900', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' };
    const inputStyle = { all: 'unset', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid #333', borderRadius: '8px', padding: '12px', width: '100%', boxSizing: 'border-box', color: '#fff', fontSize: '14px', fontVariantNumeric: 'tabular-nums' };

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                    <div style={{ padding: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                        <Clock size={20} color="#3b82f6" />
                    </div>
                    <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', margin: 0 }}>EDIT SLEEP LOG</h2>
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Start Time</label>
                    <input 
                        type="datetime-local" 
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>End Time</label>
                    <input 
                        type="datetime-local" 
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                    <button 
                        onClick={onCancel}
                        style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #333', backgroundColor: 'transparent', color: '#fff', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        <Check size={16} strokeWidth={3} /> Save
                    </button>
                </div>
            </div>
        </div>
    );
};
