import { useState, useEffect } from 'react';

/**
 * Hook to manage the active session stopwatch.
 */
export const useSessionTimer = (activeSession, retroactiveDate) => {
    const [elapsed, setElapsed] = useState('00:00');

    useEffect(() => {
        if (activeSession && !activeSession.isRestDay && !retroactiveDate) {
            const interval = setInterval(() => {
                const startTime = activeSession.startTime || activeSession.start_time; // Support both shapes
                const diff = new Date() - new Date(startTime);
                
                const hours = Math.floor(diff / 3600000);
                const mins = Math.floor((diff % 3600000) / 60000);
                const secs = Math.floor((diff % 60000) / 1000);
                
                if (hours > 0) {
                    setElapsed(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
                } else {
                    setElapsed(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
                }
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setElapsed('00:00');
        }
    }, [activeSession, retroactiveDate]);

    return elapsed;
};
