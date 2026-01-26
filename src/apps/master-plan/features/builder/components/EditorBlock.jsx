import React from 'react';
import { RefreshCcw, Dumbbell, X, Plus } from 'lucide-react';
import { EditorItem } from './EditorItem';
import { ExerciseSearch } from './ExerciseSearch';

export const EditorBlock = ({ 
    block, 
    onUpdate, 
    onDelete, 
    onAddItem, 
    onUpdateItem, 
    onDeleteItem,
    activeSearch,
    setActiveSearch,
    searchTerm,
    setSearchTerm,
    filteredLibrary
}) => {
    const isSearching = activeSearch?.blockId === block.id;

    return (
        <div style={{ borderLeft: '2px solid #333', paddingLeft: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {block.block_type === 'CIRCUIT' ? <RefreshCcw size={14} color="#2ecc71" /> : <Dumbbell size={14} color="#f29b11" />}
                    <input 
                        value={block.label} 
                        onChange={(e) => onUpdate('label', e.target.value)} 
                        style={{ all: 'unset', fontSize: '11px', fontWeight: '900', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }} 
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                        onClick={() => onUpdate('block_type', block.block_type === 'STANDARD' ? 'CIRCUIT' : 'STANDARD')} 
                        style={{ all: 'unset', cursor: 'pointer', fontSize: '9px', fontWeight: '900', color: '#666', border: '1px solid #333', padding: '2px 6px', borderRadius: '4px' }}
                    >
                        TYPE
                    </button>
                    <button onClick={onDelete} style={{ all: 'unset', opacity: 0.4, cursor: 'pointer' }}><X size={14} color="#ef4444" /></button>
                </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                {block.items.map((item) => (
                    <EditorItem 
                        key={item.id} 
                        item={item} 
                        onUpdate={(field, val) => onUpdateItem(item.id, field, val)}
                        onDelete={() => onDeleteItem(item.id)}
                    />
                ))}
            </div>

            {isSearching ? (
                <ExerciseSearch 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filteredLibrary={filteredLibrary}
                    onSelect={(ex) => onAddItem(ex)}
                    onClose={() => setActiveSearch(null)}
                />
            ) : (
                <button 
                    onClick={() => setActiveSearch({ blockId: block.id })}
                    className="premium-btn-secondary" 
                    style={{ height: '32px', width: 'auto', padding: '0 15px', fontSize: '10px', borderStyle: 'dashed' }}
                >
                    <Plus size={12} /> ADD EXERCISE
                </button>
            )}
        </div>
    );
};
