import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Check, ChevronLeft, ChevronRight, AlertTriangle, Trash2, ArrowRight, XCircle, RefreshCw } from 'lucide-react';
import { DataManager } from '../data/DataManager';
import { usePlan } from '../context/PlanContext';

export const RoutineAssigner = ({ routine, onClose, onAssign }) => {
    const { session } = usePlan();
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(null);
    const [viewDate, setViewDate] = useState(new Date());
    const [history, setHistory] = useState([]);
    const [conflicts, setConflicts] = useState([]);
    const [showConflictModal, setShowConflictModal] = useState(false);
    const [isProcessing, setIsBackgroundProcessing] = useState(false);

    const cycleLength = routine?.cycle_length || 7;

    useEffect(() => {
        if (session?.user?.id) {
            DataManager.fetchRoutineHistory(session.user.id).then(setHistory);
        }
    }, [session]);

    const isSameDay = (d1, d2) => {
        return d1 && d2 && 
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() && 
            d1.getDate() === d2.getDate();
    };

    const handleDayClick = (value) => {
        if (start && end) {
            if (isSameDay(value, end)) { setEnd(null); return; }
            if (isSameDay(value, start)) { setStart(null); setEnd(null); return; }
            setStart(value); setEnd(null); return;
        }
        if (start && !end) {
            if (isSameDay(value, start)) { setStart(null); return; }
            if (value < start) { setStart(value); return; }
            setEnd(value); return;
        }
        setStart(value);
    };

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const tileClassName = ({ date, view }) => {
        if (view !== 'month') return null;
        
        // 1. Check Selection
        if (isSameDay(date, start)) return isSameDay(date, end) ? 'tile-range-start tile-range-end' : 'tile-range-start';
        if (isSameDay(date, end)) return 'tile-range-end';
        if (start && end && date > start && date < end) return 'tile-range-middle';

        // 2. Check Booked
        const isBooked = history.some(h => {
            const hStart = new Date(h.cycle_start_date);
            hStart.setHours(0,0,0,0);
            
            const hEnd = h.cycle_end_date ? new Date(h.cycle_end_date) : null;
            if(hEnd) hEnd.setHours(0,0,0,0);

            if (hEnd) return date >= hStart && date <= hEnd;
            return date.getTime() >= hStart.getTime(); 
        });
        if (isBooked) return 'tile-booked';

        // 3. Check Suggestions
        if (start && !end) {
            const s = new Date(start); s.setHours(0,0,0,0);
            const d = new Date(date); d.setHours(0,0,0,0);
            if (d > s) {
                const diffTime = d.getTime() - s.getTime();
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                if ((diffDays + 1) % cycleLength === 0) return 'suggested-end-date';
            }
        }
        return null;
    };

    const checkConflicts = () => {
        if(!start || !end) return;

        const s = new Date(start); s.setHours(0,0,0,0);
        const e = new Date(end); e.setHours(0,0,0,0);

        const overlapping = history.filter(h => {
            const hStart = new Date(h.cycle_start_date); hStart.setHours(0,0,0,0);
            const hEnd = h.cycle_end_date ? new Date(h.cycle_end_date) : null;
            if(hEnd) hEnd.setHours(0,0,0,0);
            
            const startsBeforeOrOnNewEnd = hStart <= e;
            const endsAfterOrOnNewStart = !hEnd || hEnd >= s;
            
            return startsBeforeOrOnNewEnd && endsAfterOrOnNewStart;
        });

        if (overlapping.length > 0) {
            setConflicts(overlapping);
            setShowConflictModal(true);
        } else {
            handleFinalAssign('NORMAL');
        }
    };

    const handleFinalAssign = async (action) => {
        if (action === 'REJECT') {
            setShowConflictModal(false);
            return;
        }

        setIsBackgroundProcessing(true);
        const toLocalISO = (d) => {
            const offset = d.getTimezoneOffset();
            const adjusted = new Date(d.getTime() - (offset*60*1000));
            return adjusted.toISOString().split('T')[0];
        };

        const assignment = { routineId: routine.id, start: toLocalISO(start), end: toLocalISO(end) };

        if (action === 'NORMAL') {
            await onAssign(routine.id, assignment.start, assignment.end);
        } else if (action === 'SHIFT_NEW') {
            const latestEndMs = Math.max(...conflicts.map(c => c.cycle_end_date ? new Date(c.cycle_end_date).getTime() : new Date(c.cycle_start_date).getTime()));
            const newStart = new Date(latestEndMs + 86400000);
            const durationMs = end.getTime() - start.getTime();
            const newEnd = new Date(newStart.getTime() + durationMs);
            await onAssign(routine.id, toLocalISO(newStart), toLocalISO(newEnd));
        } else {
            await DataManager.resolveRoutineConflict(session.user.id, action, assignment, conflicts);
            window.location.reload(); 
        }
        setIsBackgroundProcessing(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-[#111] w-full max-w-md rounded-2xl border border-[#333] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
                
                {/* Header */}
                <div className="p-4 border-b border-[#222] bg-[#1a1a1a] flex justify-between items-center">
                    <div className="flex flex-col">
                        <h2 className="text-sm font-black uppercase tracking-[0.15em] text-[var(--training-accent)] mb-0.5">
                            Assign Routine
                        </h2>
                        <span className="text-[10px] text-gray-500 font-bold uppercase">{routine.name}</span>
                    </div>
                    <button onClick={onClose} className="action-btn" style={{ background: '#222', border: '1px solid #444' }}>
                        Cancel
                    </button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Instructions */}
                    <div className="bg-[#1a1a1a] p-3 rounded-xl border-l-2 border-[var(--training-accent)] mb-6">
                        <p className="text-xs text-gray-400 leading-relaxed font-medium">
                            Select <span className="text-[var(--training-accent)] font-bold">Start</span> & <span className="text-[var(--training-accent)] font-bold">End</span> dates.
                            <br/>
                            <span className="text-[var(--nutrition-accent)] font-bold">●</span> marks optimal cycle completion.
                        </p>
                    </div>

                    {/* Custom Calendar Navigation */}
                    <div className="flex justify-between items-center mb-4 px-1">
                        <button 
                            onClick={handlePrevMonth} 
                            className="timer-icon-btn" 
                            style={{ width: '32px', height: '32px', border: '1px solid #444', color: '#888' }}
                        >
                            <ChevronLeft size={18}/>
                        </button>
                        <span className="text-white font-black uppercase tracking-widest text-xs">
                            {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button 
                            onClick={handleNextMonth} 
                            className="timer-icon-btn" 
                            style={{ width: '32px', height: '32px', border: '1px solid #444', color: '#888' }}
                        >
                            <ChevronRight size={18}/>
                        </button>
                    </div>

                    <div className="w-full mb-6">
                        <Calendar
                            onClickDay={handleDayClick}
                            value={null}
                            activeStartDate={viewDate}
                            showNavigation={false}
                            tileClassName={tileClassName}
                        />
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-6 text-[9px] uppercase font-bold text-gray-500 mb-2 tracking-wide">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-sm bg-[var(--training-accent)]"></div> 
                            <span>Selection</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-sm border border-blue-500/50 bg-blue-500/10"></div> 
                            <span>Booked</span>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 border-t border-[#222] bg-[#1a1a1a]">
                    <div className="flex justify-between items-center mb-5">
                        <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Duration</div>
                        <div className="px-3 py-1 bg-black rounded-md border border-[#333]">
                            <span className="text-sm font-black text-white font-mono">
                                {start && end ? Math.ceil((end-start)/86400000)+1 : 0}
                            </span>
                            <span className="text-[10px] ml-1 text-gray-500 font-bold uppercase">Days</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={checkConflicts}
                        disabled={!start || !end || isProcessing}
                        className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.15em] text-xs transition-all shadow-lg flex items-center justify-center gap-2 ${
                            !start || !end || isProcessing
                            ? 'bg-[#222] text-gray-600 cursor-not-allowed border border-[#333]'
                            : 'bg-[var(--training-accent)] text-black hover:opacity-90 border border-[var(--training-accent)]'
                        }`}
                    >
                        {isProcessing ? <RefreshCw className="animate-spin" size={16}/> : <Check size={16}/>}
                        {isProcessing ? "Syncing..." : "Confirm"}
                    </button>
                </div>
            </div>

            {/* CONFLICT RESOLUTION MODAL */}
            {showConflictModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-[#111] border border-red-500/30 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
                        <div className="p-5 bg-red-900/10 flex items-center gap-4 border-b border-red-500/20">
                            <div className="p-2 bg-red-500/20 rounded-lg text-red-500">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-black uppercase text-sm tracking-wider">Schedule Conflict</h4>
                                <p className="text-[10px] text-red-400 font-bold uppercase tracking-wide">Overlap Detected</p>
                            </div>
                        </div>
                        
                        <div className="p-5 space-y-5">
                            <div className="space-y-2">
                                {conflicts.map(c => (
                                    <div key={c.id} className="bg-black p-3 rounded-lg border border-[#333] flex justify-between items-center">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{c.routines?.name}</div>
                                        <div className="text-[10px] text-[var(--training-accent)] font-mono">
                                            {new Date(c.cycle_start_date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <button onClick={() => handleFinalAssign('OVERWRITE_OVERLAP')} className="w-full p-4 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-xl text-left transition-all group hover:border-[var(--training-accent)]">
                                    <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1 group-hover:text-[var(--training-accent)]">Overwrite</div>
                                    <div className="text-[10px] text-gray-500">Replace conflicting days.</div>
                                </button>

                                <button onClick={() => handleFinalAssign('PUSH_EXISTING')} className="w-full p-4 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-xl text-left transition-all group hover:border-[var(--nutrition-accent)]">
                                    <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1 group-hover:text-[var(--nutrition-accent)]">Push Existing</div>
                                    <div className="text-[10px] text-gray-500">Shift old routine forward.</div>
                                </button>

                                <button onClick={() => handleFinalAssign('SHIFT_NEW')} className="w-full p-4 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-xl text-left transition-all group hover:border-blue-400">
                                    <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1 group-hover:text-blue-400">Shift New</div>
                                    <div className="text-[10px] text-gray-500">Move this to next open slot.</div>
                                </button>

                                <button onClick={() => handleFinalAssign('DELETE_EXISTING')} className="w-full p-4 bg-red-900/10 hover:bg-red-900/20 border border-red-900/30 rounded-xl text-left transition-all group">
                                    <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Delete Legacy</div>
                                    <div className="text-[10px] text-red-400/50">Remove conflicting routine.</div>
                                </button>

                                <button onClick={() => handleFinalAssign('REJECT')} className="w-full pt-4 bg-transparent text-gray-600 text-[10px] font-black uppercase tracking-widest text-center hover:text-white transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
