import React from 'react';
import { CheckCircle2, Trash2, ChevronRight } from 'lucide-react';

export const RoutineCard = ({ r, activeId, onActivate, onEdit, onDelete }) => {
    const isActive = activeId === r.id;
    return (
        <div className={`card ${isActive ? 'active-routine-card' : ''}`} style={{ borderLeft: isActive ? '4px solid #2ecc71' : '1px solid #333' }}>
            <div className="card-content">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-lg">{r.name}</h3>
                            {r.is_system_default && (
                                <span className="text-[9px] bg-[#333] text-gray-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Default</span>
                            )}
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-1">
                            {r.cycle_length || 7} DAY CYCLE
                        </div>
                    </div>
                    
                    {isActive && (
                        <div className="flex items-center gap-1 text-[#2ecc71] text-xs font-bold uppercase bg-[#2ecc7120] px-2 py-1 rounded">
                            <CheckCircle2 size={12} /> Active
                        </div>
                    )}
                </div>

                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    {r.description || "No description provided."}
                </p>

                <div className="flex items-center gap-2 pt-3 border-t border-[#222]">
                    <button 
                        onClick={() => onActivate(r)}
                        className="action-btn flex-1 justify-center py-2"
                        style={{ background: '#222', color: '#fff', border: '1px solid #444' }}
                    >
                        Assign Routine
                    </button>
                    
                    <button 
                        onClick={() => onEdit(r.id)}
                        className="action-btn flex-1 justify-center py-2"
                        style={{ background: '#222', color: 'var(--training-accent)', border: '1px solid #444' }}
                    >
                        Edit Split
                    </button>

                    {!r.is_system_default && (
                        <button 
                            onClick={() => onDelete(r.id)} 
                            className="action-btn px-3 py-2"
                            style={{ background: '#2a1a1a', color: '#e74c3c', border: '1px solid #4a2a2a' }}
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
