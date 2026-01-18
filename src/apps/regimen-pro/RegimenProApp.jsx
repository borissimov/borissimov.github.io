import React from 'react';
import { useTrainingStore } from './stores/useTrainingStore';
import { TrainingBlock } from './components/TrainingBlock';
import { X, ArrowLeft } from 'lucide-react';

const RegimenProApp = ({ onExit }) => {
    const { activeSession, startSession, resetStore } = useTrainingStore();

    return (
        <div className="min-h-screen bg-[#121212] text-[#ececec] p-4 font-sans max-w-md mx-auto">
            <header className="flex justify-between items-start mb-8">
                <div className="flex items-start gap-3">
                    <button onClick={onExit} className="p-2 -ml-2 text-gray-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[#f29b11] uppercase tracking-widest">Regimen Pro</h1>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">V2.0 Relational Engine</p>
                    </div>
                </div>
                {activeSession && (
                    <button onClick={resetStore} className="p-2 bg-[#1e1e1e] rounded-lg text-gray-500 border border-[#333]">
                        <X size={18} />
                    </button>
                )}
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
                <div className="space-y-10 pb-32">
                    {activeSession.blocks.map((block, idx) => (
                        <TrainingBlock 
                            key={block.id} 
                            block={block} 
                            index={idx}
                            totalBlocks={activeSession.blocks.length}
                        />
                    ))}
                    
                    <div className="p-4 bg-[#1e1e1e] border border-[#333] rounded-2xl">
                        <h3 className="text-[#f29b11] font-black uppercase text-[10px] tracking-widest mb-2">Session Meta</h3>
                        <p className="text-xs text-gray-400">Date: {activeSession.date}</p>
                        <p className="text-xs text-gray-400">Started: {new Date(activeSession.startTime).toLocaleTimeString()}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegimenProApp;
