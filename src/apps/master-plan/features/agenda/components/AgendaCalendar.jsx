import React from 'react';
import { DayPicker } from 'react-day-picker';

export const AgendaCalendar = ({
    isGridExpanded,
    selectedCalendarDate,
    setSelectedCalendarDate,
    scrollerRef,
    scrollerDates,
    scrollHandlers,
    getDateStyle
}) => {
    return (
        <div style={{ 
            backgroundColor: 'transparent', 
            borderRadius: '15px', 
            padding: isGridExpanded ? '10px' : '0', 
            border: isGridExpanded ? '1px solid #222' : 'none', 
            transition: 'all 0.3s ease',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden'
        }}>
            {isGridExpanded ? (
                <div className="animate-in zoom-in-95 duration-200">
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <style>{`
                            .rdp-root { 
                                --rdp-accent-color: #f29b11 !important; 
                                --rdp-today-color: #2ecc71 !important; 
                                margin: 0; 
                            } 
                            .rdp-months {
                                position: relative !important;
                            }
                            .rdp-month {
                                position: relative !important;
                            }
                            .rdp-month_caption {
                                display: flex !important;
                                align-items: center !important;
                                justify-content: center !important;
                                position: relative !important;
                                margin-bottom: 10px !important;
                                height: 40px !important;
                                width: 100% !important;
                            }
                            .rdp-caption_label { 
                                color: #f29b11 !important; 
                                font-weight: 900 !important; 
                                text-transform: uppercase !important; 
                                font-size: 1rem !important;
                                z-index: 1;
                            } 
                            .rdp-nav {
                                position: absolute !important;
                                top: 0 !important;
                                left: 0 !important;
                                right: 0 !important;
                                display: flex !important;
                                justify-content: space-between !important;
                                align-items: center !important;
                                width: 100% !important;
                                height: 40px !important;
                                pointer-events: none !important;
                                z-index: 10 !important;
                                padding: 0 5px !important;
                            }
                            .rdp-button_next, .rdp-button_previous { 
                                color: #f29b11 !important; 
                                pointer-events: auto !important;
                                background: transparent !important;
                                border: none !important;
                                cursor: pointer !important;
                                display: flex !important;
                                align-items: center !important;
                                justify-content: center !important;
                                width: 32px !important;
                                height: 32px !important;
                            } 
                            .rdp-button_next svg, .rdp-button_previous svg, .rdp-chevron {
                                fill: #f29b11 !important;
                                stroke: #f29b11 !important;
                            }
                            .rdp-day_selected { 
                                background-color: #f29b11 !important; 
                                color: #000 !important; 
                                border-radius: 50% !important; 
                            } 
                            .rdp-day_today { 
                                color: #2ecc71 !important; 
                                font-weight: 900 !important; 
                            } 
                            .rdp-head_cell { 
                                color: #f29b11 !important; 
                                font-weight: 900 !important; 
                                text-transform: uppercase !important; 
                            } 
                            .rdp-day_outside { 
                                color: rgba(242, 155, 17, 0.2) !important; 
                            }
                        `}</style>
                        <DayPicker 
                            mode="single" 
                            selected={selectedCalendarDate} 
                            onSelect={(d) => d && setSelectedCalendarDate(d)} 
                            weekStartsOn={1} 
                            components={{ 
                                Day: (props) => { 
                                    const { day, modifiers } = props; 
                                    if (!day) return null; 
                                    const date = day.date; 
                                    const isSelected = modifiers.selected; 
                                    const customStyle = getDateStyle(date); 
                                    return (
                                        <td style={{ padding: '2px' }}>
                                            <button 
                                                type="button" 
                                                onClick={() => setSelectedCalendarDate(date)} 
                                                style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: 'transparent', borderRadius: '8px', border: isSelected ? '2px solid #f29b11' : 'none', ...customStyle }}
                                            >
                                                {date.getDate()}
                                            </button>
                                        </td>
                                    ); 
                                } 
                            }} 
                        />
                    </div>
                </div>
            ) : (
                <div ref={scrollerRef} {...scrollHandlers} style={{ display: 'flex', overflowX: 'auto', gap: '6px', padding: '2px 0', scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab', userSelect: 'none', width: '100%' }}>
                    {scrollerDates.map((date, idx) => { 
                        const isSelected = date.toDateString() === selectedCalendarDate.toDateString(); 
                        const isToday = date.toDateString() === new Date().toDateString();
                        const customStyle = getDateStyle(date); 
                        return (
                            <div 
                                key={idx} 
                                onClick={() => setSelectedCalendarDate(date)} 
                                style={{ 
                                    minWidth: '44px', 
                                    height: '44px', 
                                    borderRadius: '10px', 
                                    border: isSelected ? '2px solid #f29b11' : isToday ? '1px solid #2ecc71' : '1px solid #222', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    cursor: 'pointer', 
                                    backgroundColor: 'transparent', 
                                    transition: 'all 0.2s ease', 
                                    flexShrink: 0,
                                    position: 'relative'
                                }}
                            >
                                {isToday && (
                                    <span style={{ 
                                        position: 'absolute', 
                                        top: '-12px', 
                                        fontSize: '6px', 
                                        fontWeight: '900', 
                                        color: '#2ecc71',
                                        letterSpacing: '0.5px'
                                    }}>TODAY</span>
                                )}
                                <span style={{ fontSize: '8px', fontWeight: '800', textTransform: 'uppercase', color: isToday ? '#2ecc71' : '#666', pointerEvents: 'none' }}>{date.toLocaleDateString([], { weekday: 'short' })}</span>
                                <span style={{ fontSize: '17px', pointerEvents: 'none', fontWeight: isToday ? '900' : 'inherit', ...customStyle }}>{date.getDate()}</span>
                            </div>
                        ); 
                    })}
                </div>
            )}
        </div>
    );
};