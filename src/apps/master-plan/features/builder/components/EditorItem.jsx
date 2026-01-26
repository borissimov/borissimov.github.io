import React from 'react';
import { X } from 'lucide-react';

const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '4px', marginTop: '8px' };
const miniInputStyle = { all: 'unset', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid #333', borderRadius: '4px', padding: '4px', fontSize: '10px', color: '#fff', textAlign: 'center' };

export const EditorItem = ({ item, onUpdate, onDelete }) => (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid #222' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '12px', fontWeight: '900', color: '#fff', margin: 0, textTransform: 'uppercase' }}>{item.name}</h4>
            <button onClick={onDelete} style={{ all: 'unset', opacity: 0.3, cursor: 'pointer' }}><X size={12} color="#ef4444" /></button>
        </div>
        <div style={gridStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '7px', fontWeight: '900', color: '#f29b11' }}>SETS</span>
                <input type="number" value={item.target_sets} onChange={(e) => onUpdate('target_sets', e.target.value)} style={miniInputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '7px', fontWeight: '900', color: '#f29b11' }}>REPS</span>
                <input value={item.target_reps} onChange={(e) => onUpdate('target_reps', e.target.value)} style={miniInputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '7px', fontWeight: '900', color: '#f29b11' }}>KG</span>
                <input value={item.target_weight} onChange={(e) => onUpdate('target_weight', e.target.value)} style={miniInputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '7px', fontWeight: '900', color: '#f29b11' }}>RPE</span>
                <input value={item.target_rpe} onChange={(e) => onUpdate('target_rpe', e.target.value)} style={miniInputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '7px', fontWeight: '900', color: '#f29b11' }}>TEMPO</span>
                <input value={item.tempo} onChange={(e) => onUpdate('tempo', e.target.value)} style={miniInputStyle} />
            </div>
        </div>
    </div>
);
