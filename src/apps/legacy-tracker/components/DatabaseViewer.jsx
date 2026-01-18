import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { RefreshCcw } from 'lucide-react';
import { LogTable } from './data/LogTable';
import { ChecklistTable } from './data/ChecklistTable';
import { RoutineStatus } from './data/RoutineStatus';
import { EgressMonitor } from './data/EgressMonitor';

export const DatabaseViewer = () => {
  const [logs, setLogs] = useState([]);
  const [checklistLogs, setChecklistLogs] = useState([]);
  const [routineStatus, setRoutineStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('logs');

  const fetchData = async () => {
    setLoading(true);
    
    // Workouts
    const { data: logData, error: logError } = await supabase
      .from('workout_logs')
      .select('id, exercise_name, weight, reps, rpe, intensity, duration_minutes, logged_at, scheduled_for, day_key')
      .order('logged_at', { ascending: false })
      .limit(50);

    if (logError) console.error("Error fetching logs:", logError);
    else setLogs(logData || []);

    // Checklist (Nutrition/Supps)
    const { data: checkData, error: checkError } = await supabase
      .from('daily_checklist_logs')
      .select('id, item_id, completed, scheduled_for, meta_data, updated_at')
      .order('updated_at', { ascending: false })
      .limit(50);

    if (checkError) console.error("Error fetching checklist:", checkError);
    else setChecklistLogs(checkData || []);

    // Routine Status
    const { data: statusData, error: statusError } = await supabase
        .from('user_routine_status')
        .select(`*, routines ( name, cycle_length )`)
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (statusError) console.error("Error fetching status:", statusError);
    else setRoutineStatus(statusData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="pb-24 px-2 pt-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 px-2 flex-shrink-0">
        <h2 className="section-title" style={{marginBottom:0}}>My Data</h2>
        <button onClick={fetchData} className="action-btn">
            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="flex gap-2 mb-4 px-2 border-b border-gray-800 pb-2 flex-shrink-0 overflow-x-auto">
          <button 
            onClick={() => setActiveView('logs')}
            className={`text-sm font-bold px-3 py-1 rounded-t whitespace-nowrap ${activeView === 'logs' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
          >
            Workouts
          </button>
          <button 
            onClick={() => setActiveView('checklist')}
            className={`text-sm font-bold px-3 py-1 rounded-t whitespace-nowrap ${activeView === 'checklist' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
          >
            Nutrition/Supps
          </button>
          <button 
            onClick={() => setActiveView('status')}
            className={`text-sm font-bold px-3 py-1 rounded-t whitespace-nowrap ${activeView === 'status' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
          >
            Routine Status
          </button>
          <button 
            onClick={() => setActiveView('egress')}
            className={`text-sm font-bold px-3 py-1 rounded-t whitespace-nowrap ${activeView === 'egress' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-500'}`}
          >
            Egress Monitor
          </button>
      </div>

      {activeView === 'logs' && <LogTable logs={logs} />}
      {activeView === 'checklist' && <ChecklistTable logs={checklistLogs} />}
      {activeView === 'status' && <RoutineStatus status={routineStatus} />}
      {activeView === 'egress' && <EgressMonitor />}
    </div>
  );
};