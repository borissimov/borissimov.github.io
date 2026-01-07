import { supabase } from '../supabaseClient';
import { fullPlanData, DAYS_MAP } from './fullPlanData';

export const DataModule = (function() {
    
    // --- HELPERS ---
    function transformRoutineToState(routineDays) {
        const state = {};
        Object.keys(DAYS_MAP).forEach(k => {
            state[k] = {
                training: { title: "Rest Day", rest: 0, instructions: "", exercises: [], type: "list" },
                nutrition: fullPlanData[k].nutrition, // Temp fallback until DB nutrition migration
                supplements: fullPlanData[k].supplements
            };
        });

        const keyMap = ['pon', 'vto', 'sry', 'che', 'pet', 'sab', 'ned'];
        routineDays.forEach(day => {
            const k = keyMap[day.day_number - 1];
            if (k) {
                state[k].training = {
                    title: day.title,
                    rest: day.day_type === 'Resistance' ? 60 : 0,
                    instructions: day.instructions,
                    exercises: day.exercises || [],
                    type: "list"
                };
            }
        });
        return state;
    }

    // --- FORKING LOGIC ---
    async function forkSystemRoutine(userId, systemRoutineId) {
        // 1. Fetch System Routine Details
        const { data: sysRoutine } = await supabase.from('routines').select('*').eq('id', systemRoutineId).single();
        if (!sysRoutine) return null;

        // 2. Create User Copy
        const { data: newRoutine, error: rError } = await supabase
            .from('routines')
            .insert({
                name: sysRoutine.name + ' (Custom)',
                description: sysRoutine.description,
                cycle_length: sysRoutine.cycle_length,
                is_system_default: false,
                owner_user_id: userId
            })
            .select()
            .single();

        if (rError) { console.error(rError); return null; }

        // 3. Copy All Days
        const { data: sysDays } = await supabase.from('routine_days').select('*').eq('routine_id', systemRoutineId);
        
        const newDays = sysDays.map(day => ({
            routine_id: newRoutine.id,
            day_number: day.day_number,
            day_type: day.day_type,
            title: day.title,
            instructions: day.instructions,
            exercises: day.exercises
        }));

        await supabase.from('routine_days').insert(newDays);

        // 4. Switch User to New Routine
        await supabase
            .from('user_routine_status')
            .upsert({ user_id: userId, active_routine_id: newRoutine.id, updated_at: new Date() });

        return newRoutine.id;
    }

    // --- CORE SYNC ---
    async function getActiveRoutineId(userId) {
        let { data: status } = await supabase.from('user_routine_status').select('active_routine_id').eq('user_id', userId).single();
        if (status?.active_routine_id) return status.active_routine_id;
        
        // If none, assign default
        const { data: def } = await supabase.from('routines').select('id').eq('is_system_default', true).limit(1).single();
        if (def) {
            await supabase.from('user_routine_status').upsert({ user_id: userId, active_routine_id: def.id, cycle_start_date: new Date().toISOString() });
            return def.id;
        }
        return null;
    }

    async function fetchActiveRoutine(userId) {
        if (!userId) return fullPlanData; // Offline fallback

        const routineId = await getActiveRoutineId(userId);
        if (!routineId) return fullPlanData;

        const { data: days } = await supabase.from('routine_days').select('*').eq('routine_id', routineId).order('day_number');
        return days ? transformRoutineToState(days) : fullPlanData;
    }

    // --- SAVE LOGIC (Copy-on-Write) ---
    async function saveTrainingUpdate(userId, dayKey, newData) {
        if (!userId) return; // TODO: LocalStorage fallback logic here

        let routineId = await getActiveRoutineId(userId);
        
        // Check if System Default
        const { data: routine } = await supabase.from('routines').select('is_system_default').eq('id', routineId).single();
        
        if (routine?.is_system_default) {
            // FORK IT!
            routineId = await forkSystemRoutine(userId, routineId);
        }

        // Now update the specific day in the User's Routine
        const dayMap = { 'pon': 1, 'vto': 2, 'sry': 3, 'che': 4, 'pet': 5, 'sab': 6, 'ned': 7 };
        const dayNum = dayMap[dayKey];

        await supabase.from('routine_days')
            .update({ 
                exercises: newData.exercises,
                instructions: newData.instructions 
            })
            .eq('routine_id', routineId)
            .eq('day_number', dayNum);
            
        return await fetchActiveRoutine(userId); // Return refreshed state
    }

    // --- REVERT LOGIC ---
    async function revertToDefault(userId) {
        if (!userId) return;
        const { data: def } = await supabase.from('routines').select('id').eq('is_system_default', true).limit(1).single();
        if (def) {
            await supabase.from('user_routine_status').update({ active_routine_id: def.id }).eq('user_id', userId);
            return await fetchActiveRoutine(userId);
        }
    }

    // --- LOG SYNCING LOGIC ---
    async function syncLogsForDay(userId, dayKey, exercises) {
        if (!userId) return JSON.parse(localStorage.getItem(`training_logs_${dayKey}`) || '{}');

        // 1. Fetch Cloud Logs for this day
        const { data: cloudLogs } = await supabase
            .from('workout_logs')
            .select('*')
            .eq('user_id', userId)
            .eq('day_key', dayKey)
            .order('logged_at', { ascending: true });

        if (!cloudLogs) return JSON.parse(localStorage.getItem(`training_logs_${dayKey}`) || '{}');

        // 2. Map Cloud Logs to Exercise Indices
        // We match by exercise name to be robust against routine changes
        const mappedLogs = {};
        
        cloudLogs.forEach(log => {
            // Find index of exercise with matching name (loose match)
            // Note: If user edited exercise name, this might break. 
            // Better: 'exercises' passed here is the current routine state.
            const idx = exercises.findIndex(ex => ex.exercise.trim() === log.exercise_name.trim());
            
            if (idx !== -1) {
                if (!mappedLogs[idx]) mappedLogs[idx] = [];
                mappedLogs[idx].push({
                    weight: log.weight,
                    reps: log.reps,
                    rpe: log.rpe,
                    tempo: log.tempo,
                    timestamp: log.logged_at
                });
            }
        });

        // 3. Update Local Storage Cache
        localStorage.setItem(`training_logs_${dayKey}`, JSON.stringify(mappedLogs));
        return mappedLogs;
    }

    return {
        getDaysMap: () => DAYS_MAP,
        getDefaultPlan: () => fullPlanData,
        
        loadPlan: fetchActiveRoutine,
        syncLogsForDay, // New Method Exposed
        
        updateSection: async (userId, dayKey, section, data) => {
            if (section === 'training') {
                return await saveTrainingUpdate(userId, dayKey, data);
            }
            return null;
        },

        revertToDefault,

        // Logs (Local Getters)
        getTrainingLogs: (dk) => JSON.parse(localStorage.getItem(`training_logs_${dk}`) || '{}'),
        saveTrainingLogs: (dk, l) => localStorage.setItem(`training_logs_${dk}`, JSON.stringify(l)),
        getTrainingState: (dk) => JSON.parse(localStorage.getItem(`training_state_${dk}`) || '[]'),
        saveTrainingState: (dk, s) => localStorage.setItem(`training_state_${dk}`, JSON.stringify(s)),
        getCheckboxState: (id) => (JSON.parse(localStorage.getItem('nutrition_plan_checkboxes') || '{}'))[id] || false,
        saveCheckboxState: (id, ch) => { const s = JSON.parse(localStorage.getItem('nutrition_plan_checkboxes') || '{}'); s[id] = ch; localStorage.setItem('nutrition_plan_checkboxes', JSON.stringify(s)); },
        resetCheckboxes: (dk, t) => { if (t === 'training') localStorage.removeItem(`training_state_${dk}`); else { const s = JSON.parse(localStorage.getItem('nutrition_plan_checkboxes') || '{}'); const p = `${dk}-${t.slice(0, 4)}`; Object.keys(s).forEach(k => { if (k.startsWith(p)) delete s[k]; }); localStorage.setItem('nutrition_plan_checkboxes', JSON.stringify(s)); } },
        
        addLog: async (userId, entry) => {
            if (userId) await supabase.from('workout_logs').insert({
                user_id: userId,
                exercise_name: entry.exercise,
                weight: entry.weight,
                reps: parseInt(entry.reps, 10),
                rpe: entry.rpe ? parseFloat(entry.rpe) : null,
                tempo: entry.tempo,
                day_key: entry.dayKey,
                logged_at: entry.timestamp
            });
        }
    };
})();