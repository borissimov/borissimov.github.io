import React, { useState, useEffect } from 'react';

export const TimerBar = ({ defaultTime }) => {
  const [timeLeft, setTimeLeft] = useState(defaultTime || 0);
  const [isActive, setIsActive] = useState(false);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    let interval = null;
    if (isActive && endTime) {
      interval = setInterval(() => {
        const remaining = Math.ceil((endTime - Date.now()) / 1000);
        if (remaining <= 0) {
          setIsActive(false);
          setTimeLeft(0);
          new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
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

  // Always render div, but hide via class if needed, or return null if totally hidden logic desired. 
  // CSS handles display:none if not .visible
  // But React component needs to know if it should add .visible class.
  // We'll assume the parent controls visibility via props or we just render it.
  // Actually, App.jsx conditional rendering handles the "Tab" visibility.
  // But we want it hidden if time is 0 and inactive? No, originally it showed up if initialTime > 0.
  
  if (!defaultTime && !isActive) return null;

  return (
    <div className={`timer-bar visible`}>
      <div className="timer-main-group">
        <button onClick={() => adjustTime(-15)} className="timer-controls adjust-btn">-15s</button>
        <div className="timer-display">{format(timeLeft)}</div>
        <button onClick={() => adjustTime(15)} className="timer-controls adjust-btn">+15s</button>
      </div>
      <div className="timer-controls start-stop-group">
        <button 
            onClick={toggleTimer} 
            className={`start-btn ${isActive ? 'stop-btn' : ''}`}
        >
            {isActive ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
  );
};
