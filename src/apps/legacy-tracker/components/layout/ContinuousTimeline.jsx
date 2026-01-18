import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { WeekView } from './WeekView';

export const ContinuousTimeline = ({ weeks, currentDay, weekOffset, onDayClick, onPrev, onNext }) => {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const startScrollLeft = useRef(0);
    const prevOffset = useRef(weekOffset);
    const lastScrollCall = useRef(0);
    const isUpdating = useRef(false);
    const isAnimating = useRef(false); // New Lock
    const [visualDay, setVisualDay] = useState(currentDay);
    const animationRef = useRef(null);
    const isDragGesture = useRef(false);

    // Unlock scroll trigger when offset updates (with safety delay)
    useEffect(() => {
        const timer = setTimeout(() => {
            isUpdating.current = false;
        }, 100);
        return () => clearTimeout(timer);
    }, [weekOffset]);

    // Sync visual day when context changes
    useEffect(() => {
        setVisualDay(currentDay);
    }, [currentDay]);

    const smoothScrollTo = (container, targetX, duration = 300, callback) => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        isAnimating.current = true; // Lock

        const start = container.scrollLeft;
        const distance = targetX - start;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            
            container.scrollLeft = start + (distance * ease);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                animationRef.current = null;
                isAnimating.current = false; // Unlock
                if (callback) callback();
            }
        };
        animationRef.current = requestAnimationFrame(animate);
    };

    // Unified Scroll & Snap Logic
    useLayoutEffect(() => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const blockWidth = container.scrollWidth / 3; 
            let justSnapped = false;

            // 1. Handle Infinite Scroll Snap (Week Switch)
            if (prevOffset.current !== weekOffset) {
                const diff = weekOffset - prevOffset.current; 
                const shift = diff * blockWidth;
                
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                    isAnimating.current = false; 
                }

                container.style.scrollBehavior = 'auto'; 
                container.scrollLeft -= shift;
                
                if (isDragging) {
                    startScrollLeft.current -= shift;
                }
                prevOffset.current = weekOffset;
                justSnapped = true;
            }

            // 2. Center Active Day
            const isInitial = !scrollRef.current.dataset.mounted;
            // If just snapped or initial load, instant scroll. Otherwise smooth (for same-week clicks).
            const behavior = (justSnapped || isInitial) ? 'auto' : 'smooth';

            const centerDay = () => {
                 const currentWeekBlock = container.children[1];
                 if (currentWeekBlock) {
                     const btn = currentWeekBlock.querySelector(`.tab-btn[data-key="${currentDay}"]`);
                     if (btn) {
                         btn.scrollIntoView({ behavior, block: 'nearest', inline: 'center' });
                         if (isInitial) scrollRef.current.dataset.mounted = "true";
                     } else if (justSnapped) {
                         // Fallback if button not found immediately (rare), keep week alignment
                         // container.scrollLeft is already aligned to week start by the shift above
                     }
                 }
            };

            if (justSnapped) {
                // Execute immediately to ensure atomic frame update
                centerDay();
            } else {
                // Small delay for smooth in-week transitions to allow layout to settle? 
                // Or just immediate? Immediate is usually better unless layout thrashing.
                // Let's try immediate.
                centerDay();
            }
        }
    }, [weekOffset, currentDay]);

    // Drag Logic
    const onMouseDown = (e) => {
        e.preventDefault(); // Prevent browser auto-scroll on focus
        isDragGesture.current = false;
        startX.current = e.pageX;
        if (scrollRef.current) {
            startScrollLeft.current = scrollRef.current.scrollLeft;
            scrollRef.current.style.scrollBehavior = 'auto';
        }
    };
    
    const onMouseLeave = () => {
        if (isDragging) setIsDragging(false);
    };

    const onMouseUp = () => {
        if (isDragging) setIsDragging(false);
        if (scrollRef.current) scrollRef.current.style.scrollBehavior = 'smooth';
    };
    
    const onClickCapture = (e) => {
        if (isDragGesture.current) {
            e.stopPropagation();
            e.preventDefault();
        }
    };
    
    const onMouseMove = (e) => {
        // Safety: If no button pressed, reset everything
        if (e.buttons === 0) {
            if (isDragging) {
                setIsDragging(false);
                isDragGesture.current = false;
                if (scrollRef.current) scrollRef.current.style.scrollBehavior = 'smooth';
            }
            return;
        }

        // Detect drag start
        if (!isDragGesture.current) { 
             if (Math.abs(e.pageX - startX.current) > 5) {
                 isDragGesture.current = true;
                 setIsDragging(true);
             }
        }

        if (isDragGesture.current && scrollRef.current) {
            e.preventDefault();
            const x = e.pageX;
            // Use offset from startX to allow seamless takeover
            const walk = (x - startX.current) * 1.5; // Slightly faster than 1:1 feel?
            scrollRef.current.scrollLeft = startScrollLeft.current - walk;
        }
    };

    // Handle Scroll
    const handleScroll = () => {
        if (isUpdating.current || isAnimating.current) return; // Check BOTH locks

        const now = Date.now();
        const container = scrollRef.current;
        if (!container) return;

        // 1. Highlight Logic
        if (now - lastScrollCall.current > 50) {
            const center = container.getBoundingClientRect().left + container.clientWidth / 2;
            const buttons = Array.from(container.querySelectorAll('.tab-btn'));
            let closest = null;
            let minDist = Infinity;
            
            for (const btn of buttons) {
                const rect = btn.getBoundingClientRect();
                const btnCenter = rect.left + rect.width / 2;
                const dist = Math.abs(center - btnCenter);
                if (dist < minDist) {
                    minDist = dist;
                    closest = btn;
                }
            }
            
            if (closest) {
                const key = closest.dataset.key;
                if (key && key !== visualDay) setVisualDay(key);
            }
            lastScrollCall.current = now;
        }

        // 2. Infinite Trigger
        const { scrollLeft, scrollWidth, clientWidth } = container;
        const threshold = 50; 

        if (scrollLeft < threshold) {
            isUpdating.current = true;
            onPrev();
        } else if (scrollLeft + clientWidth > scrollWidth - threshold) {
            isUpdating.current = true;
            onNext();
        }
    };

    const handleDayClick = (offset, key) => {
        const container = scrollRef.current;
        if (!container) return;
        
        const targetBlock = container.children[1 + offset];
        const btn = targetBlock?.querySelector(`.tab-btn[data-key="${key}"]`);
        
        if (btn) {
            const containerCenter = container.clientWidth / 2;
            const containerRect = container.getBoundingClientRect();
            const btnRect = btn.getBoundingClientRect();
            const currentScroll = container.scrollLeft;
            const btnCenterRel = btnRect.left - containerRect.left + (btnRect.width / 2);
            const targetScroll = currentScroll + (btnCenterRel - containerCenter);

            smoothScrollTo(container, targetScroll, 300, () => {
                if (onDayClick) onDayClick(offset, key);
                setVisualDay(key);
            });
        }
    };

    return (
        <div 
            className="continuous-scroll-container" 
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onClickCapture={onClickCapture}
            onScroll={handleScroll}
            style={{ 
                overflowX: 'auto', 
                overflowY: 'hidden',
                whiteSpace: 'nowrap',
                display: 'flex',
                background: '#101010',
                borderBottom: '1px solid #333',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none'
            }}
        >
            {weeks.map((week, wIdx) => (
                <WeekView 
                    key={wIdx}
                    weekMap={week.map}
                    weekNumber={week.info.number}
                    year={week.info.year}
                    weekClass={week.class}
                    currentDay={visualDay} 
                    setCurrentDay={(key) => handleDayClick(week.offset, key)}
                    activeTab="" 
                    currentDayData={null} 
                    onPrev={onPrev}
                    onNext={onNext}
                    style={{ minWidth: '100vw', width: '100vw' }}
                />
            ))}
        </div>
    );
};