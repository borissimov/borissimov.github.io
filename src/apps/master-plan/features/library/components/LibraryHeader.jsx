import React from 'react';
import { LayoutGrid, History, ChevronDown } from 'lucide-react';
import { getActiveSchema } from '../../../../../supabaseClient';

export const LibraryHeader = ({ onExit, onNavigate, onToggleSwitcher, activeProgramName, showSwitcher }) => (
    <header style={{ display: 'flex', alignItems: 'center', height: '54px', gap: '10px' }}>
        <button onClick={onExit} style={{ all: 'unset', cursor: 'pointer', padding: '10px 5px' }} title="Back to Portal">
            <LayoutGrid size={24} color="#f29b11" />
        </button>
        
        <div 
            onClick={onToggleSwitcher}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', position: 'relative' }}
        >
            <h1 style={{ fontSize: '16px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeProgramName || 'SELECT PROGRAM'}
            </h1>
            <ChevronDown size={16} color="#f29b11" style={{ transform: showSwitcher ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            
            {getActiveSchema() === 'v3_dev' && (
                <span style={{ position: 'absolute', bottom: '-12px', left: '50%', transform: 'translateX(-50%)', fontSize: '7px', color: '#ef4444', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Sandbox Mode
                </span>
            )}
        </div>

        <button onClick={() => onNavigate('master-agenda')} style={{ all: 'unset', cursor: 'pointer', padding: '10px 5px' }} title="Switch to Master Agenda">
            <History size={24} color="#f29b11" />
        </button>
    </header>
);
