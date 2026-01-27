import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { getProgressColor } from '../../../shared/utils/formatting.jsx';
import { getActiveSchema } from '../../../../../supabaseClient';

export const SessionHeader = ({ onBack, workoutLabel, elapsed, retroactiveDate, globalPercent, onAbandon }) => (
    <div style={{ backgroundColor: '#121212' }}>
        <div style={{ height: '3px', width: '100%', backgroundColor: '#222' }}>
            <div style={{ height: '100%', width: `${globalPercent}%`, backgroundColor: getProgressColor(globalPercent), boxShadow: `0 0 10px ${getProgressColor(globalPercent)}88`, transition: 'all 0.5s ease-out' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', height: '54px', borderBottom: '1px solid #222' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                <button onClick={onBack} style={{ all: 'unset', cursor: 'pointer', padding: '10px 5px' }}>
                    <ArrowLeft size={20} color="#f29b11" />
                </button>
                <h2 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                    {workoutLabel}
                </h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, position: 'relative' }}>
                {retroactiveDate ? (
                    <span style={{ fontSize: '12px', fontWeight: '900', color: '#f29b11', textTransform: 'uppercase' }}>
                        {new Date(retroactiveDate).toLocaleDateString()}
                    </span>
                ) : (
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#f29b11', fontVariantNumeric: 'tabular-nums', fontFamily: 'monospace' }}>
                        {elapsed}
                    </span>
                )}
                
                {getActiveSchema() === 'v3_dev' && (
                    <span style={{ position: 'absolute', bottom: '-12px', left: '50%', transform: 'translateX(-50%)', fontSize: '7px', color: '#ef4444', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                        Sandbox Mode
                    </span>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '12px', fontWeight: '900', color: getProgressColor(globalPercent), transition: 'color 0.5s ease' }}>
                    {Math.round(globalPercent)}%
                </span>
                <button onClick={onAbandon} style={{ all: 'unset', cursor: 'pointer', opacity: 0.4, padding: '10px 5px' }}>
                    <X size={20} color="#fff" />
                </button>
            </div>
        </div>
    </div>
);
