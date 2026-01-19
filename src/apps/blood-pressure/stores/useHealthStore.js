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

                set((state) => ({ logs: [newLog, ...state.logs] }));

                try {
                    const { error } = await supabase
                        .schema('v2') // Point to v2
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
                        .schema('v2') // Point to v2
                        .from('health_metrics')
                        .select('*')
                        .eq('user_id', userId)
                        .order('measured_at', { ascending: false })
                        .limit(50);
                    
                    if (error) throw error;
                    
                    const grouped = data.reduce((acc, row) => {
                        const date = row.measured_at.split('T')[0];
                        if (!acc[date]) acc[date] = { measured_at: row.measured_at, metrics: {} };
                        acc[date].metrics[row.metric_type.toLowerCase()] = row.value;
                        return acc;
                    }, {});

                    set({ logs: Object.values(grouped), isSyncing: false });
                } catch (err) {
                    console.error("Health Fetch Error:", err);
                    set({ isSyncing: false });
                }
            },

            getAverageMetrics: () => {
                const logs = get().logs;
                if (logs.length === 0) return null;
                const sum = logs.reduce((acc, log) => ({
                    sys: acc.sys + (log.metrics?.bp_sys || 0),
                    dia: acc.dia + (log.metrics?.bp_dia || 0)
                }), { sys: 0, dia: 0 });
                return {
                    sys: Math.round(sum.sys / logs.length),
                    dia: Math.round(sum.dia / logs.length)
                };
            },
        }),
        {
            name: 'mp-health-storage-v2', // Updated key for v2 schema
        }
    )
);