import { useState, useRef, useCallback } from 'react';

export const useSwipeable = ({ onSwipeLeft, onSwipeRight, threshold = 100 }) => {
    const [deltaX, setDeltaX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const currentX = useRef(0);

    // --- TOUCH EVENTS ---
    const onTouchStart = useCallback((e) => {
        startX.current = e.touches[0].clientX;
        currentX.current = e.touches[0].clientX;
        setIsDragging(true);
        setDeltaX(0);
    }, []);

    const onTouchMove = useCallback((e) => {
        if (!isDragging) return;
        currentX.current = e.touches[0].clientX;
        const diff = currentX.current - startX.current;
        setDeltaX(diff);
    }, [isDragging]);

    const onTouchEnd = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        const diff = currentX.current - startX.current;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) onSwipeRight(); // Dragged Right -> Prev
            else onSwipeLeft();  // Dragged Left -> Next
        }
        setDeltaX(0); // Reset position (or animate back if we had a library)
    }, [isDragging, threshold, onSwipeLeft, onSwipeRight]);

    // --- MOUSE EVENTS ---
    const onMouseDown = useCallback((e) => {
        startX.current = e.clientX;
        currentX.current = e.clientX;
        setIsDragging(true);
        setDeltaX(0);
    }, []);

    const onMouseMove = useCallback((e) => {
        if (!isDragging) return;
        // Prevent text selection while dragging
        e.preventDefault();
        currentX.current = e.clientX;
        const diff = currentX.current - startX.current;
        setDeltaX(diff);
    }, [isDragging]);

    const onMouseUp = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        const diff = currentX.current - startX.current;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) onSwipeRight();
            else onSwipeLeft();
        }
        setDeltaX(0);
    }, [isDragging, threshold, onSwipeLeft, onSwipeRight]);

    const onMouseLeave = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);
            setDeltaX(0);
        }
    }, [isDragging]);

    return {
        handlers: {
            onTouchStart,
            onTouchMove,
            onTouchEnd,
            onMouseDown,
            onMouseMove,
            onMouseUp,
            onMouseLeave
        },
        deltaX,      // Exported
        isDragging,  // Exported
        style: {
            transform: `translateX(${deltaX}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none' 
        }
    };
};
