import { DB } from '../../services/database.service';
import { supabase } from '../../../../supabaseClient';

export const createHistorySlice = (set, get) => ({
    globalHistory: [],
    dailyVolumes: {},
    activeHistorySession: null,

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
            const { data: session, error: sErr } = await DB.fetchSessions(sessionId); // This needs careful mapping
            // Note: DB service needs a .singleSession fetcher
            
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
