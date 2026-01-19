import React, { useState } from 'react';
import { useTrainingStore } from './stores/useTrainingStore';
import { TrainingBlock } from './components/TrainingBlock';
import { 
    X, 
    ArrowLeft, 
    Play, 
    Timer, 
    CheckCircle2, 
    LayoutDashboard,
    Activity,
    Utensils,
    Beaker,
    Heart
} from 'lucide-react';

const RegimenProApp = ({ onExit }) => {
    const { activeSession, startSession, resetStore } = useTrainingStore();
    const [activeTab, setActiveTab] = useState('training');

    const progress = activeSession ? 35 : 0; // Mock progress percentage

    return (
        <div className="min-h-screen bg-[#121212] text-[#ececec] font-sans selection:bg-[#f29b11]/30">
            
            {/* FIXED FOCUS HEADER */}
            {activeSession && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/80 backdrop-blur-xl border-b border-[#333]">
                    <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
                        <button onClick={onExit} className="p-2 -ml-2 text-gray-500 hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        
                        <div className="flex flex-col items-center flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Timer size={14} className="text-[#f29b11]" />
                                <span className="text-xl font-black tabular-nums tracking-tighter">01:45</span>
                            </div>
                            <div className="w-32 h-1 bg-[#222] rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-[#f29b11] transition-all duration-1000" 
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <button onClick={resetStore} className="p-2 -mr-2 text-gray-500 hover:text-red-500 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* MAIN SCROLL CONTENT */}
            <main className={`max-w-md mx-auto px-4 ${activeSession ? 'pt-24 pb-32' : 'pt-12'}`}>
                {!activeSession ? (
                    <div className="flex flex-col">
                        <header className="mb-12">
                            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
                                Regimen <span className="text-[#f29b11]">Pro</span>
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-0.5 rounded bg-[#1e1e1e] border border-[#333] text-[9px] font-black text-[#f29b11] tracking-widest uppercase">
                                    V2.0 Engine
                                </span>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                    Next: Legs (Volume)
                                </span>
                            </div>
                        </header>

                        <div className="bg-[#1e1e1e] border border-[#333] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
                            <div className="w-20 h-20 bg-[#f29b11]/10 border border-[#f29b11]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Play size={32} className="text-[#f29b11] ml-1" fill="currentColor" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tight">Ready to train?</h2>
                                <p className="text-sm text-gray-500 mt-1">Your Jan 18 progression is loaded.</p>
                            </div>
                            <button 
                                onClick={() => startSession(new Date().toISOString().split('T')[0])}
                                className="w-full py-5 bg-[#f29b11] text-black font-black uppercase rounded-2xl shadow-[0_10px_20px_rgba(242,155,17,0.2)] transform transition-all active:scale-[0.98] hover:bg-[#ffae2b]"
                            >
                                Start Session
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {activeSession.blocks.map((block, idx) => (
                            <TrainingBlock 
                                key={block.id} 
                                block={block} 
                                index={idx}
                                totalBlocks={activeSession.blocks.length}
                            />
                        ))}
                        
                        <button className="w-full py-6 border-2 border-dashed border-[#333] rounded-3xl text-gray-600 font-black uppercase tracking-widest hover:border-[#f29b11]/30 hover:text-gray-400 transition-all">
                            + Add Custom Block
                        </button>
                    </div>
                )}
            </main>

            {/* BOTTOM NAV BAR */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#121212]/90 backdrop-blur-2xl border-t border-[#333] px-6 pb-8 pt-3">
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <NavBtn icon={<LayoutDashboard size={22} />} label="Hub" active={false} onClick={onExit} />
                    <NavBtn icon={<Activity size={22} />} label="Train" active={activeTab === 'training'} onClick={() => setActiveTab('training')} />
                    <NavBtn icon={<Utensils size={22} />} label="Eats" active={activeTab === 'nutrition'} onClick={() => setActiveTab('nutrition')} />
                    <NavBtn icon={<Beaker size={22} />} label="Supps" active={activeTab === 'supps'} onClick={() => setActiveTab('supps')} />
                    <NavBtn icon={<Heart size={22} />} label="Health" active={activeTab === 'health'} onClick={() => setActiveTab('health')} />
                </div>
            </nav>
        </div>
    );
};

const NavBtn = ({ icon, label, active, onClick }) => (
    <button 
        onClick={onClick}
        className="flex flex-col items-center gap-1 transition-all active:scale-90"
    >
        <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-[#f29b11] text-black shadow-[0_0_15px_rgba(242,155,17,0.3)]' : 'text-gray-500'}`}>
            {icon}
        </div>
        <span className={`text-[9px] font-black uppercase tracking-tighter ${active ? 'text-[#f29b11]' : 'text-gray-600'}`}>
            {label}
        </span>
    </button>
);

export default RegimenProApp;