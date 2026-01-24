import React, { useState, useEffect, useRef } from 'react';
import { Check, Play, Pause, RotateCcw } from 'lucide-react';
import '../../../../shared-premium.css';

export const MetricInput = ({ item, onLog, isComplete, accentColor }) => {
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [rpe, setRpe] = useState('');
    
    // TIMER STATE
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);

    const isDuration = item.metric_type === 'DURATION';
    const isDistance = item.metric_type === 'DISTANCE';

    // TIMER LOGIC
    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleLog = () => {
        const payload = {
            weight: weight || item.target_weight || '0',
            rpe: rpe || item.target_rpe || 9,
        };

        if (isDuration) {
            payload.duration_seconds = time;
            payload.reps = 0; 
        } else if (isDistance) {
            payload.distance_meters = parseFloat(weight) || 0;
            payload.duration_seconds = time;
            payload.reps = 0;
        } else {
            payload.reps = parseInt(reps) || parseInt(item.target_reps) || 0;
        }

        onLog(payload);
        
        // Reset
        setWeight('');
        setReps('');
        setRpe('');
        setTime(0);
        setIsRunning(false);
    };

    const gridStyle = { display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 52px', gap: '6px', alignItems: 'center', width: '100%', marginBottom: '15px' };
    const inputStyle = { height: '42px', fontSize: '20px' };
    const btnStyle = { all: 'unset', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.05)', color: accentColor, width: '52px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', border: `1px solid ${accentColor}` };

    if (isDuration) {
        return (
            <div style={{ ...gridStyle, gridTemplateColumns: '1.5fr 1fr 1fr 52px' }}>
                {/* TIMER DISPLAY */}
                <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${isRunning ? '#f29b11' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px' }}>
                    <span style={{ fontWeight: '900', color: '#fff', fontSize: '18px', fontVariantNumeric: 'tabular-nums' }}>{formatTime(time)}</span>
                    <button onClick={() => setIsRunning(!isRunning)} style={{ all: 'unset', cursor: 'pointer' }}>
                        {isRunning ? <Pause size={16} color="#f29b11" /> : <Play size={16} color="#2ecc71" />}
                    </button>
                </div>

                {/* RPE */}
                <input type="text" inputMode="decimal" className="premium-input" style={inputStyle} value={rpe} onChange={(e) => setRpe(e.target.value)} placeholder="RPE" />
                
                {/* RESET */}
                <button onClick={() => { setTime(0); setIsRunning(false); }} style={{ ...btnStyle, width: '100%', border: '1px solid #333', color: '#666' }}>
                    <RotateCcw size={20} />
                </button>

                {/* LOG */}
                <button onClick={handleLog} style={btnStyle}>
                    <Check size={24} strokeWidth={4} />
                </button>
            </div>
        );
    }

    // DEFAULT: LOAD_REP
    return (
        <div style={gridStyle}>
            <input type="text" inputMode="decimal" className="premium-input" style={inputStyle} value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="KG" />
            <input type="text" inputMode="decimal" className="premium-input" style={inputStyle} value={reps} onChange={(e) => setReps(e.target.value)} placeholder="REPS" />
            <input type="text" inputMode="decimal" className="premium-input" style={{ ...inputStyle, borderStyle: 'dashed' }} value={rpe} onChange={(e) => setRpe(e.target.value)} placeholder="RPE" />
            <button onClick={handleLog} style={btnStyle}>
                <Check size={24} strokeWidth={4} />
            </button>
        </div>
    );
};