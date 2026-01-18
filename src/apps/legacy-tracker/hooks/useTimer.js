import { useState, useEffect } from 'react';

export const useTimer = () => {
    const [timerState, setTimerState] = useState(() => {
        const saved = localStorage.getItem('mp_timer_state');
        return saved ? JSON.parse(saved) : { isActive: false, endTime: null, duration: 60 };
    });

    useEffect(() => {
        localStorage.setItem('mp_timer_state', JSON.stringify(timerState));
        // Auto-reset if expired significantly
        if (timerState.isActive && timerState.endTime && Date.now() > timerState.endTime + 5000) {
             setTimerState(prev => ({ ...prev, isActive: false, endTime: null }));
        }
    }, [timerState]);

    return { timerState, setTimerState };
};
