import React from 'react';
import { Moon, Sun } from 'lucide-react';

export const ActiveSleepBanner = ({ onClick, elapsed }) => (
    <div 
        onClick={onClick}
        style={{ 
            backgroundColor: 'rgba(59, 130, 246, 0.1)', 
            border: '1px solid #3b82f6', 
            padding: '12px', 
            borderRadius: '12px', 
            marginTop: '10px', 
            marginBottom: '15px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)'
        }}
    >
        <div style={{ flex: 1 }}>
            <p style={{ fontSize: '10px', fontWeight: '900', color: '#3b82f6', textTransform: 'uppercase', margin: 0, letterSpacing: '1px' }}>Recovery Mission in Progress</p>
            <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, color: '#fff' }}>SLEEP PROTOCOL • <span style={{ fontFamily: 'monospace' }}>{elapsed}</span></p>
        </div>
        <div style={{ padding: '8px', backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: '50%' }}>
            <Moon size={20} color="#3b82f6" fill="#3b82f6" />
        </div>
    </div>
);
