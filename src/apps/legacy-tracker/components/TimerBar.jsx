import React from 'react';
import { useTimerController } from '../../../hooks/useTimerController';
import { Plus, Minus, Play, Square } from 'lucide-react';

export const TimerBar = ({ defaultTime }) => {
  const { timeLeft, isActive, toggleTimer, adjustTime } = useTimerController(defaultTime);

  const format = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  if (!defaultTime && !isActive) return null;

  return (
    <div className="timer-bar visible">
        <div className="timer-container">
            <button onClick={() => adjustTime(-15)} className="timer-icon-btn">
                <Minus size={20} />
            </button>

            <div className="timer-display-text">{format(timeLeft)}</div>

            <button onClick={() => adjustTime(15)} className="timer-icon-btn">
                <Plus size={20} />
            </button>

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
