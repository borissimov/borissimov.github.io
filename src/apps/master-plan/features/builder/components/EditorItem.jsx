import React from 'react';
import { X } from 'lucide-react';

const gridStyle = { 
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: '8px', 
    marginTop: '10px' 
};

const inputGroupStyle = { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '2px', 
    flex: '1 1 60px', // Allow growth, shrinking, and set a reasonable base width
    minWidth: 0 
};

const miniInputStyle = { 
    all: 'unset', 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    border: '1px solid #333', 
    borderRadius: '4px', 
    padding: '6px 4px', 
    fontSize: '11px', 
    color: '#fff', 
    textAlign: 'center',
    width: '100%'
};

export const EditorItem = ({ item, onUpdate, onDelete }) => (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px 10px', borderRadius: '8px', border: '1px solid #222' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: '900', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.name}</h4>
            <button onClick={onDelete} style={{ all: 'unset', opacity: 0.3, cursor: 'pointer', padding: '4px' }}><X size={14} color="#ef4444" /></button>
        </div>
        <div style={gridStyle}>
            <div style={inputGroupStyle}>
                <span style={{ fontSize: '7px', fontWeight: '900', color: '#f29b11' }}>SETS</span>
                <input type="number" value={item.target_sets} onChange={(e) => onUpdate('target_sets', e.target.value)} style={miniInputStyle} />
            </div>
            <div style={inputGroupStyle}>
                <span style={{ fontSize: '7px', fontWeight: '900', color: '#f29b11' }}>REPS</span>
                <input value={item.target_reps} onChange={(e) => onUpdate('target_reps', e.target.value)} style={miniInputStyle} />
            </div>
            <div style={inputGroupStyle}>
                <span style={{ fontSize: '7px', fontWeight: '900', color: '#f29b11' }}>KG</span>
                <input value={item.target_weight} onChange={(e) => onUpdate('target_weight', e.target.value)} style={miniInputStyle} />
            </div>
            <div style={inputGroupStyle}>
                <span style={{ fontSize: '7px', fontWeight: '900', color: '#f29b11' }}>RPE</span>
                <input value={item.target_rpe} onChange={(e) => onUpdate('target_rpe', e.target.value)} style={miniInputStyle} />
            </div>
            <div style={inputGroupStyle}>
                <span style={{ fontSize: '7px', fontWeight: '900', color: '#f29b11' }}>TEMPO</span>
                <input value={item.tempo} onChange={(e) => onUpdate('tempo', e.target.value)} style={miniInputStyle} />
            </div>
        </div>
    </div>
);
