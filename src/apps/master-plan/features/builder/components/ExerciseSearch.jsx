import React from 'react';
import { Search, X } from 'lucide-react';

export const ExerciseSearch = ({ searchTerm, setSearchTerm, filteredLibrary, onSelect, onClose }) => (
    <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #f29b1144', borderRadius: '8px', padding: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', borderBottom: '1px solid #222', paddingBottom: '8px' }}>
            <Search size={14} color="#f29b11" />
            <input 
                autoFocus
                placeholder="Search Library..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ all: 'unset', fontSize: '12px', color: '#fff', flex: 1 }}
            />
            <button onClick={onClose} style={{ all: 'unset', cursor: 'pointer' }}><X size={14} color="#666" /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {filteredLibrary.map(ex => (
                <button 
                    key={ex} 
                    onClick={() => onSelect(ex)}
                    style={{ all: 'unset', padding: '8px', fontSize: '11px', color: '#ccc', textAlign: 'left', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.02)', cursor: 'pointer' }}
                >
                    {ex.toUpperCase()}
                </button>
            ))}
        </div>
    </div>
);
