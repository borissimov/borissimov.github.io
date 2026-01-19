import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { DataManager } from '../data/DataManager';
import { usePlan } from '../context/PlanContext';

export const useTimerController = (defaultTime) => {
    const { session, timerState, setTimerState } = usePlan();
    const [timeLeft, setTimeLeft] = useState(defaultTime || 60);
    const audioCtxRef = useRef(null);

    // 1. Sync local display with global state
    useEffect(() => {
        if (timerState.isActive && timerState.endTime) {
            const remaining = Math.ceil((timerState.endTime - Date.now()) / 1000);
            if (remaining > 0) setTimeLeft(remaining);
        } else if (timerState.duration) {
            setTimeLeft(timerState.duration);
        }
    }, [timerState.isActive, timerState.endTime, timerState.duration]);

    // 2. Audio Logic
    const playBeep = useCallback(() => {
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
    }, []);

    // 3. Countdown Interval
    useEffect(() => {
        let interval = null;
        if (timerState.isActive && timerState.endTime) {
            interval = setInterval(() => {
                const diff = timerState.endTime - Date.now();
                const remaining = Math.ceil(diff / 1000);
                
                if (remaining <= 0) {
                    setTimerState(prev => ({ ...prev, isActive: false, endTime: null }));
                    setTimeLeft(0);
                    if (Math.abs(diff) < 5000) playBeep();
                } else {
                    setTimeLeft(remaining);
                }
            }, 200);
        }
        return () => clearInterval(interval);
    }, [timerState.isActive, timerState.endTime, playBeep, setTimerState]);

    // 4. Actions
    const toggleTimer = useCallback(async () => {
        if (!timerState.isActive) {
            const duration = timeLeft > 0 ? timeLeft : defaultTime;
            const target = Date.now() + duration * 1000;
            const timerId = crypto.randomUUID();
            
            setTimerState({ isActive: true, endTime: target, duration: duration, timerId: timerId });
            
            // Audio init
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();

            if ('wakeLock' in navigator) navigator.wakeLock.request('screen').catch(() => {});

            // Cloud Sync
            if (session?.user?.id) {
                const targetEndpoint = localStorage.getItem('current_push_endpoint');
                await DataManager.updateActiveTimer(session.user.id, timerId, target);
                supabase.functions.invoke('timer-notify', {
                    body: { duration, userId: session.user.id, timerId, targetEndpoint }
                });
            }
        } else {
            setTimerState(prev => ({ ...prev, isActive: false, endTime: null, timerId: null }));
        }
    }, [timerState.isActive, timeLeft, defaultTime, session, setTimerState]);

    const adjustTime = useCallback(async (amount) => {
        if (timerState.isActive) {
            const now = Date.now();
            const currentDuration = Math.ceil((timerState.endTime - now) / 1000);
            if (amount > 0 && currentDuration >= 180) return; 

            const newEnd = timerState.endTime + (amount * 1000);
            const newTimerId = crypto.randomUUID();
            const newDuration = Math.ceil((newEnd - now) / 1000);

            setTimerState(prev => ({ ...prev, endTime: newEnd, timerId: newTimerId }));
            setTimeLeft(prev => Math.min(180, Math.max(0, prev + amount)));

            if (session?.user?.id && newDuration > 0 && newDuration <= 180) {
                const targetEndpoint = localStorage.getItem('current_push_endpoint');
                await DataManager.updateActiveTimer(session.user.id, newTimerId, newEnd);
                supabase.functions.invoke('timer-notify', {
                    body: { duration: newDuration, userId: session.user.id, timerId: newTimerId, targetEndpoint }
                });
            }
        } else {
            const newVal = Math.min(180, Math.max(0, timeLeft + amount));
            setTimeLeft(newVal);
            setTimerState(prev => ({ ...prev, duration: newVal }));
        }
    }, [timerState.isActive, timerState.endTime, timeLeft, session, setTimerState]);

    return {
        timeLeft,
        isActive: timerState.isActive,
        toggleTimer,
        adjustTime
    };
};
