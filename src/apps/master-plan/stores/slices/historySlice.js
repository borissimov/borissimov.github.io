import { DB } from '../../services/database.service';
import { supabase } from '../../../../supabaseClient';

export const createHistorySlice = (set, get) => ({
    globalHistory: [],
    dailyVolumes: {},
    activeHistorySession: null,

    // Derived Statistics
    getHistoryStats: () => {
        const history = get().globalHistory;
        if (!history || history.length === 0) return { streak: 0, weekCount: 0 };

        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toLocaleDateString('en-CA');
        });
        
        const weekCount = history.filter(s => {
            const date = new Date(s.end_time).toLocaleDateString('en-CA');
            return last7Days.includes(date);
        }).length;

        let streak = 0;
        let checkDate = new Date();
        const todayStr = checkDate.toLocaleDateString('en-CA');
        const todayHasLog = history.some(s => new Date(s.end_time).toLocaleDateString('en-CA') === todayStr);
        
        if (!todayHasLog) checkDate.setDate(checkDate.getDate() - 1);

        while (true) {
            const dateStr = checkDate.toLocaleDateString('en-CA');
            const hasActivity = history.some(s => new Date(s.end_time).toLocaleDateString('en-CA') === dateStr);
            if (hasActivity) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else break;
            if (streak > 365) break; // Safety
        }
        return { streak, weekCount };
    },

    getActivitiesForDate: (dateObj) => {
        const selectedStr = dateObj.toLocaleDateString('en-CA');
        return get().globalHistory.filter(s => {
            return new Date(s.end_time).toLocaleDateString('en-CA') === selectedStr;
        });
    },

    fetchGlobalHistory: async () => {
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data, error } = await DB.fetchGlobalHistory(user?.id);
            if (error) throw error;

            const volumeMap = {};
            data.forEach(session => {
                const dateKey = new Date(session.end_time).toDateString();
                let sessionVolume = 0;
                session.performance_logs.forEach(log => {
                    let w = 0;
                    const weightStr = String(log.weight || '0').toLowerCase();
                    if (weightStr !== 'bw') {
                        const parts = weightStr.match(/\d+(\.\d+)?/);
                        w = parts ? parseFloat(parts[0]) : 0;
                    }
                    const r = parseInt(log.reps) || 0;
                    sessionVolume += (w * r);
                });
                volumeMap[dateKey] = (volumeMap[dateKey] || 0) + sessionVolume;
            });

            set({ globalHistory: data, dailyVolumes: volumeMap, isLoading: false });
        } catch (err) {
            console.error("[HistorySlice] fetchGlobalHistory FAILED:", err);
            set({ isLoading: false });
        }
    },

    fetchSessionDetails: async (sessionId) => {
        const fkConstraint = get().getFKConstraint();
        set({ isLoading: true, activeHistorySession: null });
        try {
            const { data: logs, error: lErr } = await DB.fetchSessionDetails(sessionId, fkConstraint);
            if (lErr) throw lErr;

            const groups = [];
            logs.forEach(log => {
                const exName = log.block_items?.exercise_library?.name || log.exercise_name_snapshot || 'Unknown Exercise';
                const targets = {
                    w: log.block_items?.target_weight || (log.target_snapshot || '?'),
                    r: log.block_items?.target_reps || '?',
                    e: log.block_items?.target_rpe || '?',
                    t: log.block_items?.tempo || ''
                };

                const lastGroup = groups[groups.length - 1];
                if (!lastGroup || lastGroup.name !== exName) {
                    groups.push({ name: exName, targets, sets: [log] });
                } else {
                    lastGroup.sets.push(log);
                }
            });

            // Fallback for session header if needed
            const { data: header } = await supabase.schema(get().activeSchema).from('completed_sessions').select('*, program_days(label)').eq('id', sessionId).single();

            set({ activeHistorySession: { ...header, groupedLogs: groups }, isLoading: false });
        } catch (err) {
            console.error("[HistorySlice] fetchSessionDetails FAILED:", err);
            set({ isLoading: false });
        }
    },

    deleteSessionRecord: async (sessionId) => {
        set({ isLoading: true });
        try {
            const { error } = await DB.deleteSessionRecord(sessionId);
            if (error) throw error;
            await get().fetchGlobalHistory();
            await get().fetchProgramManifest(); // Re-sync manifest for previews
            set({ isLoading: false });
        } catch (err) {
            console.error("[HistorySlice] deleteSessionRecord FAILED:", err);
            set({ isLoading: false });
            throw err;
        }
    }
});
