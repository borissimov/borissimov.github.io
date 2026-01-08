import { supabase } from '../supabaseClient';
import { fullPlanData, DAYS_MAP } from './fullPlanData';

export const DataModule = (function() {
    
    // ... (Helpers remain same) ...
    const cleanHtml = (str) => {
        if (!str) return "";
        return str.replace(/<ul[^>]*>/g, '').replace(/<\/ul>/g, '').replace(/<li>/g, '').replace(/<\/li>/g, '\n').replace(/\n\n+/g, '\n').trim();
    };

    function transformRoutineToState(routineDays) {
        const state = {};
        const keys = Object.keys(DAYS_MAP);
        
        keys.forEach(k => {
            const freshData = fullPlanData[k];
            state[k] = {
                training: { 
                    title: cleanHtml(freshData.training.title), 
                    rest: freshData.training.rest, 
                    instructions: cleanHtml(freshData.training.instructions), 
                    exercises: [],
                    type: "list" 
                },
                nutrition: JSON.parse(JSON.stringify(freshData.nutrition)),
                supplements: JSON.parse(JSON.stringify(freshData.supplements))
            };
        });

        const keyMap = ['pon', 'vto', 'sry', 'che', 'pet', 'sab', 'ned'];
        
        if (routineDays && routineDays.length > 0) {
            routineDays.forEach(day => {
                const k = keyMap[day.day_number - 1];
                if (k && state[k]) {
                    state[k].training.title = day.title;
                    state[k].training.instructions = cleanHtml(day.instructions);
                    state[k].training.exercises = (day.exercises || []).map(ex => ({
                        ...ex,
                        focus: cleanHtml(ex.focus),
                        type: ex.type || 'Resistance' 
                    }));
                }
            });
        }
        return state;
    }

    // ... (Fork/Active Routine logic same) ...
    async function forkSystemRoutine(userId, systemRoutineId) {
        const { data: sysRoutine } = await supabase.from('routines').select('*').eq('id', systemRoutineId).single();
        if (!sysRoutine) return null;
        const { data: newRoutine, error: rError } = await supabase.from('routines').insert({ name: sysRoutine.name + ' (Custom)', description: sysRoutine.description, cycle_length: sysRoutine.cycle_length, is_system_default: false, owner_user_id: userId }).select().single();
        if (rError) return null;
        const { data: sysDays } = await supabase.from('routine_days').select('*').eq('routine_id', systemRoutineId);
        const newDays = sysDays.map(day => ({ routine_id: newRoutine.id, day_number: day.day_number, day_type: day.day_type, title: day.title, instructions: day.instructions, exercises: day.exercises }));
        await supabase.from('routine_days').insert(newDays);
        await supabase.from('user_routine_status').upsert({ user_id: userId, active_routine_id: newRoutine.id, updated_at: new Date() });
        return newRoutine.id;
    }

    async function getActiveRoutineId(userId) {
        let { data: status } = await supabase.from('user_routine_status').select('active_routine_id').eq('user_id', userId).single();
        if (status?.active_routine_id) return status.active_routine_id;
        const { data: def } = await supabase.from('routines').select('id').eq('is_system_default', true).limit(1).single();
        if (def) { await supabase.from('user_routine_status').upsert({ user_id: userId, active_routine_id: def.id, cycle_start_date: new Date().toISOString() }); return def.id; }
        return null;
    }

    async function fetchActiveRoutine(userId) {
        if (!userId) return transformRoutineToState([]);
        const routineId = await getActiveRoutineId(userId);
        if (!routineId) return transformRoutineToState([]);
        const { data: days } = await supabase.from('routine_days').select('*').eq('routine_id', routineId).order('day_number');
        return (days && days.length > 0) ? transformRoutineToState(days) : transformRoutineToState([]);
    }

    async function saveTrainingUpdate(userId, dayKey, newData) {
        if (!userId) return; 
        let routineId = await getActiveRoutineId(userId);
        const { data: routine } = await supabase.from('routines').select('is_system_default').eq('id', routineId).single();
        if (routine?.is_system_default) routineId = await forkSystemRoutine(userId, routineId);
        const dayMap = { 'pon': 1, 'vto': 2, 'sry': 3, 'che': 4, 'pet': 5, 'sab': 6, 'ned': 7 };
        const dayNum = dayMap[dayKey];
        await supabase.from('routine_days').update({ exercises: newData.exercises, instructions: newData.instructions }).eq('routine_id', routineId).eq('day_number', dayNum);
        return await fetchActiveRoutine(userId);
    }

    async function revertToDefault(userId) {
        if (!userId) return;
        const { data: def } = await supabase.from('routines').select('id').eq('is_system_default', true).limit(1).single();
        if (def) { await supabase.from('user_routine_status').update({ active_routine_id: def.id }).eq('user_id', userId); return await fetchActiveRoutine(userId); }
    }

    // --- DEBUGGING SYNC LOGS ---
    async function syncLogsForDay(userId, dayKey, exercises, targetDate) {
        if (!userId) return JSON.parse(localStorage.getItem(`training_logs_${dayKey}`) || '{}');
        
        const englishDays = { pon: 'Monday', vto: 'Tuesday', sry: 'Wednesday', che: 'Thursday', pet: 'Friday', sab: 'Saturday', ned: 'Sunday' };
        const legacyKey = englishDays[dayKey] || dayKey;

        // DEBUG: Relaxed Query - Check ONLY Date and User first
        let query = supabase
            .from('workout_logs')
            .select('*')
            .eq('user_id', userId)
            .order('logged_at', { ascending: true });

        if (targetDate) {
            // Strict date filter for debugging
            query = query.eq('scheduled_for', targetDate);
        } else {
            // Fallback for legacy if no date
             query = query.or(`day_key.eq.${dayKey},day_key.eq.${legacyKey}`);
        }

        const { data: cloudLogs, error } = await query;

        if (error) { console.error("Sync Error:", error); return {}; }
        
        console.log(`[Sync] Found ${cloudLogs?.length} logs from DB.`);

        if (!cloudLogs || cloudLogs.length === 0) return {};

        const mappedLogs = {};
        cloudLogs.forEach(log => {
            const logName = log.exercise_name.toLowerCase().replace(/[^a-z0-9]/g, ''); 
            const idx = exercises.findIndex(ex => {
                const planName = ex.exercise.toLowerCase().replace(/[^a-z0-9]/g, '');
                return planName === logName || planName.includes(logName) || logName.includes(planName);
            });
            
            if (idx !== -1) {
                if (!mappedLogs[idx]) mappedLogs[idx] = [];
                mappedLogs[idx].push({
                    id: log.id, 
                    weight: log.weight,
                    reps: log.reps,
                    rpe: log.rpe,
                    tempo: log.tempo,
                    timestamp: log.logged_at
                });
            } else {
                console.warn(`[Sync] Unmatched log: ${log.exercise_name}`);
            }
        });
        
        localStorage.setItem(`training_logs_${dayKey}`, JSON.stringify(mappedLogs));
        return mappedLogs;
    }

    async function createCloudLog(userId, entry) {
        if (!userId) return null;
        console.log(`[Log] Saving for ${entry.scheduledDate}`);
        const { data, error } = await supabase.from('workout_logs').insert({
            user_id: userId,
            exercise_name: entry.exercise,
            weight: entry.weight,
            reps: parseInt(entry.reps, 10),
            rpe: entry.rpe ? parseFloat(entry.rpe) : null,
            tempo: entry.tempo,
            day_key: entry.dayKey,
            logged_at: entry.timestamp,
            scheduled_for: entry.scheduledDate
        }).select();
        if (error) { console.error("Log Error:", error); return null; }
        return data ? data[0] : null;
    }

    async function deleteCloudLog(logId) {
        if (!logId) return;
        const { error } = await supabase.from('workout_logs').delete().eq('id', logId);
        if (error) console.error("Delete Error:", error);
    }

    return {
        getDaysMap: () => DAYS_MAP,
        getDefaultPlan: () => fullPlanData,
        loadPlan: fetchActiveRoutine,
        syncLogsForDay,
        updateSection: async (userId, dayKey, section, data) => { if (section === 'training') return await saveTrainingUpdate(userId, dayKey, data); return null; },
        revertToDefault,
        getTrainingLogs: (dk) => JSON.parse(localStorage.getItem(`training_logs_${dk}`) || '{}'),
        saveTrainingLogs: (dk, l) => localStorage.setItem(`training_logs_${dk}`, JSON.stringify(l)),
        getTrainingState: (dk) => JSON.parse(localStorage.getItem(`training_state_${dk}`) || '[]'),
        saveTrainingState: (dk, s) => localStorage.setItem(`training_state_${dk}`, JSON.stringify(s)),
        getCheckboxState: (id) => (JSON.parse(localStorage.getItem('nutrition_plan_checkboxes') || '{}'))[id] || false,
        saveCheckboxState: (id, ch) => { const s = JSON.parse(localStorage.getItem('nutrition_plan_checkboxes') || '{}'); s[id] = ch; localStorage.setItem('nutrition_plan_checkboxes', JSON.stringify(s)); },
        resetCheckboxes: (dk, t) => { if (t === 'training') localStorage.removeItem(`training_state_${dk}`); else { const s = JSON.parse(localStorage.getItem('nutrition_plan_checkboxes') || '{}'); const p = `${dk}-${t.slice(0, 4)}`; Object.keys(s).forEach(k => { if (k.startsWith(p)) delete s[k]; }); localStorage.setItem('nutrition_plan_checkboxes', JSON.stringify(s)); } },
        addLog: createCloudLog,
        deleteLog: deleteCloudLog,
        cleanHtml,
        searchExercises: async (query) => {
            if (!query || query.length < 2) return [];
            const { data, error } = await supabase.from('exercise_library').select('*').ilike('name', `%${query}%`).limit(5);
            if (error) { console.error("Search Error:", error); return []; }
            return data || [];
        }
    };
})();
