import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../../../supabaseClient';

export const useHealthStore = create(
    persist(
        (set, get) => ({
            logs: [],
            isSyncing: false,

            addLog: async (userId, systolic, diastolic, heartRate) => {
                const newLog = {
                    user_id: userId,
                    measured_at: new Date().toISOString(),
                    metrics: {
                        bp_sys: systolic,
                        bp_dia: diastolic,
                        hr: heartRate
                    }
                };

                // Add to local state immediately (Optimistic)
                set((state) => ({ logs: [newLog, ...state.logs] }));

                // Sync to Supabase
                try {
                    const { error } = await supabase
                        .from('health_metrics')
                        .insert([
                            { user_id: userId, metric_type: 'BP_SYS', value: systolic },
                            { user_id: userId, metric_type: 'BP_DIA', value: diastolic },
                            { user_id: userId, metric_type: 'HR', value: heartRate }
                        ]);
                    if (error) throw error;
                } catch (err) {
                    console.error("Health Sync Error:", err);
                }
            },

            fetchLogs: async (userId) => {
                set({ isSyncing: true });
                try {
                    const { data, error } = await supabase
                        .from('health_metrics')
                        .select('*')
                        .eq('user_id', userId)
                        .order('measured_at', { ascending: false })
                        .limit(50);
                    
                    if (error) throw error;
                    set({ logs: data || [], isSyncing: false });
                } catch (err) {
                    console.error("Health Fetch Error:", err);
                    set({ isSyncing: false });
                }
            }
        }),
        {
            name: 'mp-health-storage',
        }
    )
);
