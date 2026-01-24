import React from 'react';
import { SessionLogger } from './SessionLogger';

export const LinearBlock = ({ block }) => {
    // V3 Shape: items
    const items = block.items || [];
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.map(item => (
                <SessionLogger key={item.id} item={item} blockId={block.id} />
            ))}
        </div>
    );
};