import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { RefreshCcw } from 'lucide-react';

export const DatabaseViewer = () => {
  const [logs, setLogs] = useState([]);
  const [routineStatus, setRoutineStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('logs');

  const fetchData = async () => {
    setLoading(true);
    
    const { data: logData, error: logError } = await supabase
      .from('workout_logs')
      .select('*')
      .order('logged_at', { ascending: false })
      .limit(50);

    if (logError) console.error("Error fetching logs:", logError);
    else setLogs(logData || []);

    const { data: statusData, error: statusError } = await supabase
        .from('user_routine_status')
        .select(`
            *,
            routines ( name, cycle_length )
        `)
        .single();

    if (statusError && statusError.code !== 'PGRST116') console.error("Error fetching status:", statusError);
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

      <div className="flex gap-2 mb-4 px-2 border-b border-gray-800 pb-2 flex-shrink-0">
          <button 
            onClick={() => setActiveView('logs')}
            className={`text-sm font-bold px-3 py-1 rounded-t ${activeView === 'logs' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
          >
            Log History
          </button>
          <button 
            onClick={() => setActiveView('status')}
            className={`text-sm font-bold px-3 py-1 rounded-t ${activeView === 'status' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
          >
            Routine Status
          </button>
      </div>

      {activeView === 'logs' && (
          <div className="flex-1 overflow-hidden relative rounded-lg border border-[#333]">
            <div className="absolute inset-0 overflow-auto">
                <table className="w-full text-left border-collapse min-w-[400px]">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-[#1a1a1a] text-gray-400 text-xs uppercase shadow-sm">
                            <th className="p-3 border-b border-[#333]">Logged At</th>
                            <th className="p-3 border-b border-[#333]">Scheduled</th> {/* NEW */}
                            <th className="p-3 border-b border-[#333]">Key</th>
                            <th className="p-3 border-b border-[#333]">Exercise</th>
                            <th className="p-3 border-b border-[#333] text-center">Load</th>
                            <th className="p-3 border-b border-[#333] text-center">Reps</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {logs.length === 0 ? (
                            <tr><td colSpan="6" className="p-4 text-center text-gray-500">No logs found.</td></tr>
                        ) : (
                            logs.map((log, i) => (
                                <tr key={log.id} className={`${i % 2 === 0 ? 'bg-[#0a0a0a]' : 'bg-[#151515]'} hover:bg-[#222]`}>
                                    <td className="p-3 border-b border-[#222] text-gray-500 whitespace-nowrap text-xs">
                                        {new Date(log.logged_at).toLocaleString()}
                                    </td>
                                    <td className="p-3 border-b border-[#222] font-mono text-blue-400 text-xs">
                                        {log.scheduled_for || "NULL"}
                                    </td>
                                    <td className="p-3 border-b border-[#222] text-xs font-mono text-gray-500">
                                        {log.day_key}
                                    </td>
                                    <td className="p-3 border-b border-[#222] font-bold text-white">
                                        {log.exercise_name}
                                    </td>
                                    <td className="p-3 border-b border-[#222] font-mono text-orange-400 text-center whitespace-nowrap">
                                        {log.weight}
                                    </td>
                                    <td className="p-3 border-b border-[#222] text-white text-center">
                                        {log.reps}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
          </div>
      )}

      {/* Routine Status Tab (Unchanged) */}
      {activeView === 'status' && (
          <div className="bg-[#111] p-4 rounded-lg border border-[#333] m-2">
              {routineStatus ? (
                  <div className="space-y-4">
                      <div>
                          <div className="text-xs text-gray-500 uppercase font-bold mb-1">Active Routine</div>
                          <div className="text-xl font-bold text-white">{routineStatus.routines?.name || "Unknown"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Start Date</div>
                            <div className="text-white font-mono">{new Date(routineStatus.cycle_start_date).toLocaleDateString()}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Cycle Length</div>
                            <div className="text-white">{routineStatus.routines?.cycle_length} Days</div>
                        </div>
                      </div>
                  </div>
              ) : (
                  <div className="text-gray-500 italic">No active routine assigned.</div>
              )}
          </div>
      )}
    </div>
  );
};
