import React, { useState } from 'react';
import { useHealthStore } from './stores/useHealthStore';
import { usePlan } from '../../context/PlanContext';
import { Heart, Activity, ArrowLeft, Plus, History } from 'lucide-react';

const BloodPressureApp = ({ onExit }) => {
    const { session } = usePlan();
    const { logs, addLog, isSyncing } = useHealthStore();
    
    const [sys, setSys] = useState(120);
    const [dia, setDia] = useState(80);
    const [hr, setHr] = useState(70);

    const handleSave = async () => {
        if (!session?.user?.id) return;
        await addLog(session.user.id, sys, dia, hr);
        alert("Metrics Logged Successfully");
    };

    return (
        <div className="min-h-screen bg-[#121212] text-[#ececec] font-sans max-w-md mx-auto flex flex-col">
            {/* Header */}
            <header className="p-6 flex justify-between items-center bg-[#1a1a1a] border-b border-[#333]">
                <button onClick={onExit} className="p-2 -ml-2 text-gray-400 hover:text-white">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-black uppercase tracking-widest text-red-500">Health Tracker</h1>
                <div className="w-10"></div> {/* Spacer */}
            </header>

            <main className="flex-1 p-6 space-y-8 overflow-y-auto">
                {/* Input Card */}
                <section className="bg-[#1e1e1e] p-6 rounded-3xl border border-[#333] shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <Heart className="text-red-500" size={18} fill="currentColor" />
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">New Entry</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="text-center space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Sys</label>
                            <input 
                                type="number" 
                                value={sys} 
                                onChange={(e) => setSys(parseInt(e.target.value))}
                                className="w-full bg-black/40 border border-[#333] rounded-xl py-3 text-center text-xl font-bold focus:border-red-500 outline-none transition-colors"
                            />
                        </div>
                        <div className="text-center space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Dia</label>
                            <input 
                                type="number" 
                                value={dia} 
                                onChange={(e) => setDia(parseInt(e.target.value))}
                                className="w-full bg-black/40 border border-[#333] rounded-xl py-3 text-center text-xl font-bold focus:border-red-500 outline-none transition-colors"
                            />
                        </div>
                        <div className="text-center space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Pulse</label>
                            <input 
                                type="number" 
                                value={hr} 
                                onChange={(e) => setHr(parseInt(e.target.value))}
                                className="w-full bg-black/40 border border-[#333] rounded-xl py-3 text-center text-xl font-bold focus:border-red-500 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleSave}
                        disabled={isSyncing}
                        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black uppercase rounded-2xl shadow-lg shadow-red-900/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Save Record
                    </button>
                </section>

                {/* History List */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2 px-2">
                        <History className="text-gray-500" size={16} />
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-500">Recent Logs</h2>
                    </div>

                    {logs.length === 0 ? (
                        <div className="text-center py-10 text-gray-600 italic text-sm">
                            No health data recorded yet.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {logs.slice(0, 5).map((log, idx) => (
                                <div key={idx} className="bg-[#1a1a1a] p-4 rounded-2xl border border-[#222] flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-bold text-gray-300">
                                            {new Date(log.measured_at).toLocaleDateString()}
                                        </p>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">
                                            {new Date(log.measured_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="text-right">
                                            <p className="text-lg font-black text-white leading-none">{log.metrics?.bp_sys}/{log.metrics?.bp_dia}</p>
                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">mmHg</p>
                                        </div>
                                        <div className="text-right border-l border-[#333] pl-4">
                                            <p className="text-lg font-black text-red-500 leading-none">{log.metrics?.hr}</p>
                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">BPM</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default BloodPressureApp;
