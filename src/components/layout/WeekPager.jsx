import React from 'react';
import { WeekView } from './WeekView';
import { useSwipeable } from '../../hooks/useSwipeable';

export const WeekPager = ({ weekDates, weekNumber, year, currentDay, setCurrentDay, activeTab, currentDayData, onPrev, onNext }) => {
    const { handlers, deltaX, isDragging } = useSwipeable({
        onSwipeLeft: onNext,
        onSwipeRight: onPrev
    });

    return (
        <div className="nav-slider-container" style={{overflow: 'hidden', width: '100%'}} {...handlers}>
            <div className="nav-slider-track" style={{
                transform: `translateX(${deltaX}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
            }}>
                <WeekView 
                    weekMap={weekDates}
                    weekNumber={weekNumber}
                    year={year}
                    weekClass="current"
                    currentDay={currentDay}
                    setCurrentDay={setCurrentDay}
                    activeTab={activeTab}
                    currentDayData={currentDayData}
                    onPrev={onPrev}
                    onNext={onNext}
                    style={{ width: '100%' }}
                />
            </div>
        </div>
    );
};
