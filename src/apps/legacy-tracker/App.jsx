import React, { useState, useMemo, useEffect } from 'react';
import { PlanProvider, usePlan } from '../../context/PlanContext';
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
import { useAppInitialization } from '../../hooks/useAppInitialization';
import { DataManager } from '../../data/DataManager';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function AppContent({ onExit }) {
  const { 
    session, loading, currentDay, setCurrentDay, daysMap, 
    weekDates, weekNumber, year, weekOffset, nextWeek, prevWeek, setWeekOffset,
    getResolvedDayData, getWeekMap, logout, profile
  } = usePlan();

  const [activeTab, setActiveTab] = useState('training');
  const [viewMode, setViewMode] = useState('tracker'); 
  const [navMode, setNavMode] = useState(() => localStorage.getItem('mp_nav_mode') || 'week');
  
  const [headerOffset, setHeaderOffset] = useState(weekOffset);

  useAppInitialization(session, () => {}, () => {}); 

  useEffect(() => {
      if (session?.user?.id) {
          DataManager.getProfile(session.user.id).then(p => {
              if (p?.navigation_mode) setNavMode(p.navigation_mode);
          });
      }
  }, [session]);

  useEffect(() => {
      setHeaderOffset(weekOffset);
  }, [weekOffset]);

  const currentDayData = useMemo(() => {
      return getResolvedDayData ? getResolvedDayData(currentDay) : null;
  }, [getResolvedDayData, currentDay]);

  const handleHeaderPrev = () => setHeaderOffset(prev => prev - 1);
  const handleHeaderNext = () => setHeaderOffset(prev => prev + 1);

  const handleContinuousDayClick = (offset, key) => {
      const targetWeekOffset = headerOffset + offset;
      if (targetWeekOffset !== weekOffset) {
          setWeekOffset(targetWeekOffset);
          setHeaderOffset(targetWeekOffset);
      }
      setCurrentDay(key);
  };

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

  const weeks = [
      { map: prevMap, info: getWeekInfo(prevMap), offset: -1, class: 'past' },
      { map: currMap, info: getWeekInfo(currMap), offset: 0, class: 'current' },
      { map: nextMap, info: getWeekInfo(nextMap), offset: 1, class: 'future' }
  ];

  if (loading) return <div className="flex h-screen items-center justify-center text-white bg-black uppercase font-black tracking-widest">Loading Legacy Tracker...</div>;
  if (!session) return <Auth />;

  if (viewMode !== 'tracker') {
      return (
          <div className="legacy-tracker-root font-sans fixed inset-0 z-50 bg-black text-white overflow-y-auto overscroll-contain">
              <div className="sticky top-0 z-50 bg-[#101010] border-b border-[#333]">
                  <Header 
                    viewMode={viewMode} 
                    setViewMode={setViewMode} 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    onExit={onExit}
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

  return (
    <div className="legacy-tracker-root font-sans app-container">
      <Header 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onExit={onExit}
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

      {activeTab === 'training' && currentDayData && (
        <div style={{ background: '#101010', borderBottom: '1px solid #333', paddingBottom: '4px', flexShrink: 0 }}>
            <TimerBar defaultTime={currentDayData.training.rest || 60} />
        </div>
      )}

      <div className="app-main">
        <DailyAIInsight />
        {currentDayData ? (
            <>
                {activeTab === 'training' && <TrainingPanel data={currentDayData.training} dayKey={currentDay} />}
                {activeTab === 'nutrition' && <NutritionPanel data={currentDayData.nutrition} dayKey={currentDay} />}
                {activeTab === 'supplements' && <SupplementPanel data={currentDayData.supplements} dayKey={currentDay} />}
                {activeTab === 'data' && <DatabaseViewer />}
            </>
        ) : (
            <div className="p-8 text-center text-gray-500"><p>No routine data.</p></div>
        )}
      </div>
    </div>
  );
}

const LegacyApp = ({ onExit }) => (
    <ErrorBoundary>
        <PlanProvider>
            <AppContent onExit={onExit} />
        </PlanProvider>
    </ErrorBoundary>
);

export default LegacyApp;