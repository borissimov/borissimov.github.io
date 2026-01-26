import React from 'react';
import { Edit2, Archive, RotateCcw, Check, PlusCircle, EyeOff, Eye } from 'lucide-react';

export const ProgramSwitcher = ({ 
    programs, 
    activeProgramId, 
    onSelect, 
    onEdit, 
    onArchive, 
    onUnarchive, 
    onCreate, 
    showArchived, 
    onToggleShowArchived, 
    onClose 
}) => (
    <div 
        style={{ position: 'absolute', top: '54px', left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1000, padding: '20px', display: 'flex', flexDirection: 'column' }}
        onClick={onClose}
    >
        <div className="animate-in slide-in-from-top-4 duration-200" style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
            <p style={{ fontSize: '10px', fontWeight: '900', color: '#666', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Your Programs:</p>
            {programs.map(prog => {
                const isArchived = !!prog.archived_at;
                return (
                    <div 
                        key={prog.id}
                        onClick={(e) => { 
                            if (isArchived) return; 
                            e.stopPropagation(); 
                            onSelect(prog.id); 
                        }}
                        style={{ 
                            padding: '12px 15px', 
                            backgroundColor: activeProgramId === prog.id ? 'rgba(242, 155, 17, 0.1)' : '#111', 
                            borderRadius: '8px', 
                            border: activeProgramId === prog.id ? '1px solid #f29b11' : '1px solid #222',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            opacity: isArchived ? 0.4 : 1
                        }}
                    >
                        <span style={{ fontSize: '13px', fontWeight: '900', color: activeProgramId === prog.id ? '#f29b11' : '#fff', textTransform: 'uppercase', flex: 1 }}>
                            {prog.name} {isArchived && "(ARCHIVED)"}
                        </span>
                        
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            {!isArchived ? (
                                <>
                                    <button onClick={(e) => { e.stopPropagation(); onEdit(prog.id); }} style={{ all: 'unset', opacity: 0.6, cursor: 'pointer' }}><Edit2 size={16} color="#fff" /></button>
                                    <button onClick={(e) => { e.stopPropagation(); onArchive(prog); }} style={{ all: 'unset', opacity: 0.6, cursor: 'pointer' }}><Archive size={16} color="#ef4444" /></button>
                                </>
                            ) : (
                                <button onClick={(e) => { e.stopPropagation(); onUnarchive(prog.id); }} style={{ all: 'unset', opacity: 0.8, cursor: 'pointer' }} title="Restore Program"><RotateCcw size={16} color="#2ecc71" /></button>
                            )}
                            {activeProgramId === prog.id && !isArchived && <Check size={16} color="#f29b11" />}
                        </div>
                    </div>
                );
            })}
            
            <div 
                onClick={(e) => { e.stopPropagation(); onCreate(); }}
                style={{ padding: '15px', border: '1px dashed #f29b1144', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', cursor: 'pointer' }}
            >
                <PlusCircle size={18} color="#f29b11" />
                <span style={{ fontSize: '12px', fontWeight: '900', color: '#f29b11', textTransform: 'uppercase' }}>Create New Program</span>
            </div>

            <div 
                onClick={(e) => { e.stopPropagation(); onToggleShowArchived(); }}
                style={{ padding: '15px', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', borderTop: '1px solid #222' }}
            >
                {showArchived ? <EyeOff size={14} color="#666" /> : <Eye size={14} color="#666" />}
                <span style={{ fontSize: '10px', fontWeight: '900', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {showArchived ? "Hide Archived" : "Show Archived Programs"}
                </span>
            </div>
        </div>
    </div>
);
