import React from 'react';
import { LayoutGrid, Dumbbell, Flame, Target, Plus, ChevronDown, ChevronRight, Download, Trash2, Coffee, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import { renderSetLabel, formatSnapshot } from '../../shared/utils/formatting.jsx';

/**
 * Master Agenda: The formal chronological timeline and performance vault.
 */
export const MasterAgendaView = ({
    onExit,
    onNavigate,
    globalHistory,
    stats,
    selectedCalendarDate,
    setSelectedCalendarDate,
    isGridExpanded,
    setIsGridExpanded,
    historyTab,
    setHistoryTab,
    scrollerRef,
    scrollerDates,
    scrollHandlers,
    activitiesOnSelectedDate,
    isLoggingActivity,
    setIsLoggingActivity,
    handleToggleActivityExpansion,
    handleExportJson,
    setConfirmDeleteId,
    programDays,
    handleInstantRetroactive,
    isLoading,
    activeHistorySession,
    getDateStyle,
    expandedActivityId
}) => {
    return (
        <div className="app-container-v2" style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '54px', zIndex: 50 }}>
                <button onClick={onExit} style={{ all: 'unset', cursor: 'pointer', padding: '10px 5px' }} title="Back to Portal"><LayoutGrid size={24} color="#f29b11" /></button>
                <div style={{ display: 'flex', backgroundColor: '#0a0a0a', borderRadius: '8px', padding: '4px', border: '1px solid #222', flex: 1.5 }}>
                    <button 
                        onClick={() => { if (historyTab === 'timeline') setIsGridExpanded(!isGridExpanded); else setHistoryTab('timeline'); }} 
                        style={{ flex: 1, all: 'unset', padding: '10px 4px', textAlign: 'center', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', borderRadius: '6px', backgroundColor: historyTab === 'timeline' ? '#f29b11' : 'transparent', color: historyTab === 'timeline' ? '#000' : '#666', transition: 'all 0.2s' }}
                    >
                        {historyTab === 'timeline' ? (isGridExpanded ? 'Month' : 'Date') : 'History'}
                    </button>
                    <button 
                        onClick={() => setHistoryTab('performance')} 
                        style={{ flex: 1, all: 'unset', padding: '10px 4px', textAlign: 'center', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', borderRadius: '6px', backgroundColor: historyTab === 'performance' ? '#f29b11' : 'transparent', color: historyTab === 'performance' ? '#000' : '#666', transition: 'all 0.2s' }}
                    >
                        Vault
                    </button>
                </div>
                <button onClick={() => onNavigate(null)} style={{ all: 'unset', cursor: 'pointer', padding: '10px 5px' }} title="Switch to Ready to Train"><Dumbbell size={26} color="#f29b11" /></button>
            </header>

            <motion.div 
                drag 
                dragMomentum={false} 
                dragConstraints={{ left: -300, right: 0, top: -600, bottom: 0 }}
                dragElastic={0.05}
                style={{ position: 'fixed', bottom: '30px', right: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', zIndex: 1000, touchAction: 'none' }}
            >
                <div style={{ backgroundColor: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(10px)', border: '1px solid #222', borderRadius: '20px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Flame size={14} color="#f29b11" fill="#f29b11" /><span style={{ fontSize: '12px', fontWeight: '900', color: '#fff' }}>{stats.streak}</span></div>
                    <div style={{ width: '1px', height: '12px', backgroundColor: '#333' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Target size={14} color="#2ecc71" /><span style={{ fontSize: '12px', fontWeight: '900', color: '#fff' }}>{stats.weekCount}</span></div>
                </div>
                <button onClick={() => setIsLoggingActivity(true)} style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f29b11', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 40px rgba(242, 155, 17, 0.5)', border: 'none' }}><Plus size={36} strokeWidth={3} /></button>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, overflowY: 'auto' }}>
                <div style={{ backgroundColor: 'transparent', borderRadius: '15px', padding: isGridExpanded ? '10px' : '0', border: isGridExpanded ? '1px solid #222' : 'none', transition: 'all 0.3s ease' }}>
                    {isGridExpanded ? (
                        <div className="animate-in zoom-in-95 duration-200">
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <style>{`.rdp-root { --rdp-accent-color: #f29b11 !important; --rdp-today-color: #2ecc71 !important; margin: 0; } .rdp-day_selected { background-color: #f29b11 !important; color: #000 !important; border-radius: 50% !important; } .rdp-day_today { color: #2ecc71 !important; font-weight: 900 !important; } .rdp-nav_button, .rdp-caption_label, .rdp-head_cell { color: #f29b11 !important; font-weight: 900 !important; text-transform: uppercase !important; } .rdp-day_outside { color: rgba(242, 155, 17, 0.2) !important; }`}</style>
                                <DayPicker 
                                    mode="single" 
                                    selected={selectedCalendarDate} 
                                    onSelect={(d) => d && setSelectedCalendarDate(d)} 
                                    weekStartsOn={1} 
                                    components={{ 
                                        Day: (props) => { 
                                            const { day, modifiers } = props; 
                                            if (!day) return null; 
                                            const date = day.date; 
                                            const isSelected = modifiers.selected; 
                                            const customStyle = getDateStyle(date); 
                                            return (
                                                <td style={{ padding: '2px' }}>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setSelectedCalendarDate(date)} 
                                                        style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: 'transparent', borderRadius: '8px', border: isSelected ? '2px solid #f29b11' : 'none', ...customStyle }}
                                                    >
                                                        {date.getDate()}
                                                    </button>
                                                </td>
                                            ); 
                                        } 
                                    }} 
                                />
                            </div>
                        </div>
                    ) : (
                        <div ref={scrollerRef} {...scrollHandlers} style={{ display: 'flex', overflowX: 'auto', gap: '6px', padding: '2px 0', scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab', userSelect: 'none' }}>
                            {scrollerDates.map((date, idx) => { 
                                const isSelected = date.toDateString() === selectedCalendarDate.toDateString(); 
                                const customStyle = getDateStyle(date); 
                                return (
                                    <div 
                                        key={idx} 
                                        onClick={() => setSelectedCalendarDate(date)} 
                                        style={{ minWidth: '44px', height: '44px', borderRadius: '10px', border: isSelected ? '2px solid #f29b11' : '1px solid #222', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: 'transparent', transition: 'all 0.2s ease', flexShrink: 0 }}
                                    >
                                        <span style={{ fontSize: '8px', fontWeight: '800', textTransform: 'uppercase', color: '#666', pointerEvents: 'none' }}>{date.toLocaleDateString([], { weekday: 'short' })}</span>
                                        <span style={{ fontSize: '17px', pointerEvents: 'none', ...customStyle }}>{date.getDate()}</span>
                                    </div>
                                ); 
                            })}
                        </div>
                    )}
                </div>
                <div style={{ flex: 1, paddingBottom: '100px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', marginTop: '5px' }}>
                        <h3 style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#444', letterSpacing: '1px', margin: 0 }}>{selectedCalendarDate.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
                        {activitiesOnSelectedDate.length > 0 && <span style={{ fontSize: '9px', fontWeight: '800', color: '#f29b11', backgroundColor: 'rgba(242,155,17,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{activitiesOnSelectedDate.length} LOGS</span>}
                    </div>
                    {activitiesOnSelectedDate.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {activitiesOnSelectedDate.map(log => { 
                                const isExpanded = expandedActivityId === log.id; 
                                const startTimeStr = log.start_time ? new Date(log.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                                const endTimeStr = new Date(log.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                
                                let sessionVolume = 0;
                                let totalRPE = 0;
                                let rpeCount = 0;
                                (log.set_logs || []).forEach(set => {
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

                                return (
                                    <div key={log.id} onClick={() => handleToggleActivityExpansion(log.id)} style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'transparent', border: '1px solid #222', borderLeft: isExpanded ? '4px solid #f29b11' : '4px solid transparent', padding: '15px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <h3 style={{ fontSize: '13px', fontWeight: '900', margin: 0, color: isExpanded ? '#f29b11' : '#fff', textTransform: 'uppercase' }}>{log.program_days?.label || 'Activity'}</h3>
                                                <p style={{ fontSize: '10px', color: '#666', margin: '2px 0 0', fontWeight: '800' }}>{startTimeStr ? `${startTimeStr} - ${endTimeStr}` : endTimeStr}</p>
                                                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                                                    <div style={{ border: '1px solid rgba(242, 155, 17, 0.3)', padding: '1px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: '900', color: '#f29b11', backgroundColor: 'rgba(242, 155, 17, 0.02)' }}>{sessionVolume.toLocaleString()} KG</div>
                                                    {avgIntensity && (<div style={{ border: '1px solid rgba(46, 204, 113, 0.3)', padding: '1px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: '900', color: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.02)' }}>INTENSITY: {avgIntensity}</div>)}
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
                                                                {group.sets.map((s, si) => (<div key={si} style={{ border: '1px solid #f29b11', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(242, 155, 17, 0.05)' }}>{renderSetLabel(s.weight, s.reps)}</div>))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={(e) => { e.stopPropagation(); handleExportJson(log.id); }} className="premium-btn-secondary" style={{ flex: 1, height: '40px', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Download size={14} /> EXPORT AI</button>
                                                    <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(log.id); }} className="premium-btn-secondary" style={{ flex: 1, height: '40px', fontSize: '10px', fontWeight: '800', color: '#ef4444', border: '1px solid #ef444422', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Trash2 size={14} /> DELETE</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ); 
                            })}
                        </div>
                    ) : (
                        <div style={{ padding: '50px 20px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px dashed #222', borderRadius: '15px' }}>
                            <Coffee size={32} color="#222" style={{ margin: '0 auto 15px' }} />
                            <p style={{ fontSize: '11px', color: '#444', fontWeight: '800', textTransform: 'uppercase', margin: 0, letterSpacing: '1px' }}>No Activity Logged</p>
                        </div>
                    )}
                </div>
            </div>

            {isLoggingActivity && (
                <div className="animate-in slide-in-from-bottom-4 duration-300" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ maxWidth: '400px', width: '100%' }}>
                        <p style={{ fontSize: '12px', color: '#f29b11', fontWeight: '900', textTransform: 'uppercase', textAlign: 'center', marginBottom: '20px', letterSpacing: '3px' }}>Initialize Activity:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {programDays.map(day => (
                                <button key={day.id} onClick={() => handleInstantRetroactive(day.id)} style={{ all: 'unset', padding: '25px 10px', backgroundColor: '#0a0a0a', color: '#fff', borderRadius: '12px', fontSize: '12px', fontWeight: '900', textAlign: 'center', border: '1px solid #222' }}>{day.label}</button>
                            ))}
                        </div>
                        <button onClick={() => setIsLoggingActivity(false)} className="premium-btn-secondary" style={{ marginTop: '25px', height: '54px', border: 'none', color: '#666', fontSize: '12px' }}>DISMISS</button>
                    </div>
                </div>
            )}
        </div>
    );
};