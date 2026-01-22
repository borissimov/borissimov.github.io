import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useTrainingStore } from './stores/useTrainingStore';
import { TrainingBlock } from './components/TrainingBlock';
import { ArrowLeft, Play, X, Activity, Loader2, Coffee, Check, ChevronDown, ChevronRight, Info, Clock, AlertTriangle, Trophy, AlertCircle, History, Calendar as CalendarIcon, Dumbbell, Archive, Download, LayoutList, CalendarPlus, Plus, Trash2, Edit2, LayoutPanelLeft, List, Flame, Target, TrendingUp, LayoutGrid, Maximize2, BookOpen } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { motion } from 'framer-motion';
import 'react-day-picker/dist/style.css';
import '../shared-premium.css';

// --- GLOBAL FAILSAFE HELPERS ---
const getProgressColor = (percent) => {
    const p = Math.max(0, Math.min(100, percent || 0));
    const colors = { 
        red: { r: 239, g: 68, b: 68 }, 
        orange: { r: 242, g: 155, b: 17 }, 
        green: { r: 46, g: 204, b: 113 } 
    };
    
    let r, g, b;
    if (p < 50) {
        const t = p / 50;
        r = Math.round(colors.red.r + (colors.orange.r - colors.red.r) * t);
        g = Math.round(colors.red.g + (colors.orange.g - colors.red.g) * t);
        b = Math.round(colors.red.b + (colors.orange.b - colors.red.b) * t);
    } else {
        const t = (p - 50) / 50;
        r = Math.round(colors.orange.r + (colors.green.r - colors.orange.r) * t);
        g = Math.round(colors.orange.g + (colors.green.g - colors.orange.g) * t);
        b = Math.round(colors.orange.b + (colors.green.b - colors.orange.b) * t);
    }
    return `rgb(${r}, ${g}, ${b})`;
};

const RegimenProApp = ({ onExit, currentView, onNavigate }) => {
    const { 
        activeSession, startSession, finishSession, resetStore, fetchRoutineDays, availableRoutineDays, recommendedDayId, selectedDayId, setSelectedDay, isLoading,
        sessionHistory, fetchDayHistory, activeHistorySession, fetchSessionDetails,
        globalHistory, fetchGlobalHistory, uniqueExercises, fetchUniqueExercises, activeExerciseHistory, fetchExerciseHistory,
        retroactiveDate, deleteSessionLog, dailyVolumes
    } = useTrainingStore();

    const [elapsed, setElapsed] = useState('00:00');
    const [showAbandonModal, setShowAbandonModal] = useState(false);
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [historyTab, setHistoryTab] = useState('timeline');
    const [isGridExpanded, setIsGridExpanded] = useState(false);
    
    // Management State
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Hub State
    const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
    const [isLoggingActivity, setIsLoggingActivity] = useState(false);
    const [expandedActivityId, setExpandedActivityId] = useState(null);

    // Scroller Mouse Drag State
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftState, setScrollLeftState] = useState(0);
    const [dragMoved, setDragMoved] = useState(false);

    const activitiesOnSelectedDate = useMemo(() => {
        return globalHistory.filter(s => {
            const d1 = new Date(s.end_time).toDateString();
            const d2 = selectedCalendarDate.toDateString();
            return d1 === d2;
        });
    }, [globalHistory, selectedCalendarDate]);

    // Momentum Logic
    const stats = useMemo(() => {
        const today = new Date();
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toDateString();
        });
        
        const weekCount = globalHistory.filter(s => {
            const date = new Date(s.end_time).toDateString();
            return last7Days.includes(date);
        }).length;

        let streak = 0;
        let checkDate = new Date();
        const todayHasLog = globalHistory.some(s => new Date(s.end_time).toDateString() === checkDate.toDateString());
        if (!todayHasLog) checkDate.setDate(checkDate.getDate() - 1);

        while (true) {
            const hasActivity = globalHistory.some(s => new Date(s.end_time).toDateString() === checkDate.toDateString());
            if (hasActivity) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else break;
        }
        return { streak, weekCount };
    }, [globalHistory]);

    // Refined Styling Logic
    const getDateStyle = (dateObj) => {
        if (!dateObj) return {};
        const dateKey = dateObj.toDateString();
        const isToday = dateKey === new Date().toDateString();
        const hasActivity = globalHistory.some(s => new Date(s.end_time).toDateString() === dateKey);
        
        const style = {
            transition: 'all 0.2s ease',
            fontWeight: '800'
        };

        if (isToday) {
            style.color = '#2ecc71';
            style.transform = 'scale(1.15)'; 
            style.fontWeight = '900';
        } else if (hasActivity) {
            style.color = '#f29b11';
            style.textShadow = '0 0 8px rgba(242, 155, 17, 0.4)';
        } else {
            style.color = '#666';
        }

        return style;
    };

    // Scroller Dates
    const scrollerDates = useMemo(() => {
        const dates = [];
        const start = new Date();
        start.setDate(start.getDate() - 14); 
        for (let i = 0; i < 28; i++) { 
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            dates.push(d);
        }
        return dates;
    }, []);

    const scrollerRef = useRef(null);

    // AUTO-CENTER LOGIC: ENSURE SCROLLER ALIGNS ON VIEW CHANGE OR DATE CHANGE
    useEffect(() => {
        if (!isGridExpanded && currentView === 'global-history' && scrollerRef.current) {
            // Use a small delay to ensure DOM is ready after view transition
            const timer = setTimeout(() => {
                const selectedIdx = scrollerDates.findIndex(d => d.toDateString() === selectedCalendarDate.toDateString());
                if (selectedIdx !== -1) {
                    const el = scrollerRef.current.children[selectedIdx];
                    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isGridExpanded, selectedCalendarDate, scrollerDates, currentView]);

    // RESET TO TODAY WHEN ENTERING LOGS
    useEffect(() => {
        if (currentView === 'global-history') {
            setSelectedCalendarDate(new Date());
        }
    }, [currentView]);

    // Mouse Drag Handlers
    const handleMouseDown = (e) => {
        if (!scrollerRef.current) return;
        setIsDragging(true);
        setDragMoved(false);
        setStartX(e.pageX - scrollerRef.current.offsetLeft);
        setScrollLeftState(scrollerRef.current.scrollLeft);
    };
    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e) => {
        if (!isDragging || !scrollerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollerRef.current.offsetLeft;
        const walk = (x - startX) * 2; 
        if (Math.abs(walk) > 5) setDragMoved(true);
        scrollerRef.current.scrollLeft = scrollLeftState - walk;
    };
    const handleDateClick = (date) => {
        if (dragMoved) return; 
        setSelectedCalendarDate(date);
    };
    const handleAbandonSession = () => {
        resetStore();
        setShowAbandonModal(false);
        onNavigate(null); 
    };

    useEffect(() => {
        setIsLoggingActivity(false);
        setExpandedActivityId(null);
    }, [selectedCalendarDate]);

    // Data Loading
    useEffect(() => {
        if (!activeSession && availableRoutineDays.length === 0) fetchRoutineDays();
        if (currentView === 'global-history') { fetchGlobalHistory(); fetchUniqueExercises(); }
    }, [currentView, activeSession, fetchRoutineDays, fetchGlobalHistory, fetchUniqueExercises]);

    // Global Stats
    const globalStats = activeSession?.blocks?.reduce((acc, block) => {
        block.exercises.forEach(ex => {
            const target = parseInt(ex.target_sets || 3);
            const logged = (activeSession?.logs[ex.id] || []).length;
            acc.totalTarget += target;
            acc.totalLogged += Math.min(logged, target);
        });
        return acc;
    }, { totalTarget: 0, totalLogged: 0 }) || { totalTarget: 0, totalLogged: 0 };

    const globalPercent = globalStats.totalTarget > 0 ? (globalStats.totalLogged / globalStats.totalTarget) * 100 : 0;
    const workoutLabel = availableRoutineDays.find(d => d.id === activeSession?.routine_day_id)?.label || 'Activity';

    const handleFinalizeSession = async () => {
        setIsSaving(true);
        try { await finishSession(); setShowFinishModal(false); onNavigate('global-history'); } catch (e) { alert("Error saving: " + e.message); } finally { setIsSaving(false); }
    };

    const handleInstantRetroactive = (dayId) => {
        setSelectedDay(dayId);
        startSession(dayId, selectedCalendarDate.toISOString()).then(() => onNavigate('session'));
    };

    const handleToggleActivityExpansion = (sessionId) => {
        if (expandedActivityId === sessionId) {
            setExpandedActivityId(null);
        } else {
            setExpandedActivityId(sessionId);
            fetchSessionDetails(sessionId);
        }
    };

    const handleDeleteLog = async () => {
        setIsDeleting(true);
        try { await deleteSessionLog(confirmDeleteId); setConfirmDeleteId(null); } catch (e) { alert("Delete failed: " + e.message); } finally { setIsDeleting(false); }
    };

    // MISSION DATA EXPORT LOGIC
    const handleExportJson = (sessionId) => {
        const session = activeHistorySession;
        if (!session || session.id !== sessionId) return;

        const durationMinutes = session.start_time 
            ? Math.round((new Date(session.end_time) - new Date(session.start_time)) / 60000)
            : 'Unknown';

        const exportData = {
            mission_brief_for_ai: "Analyze this training session. Compare actual Weight/Reps/RPE against targets. Identify performance leakage in tempo or duration. Determine if progressive overload was achieved. Calculate an approximated Kkal burn for the entire session based on tonnage and intensity. Suggest specific weight/rep adjustments for the next encounter.",
            session_metadata: {
                label: session.routine_days?.label || 'Activity',
                date: new Date(session.end_time).toLocaleDateString(),
                start_time: session.start_time,
                end_time: session.end_time,
                duration_minutes: durationMinutes
            },
            exercise_data: session.groupedLogs.map(group => ({
                exercise_name: group.name,
                targets: group.targets,
                actual_sets: group.sets.map(s => ({
                    weight: s.weight,
                    reps: s.reps,
                    rpe: s.rpe,
                    set_number: s.set_number
                }))
            }))
        };

        // CUSTOM FILENAME FORMAT: YY.MM.DD-Workout_name.json
        const dateObj = new Date(session.end_time);
        const yy = String(dateObj.getFullYear()).slice(-2);
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const workoutName = (session.routine_days?.label || 'Workout').replace(/\s+/g, '_');
        const fileName = `${yy}.${mm}.${dd}-${workoutName}.json`;

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Timer
    useEffect(() => {
        if (activeSession && !activeSession.isRestDay && !retroactiveDate) {
            const interval = setInterval(() => {
                const diff = new Date() - new Date(activeSession.startTime);
                const mins = Math.floor(diff / 60000);
                const secs = Math.floor((diff % 60000) / 1000);
                setElapsed(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [activeSession, retroactiveDate]);

    // Formatters
    const renderSetLabel = (weight, reps) => {
        const isBW = String(weight).toLowerCase() === 'bw';
        const isCardio = String(reps).toLowerCase().includes('min') || String(reps).toLowerCase().includes('sec');
        return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
                <span style={{ fontWeight: '800' }}>{weight}</span>
                {!isBW && weight !== '-' && !isCardio && <span style={{ fontSize: '0.7em', fontWeight: '800', marginLeft: '0px', opacity: 0.8 }}>K</span>}
                <span style={{ margin: '0 2px', opacity: 0.4 }}>·</span>
                <span style={{ fontWeight: '800' }}>{reps}</span>
            </span>
        );
    };

    const formatSnapshot = (text) => {
        if (!text) return null;
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {text.split(', ').map((setStr, i) => {
                    const parts = setStr.split(' KG · ');
                    const w = parts[0];
                    const r = parts[1] || setStr.split(' · ')[1]; 
                    return (
                        <div key={i} style={{ border: '1px solid #f29b11', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(242, 155, 17, 0.05)', fontSize: '10px', color: '#f29b11' }}>
                            {renderSetLabel(w, r)}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderModals = () => (
        <>
            {showAbandonModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="premium-card" style={{ border: `1px solid #ef4444`, textAlign: 'center', padding: '30px 20px', maxWidth: '400px', backgroundColor: '#121212' }}>
                        <AlertTriangle size={48} color="#ef4444" style={{ margin: '0 auto 20px' }} />
                        <h2 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', color: '#fff', marginBottom: '10px' }}>Abandon Activity?</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button className="premium-btn-primary" style={{ backgroundColor: '#fff', color: '#000' }} onClick={() => setShowAbandonModal(false)}>RESUME TRAINING</button>
                            <button onClick={handleAbandonSession} style={{ all: 'unset', color: '#ef4444', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', padding: '10px' }}>Yes, Abandon Activity</button>
                        </div>
                    </div>
                </div>
            )}
            {showFinishModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="premium-card" style={{ border: `1px solid ${globalPercent >= 100 ? '#2ecc71' : '#f29b11'}`, textAlign: 'center', padding: '30px 20px', maxWidth: '400px', backgroundColor: '#121212' }}>
                        {globalPercent >= 100 ? <Trophy size={48} color="#2ecc71" style={{ margin: '0 auto 20px' }} className="animate-bounce" /> : <AlertCircle size={48} color="#f29b11" style={{ margin: '0 auto 20px' }} />}
                        <h2 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', color: '#fff', marginBottom: '10px' }}>{globalPercent >= 100 ? 'Activity Accomplished' : 'Finish Early?'}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button className="premium-btn-primary" style={{ backgroundColor: globalPercent >= 100 ? '#2ecc71' : '#fff', color: '#000' }} onClick={handleFinalizeSession} disabled={isSaving}>{isSaving ? 'SYNCING...' : 'FINALIZE & SAVE'}</button>
                            <button onClick={() => setShowFinishModal(false)} style={{ all: 'unset', color: '#666', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer', padding: '10px' }}>Wait, I missed something</button>
                        </div>
                    </div>
                </div>
            )}
            {confirmDeleteId && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="premium-card" style={{ border: `1px solid #ef4444`, textAlign: 'center', padding: '30px 20px', maxWidth: '400px', backgroundColor: '#121212' }}>
                        <Trash2 size={48} color="#ef4444" style={{ margin: '0 auto 20px' }} />
                        <h2 style={{ fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', color: '#fff', marginBottom: '10px' }}>Delete Activity?</h2>
                        <p style={{ fontSize: '12px', color: '#666', marginBottom: '25px' }}>This action is permanent and will remove all logged sets for this workout.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button className="premium-btn-primary" style={{ backgroundColor: '#ef4444', color: '#fff' }} onClick={handleDeleteLog} disabled={isDeleting}>{isDeleting ? 'DELETING...' : 'YES, DELETE PERMANENTLY'}</button>
                            <button className="premium-btn-secondary" onClick={() => setConfirmDeleteId(null)}>CANCEL</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

    // --- VIEW: LOGGER (SESSION) ---
    if (currentView === 'session' && activeSession) {
        return (
            <div className="app-container-v2" style={{ padding: '0' }}>
                {renderModals()}
                <div style={{ position: 'sticky', top: 0, left: 0, zIndex: 100, backgroundColor: '#121212' }}>
                    <div style={{ height: '3px', width: '100%', backgroundColor: '#222' }}><div style={{ height: '100%', width: `${globalPercent}%`, backgroundColor: getProgressColor(globalPercent), boxShadow: `0 0 10px ${getProgressColor(globalPercent)}88`, transition: 'all 0.5s ease-out' }} /></div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', height: '54px', borderBottom: '1px solid #222' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}><button onClick={() => onNavigate(null)} style={{ all: 'unset', cursor: 'pointer', padding: '10px 5px' }}><ArrowLeft size={20} color="#f29b11" /></button><h2 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{workoutLabel}</h2></div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>{retroactiveDate ? <span style={{ fontSize: '12px', fontWeight: '900', color: '#f29b11', textTransform: 'uppercase' }}>{new Date(retroactiveDate).toLocaleDateString()}</span> : <span style={{ fontSize: '18px', fontWeight: '900', color: '#f29b11', fontVariantNumeric: 'tabular-nums' }}>{elapsed}</span>}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end' }}><span style={{ fontSize: '12px', fontWeight: '900', color: getProgressColor(globalPercent), transition: 'color 0.5s ease' }}>{Math.round(globalPercent)}%</span><button onClick={() => setShowAbandonModal(true)} style={{ all: 'unset', cursor: 'pointer', opacity: 0.4, padding: '10px 5px' }}><X size={20} color="#fff" /></button></div>
                    </div>
                </div>
                <div style={{ paddingBottom: '100px' }}><div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>{activeSession.blocks.map((block, idx) => (<div key={block.id} className="premium-card" style={{ padding: '8px 10px', borderRadius: '0', border: 'none', borderBottom: '1px solid #222', marginBottom: 0, backgroundColor: 'transparent' }}><TrainingBlock block={block} index={idx} totalBlocks={activeSession.blocks.length} /></div>))}</div><div style={{ padding: '20px 15px 60px' }}><button className={globalPercent >= 100 ? "premium-btn-primary animate-pulse-bright-green" : "premium-btn-primary"} style={{ backgroundColor: globalPercent >= 100 ? '#2ecc71' : 'transparent', border: globalPercent >= 100 ? 'none' : `2px solid #f29b11`, color: globalPercent >= 100 ? '#000' : '#f29b11', boxShadow: globalPercent >= 100 ? '0 0 30px rgba(46, 204, 113, 0.4)' : '0 4px 20px rgba(0,0,0,0.5)', fontWeight: '900', fontSize: '16px', height: '54px' }} onClick={() => setShowFinishModal(true)}>End activity</button></div></div>
            </div>
        );
    }

    // --- VIEW: MISSION LOGS (GLOBAL HISTORY) ---
    if (currentView === 'global-history') {
        return (
            <div className="app-container-v2" style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
                {renderModals()}
                <header style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '54px', zIndex: 50 }}>
                    <button onClick={onExit} style={{ all: 'unset', cursor: 'pointer', padding: '10px 5px' }} title="Back to Portal"><LayoutGrid size={24} color="#f29b11" /></button>
                    <div style={{ display: 'flex', backgroundColor: '#0a0a0a', borderRadius: '8px', padding: '4px', border: '1px solid #222', flex: 1.5 }}>
                        <button onClick={() => { if (historyTab === 'timeline') setIsGridExpanded(!isGridExpanded); else setHistoryTab('timeline'); }} style={{ flex: 1, all: 'unset', padding: '10px 4px', textAlign: 'center', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', borderRadius: '6px', backgroundColor: historyTab === 'timeline' ? '#f29b11' : 'transparent', color: historyTab === 'timeline' ? '#000' : '#666', transition: 'all 0.2s' }}>{historyTab === 'timeline' ? (isGridExpanded ? 'Month' : 'Date') : 'History'}</button>
                        <button onClick={() => setHistoryTab('performance')} style={{ flex: 1, all: 'unset', padding: '10px 4px', textAlign: 'center', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', borderRadius: '6px', backgroundColor: historyTab === 'performance' ? '#f29b11' : 'transparent', color: historyTab === 'performance' ? '#000' : '#666', transition: 'all 0.2s' }}>Vault</button>
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
                            <div className="animate-in zoom-in-95 duration-200"><div style={{ display: 'flex', justifyContent: 'center' }}>
                                <style>{`.rdp-root { --rdp-accent-color: #f29b11 !important; --rdp-today-color: #2ecc71 !important; margin: 0; } .rdp-day_selected { background-color: #f29b11 !important; color: #000 !important; border-radius: 50% !important; } .rdp-day_today { color: #2ecc71 !important; font-weight: 900 !important; } .rdp-nav_button, .rdp-caption_label, .rdp-head_cell { color: #f29b11 !important; font-weight: 900 !important; text-transform: uppercase !important; } .rdp-day_outside { color: rgba(242, 155, 17, 0.2) !important; }`}</style>
                                <DayPicker mode="single" selected={selectedCalendarDate} onSelect={(d) => d && setSelectedCalendarDate(d)} weekStartsOn={1} components={{ Day: (props) => { const { day, modifiers } = props; if (!day) return null; const date = day.date; const isSelected = modifiers.selected; const customStyle = getDateStyle(date); return (<td style={{ padding: '2px' }}><button type="button" onClick={() => setSelectedCalendarDate(date)} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: 'transparent', borderRadius: '8px', border: isSelected ? '2px solid #f29b11' : 'none', ...customStyle }}>{date.getDate()}</button></td>); }}} />
                            </div></div>
                        ) : (
                            <div ref={scrollerRef} onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} style={{ display: 'flex', overflowX: 'auto', gap: '6px', padding: '2px 0', scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none' }}>
                                {scrollerDates.map((date, idx) => { const isSelected = date.toDateString() === selectedCalendarDate.toDateString(); const customStyle = getDateStyle(date); return (<div key={idx} onClick={() => handleDateClick(date)} style={{ minWidth: '44px', height: '44px', borderRadius: '10px', border: isSelected ? '2px solid #f29b11' : '1px solid #222', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: 'transparent', transition: 'all 0.2s ease', flexShrink: 0 }}><span style={{ fontSize: '8px', fontWeight: '800', textTransform: 'uppercase', color: '#666', pointerEvents: 'none' }}>{date.toLocaleDateString([], { weekday: 'short' })}</span><span style={{ fontSize: '17px', pointerEvents: 'none', ...customStyle }}>{date.getDate()}</span></div>); })}
                            </div>
                        )}
                    </div>
                    <div style={{ flex: 1, paddingBottom: '100px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', marginTop: '5px' }}><h3 style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#444', letterSpacing: '1px', margin: 0 }}>{selectedCalendarDate.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</h3>{activitiesOnSelectedDate.length > 0 && <span style={{ fontSize: '9px', fontWeight: '800', color: '#f29b11', backgroundColor: 'rgba(242,155,17,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{activitiesOnSelectedDate.length} LOGS</span>}</div>
                        {activitiesOnSelectedDate.length > 0 ? (<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>{activitiesOnSelectedDate.map(log => { 
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

                            return (<div key={log.id} onClick={() => handleToggleActivityExpansion(log.id)} style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'transparent', border: '1px solid #222', borderLeft: isExpanded ? '4px solid #f29b11' : '4px solid transparent', padding: '15px', cursor: 'pointer', transition: 'all 0.2s ease' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}><div style={{ flex: 1, minWidth: 0 }}><h3 style={{ fontSize: '13px', fontWeight: '900', margin: 0, color: isExpanded ? '#f29b11' : '#fff', textTransform: 'uppercase' }}>{log.routine_days?.label || 'Activity'}</h3><p style={{ fontSize: '10px', color: '#666', margin: '2px 0 0', fontWeight: '800' }}>{startTimeStr ? `${startTimeStr} - ${endTimeStr}` : endTimeStr}</p><div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}><div style={{ border: '1px solid rgba(242, 155, 17, 0.3)', padding: '1px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: '900', color: '#f29b11', backgroundColor: 'rgba(242, 155, 17, 0.02)' }}>{sessionVolume.toLocaleString()} KG</div>{avgIntensity && (<div style={{ border: '1px solid rgba(46, 204, 113, 0.3)', padding: '1px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: '900', color: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.02)' }}>INTENSITY: {avgIntensity}</div>)}</div></div>{isExpanded ? <ChevronDown size={20} color="#f29b11" /> : <ChevronRight size={20} color="#333" />}</div>{isExpanded && (<div className="animate-in fade-in slide-in-from-top-2 duration-200" style={{ marginTop: '15px' }}><div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '15px' }}>{isLoading && !activeHistorySession ? <div style={{ padding: '20px', textAlign: 'center' }}><Loader2 className="animate-spin" color="#f29b11" size={16} /></div> : activeHistorySession?.groupedLogs?.map((group, gi) => (<div key={gi} style={{ padding: '8px 0', borderBottom: gi < activeHistorySession.groupedLogs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}><div style={{ fontSize: '13px', color: '#fff', fontWeight: '900', textTransform: 'uppercase' }}>{group.name}</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px', color: '#f29b11', fontSize: '10px' }}>{group.sets.map((s, si) => (<div key={si} style={{ border: '1px solid #f29b11', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(242, 155, 17, 0.05)' }}>{renderSetLabel(s.weight, s.reps)}</div>))}</div></div>))}</div><div style={{ display: 'flex', gap: '8px' }}><button onClick={(e) => { e.stopPropagation(); handleExportJson(log.id); }} className="premium-btn-secondary" style={{ flex: 1, height: '40px', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Download size={14} /> EXPORT AI</button><button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(log.id); }} className="premium-btn-secondary" style={{ flex: 1, height: '40px', fontSize: '10px', fontWeight: '800', color: '#ef4444', border: '1px solid #ef444422', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Trash2 size={14} /> DELETE</button></div></div>)}</div>); })}</div>) : (<div style={{ padding: '50px 20px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px dashed #222', borderRadius: '15px' }}><p style={{ fontSize: '11px', color: '#444', fontWeight: '800', textTransform: 'uppercase', margin: 0, letterSpacing: '1px' }}>No Activity Logged</p></div>)}
                    </div>
                </div>
                {isLoggingActivity && (<div className="animate-in slide-in-from-bottom-4 duration-300" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}><div style={{ maxWidth: '400px', width: '100%' }}><p style={{ fontSize: '12px', color: '#f29b11', fontWeight: '900', textTransform: 'uppercase', textAlign: 'center', marginBottom: '20px', letterSpacing: '3px' }}>Initialize Activity:</p><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>{availableRoutineDays.map(day => (<button key={day.id} onClick={() => handleInstantRetroactive(day.id)} style={{ all: 'unset', padding: '25px 10px', backgroundColor: '#0a0a0a', color: '#fff', borderRadius: '12px', fontSize: '12px', fontWeight: '900', textAlign: 'center', border: '1px solid #222' }}>{day.label}</button>))}</div><button onClick={() => setIsLoggingActivity(false)} className="premium-btn-secondary" style={{ marginTop: '25px', height: '54px', border: 'none', color: '#666', fontSize: '12px' }}>DISMISS</button></div></div>)}
            </div>
        );
    }

    // --- VIEW: READY TO TRAIN (ACTIVITY SELECTOR) ---
    return (
        <div className="app-container-v2" style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {renderModals()}
            <header style={{ display: 'flex', alignItems: 'center', height: '54px' }}>
                <button onClick={onExit} style={{ all: 'unset', cursor: 'pointer', padding: '10px 5px' }} title="Back to Portal"><LayoutGrid size={24} color="#f29b11" /></button>
                <h1 style={{ flex: 1, textAlign: 'center', fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>Ready to <span style={{ color: '#f29b11' }}>Train?</span></h1>
                <button onClick={() => onNavigate('global-history')} style={{ all: 'unset', cursor: 'pointer', padding: '10px 5px' }} title="Switch to Mission Logs"><History size={24} color="#f29b11" /></button>
            </header>

            {activeSession && (
                <div style={{ backgroundColor: 'transparent', border: '1px solid #2ecc71', padding: '12px', borderRadius: '8px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div onClick={() => onNavigate('session')} style={{ flex: 1, cursor: 'pointer' }}><p style={{ fontSize: '10px', fontWeight: '900', color: '#2ecc71', textTransform: 'uppercase', margin: 0 }}>Active Session in Progress</p><p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{workoutLabel} • {elapsed}</p></div>
                    <button onClick={() => setShowAbandonModal(true)} style={{ all: 'unset', padding: '10px', cursor: 'pointer', opacity: 0.6 }}><X size={20} color="#ef4444" /></button>
                </div>
            )}

            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {availableRoutineDays.map((day) => {
                        const isRecommended = day.id === recommendedDayId;
                        const isSelected = day.id === selectedDayId;
                        const lastDone = day.last_session ? new Date(day.last_session.end_time).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase() : 'NEVER';
                        const preview = day.exercisePreview || [];
                        
                        return (
                            <div key={day.id} onClick={() => setSelectedDay(day.id)} className={isRecommended && !isSelected ? 'animate-breathe-orange' : ''} style={{ backgroundColor: 'transparent', border: '1px solid #222', padding: '10px 15px', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.2s ease', borderLeft: isSelected ? '4px solid #f29b11' : isRecommended ? '4px solid #f29b1188' : '4px solid transparent' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '10px' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <span style={{ fontSize: '10px', fontWeight: '900', color: '#666', textTransform: 'uppercase' }}>Day {day.sequence_number}</span>
                                        <h3 style={{ fontSize: '16px', fontWeight: '900', margin: '1px 0', color: isSelected ? '#f29b11' : '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{day.label}</h3>
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '1px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: '800', color: day.last_session ? '#2ecc71' : '#444' }}>LAST: {lastDone}</span>
                                            {preview.length > 0 && <span style={{ fontSize: '11px', color: '#444', fontWeight: '800' }}>| {preview.length} EX</span>}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {isSelected ? (
                                            <button onClick={(e) => { e.stopPropagation(); startSession(day.id).then(() => onNavigate('session')); }} style={{ all: 'unset', backgroundColor: '#f29b11', color: '#000', padding: '6px 15px', borderRadius: '6px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>Start <Play size={10} fill="currentColor" /></button>
                                        ) : (
                                            <>{isRecommended && <span style={{ fontSize: '9px', fontWeight: '900', backgroundColor: '#f29b1122', color: '#f29b11', padding: '2px 6px', borderRadius: '4px' }}>REC</span>}<ChevronRight size={18} color="#333" /></>
                                        )}
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-200" style={{ marginTop: '15px' }}>
                                        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            {preview.length === 0 ? <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>NO EXERCISES IN MAIN PHASE</p> :
                                             preview.map((ex, i) => (
                                                <div key={i} style={{ padding: '8px 0', borderBottom: i < preview.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                                    <div style={{ fontSize: '13px', color: '#fff', fontWeight: '900', textTransform: 'uppercase' }}>{ex.name}</div>
                                                    {ex.snapshot && <div>{formatSnapshot(ex.snapshot)}</div>}
                                                </div>
                                             ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RegimenProApp;