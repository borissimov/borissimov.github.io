import React from 'react';
import { TimerBar } from '../TimerBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const WeekView = React.memo(({ 
    weekMap, 
    weekNumber, 
    year, 
    weekClass, 
    currentDay, 
    setCurrentDay, 
    activeTab, 
    currentDayData,
    onPrev,
    onNext,
    style
}) => {
    
    const shortenLabel = (label) => {
        if (!label) return "";
        const lower = label.toLowerCase();
        if (lower.includes('rest')) return 'REST';
        if (lower.includes('cardio')) return 'CARDIO';
        if (lower.includes('resistance')) return 'LIFT';
        if (lower.includes('leg')) return 'LEGS';
        if (lower.includes('push')) return 'PUSH';
        if (lower.includes('pull')) return 'PULL';
        if (lower.includes('upper')) return 'UPPER';
        if (lower.includes('lower')) return 'LOWER';
        return label.split(' ')[0].substring(0, 6);
    };

    return (
        <div style={{ width: '33.3333%', flexShrink: 0, display: 'flex', flexDirection: 'column', ...style }}>
            <div className={`week-navigator ${weekClass}`}>
                <button className="week-nav-btn" onClick={onPrev} onMouseDown={(e) => e.preventDefault()}>
                    <ChevronLeft size={20} />
                </button>
                <span>WEEK {weekNumber}, {year}</span>
                <button className="week-nav-btn" onClick={onNext} onMouseDown={(e) => e.preventDefault()}>
                    <ChevronRight size={20} />
                </button>
            </div>

            <div style={{ backgroundColor: '#101010', padding: '8px 4px', borderBottom: '1px solid #333' }}>
                <div className="scroll-tabs" style={{ marginRight: 0, gap: '2px' }}>
                    {Object.entries(weekMap).map(([key, label]) => {
                        const dateInfo = weekMap[key];
                        const isActive = currentDay === key;
                        // "Green outline" logic: active tab gets special class
                        return (
                            <button 
                                key={key}
                                data-key={key}
                                onClick={() => setCurrentDay(key)} 
                                onMouseDown={(e) => e.preventDefault()} // Prevent focus scroll
                                className={`tab-btn ${isActive ? 'active' : ''}`}
                                style={{ 
                                    minWidth: '0px', 
                                    padding: '6px 2px',
                                    border: isActive ? '1px solid var(--nutrition-accent)' : '1px solid var(--border-color)', // Green outline request
                                    boxShadow: isActive ? '0 0 5px rgba(46, 204, 113, 0.3)' : 'none'
                                }}
                            >
                                <div style={{lineHeight: '1.1', overflow: 'hidden'}}>
                                    <div style={{fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#888'}}>
                                        {key.substring(0, 3)}
                                    </div>
                                    <div style={{fontSize: '0.6rem', fontWeight: '500', color: '#fff', marginTop: '1px'}}>
                                        {dateInfo.label}
                                    </div>
                                    {dateInfo.cycleLabel && (
                                        <div className="truncate" style={{
                                            fontSize: '0.55rem', 
                                            fontWeight: '600', 
                                            color: 'var(--training-accent)',
                                            opacity: 0.8,
                                            marginTop: '1px'
                                        }}>
                                            {shortenLabel(dateInfo.cycleLabel)}
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {activeTab === 'training' && currentDayData && (
                    <div style={{ marginTop: '8px' }} onMouseDown={(e) => e.stopPropagation()}>
                        <TimerBar defaultTime={currentDayData.training.rest || 60} />
                    </div>
                )}
            </div>
        </div>
    );
});
