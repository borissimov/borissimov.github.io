import React from 'react';
import { ChevronDown, ChevronRight, Loader2, Download, Trash2 } from 'lucide-react';
import { renderSetLabel } from '../../../shared/utils/formatting.jsx';

export const CompletedSessionCard = ({
    log,
    expandedActivityId,
    handleToggleActivityExpansion,
    isLoading,
    activeHistorySession,
    handleExportJson,
    setConfirmDeleteLog
}) => {
    const isExpanded = expandedActivityId === log.id; 
    const startTimeStr = log.start_time ? new Date(log.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const endTimeStr = new Date(log.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let sessionVolume = 0;
    let totalRPE = 0;
    let rpeCount = 0;
    // V3 uses performance_logs instead of set_logs
    const sets = log.performance_logs || [];
    
    sets.forEach(set => {
        let w = 0;
        const weightStr = String(set.weight || '0').toLowerCase();
        if (weightStr !== 'bw') {
            const parts = weightStr.match(/\d+(\.\d+)?/);
            w = parts ? parseFloat(parts[0]) : 0;
        }
        const r = parseInt(set.reps) || 0;
        sessionVolume += (w * r);
        if (set.rpe) {
            totalRPE += parseFloat(set.rpe);
            rpeCount++;
        }
    });
    const avgIntensity = rpeCount > 0 ? (totalRPE / rpeCount).toFixed(1) : null;

    // Unified pill style to match set details
    const pillBaseStyle = {
        border: '1px solid #f29b11',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: '900',
        backgroundColor: 'rgba(242, 155, 17, 0.05)',
        textTransform: 'uppercase'
    };

    return (
        <div onClick={() => handleToggleActivityExpansion(log.id)} style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'transparent', border: '1px solid #222', borderLeft: isExpanded ? '4px solid #f29b11' : '4px solid transparent', padding: '15px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '900', margin: 0, color: isExpanded ? '#f29b11' : '#fff', textTransform: 'uppercase' }}>{log.program_days?.label || 'Activity'}</h3>
                    <p style={{ fontSize: '10px', color: '#666', margin: '2px 0 0', fontWeight: '800' }}>{startTimeStr ? `${startTimeStr} - ${endTimeStr}` : endTimeStr}</p>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                        <div style={{ ...pillBaseStyle, color: '#f29b11' }}>{sessionVolume.toLocaleString()} KG</div>
                        {avgIntensity && (<div style={{ ...pillBaseStyle, color: '#2ecc71', borderColor: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.05)' }}>INT: {avgIntensity}</div>)}
                    </div>
                </div>
                {isExpanded ? <ChevronDown size={20} color="#f29b11" /> : <ChevronRight size={20} color="#333" />}
            </div>
            {isExpanded && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200" style={{ marginTop: '15px' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '15px' }}>
                        {isLoading && !activeHistorySession ? (
                            <div style={{ padding: '20px', textAlign: 'center' }}><Loader2 className="animate-spin" color="#f29b11" size={16} /></div>
                        ) : activeHistorySession?.groupedLogs?.map((group, gi) => (
                            <div key={gi} style={{ padding: '8px 0', borderBottom: gi < activeHistorySession.groupedLogs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                <div style={{ fontSize: '13px', color: '#fff', fontWeight: '900', textTransform: 'uppercase' }}>{group.name}</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px', color: '#f29b11', fontSize: '10px' }}>
                                    {group.sets.map((s, si) => (<div key={si} style={pillBaseStyle}>{renderSetLabel(s.weight, s.reps)}</div>))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={(e) => { e.stopPropagation(); handleExportJson(log.id); }} className="premium-btn-secondary" style={{ flex: 1, height: '40px', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Download size={14} /> EXPORT AI</button>
                        <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteLog({ id: log.id, type: 'WORKOUT' }); }} className="premium-btn-secondary" style={{ flex: 1, height: '40px', fontSize: '10px', fontWeight: '800', color: '#ef4444', border: '1px solid #ef444422', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Trash2 size={14} /> DELETE</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompletedSessionCard;