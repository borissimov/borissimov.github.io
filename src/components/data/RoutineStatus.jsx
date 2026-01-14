import React from 'react';

export const RoutineStatus = ({ status }) => {
    return (
        <div className="bg-[#111] p-4 rounded-lg border border-[#333] m-2">
            {status ? (
                <div className="space-y-4">
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Active Routine</div>
                        <div className="text-xl font-bold text-white">{status.routines?.name || "Unknown"}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Start Date</div>
                            <div className="text-white font-mono">{new Date(status.cycle_start_date).toLocaleDateString()}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Cycle Length</div>
                            <div className="text-white">{status.routines?.cycle_length} Days</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-gray-500 italic">No active routine assigned.</div>
            )}
        </div>
    );
};
