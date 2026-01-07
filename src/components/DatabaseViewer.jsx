import React, { useState, useEffect } from 'react';
import { usePlan } from '../context/PlanContext';
import { supabase } from '../supabaseClient';
import { RefreshCcw, Database, Table } from 'lucide-react';

export const DatabaseViewer = () => {
  const { session } = usePlan();
  const [logs, setLogs] = useState([]);
  const [planRows, setPlanRows] = useState([]);
  const [selectedTable, setSelectedTable] = useState('workout_logs');
  const [loading, setLoading] = useState(false);

  const fetchCloudData = async () => {
    if (!session?.user?.id) return;
    setLoading(true);

    if (selectedTable === 'workout_logs') {
      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('logged_at', { ascending: false });
      
      if (!error) setLogs(data || []);
    } else {
      const { data, error } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (!error) setPlanRows(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCloudData();
  }, [selectedTable, session]);

  return (
    <div className="p-4 pb-24 text-white">
      <div className="flex justify-between items-center mb-4">
          <h2 className="section-title text-gray-200 mb-0 flex items-center gap-2">
            <Database size={20} className="text-blue-500" /> 
            Cloud Database Explorer
          </h2>
          <button 
            onClick={fetchCloudData}
            disabled={loading}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 px-3 py-2 rounded text-xs font-bold transition-colors disabled:opacity-50"
          >
            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} /> 
            {loading ? "FETCHING..." : "REFRESH"}
          </button>
      </div>
      
      {/* Table Selector */}
      <div className="flex gap-2 mb-4 border-b border-gray-700 pb-2">
        <button 
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-t-lg transition-all ${selectedTable === 'workout_logs' ? 'bg-blue-600 text-white' : 'bg-neutral-900 text-gray-500 hover:text-gray-300'}`}
            onClick={() => setSelectedTable('workout_logs')}
        >
            <Table size={14} /> public.workout_logs
        </button>
        <button 
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-t-lg transition-all ${selectedTable === 'user_plans' ? 'bg-blue-600 text-white' : 'bg-neutral-900 text-gray-500 hover:text-gray-300'}`}
            onClick={() => setSelectedTable('user_plans')}
        >
            <Table size={14} /> public.user_plans
        </button>
      </div>

      {loading ? (
          <div className="py-20 text-center text-gray-500 animate-pulse">Querying Supabase...</div>
      ) : (
          <>
            {selectedTable === 'workout_logs' && (
                <div className="overflow-x-auto bg-neutral-900 rounded border border-gray-800 shadow-xl">
                    <table className="w-full text-left text-[11px] font-mono border-collapse">
                        <thead className="bg-neutral-800 text-gray-400 sticky top-0">
                            <tr>
                                <th className="p-3 border-b border-gray-700">logged_at</th>
                                <th className="p-3 border-b border-gray-700">day_key</th>
                                <th className="p-3 border-b border-gray-700">exercise_name</th>
                                <th className="p-3 border-b border-gray-700">weight</th>
                                <th className="p-3 border-b border-gray-700">reps</th>
                                <th className="p-3 border-b border-gray-700">rpe</th>
                                <th className="p-3 border-b border-gray-700">tempo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr><td colSpan="7" className="p-10 text-center text-gray-600 italic">No cloud records found. Log a set in Training to see it here.</td></tr>
                            ) : (
                                logs.map((row) => (
                                    <tr key={row.id} className="border-b border-gray-800 hover:bg-blue-900/10 transition-colors">
                                        <td className="p-3 text-gray-500">{new Date(row.logged_at).toLocaleString()}</td>
                                        <td className="p-3 text-blue-400 font-bold">{row.day_key.toUpperCase()}</td>
                                        <td className="p-3 text-orange-300">{row.exercise_name}</td>
                                        <td className="p-3 font-bold">{row.weight}</td>
                                        <td className="p-3 text-white">{row.reps}</td>
                                        <td className="p-3 text-yellow-500 font-bold">{row.rpe || 'NULL'}</td>
                                        <td className="p-3 text-gray-500 italic">{row.tempo || 'NULL'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedTable === 'user_plans' && (
                <div className="space-y-4">
                    {planRows.map(row => (
                        <div key={row.id} className="bg-neutral-900 rounded border border-gray-800 overflow-hidden shadow-xl">
                            <div className="bg-neutral-800 p-2 px-4 text-[10px] text-gray-500 flex justify-between">
                                <span>ROW_ID: {row.id}</span>
                                <span>LAST_UPDATED: {new Date(row.updated_at).toLocaleString()}</span>
                            </div>
                            <pre className="p-4 text-[10px] leading-relaxed text-green-500/80 overflow-auto max-h-[500px]">
                                {JSON.stringify(row.plan_data, null, 2)}
                            </pre>
                        </div>
                    ))}
                    {planRows.length === 0 && <div className="p-10 text-center text-gray-600 italic">No plan found in cloud.</div>}
                </div>
            )}
          </>
      )}
      
      <div className="mt-6 p-4 bg-blue-900/10 border border-blue-900/30 rounded-lg text-xs text-blue-300">
          <strong>Tip:</strong> These tables show your live <strong>Supabase Cloud Data</strong>. When you log a workout, a row is inserted into <code>workout_logs</code>. When you edit your plan structure, it updates the JSON in <code>user_plans</code>.
      </div>
    </div>
  );
};