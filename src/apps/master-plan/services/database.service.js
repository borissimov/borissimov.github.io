import { supabase, getActiveSchema } from '../../../supabaseClient';

/**
 * DATABASE SERVICE (V3 Repository)
 * Centralized schema-aware queries to prevent logic duplication.
 */

const getClient = () => {
    const schema = getActiveSchema();
    return supabase.schema(schema);
};

export const DB = {
    // --- PROGRAMS ---
    async fetchPrograms(showArchived = false) {
        let query = getClient().from('programs').select('*');
        if (!showArchived) query = query.is('archived_at', null);
        return await query.order('created_at', { ascending: false });
    },

    async upsertProgram(payload) {
        return await getClient().from('programs').upsert([payload]).select().single();
    },

    async setProgramArchivedStatus(programId, timestamp) {
        return await getClient().from('programs').update({ archived_at: timestamp }).eq('id', programId);
    },

    // --- PROGRAM STRUCTURE (Hydration) ---
    async fetchProgramDays(programId) {
        return await getClient()
            .from('program_days')
            .select('*')
            .eq('program_id', programId)
            .order('sequence_number');
    },

    async fetchDeepProgram(programId) {
        return await getClient()
            .from('program_days')
            .select(`
                id, label, sequence_number,
                sessions (
                    id, name,
                    blocks (
                        id, label, block_type, sort_order,
                        block_items (
                            id, exercise_library_id, target_sets, target_reps, target_weight, target_rpe, tempo, set_targets, metric_type, sort_order,
                            exercise_library ( name, technique_cues )
                        )
                    )
                )
            `)
            .eq('program_id', programId)
            .order('sequence_number');
    },

    // --- SESSIONS & BLOCKS ---
    async fetchSessions() {
        return await getClient().from('sessions').select('id, program_day_id');
    },

    async fetchBlocks() {
        return await getClient().from('blocks').select('id, session_id, label, block_type, sort_order');
    },

    async fetchBlockItems() {
        return await getClient().from('block_items').select('id, session_block_id, target_sets, target_reps, target_weight, target_rpe, tempo, metric_type, sort_order, exercise_library(name, technique_cues)');
    },

    // --- HISTORY ---
    async fetchGlobalHistory(userId) {
        return await getClient()
            .from('completed_sessions')
            .select('*, program_days(label), performance_logs(weight, reps, rpe)') 
            .eq('user_id', userId)
            .order('end_time', { ascending: false });
    },

    async fetchSessionDetails(sessionId, fkConstraint) {
        return await getClient()
            .from('performance_logs')
            .select(`*, 
                block_items!${fkConstraint} ( target_weight, target_reps, target_rpe, tempo, sort_order, exercise_library ( name ) ),
                exercise_library ( name )
            `)
            .eq('completed_session_id', sessionId)
            .order('created_at', { ascending: true });
    },

    async insertCompletedSession(payload) {
        return await getClient().from('completed_sessions').insert([payload]).select().single();
    },

    async insertPerformanceLogs(logs) {
        return await getClient().from('performance_logs').insert(logs);
    },

    async deleteSessionRecord(sessionId) {
        return await getClient().from('completed_sessions').delete().eq('id', sessionId);
    },

    // --- SLEEP & RECOVERY ---
    async fetchSleepHistory(userId) {
        return await getClient()
            .from('sleep_logs')
            .select('*')
            .eq('user_id', userId)
            .order('start_time', { ascending: false });
    },

    async insertSleepLog(payload) {
        return await getClient().from('sleep_logs').insert([payload]).select().single();
    },

    async deleteSleepLog(logId) {
        return await getClient().from('sleep_logs').delete().eq('id', logId);
    },

    async updateSleepLog(logId, payload) {
        return await getClient().from('sleep_logs').update(payload).eq('id', logId);
    },

    // --- LIBRARY ---
    async fetchExerciseLibrary() {
        return await getClient().from('exercise_library').select('id, name').order('name', { ascending: true });
    }
};
