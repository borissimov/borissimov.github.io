import React, { useState } from 'react';
import { usePlan } from './context/PlanContext';
import { Auth } from './components/Auth';
import { TimerBar } from './components/TimerBar';
import { TrainingPanel } from './components/TrainingPanel';
import { NutritionPanel } from './components/NutritionPanel';
import { SupplementPanel } from './components/SupplementPanel';
import { DatabaseViewer } from './components/DatabaseViewer';

function App() {
  const { session, loading, planData, currentDay, setCurrentDay, isEditMode, toggleEditMode, daysMap } = usePlan();
  const [activeTab, setActiveTab] = useState('training');

  if (loading) return <div className="flex h-screen items-center justify-center text-white bg-black">Loading Plan...</div>;
  
  // RESTORED: Enforce Auth
  if (!session) return <Auth />;
  
  if (!planData) return <div className="p-4 text-red-500">Error loading data.</div>;

  const currentDayData = planData[currentDay];

  return (
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        <div className="header-content">
            <div className="scroll-tabs">
            {Object.entries(daysMap).map(([key, label]) => (
                <button 
                key={key}
                onClick={() => setCurrentDay(key)}
                className={`tab-btn ${currentDay === key ? 'active' : ''}`}
                >
                {label.substring(0, 3)}
                </button>
            ))}
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