import React, { useState, useRef } from 'react';
import { usePlan } from './context/PlanContext';
import { Auth } from './components/Auth';
import { TimerBar } from './components/TimerBar';
import { TrainingPanel } from './components/TrainingPanel';
import { NutritionPanel } from './components/NutritionPanel';
import { SupplementPanel } from './components/SupplementPanel';
import { DatabaseViewer } from './components/DatabaseViewer';
import { User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  const { session, loading, planData, currentDay, setCurrentDay, daysMap, weekDates, logout, weekNumber, year, weekOffset, nextWeek, prevWeek } = usePlan();
  const [activeTab, setActiveTab] = useState('training');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // SWIPE LOGIC
  const touchStart = useRef(null);
  const touchEnd = useRef(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    touchEnd.current = null; 
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    // Only navigate if swiping on the header or main area (not inside horizontal scroll containers)
    // For now, global swipe:
    if (isLeftSwipe) {
        nextWeek();
    } else if (isRightSwipe) {
        prevWeek();
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-white bg-black">Loading Plan...</div>;
  if (!session) return <Auth />;
  if (!planData) return <div className="p-4 text-red-500">Error loading data.</div>;

  const currentDayData = planData[currentDay];

  // Determine Week Style Class
  let weekClass = "current";
  if (weekOffset < 0) weekClass = "past";
  if (weekOffset > 0) weekClass = "future";

  return (
    <div className="app-container">
      
      {/* WEEK HEADER */}
      <div 
        className={`week-navigator ${weekClass}`}
        onTouchStart={onTouchStart} 
        onTouchMove={onTouchMove} 
        onTouchEnd={onTouchEnd}
      >
          <button className="week-nav-btn" onClick={prevWeek}><ChevronLeft size={20} /></button>
          <span>WEEK {weekNumber}, {year}</span>
          <button className="week-nav-btn" onClick={nextWeek}><ChevronRight size={20} /></button>
      </div>

      {/* App Header */}
      <div className="app-header">
        <div className="header-content">
            <div className="header-top-row">
                <div className="scroll-tabs">
                {Object.entries(daysMap).map(([key, label]) => {
                    const dateInfo = weekDates[key];
                    return (
                        <button 
                            key={key}
                            onClick={() => setCurrentDay(key)}
                            className={`tab-btn ${currentDay === key ? 'active' : ''}`}
                        >
                            <div style={{lineHeight: '1.1'}}>
                                <div style={{fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase'}}>
                                    {label.substring(0, 3)}
                                </div>
                                {dateInfo && (
                                    <div style={{fontSize: '0.65rem', opacity: '0.7', fontWeight: '500'}}>
                                        {dateInfo.label}
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
                </div>
                
                <div className="relative">
                    <button 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="profile-btn"
                    >
                        <User size={20} />
                    </button>
                    
                    {showProfileMenu && (
                        <div className="profile-menu">
                            <div className="profile-info">
                                <p className="text-[10px] text-gray-500 uppercase font-bold">Logged in as</p>
                                <p className="text-xs text-white truncate">{session.user.email}</p>
                            </div>
                            <button 
                                onClick={() => { logout(); setShowProfileMenu(false); }}
                                className="logout-btn"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="filter-tabs">
            {['training', 'nutrition', 'supplements', 'data'].map(tab => (
                <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`filter-btn active ${tab} ${activeTab === tab ? '' : 'opacity-50'}`} 
                >
                {tab.toUpperCase()}
                </button>
            ))}
            </div>
        </div>

        {/* Timer Bar */}
        {activeTab === 'training' && (
            <TimerBar defaultTime={currentDayData.training.rest || 60} />
        )}
      </div>

      {/* Main Content */}
      <div className="app-main">
        {activeTab === 'training' && (
          <TrainingPanel 
            data={currentDayData.training} 
            dayKey={currentDay}
          />
        )}
        
        {activeTab === 'nutrition' && (
          <NutritionPanel
            data={currentDayData.nutrition}
            dayKey={currentDay}
          />
        )}

        {activeTab === 'supplements' && (
           <SupplementPanel
             data={currentDayData.supplements}
             dayKey={currentDay}
           />
        )}

        {activeTab === 'data' && (
            <DatabaseViewer />
        )}
      </div>
    </div>
  );
}

export default App;