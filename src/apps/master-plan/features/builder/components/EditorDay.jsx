import React from 'react';
import { Trash2, ChevronDown, ChevronRight, Plus, RefreshCcw } from 'lucide-react';
import { EditorBlock } from './EditorBlock';

export const EditorDay = ({ 
    day, 
    isExpanded, 
    onToggle, 
    onUpdateLabel, 
    onDelete, 
    onAddBlock,
    onUpdateBlock,
    onDeleteBlock,
    onAddItemToBlock,
    onUpdateItemInBlock,
    onDeleteItemFromBlock,
    activeSearch,
    setActiveSearch,
    searchTerm,
    setSearchTerm,
    filteredLibrary
}) => (
    <div className="premium-card" style={{ padding: '0', overflow: 'hidden', border: isExpanded ? '1px solid #f29b1144' : '1px solid #222' }}>
        <div 
            onClick={onToggle}
            style={{ padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isExpanded ? 'rgba(242, 155, 17, 0.05)' : 'transparent', cursor: 'pointer' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '10px', fontWeight: '900', color: '#f29b11' }}>DAY {day.sequence_number}</span>
                <input 
                    value={day.label}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onUpdateLabel(e.target.value)}
                    style={{ all: 'unset', fontSize: '14px', fontWeight: '900', color: '#fff' }}
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{ all: 'unset', opacity: 0.4, cursor: 'pointer' }}><Trash2 size={16} color="#ef4444" /></button>
                {isExpanded ? <ChevronDown size={18} color="#f29b11" /> : <ChevronRight size={18} color="#444" />}
            </div>
        </div>

        {isExpanded && (
            <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '1px solid #222' }}>
                {day.blocks.map((block) => (
                    <EditorBlock 
                        key={block.id}
                        block={block}
                        onUpdate={(field, val) => onUpdateBlock(block.id, field, val)}
                        onDelete={() => onDeleteBlock(block.id)}
                        onAddItem={(ex) => onAddItemToBlock(block.id, ex)}
                        onUpdateItem={(itemId, field, val) => onUpdateItemInBlock(block.id, itemId, field, val)}
                        onDeleteItem={(itemId) => onDeleteItemFromBlock(block.id, itemId)}
                        activeSearch={activeSearch}
                        setActiveSearch={setActiveSearch}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filteredLibrary={filteredLibrary}
                    />
                ))}

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => onAddBlock('STANDARD')} className="premium-btn-secondary" style={{ flex: 1, height: '40px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Plus size={14} /> BLOCK</button>
                    <button onClick={() => onAddBlock('CIRCUIT')} className="premium-btn-secondary" style={{ flex: 1, height: '40px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#2ecc71', borderColor: 'rgba(46, 204, 113, 0.2)' }}><RefreshCcw size={14} /> CIRCUIT</button>
                </div>
            </div>
        )}
    </div>
);
