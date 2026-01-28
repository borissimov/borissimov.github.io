import { DB } from '../../services/database.service';
import { supabase } from '../../../../supabaseClient';

export const createSleepSlice = (set, get) => ({
    activeSleepSession: null, // { startTime: ISO }
    sleepHistory: [],

    startSleep: () => {
        set({ activeSleepSession: { startTime: new Date().toISOString() } });
    },

    endSleep: async () => {
        const session = get().activeSleepSession;
        if (!session) return;

        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const payload = {
                user_id: user.id,
                start_time: session.startTime,
                end_time: new Date().toISOString()
            };

            await DB.insertSleepLog(payload);
            set({ activeSleepSession: null });
            await get().fetchSleepHistory();
        } catch (err) {
            console.error("[SleepSlice] endSleep FAILED:", err);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchSleepHistory: async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data } = await DB.fetchSleepHistory(user.id);
            set({ sleepHistory: data || [] });
        } catch (err) {
            console.error("[SleepSlice] fetchSleepHistory FAILED:", err);
        }
    }
});
