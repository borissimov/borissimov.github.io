import React from 'react';
import { useTrainingStore } from './stores/useTrainingStore';

const RegimenProApp = () => {
    const { activeSession, startSession } = useTrainingStore();

    return (
        <div className="min-h-screen bg-[#121212] text-[#ececec] p-4 font-sans">
            <header className="mb-8">
                <h1 className="text-2xl font-black text-[#f29b11] uppercase tracking-widest">Regimen Pro</h1>
                <p className="text-xs text-gray-500 uppercase font-bold">V2.0 Relational Engine</p>
            </header>

            {!activeSession ? (
                <div className="flex flex-col items-center justify-center mt-20">
                    <button 
                        onClick={() => startSession(new Date().toISOString().split('T')[0])}
                        className="px-12 py-4 bg-[#f29b11] text-black font-black uppercase rounded-xl shadow-lg transform transition-transform active:scale-95"
                    >
                        Start Workout
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="p-4 bg-[#1e1e1e] border border-[#333] rounded-xl">
                        <h2 className="text-[#f29b11] font-bold uppercase text-sm mb-2">Session Active</h2>
                        <p className="text-xs text-gray-400">Date: {activeSession.date}</p>
                        <p className="text-xs text-gray-400">Started: {new Date(activeSession.startTime).toLocaleTimeString()}</p>
                    </div>
                    
                    <p className="text-center text-gray-600 italic py-10">
                        Block-based Circuit UI implementation in progress...
                    </p>
                </div>
            )}
        </div>
    );
};

export default RegimenProApp;
