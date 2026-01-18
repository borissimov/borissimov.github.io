import React from 'react';

export const LogTable = ({ logs }) => {
    return (
        <div className="flex-1 overflow-hidden relative rounded-lg border border-[#333]">
            <div className="absolute inset-0 overflow-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-[#1a1a1a] text-gray-400 text-xs uppercase shadow-sm">
                            <th className="p-3 border-b border-[#333]">Logged</th>
                            <th className="p-3 border-b border-[#333]">Sched</th>
                            <th className="p-3 border-b border-[#333]">Ex</th>
                            <th className="p-3 border-b border-[#333] text-center">Load</th>
                            <th className="p-3 border-b border-[#333] text-center">Reps</th>
                            <th className="p-3 border-b border-[#333] text-center">Int/RPE</th>
                            <th className="p-3 border-b border-[#333] text-center">Dur</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">{logs.length === 0 ? (
                            <tr><td colSpan="7" className="p-4 text-center text-gray-500">No logs found.</td></tr>
                        ) : (
                            logs.map((log, i) => (
                                <tr key={log.id} className={`${i % 2 === 0 ? 'bg-[#0a0a0a]' : 'bg-[#151515]'} hover:bg-[#222]`}>
                                    <td className="p-3 border-b border-[#222] text-gray-500 whitespace-nowrap text-xs">{new Date(log.logged_at).toLocaleString(undefined, {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</td>
                                    <td className="p-3 border-b border-[#222] font-mono text-blue-400 text-xs">{log.scheduled_for || "-"}</td>
                                    <td className="p-3 border-b border-[#222] font-bold text-white text-xs">{log.exercise_name}</td>
                                    <td className="p-3 border-b border-[#222] font-mono text-orange-400 text-center whitespace-nowrap">{log.weight}</td>
                                    <td className="p-3 border-b border-[#222] text-white text-center">{log.reps}</td>
                                    <td className="p-3 border-b border-[#222] text-white text-center text-xs">
                                        {log.intensity ? <span className="text-blue-300">{log.intensity}%</span> : log.rpe}
                                    </td>
                                    <td className="p-3 border-b border-[#222] text-white text-center text-xs">
                                        {log.duration_minutes ? `${log.duration_minutes}m` : "-"}
                                    </td>
                                </tr>
                            ))
                        )}</tbody>
                </table>
            </div>
        </div>
    );
};
