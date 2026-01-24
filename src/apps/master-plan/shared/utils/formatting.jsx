import React from 'react';

/**
 * Calculates a color from Red to Green based on completion percentage.
 */
export const getProgressColor = (percent) => {
    const p = Math.max(0, Math.min(100, percent || 0));
    const colors = { 
        red: { r: 239, g: 68, b: 68 }, 
        orange: { r: 242, g: 155, b: 17 }, 
        green: { r: 46, g: 204, b: 113 } 
    };
    
    let r, g, b;
    if (p < 50) {
        const t = p / 50;
        r = Math.round(colors.red.r + (colors.orange.r - colors.red.r) * t);
        g = Math.round(colors.red.g + (colors.orange.g - colors.red.g) * t);
        b = Math.round(colors.red.b + (colors.orange.b - colors.red.b) * t);
    } else {
        const t = (p - 50) / 50;
        r = Math.round(colors.orange.r + (colors.green.r - colors.orange.r) * t);
        g = Math.round(colors.orange.g + (colors.green.g - colors.orange.g) * t);
        b = Math.round(colors.orange.b + (colors.green.b - colors.orange.b) * t);
    }
    return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Renders a stylized label for a set (Weight x Reps).
 */
export const renderSetLabel = (weight, reps) => {
    const isBW = String(weight).toLowerCase() === 'bw';
    const isCardio = String(reps).toLowerCase().includes('min') || String(reps).toLowerCase().includes('sec');
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
            <span style={{ fontWeight: '800' }}>{weight}</span>
            {!isBW && weight !== '-' && !isCardio && <span style={{ fontSize: '0.7em', fontWeight: '800', marginLeft: '0px', opacity: 0.8 }}>K</span>}
            <span style={{ margin: '0 2px', opacity: 0.4 }}>·</span>
            <span style={{ fontWeight: '800' }}>{reps}</span>
        </span>
    );
};

/**
 * Formats a comma-separated snapshot string into stylized badges.
 */
export const formatSnapshot = (text) => {
    if (!text) return null;
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
            {text.split(', ').map((setStr, i) => {
                const parts = setStr.split(' KG · ');
                const w = parts[0];
                const r = parts[1] || setStr.split(' · ')[1]; 
                return (
                    <div key={i} style={{ border: '1px solid #f29b11', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(242, 155, 17, 0.05)', fontSize: '10px', color: '#f29b11' }}>
                        {renderSetLabel(w, r)}
                    </div>
                );
            })}
        </div>
    );
};
