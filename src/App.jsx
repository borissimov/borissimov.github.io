import React, { useState, useMemo, useEffect } from 'react';
import { usePlan } from './context/PlanContext';
import { Auth } from './components/Auth';
import { TimerBar } from './components/TimerBar';
import { TrainingPanel } from './components/TrainingPanel';
import { NutritionPanel } from './components/NutritionPanel';
import { SupplementPanel } from './components/SupplementPanel';
import { Header } from './components/layout/Header';
import { WeekPager } from './components/layout/WeekPager';
import { ContinuousTimeline } from './components/layout/ContinuousTimeline';
import { DatabaseViewer } from './components/DatabaseViewer';
import { PlannerPanel } from './components/PlannerPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { ProfilePanel } from './components/ProfilePanel';
import { DailyAIInsight } from './components/DailyAIInsight';
import { useAppInitialization } from './hooks/useAppInitialization';
import { DataManager } from './data/DataManager';

function App() {
  const { 
    session, loading, currentDay, setCurrentDay, daysMap, 
    weekDates, weekNumber, year, weekOffset, nextWeek, prevWeek, setWeekOffset,
    getResolvedDayData, getWeekMap 
  } = usePlan();

  const [activeTab, setActiveTab] = useState('training');
  const [viewMode, setViewMode] = useState('tracker'); 
  const [navMode, setNavMode] = useState(() => localStorage.getItem('mp_nav_mode') || 'week');
  const [appMode, setAppMode] = useState(null); // 'master' or 'regimen'
  
  // Independent Header State for Continuous Mode
  const [headerOffset, setHeaderOffset] = useState(weekOffset);

  // Initialization (Theme, Push)
  useAppInitialization(session, () => {}, () => {}); 

  // Load Nav Mode Preference
  useEffect(() => {
      if (session?.user?.id) {
          DataManager.getProfile(session.user.id).then(p => {
              if (p?.navigation_mode) setNavMode(p.navigation_mode);
          });
      }
  }, [session]);

  // Sync Header with Context (One-way sync: Context -> Header)
  // This ensures if we switch modes or reset to today, header jumps to correct place.
  // We deliberately do NOT sync Header -> Context automatically during scroll.
  useEffect(() => {
      setHeaderOffset(weekOffset);
  }, [weekOffset]);

  const currentDayData = useMemo(() => {
      return getResolvedDayData ? getResolvedDayData(currentDay) : null;
  }, [getResolvedDayData, currentDay]);

  // Continuous Mode Handlers
  const handleHeaderPrev = () => setHeaderOffset(prev => prev - 1);
  const handleHeaderNext = () => setHeaderOffset(prev => prev + 1);

  const handleContinuousDayClick = (offset, key) => {
      const targetWeekOffset = headerOffset + offset;
      // Update Main View Context
      if (targetWeekOffset !== weekOffset) {
          setWeekOffset(targetWeekOffset);
          setHeaderOffset(targetWeekOffset); // Sync header immediately
      }
      setCurrentDay(key);
  };

  // Data Generation for Continuous Mode (Driven by headerOffset)
  const prevMap = useMemo(() => getWeekMap ? getWeekMap(headerOffset - 1) : {}, [headerOffset, getWeekMap]);
  const currMap = useMemo(() => getWeekMap ? getWeekMap(headerOffset) : {}, [headerOffset, getWeekMap]);
  const nextMap = useMemo(() => getWeekMap ? getWeekMap(headerOffset + 1) : {}, [headerOffset, getWeekMap]);

  const getWeekInfo = (map) => {
      if (!map || !map['mon']) return { number: 0, year: 0 };
      const d = new Date(map['mon'].dateObj);
      d.setHours(0,0,0,0);
      d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
      const week1 = new Date(d.getFullYear(), 0, 4);
      return {
          number: 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7),
          year: d.getFullYear()
      };
  };

  const getWeekClass = (absOffset) => {
      if (absOffset < 0) return "past";
      if (absOffset > 0) return "future";
      return "current";
  };

  const weeks = [
      { map: prevMap, info: getWeekInfo(prevMap), offset: -1, class: getWeekClass(headerOffset - 1) },
      { map: currMap, info: getWeekInfo(currMap), offset: 0, class: getWeekClass(headerOffset) },
      { map: nextMap, info: getWeekInfo(nextMap), offset: 1, class: getWeekClass(headerOffset + 1) }
  ];

  if (loading) return <div className="flex h-screen items-center justify-center text-white bg-black">Loading Plan...</div>;
  if (!session) return <Auth />;

  // --- VERSION CHOOSER ---
  if (!appMode) {
      return (
          <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-4 gap-6">
              <h1 className="text-3xl font-black text-[var(--training-accent)] uppercase tracking-widest mb-4">Master Plan</h1>
              <div className="w-full max-w-sm flex flex-col gap-4">
                  <button 
                      onClick={() => setAppMode('master')}
                      className="w-full py-6 rounded-xl bg-[#1a1a1a] border border-[#333] hover:border-[var(--training-accent)] transition-all flex flex-col items-center group"
                  >
                      <span className="text-lg font-bold group-hover:text-[var(--training-accent)]">Current Version (React)</span>
                      <span className="text-xs text-gray-500 mt-1">Full Feature Set</span>
                  </button>
                  
                  <button 
                      onClick={() => { setAppMode('regimen'); window.location.href = '/regimen.html'; }}
                      className="w-full py-6 rounded-xl bg-[#1a1a1a] border border-[#333] hover:border-[var(--nutrition-accent)] transition-all flex flex-col items-center group"
                  >
                      <span className="text-lg font-bold group-hover:text-[var(--nutrition-accent)]">Regimen Prototype</span>
                      <span className="text-xs text-gray-500 mt-1">Single Page + Cloud Sync</span>
                  </button>
              </div>
          </div>
      );
  }

  // SEPARATE LAYOUT FOR NON-TRACKER VIEWS (Guarantees Scrolling)
  if (viewMode !== 'tracker') {
      return (
          <div className="fixed inset-0 z-50 bg-black text-white overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="sticky top-0 z-50 bg-[#101010] border-b border-[#333]">
                  <Header 
                    viewMode={viewMode} 
                    setViewMode={setViewMode} 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                  />
              </div>
              <div className="min-h-full">
                {viewMode === 'planner' ? <PlannerPanel /> : 
                 viewMode === 'settings' ? <SettingsPanel /> : 
                 <ProfilePanel />}
              </div>
          </div>
      );
  }

  // TRACKER LAYOUT
  return (
    <div className="app-container">
      <Header 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {navMode === 'continuous' ? (
          <ContinuousTimeline 
              weeks={weeks}
              currentDay={currentDay}
              weekOffset={headerOffset}
              onDayClick={handleContinuousDayClick}
              onPrev={handleHeaderPrev}
              onNext={handleHeaderNext}
          />
      ) : (
          <WeekPager 
              weekDates={weekDates}
              weekNumber={weekNumber}
              year={year}
              currentDay={currentDay}
              setCurrentDay={setCurrentDay}
              activeTab={activeTab}
              currentDayData={null} 
              onPrev={prevWeek}
              onNext={nextWeek}
          />
      )}

      {/* TIMER BAR (Fixed below nav) */}
      {activeTab === 'training' && currentDayData && (
        <div style={{ background: '#101010', borderBottom: '1px solid #333', paddingBottom: '4px', flexShrink: 0 }}>
            <TimerBar defaultTime={currentDayData.training.rest || 60} />
        </div>
      )}

      <div className="app-main">
        <DailyAIInsight />

        {currentDayData ? (
            <>
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
            </>
        ) : (
            <div className="p-8 text-center text-gray-500">
                <p>No routine data for this day.</p>
                <p className="text-xs mt-2">Check your cycle start date in the Planner.</p>
            </div>
        )}
      </div>
    </div>
  );
}

export default App;