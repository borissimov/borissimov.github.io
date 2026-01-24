import React from 'react';
import { BlockItemRow } from './BlockItemRow';

export const CircuitBlock = ({ block }) => {
    // V3 Shape: items
    const items = block.items || [];
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.map((item) => (
                <BlockItemRow 
                    key={item.id}
                    item={item}
                    blockId={block.id}
                    onLog={() => {}}
                />
            ))}
        </div>
    );
};