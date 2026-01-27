import React, { useState, useMemo, useEffect } from 'react';
import { LayoutGrid, Plus, Coffee, Loader2, X } from 'lucide-react';
import { useProgramStore } from '../../stores/useProgramStore';
import { AgendaCalendar } from './components/AgendaCalendar';
import CompletedSessionCard from './components/CompletedSessionCard';
import { getActiveSchema } from '../../../../supabaseClient';
import { useDraggableScroll } from '../../shared/hooks/useDraggableScroll';

/**
 * Master Agenda: The formal chronological timeline and performance vault.
 * Now acts as its own Feature Orchestrator.
 */
export const MasterAgendaView = ({
    onExit,
    onNavigate,
    onLogActivity,
    handleExportJson,
    setConfirmDeleteId,
    activeSession,
    workoutLabel,
    elapsed,
    setShowAbandonModal
}) => {
    // 1. Store Access
    const { 
        globalHistory, getHistoryStats, getActivitiesForDate, 
        fetchGlobalHistory, fetchSessionDetails, activeHistorySession, isLoading 
    } = useProgramStore();

    // 2. Local Feature State
    const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
    const [historyTab, setHistoryTab] = useState('timeline');
    const [isGridExpanded, setIsGridExpanded] = useState(false);
    const [expandedActivityId, setExpandedActivityId] = useState(null);
    const [scrollMonth, setScrollMonth] = useState("");
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const { scrollerRef, scrollHandlers } = useDraggableScroll();

    // 3. Derived State
    const stats = getHistoryStats();
    const activitiesOnSelectedDate = getActivitiesForDate(selectedCalendarDate);

    const scrollerDates = useMemo(() => {
        const dates = [];
        const start = new Date();
        // Expand range: 180 days back, 180 days forward (approx 1 year total)
        start.setDate(start.getDate() - 180); 
        for (let i = 0; i < 361; i++) { 
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            dates.push(d);
        }
        return dates;
    }, []);

    // 4. Effects
    useEffect(() => {
        setExpandedActivityId(null);
    }, [selectedCalendarDate]);

    // Track visible month on scroll
    useEffect(() => {
        const el = scrollerRef.current;
        if (!el || isGridExpanded) return;

        const handleScroll = () => {
            const itemWidth = 50; // minWidth (44) + gap (6)
            const index = Math.round(el.scrollLeft / itemWidth);
            const visibleDate = scrollerDates[index];
            if (visibleDate) {
                const label = visibleDate.toLocaleDateString([], { month: 'long', year: 'numeric' });
                setScrollMonth(label.toUpperCase());
            }
        };

        el.addEventListener('scroll', handleScroll);
        // Initial call
        handleScroll();
        return () => el.removeEventListener('scroll', handleScroll);
    }, [scrollerDates, isGridExpanded]);

    // Center scroller on mount
    useEffect(() => {
        if (scrollerRef.current && !isGridExpanded) {
            const todayIndex = scrollerDates.findIndex(d => d.toDateString() === new Date().toDateString());
            if (todayIndex !== -1) {
                const containerWidth = scrollerRef.current.offsetWidth;
                const itemWidth = 50; // minWidth (44) + gap (6)
                const scrollPos = (todayIndex * itemWidth) - (containerWidth / 2) + (itemWidth / 2);
                scrollerRef.current.scrollLeft = scrollPos;
            }
        }
    }, [isGridExpanded, scrollerDates]); // Re-run if we switch back from grid to date scroller

    // 5. Handlers
    const handleToggleActivityExpansion = (sessionId) => {
        if (expandedActivityId === sessionId) setExpandedActivityId(null);
        else { setExpandedActivityId(sessionId); fetchSessionDetails(sessionId); }
    };

    const getDateStyle = (dateObj) => {
        if (!dateObj) return {};
        const isToday = dateObj.toDateString() === new Date().toDateString();
        const dateStr = dateObj.toLocaleDateString('en-CA');
        const hasActivity = globalHistory.some(s => new Date(s.end_time).toLocaleDateString('en-CA') === dateStr);
        return { color: isToday ? '#2ecc71' : hasActivity ? '#f29b11' : '#666', fontWeight: isToday ? '900' : '800' };
    };

    return (
        <div className="app-container-v2 viewport-constrained">
            <header style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '54px', padding: '0 10px', zIndex: 50, position: 'relative', flexShrink: 0, borderBottom: '1px solid #222' }}>
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

                {getActiveSchema() === 'v3_dev' && (
                    <span style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', fontSize: '7px', color: '#ef4444', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Sandbox Mode
                    </span>
                )}

                <button onClick={() => onLogActivity(selectedCalendarDate)} style={{ all: 'unset', cursor: 'pointer', padding: '10px 5px' }} title="Plan or Log Activity"><Plus size={28} color="#f29b11" strokeWidth={3} /></button>
            </header>

            <div className="scrollable-content" style={{ padding: '0 10px' }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'minmax(0, 1fr)', 
                    gap: '20px', 
                    paddingTop: '5px',
                    overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {!isGridExpanded && (
                            <div style={{ fontSize: '9px', fontWeight: '900', color: '#f29b11', letterSpacing: '2px', marginBottom: '4px', opacity: 0.8 }}>
                                {scrollMonth}
                            </div>
                        )}
                        <AgendaCalendar 
                            isGridExpanded={isGridExpanded}
                            selectedCalendarDate={selectedCalendarDate}
                            setSelectedCalendarDate={setSelectedCalendarDate}
                            currentMonth={currentMonth}
                            setCurrentMonth={setCurrentMonth}
                            scrollerRef={scrollerRef}
                            scrollerDates={scrollerDates}
                            scrollHandlers={scrollHandlers}
                            getDateStyle={getDateStyle}
                        />

                        {activeSession && (
                            <div style={{ backgroundColor: 'transparent', border: '1px solid #2ecc71', padding: '12px', borderRadius: '8px', marginTop: '10px', marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div onClick={() => onNavigate('session')} style={{ flex: 1, cursor: 'pointer' }}>
                                                            <p style={{ fontSize: '10px', fontWeight: '900', color: '#2ecc71', textTransform: 'uppercase', margin: 0 }}>Active Session in Progress</p>
                                                            <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{workoutLabel} • <span style={{ fontFamily: 'monospace' }}>{elapsed}</span></p>
                                                        </div>
                                
                                <button onClick={() => setShowAbandonModal(true)} style={{ all: 'unset', padding: '10px', cursor: 'pointer', opacity: 0.6 }}>
                                    <X size={20} color="#ef4444" />
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div style={{ paddingBottom: '100px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', marginTop: '5px' }}>
                            <h3 style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#444', letterSpacing: '1px', margin: 0 }}>{selectedCalendarDate.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
                            {activitiesOnSelectedDate.length > 0 && <span style={{ fontSize: '9px', fontWeight: '800', color: '#f29b11', backgroundColor: 'rgba(242, 155, 17,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{activitiesOnSelectedDate.length} LOGS</span>}
                        </div>
                        {activitiesOnSelectedDate.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {activitiesOnSelectedDate.map(log => (
                                    <CompletedSessionCard 
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
            </div>
        </div>
    );
};