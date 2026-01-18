import React, { useState, useEffect } from 'react';
import { usePlan } from '../context/PlanContext';
import { supabase } from '../supabaseClient';
import { Sparkles, RefreshCw, Brain } from 'lucide-react';

export const DailyAIInsight = () => {
    const { session, currentDay, weekDates } = usePlan();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false); // NEW

    const date = weekDates[currentDay]?.fullDate;

    useEffect(() => {
        if (session?.user?.id && date) {
            setIsFetching(true);
            loadInsight().finally(() => setIsFetching(false));
        }
    }, [session, date]);

    const loadInsight = async () => {
        const { data } = await supabase
            .from('daily_analytics')
            .select('summary')
            .eq('user_id', session.user.id)
            .eq('date', date)
            .maybeSingle();
        if (data) setSummary(data.summary);
        else setSummary(null);
    };

    const handleAnalyze = async () => {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('analyze-day', {
            body: { date: date, userId: session.user.id }
        });
        
        if (error) {
            console.error("Analysis Error:", error);
        }
        
        if (data?.summary) setSummary(data.summary);
        if (data?.error) console.error("Function Error:", data.error);
        
        setLoading(false);
    };

    if (!date) return null;

    // Determine if we should show content area
    // Show if: Summary exists OR Loading (Analyzing) OR Fetching (Initial check)
    // This prevents collapse while checking DB.
    const showContent = summary || loading || isFetching;

    return (
        <div className="mx-4 mb-6 mt-2">
            <div className="bg-[#1a1a1a] rounded-xl border border-[#333] relative overflow-hidden shadow-lg">
                {/* Header Strip */}
                <div className="flex justify-center items-center p-3 bg-[#222] border-b border-[#333]">
                    <div className="flex items-center gap-2">
                        {!summary && !loading && !isFetching && (
                            <button 
                                onClick={handleAnalyze} 
                                className="filter-btn active"
                                style={{ 
                                    backgroundColor: '#8e44ad', 
                                    borderColor: '#8e44ad', 
                                    color: 'white',
                                    padding: '6px 16px',
                                    borderRadius: '6px',
                                    fontSize: '0.7rem',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    minWidth: 'auto' 
                                }}
                            >
                                Ask 4u4o Byu4o
                            </button>
                        )}
                        {(summary || loading || isFetching) && (
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold text-[#8e44ad] uppercase tracking-wider">4yu 4u4o cu kakВо Tu soBopu</span>
                                <button onClick={handleAnalyze} className="text-gray-500 hover:text-white transition-colors p-1" title="Refresh Analysis">
                                    <RefreshCw size={14} className={loading || isFetching ? "animate-spin" : ""} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Content Area */}
                {showContent && (
                    <div className="p-4 relative min-h-[80px] flex items-center">
                        <div className="absolute inset-0 opacity-5 pointer-events-none" 
                            style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                        </div>

                        <div className="relative z-10 w-full">
                            {loading || isFetching ? (
                                <div className="flex justify-center items-center gap-8 py-4">
                                    <Brain 
                                        size={32} 
                                        fill="#8e44ad" 
                                        stroke="#000" 
                                        strokeWidth={1}
                                        className="animate-brain" 
                                    />
                                    <span className="text-sm font-black uppercase tracking-[0.2em] text-[#8e44ad] animate-pulse">
                                        {loading ? "Thinking..." : "Checking..."}
                                    </span>
                                </div>
                            ) : (
                                <div className="text-gray-300 text-sm font-medium leading-relaxed italic border-l-2 border-[#8e44ad] pl-3">
                                    "{summary}"
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
