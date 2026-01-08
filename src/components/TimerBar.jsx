import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Play, Square } from 'lucide-react';

export const TimerBar = ({ defaultTime }) => {
  const [timeLeft, setTimeLeft] = useState(defaultTime || 0);
  const [isActive, setIsActive] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const audioCtxRef = useRef(null);

  const playBeep = () => {
    if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'square'; 
    oscillator.frequency.setValueAtTime(3200, now); 
    gainNode.gain.setValueAtTime(0.5, now);
    gainNode.gain.linearRampToValueAtTime(0.5, now + 0.45);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    oscillator.start(now);
    oscillator.stop(now + 0.5);
  };

  useEffect(() => {
    let interval = null;
    if (isActive && endTime) {
      interval = setInterval(() => {
        const remaining = Math.ceil((endTime - Date.now()) / 1000);
        if (remaining <= 0) {
          setIsActive(false);
          setTimeLeft(0);
          playBeep();
        } else {
          setTimeLeft(remaining);
        }
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isActive, endTime]);

  const toggleTimer = () => {
    if (!isActive) {
      const target = Date.now() + (timeLeft > 0 ? timeLeft : defaultTime) * 1000;
      setEndTime(target);
      setIsActive(true);
      
      // Init audio context on user interaction to bypass browser blocks
      if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();

      if ('wakeLock' in navigator) navigator.wakeLock.request('screen').catch(() => {});
    } else {
      setIsActive(false);
      setEndTime(null);
    }
  };

  const adjustTime = (amount) => {
    if (isActive) {
        setEndTime(prev => prev + (amount * 1000));
        setTimeLeft(prev => prev + amount);
    } else {
        setTimeLeft(prev => Math.max(0, prev + amount));
    }
  };

  const format = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  if (!defaultTime && !isActive) return null;

  return (
    <div className="timer-bar visible">
        <div className="timer-container">
            {/* Left: Decrease */}
            <button onClick={() => adjustTime(-15)} className="timer-icon-btn">
                <Minus size={20} />
            </button>

            {/* Middle: Display */}
            <div className="timer-display-text">{format(timeLeft)}</div>

            {/* Right: Increase */}
            <button onClick={() => adjustTime(15)} className="timer-icon-btn">
                <Plus size={20} />
            </button>

            {/* Far Right: Toggle Action */}
            <button 
                onClick={toggleTimer} 
                className={`timer-toggle-action ${isActive ? 'stop' : 'start'}`}
            >
                {isActive ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>
        </div>
    </div>
  );
};