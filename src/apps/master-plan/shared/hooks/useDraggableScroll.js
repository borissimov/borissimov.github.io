import { useState, useRef } from 'react';

/**
 * Hook to enable mouse-drag scrolling on a container.
 */
export const useDraggableScroll = () => {
    const scrollerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftState, setScrollLeftState] = useState(0);
    const [dragMoved, setDragMoved] = useState(false);

    const onMouseDown = (e) => {
        if (!scrollerRef.current) return;
        setIsDragging(true);
        setDragMoved(false);
        setStartX(e.pageX - scrollerRef.current.offsetLeft);
        setScrollLeftState(scrollerRef.current.scrollLeft);
    };

    const onMouseLeave = () => setIsDragging(false);
    const onMouseUp = () => setIsDragging(false);

    const onMouseMove = (e) => {
        if (!isDragging || !scrollerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollerRef.current.offsetLeft;
        const walk = (x - startX) * 2; 
        if (Math.abs(walk) > 5) setDragMoved(true);
        scrollerRef.current.scrollLeft = scrollLeftState - walk;
    };

    return {
        scrollerRef,
        isDragging,
        dragMoved,
        scrollHandlers: {
            onMouseDown,
            onMouseLeave,
            onMouseUp,
            onMouseMove
        }
    };
};
