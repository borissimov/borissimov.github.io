import React from 'react';
import { LayoutGrid, Dumbbell, Coffee, Loader2 } from 'lucide-react';
import { AgendaCalendar } from './components/AgendaCalendar';
import { ActivityLogCard } from './components/ActivityLogCard';
import { AgendaStats } from './components/AgendaStats';

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
                <button onClick={() => onNavigate(null)} style={{ all: 'unset', cursor: 'pointer', padding: '10px 5px' }} title="Switch to Program Library"><Dumbbell size={26} color="#f29b11" /></button>
            </header>

            <AgendaStats stats={stats} onLogActivity={() => setIsLoggingActivity(true)} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, overflowY: 'auto' }}>
                <AgendaCalendar 
                    isGridExpanded={isGridExpanded}
                    selectedCalendarDate={selectedCalendarDate}
                    setSelectedCalendarDate={setSelectedCalendarDate}
                    scrollerRef={scrollerRef}
                    scrollerDates={scrollerDates}
                    scrollHandlers={scrollHandlers}
                    getDateStyle={getDateStyle}
                />
                
                <div style={{ flex: 1, paddingBottom: '100px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', marginTop: '5px' }}>
                        <h3 style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#444', letterSpacing: '1px', margin: 0 }}>{selectedCalendarDate.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
                        {activitiesOnSelectedDate.length > 0 && <span style={{ fontSize: '9px', fontWeight: '800', color: '#f29b11', backgroundColor: 'rgba(242,155,17,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{activitiesOnSelectedDate.length} LOGS</span>}
                    </div>
                    {activitiesOnSelectedDate.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {activitiesOnSelectedDate.map(log => (
                                <ActivityLogCard 
                                    key={log.id}
                                    log={log}
                                    expandedActivityId={expandedActivityId}
                                    handleToggleActivityExpansion={handleToggleActivityExpansion}
                                    isLoading={isLoading}
                                    activeHistorySession={activeHistorySession}
                                    handleExportJson={handleExportJson}
                                    setConfirmDeleteId={setConfirmDeleteId}
                                />
                            ))}
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