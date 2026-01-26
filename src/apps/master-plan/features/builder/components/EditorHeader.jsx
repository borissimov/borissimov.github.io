import React from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { getActiveSchema } from '../../../../../supabaseClient';

export const EditorHeader = ({ onBack, programName, setProgramName, onSave, isSaving }) => (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', height: '54px', borderBottom: '1px solid #222', backgroundColor: '#121212', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={onBack} style={{ all: 'unset', cursor: 'pointer', padding: '10px 5px' }}>
                <ArrowLeft size={20} color="#f29b11" />
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <input 
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value.toUpperCase())}
                    style={{ all: 'unset', fontSize: '14px', fontWeight: '900', color: '#fff', width: '180px', borderBottom: '1px dashed #444' }}
                />
                {getActiveSchema() === 'v3_dev' && (
                    <span style={{ position: 'absolute', bottom: '-12px', left: '0', fontSize: '7px', color: '#ef4444', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Sandbox Mode
                    </span>
                )}
            </div>
        </div>
        <button 
            onClick={onSave}
            disabled={isSaving}
            style={{ all: 'unset', backgroundColor: '#f29b11', color: '#000', padding: '6px 15px', borderRadius: '6px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', opacity: isSaving ? 0.5 : 1 }}
        >
            {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} fill="currentColor" />}
            {isSaving ? 'Saving...' : 'Save'}
        </button>
    </header>
);
