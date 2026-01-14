import React, { useState, useEffect } from 'react';

export const EgressMonitor = () => {
    const [stats, setStats] = useState({ requests: 0, egressBytes: 0, logs: [] });

    useEffect(() => {
        const update = () => {
            const data = JSON.parse(localStorage.getItem('mock_monitor_stats') || '{"requests":0,"egressBytes":0,"logs":[]}');
            setStats(data);
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    // Aggregation Logic
    // Note: mock_monitor_stats.logs currently stores only last 50 logs (FIFO).
    // If we want aggregated stats for the *session*, we should have tracked global counters in MockSupabase.
    // MockMonitor currently does this: requests++, egressBytes++.
    // But it doesn't store a map of counts per type.
    // However, if the user sees "269 requests", and the logs array is capped at 50, I can only analyze the last 50.
    // To solve this, I will update MockSupabase.js to store aggregated counts as well?
    // For now, I will display what I have (Global Total + Breakdown of Recent 50).
    
    // Better: Update MockSupabase to store 'breakdown' map.
    // But since I cannot change MockSupabase in this turn without overwriting, I will work with what I have.
    // Wait, I can update MockSupabase.js easily. It's better for the user request "log of api calls sorted by numbers".
    // I should update MockSupabase.js to track 'breakdown'.
    
    // Assuming I will update MockSupabase.js next step. For now, render based on 'stats.breakdown' if exists, else aggregate logs.
    
    const aggregated = stats.breakdown || {};
    // Fallback if breakdown missing (legacy logs)
    if (!stats.breakdown && stats.logs) {
        stats.logs.forEach(log => {
            const key = `${log.type} ${log.table}`;
            if (!aggregated[key]) aggregated[key] = { count: 0, size: 0 };
            aggregated[key].count++;
            aggregated[key].size += log.size;
        });
    }

    const sortedRows = Object.entries(aggregated).map(([key, val]) => ({
        key,
        count: val.count,
        size: val.size
    })).sort((a, b) => b.count - a.count);

    return (
        <div className="flex-1 overflow-hidden relative rounded-lg border border-[#333] flex flex-col p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#111] p-3 rounded border border-[#222]">
                    <div className="text-xs text-gray-500 uppercase">Total Requests</div>
                    <div className="text-xl font-bold text-white">{stats.requests}</div>
                </div>
                <div className="bg-[#111] p-3 rounded border border-[#222]">
                    <div className="text-xs text-gray-500 uppercase">Total Egress</div>
                    <div className="text-xl font-bold text-blue-400">{(stats.egressBytes / 1024).toFixed(2)} KB</div>
                </div>
            </div>

            <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase">Operation Breakdown (Session)</h3>
            <div className="flex-1 overflow-auto border-t border-[#222]">
                <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-[#1a1a1a] text-gray-500">
                        <tr>
                            <th className="p-2">Operation</th>
                            <th className="p-2 text-right">Count</th>
                            <th className="p-2 text-right">Size (KB)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRows.length === 0 ? (
                            <tr><td colSpan="3" className="p-4 text-center text-gray-600">No data available.</td></tr>
                        ) : (
                            sortedRows.map(row => (
                                <tr key={row.key} className="border-b border-[#222]">
                                    <td className="p-2 text-white font-mono">{row.key}</td>
                                    <td className="p-2 text-right text-orange-400 font-bold">{row.count}</td>
                                    <td className="p-2 text-right text-gray-400">{(row.size / 1024).toFixed(2)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            <button 
                onClick={() => {
                    localStorage.removeItem('mock_monitor_stats');
                    setStats({ requests: 0, egressBytes: 0, breakdown: {}, logs: [] });
                }}
                className="mt-4 w-full py-2 bg-red-900/30 text-red-400 border border-red-900 rounded uppercase font-bold text-xs hover:bg-red-900/50"
            >
                Reset Statistics
            </button>
        </div>
    );
};
