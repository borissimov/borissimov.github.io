import React from 'react';

export const ChecklistTable = ({ logs }) => {
    return (
        <div className="flex-1 overflow-hidden relative rounded-lg border border-[#333]">
            <div className="absolute inset-0 overflow-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-[#1a1a1a] text-gray-400 text-xs uppercase shadow-sm">
                            <th className="p-3 border-b border-[#333]">Updated</th>
                            <th className="p-3 border-b border-[#333]">Scheduled</th>
                            <th className="p-3 border-b border-[#333]">ID</th>
                            <th className="p-3 border-b border-[#333] text-center">Status</th>
                            <th className="p-3 border-b border-[#333]">Details</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {logs.length === 0 ? (
                            <tr><td colSpan="5" className="p-4 text-center text-gray-500">No checklist logs found.</td></tr>
                        ) : (
                            logs.map((log, i) => (
                                <tr key={log.id} className={`${i % 2 === 0 ? 'bg-[#0a0a0a]' : 'bg-[#151515]'} hover:bg-[#222]`}>
                                    <td className="p-3 border-b border-[#222] text-gray-500 whitespace-nowrap text-xs">{new Date(log.updated_at).toLocaleString()}</td>
                                    <td className="p-3 border-b border-[#222] font-mono text-green-400 text-xs">{log.scheduled_for}</td>
                                    <td className="p-3 border-b border-[#222] text-xs font-mono text-gray-500 truncate max-w-[100px]" title={log.item_id}>{log.item_id}</td>
                                    <td className="p-3 border-b border-[#222] text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${log.completed ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                            {log.completed ? 'DONE' : 'PENDING'}
                                        </span>
                                    </td>
                                    <td className="p-3 border-b border-[#222] text-xs text-gray-300">
                                        {log.meta_data ? (
                                            <div className="flex flex-col gap-1">
                                                {log.meta_data.name && <div className="font-bold text-white">{log.meta_data.name}</div>}
                                                {log.meta_data.dosage && <div className="text-gray-400" dangerouslySetInnerHTML={{__html: log.meta_data.dosage}}></div>}
                                            </div>
                                        ) : (
                                            <span className="text-gray-600 italic">No details</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
