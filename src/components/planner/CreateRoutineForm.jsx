import React, { useState } from 'react';

export const CreateRoutineForm = ({ onCreate, onCancel }) => {
    const [newName, setNewName] = useState("");

    const handleSubmit = () => {
        if (newName.trim()) {
            onCreate(newName);
            setNewName("");
        }
    };

    return (
        <div className="card mb-6" style={{ borderTop: '2px solid var(--training-accent)' }}>
            <div className="card-content">
                <h3 className="text-xs font-bold mb-3 uppercase text-gray-500">Create New Routine</h3>
                <input 
                    className="auth-input mb-3" 
                    style={{ background: '#0a0a0a', borderColor: '#333' }}
                    placeholder="Routine Name (e.g. Hypertrophy v2)" 
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    autoFocus
                />
                <div className="flex gap-3">
                    <button onClick={handleSubmit} className="auth-button flex-1 py-2 text-sm" style={{marginTop:0}}>Create</button>
                    <button onClick={onCancel} className="auth-button flex-1 py-2 text-sm" style={{marginTop:0, background: '#222', color: '#ccc', border: '1px solid #444'}}>Cancel</button>
                </div>
            </div>
        </div>
    );
};
