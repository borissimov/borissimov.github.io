import React from 'react';

export const SessionFocusBanner = ({ focus }) => (
    <div style={{ padding: '10px 15px', borderBottom: '1px solid #222', backgroundColor: 'rgba(242, 155, 17, 0.02)' }}>
        <p style={{ fontSize: '9px', color: '#f29b11', fontWeight: '900', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '1px' }}>SESSION FOCUS</p>
        <p style={{ fontSize: '11px', color: '#ccc', fontStyle: 'italic', lineHeight: '1.4' }}>{focus}</p>
    </div>
);
