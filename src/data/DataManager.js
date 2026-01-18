import { supabase } from '../supabaseClient';
import { fullPlanData, DAYS_MAP } from './fullPlanData';

export const DataManager = (function() {
    
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

        const keyMap = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        
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

    async function getActiveRoutineStatus(userId, targetDateStr = new Date().toISOString().split('T')[0]) {
        const { data } = await supabase
            .from('user_routine_status')
            .select('active_routine_id, cycle_start_date')
            .eq('user_id', userId)
            .lte('cycle_start_date', targetDateStr)
            .or(`cycle_end_date.gte.${targetDateStr},cycle_end_date.is.null`)
            .order('id', { ascending: false })
            .limit(1)
            .maybeSingle();
            
        if (data) return data;

        const { data: def } = await supabase.from('routines').select('id').eq('is_system_default', true).limit(1).single();
        if (def) {
            return { active_routine_id: def.id, cycle_start_date: new Date().toISOString() };
        }
        return null;
    }

    async function getActiveRoutineId(userId) {
        const status = await getActiveRoutineStatus(userId);
        return status?.active_routine_id;
    }

    const activeRoutineRequestCache = {};

    async function fetchRawActiveRoutine(userId, startDate, endDate) {
        // Throttle Key
        const key = `${userId}-${startDate}-${endDate}`;
        const now = Date.now();
        
        if (activeRoutineRequestCache[key] && (now - activeRoutineRequestCache[key].timestamp < 2000)) {
            console.log("[DataModule] Throttling frequent request:", key);
            return activeRoutineRequestCache[key].promise;
        }

        console.log("Loading Raw Plan for:", userId);
        if (!userId) return null;
        
        const fetchPromise = (async () => {
            const targetDate = startDate || new Date().toISOString().split('T')[0];
            const status = await getActiveRoutineStatus(userId, targetDate);
            
            if (!status?.active_routine_id) return null;

            // --- CACHING STRATEGY ---
            const cacheKey = `cached_routine_v2_${status.active_routine_id}`;
            const cached = localStorage.getItem(cacheKey);
            
            let routineData;
            
            if (cached) {
                console.log("[DataModule] Using cached routine structure.");
                routineData = JSON.parse(cached);
            } else {
                console.log("[DataModule] Fetching full routine from DB...");
                // Get routine metadata + days (Optimized Select)
                const { data: routine } = await supabase.from('routines').select('id, name, description, cycle_length, is_system_default').eq('id', status.active_routine_id).single();
                const { data: days } = await supabase.from('routine_days').select('id, day_number, day_type, title, instructions, exercises').eq('routine_id', status.active_routine_id).order('day_number');
                
                routineData = { ...routine, days: days || [] };
                
                if (routine && days) {
                    localStorage.setItem(cacheKey, JSON.stringify(routineData));
                }
            }
            
            // Get modifications (Optimized Select)
            let modifications = [];
            if (startDate && endDate) {
                const { data: mods } = await supabase
                    .from('daily_plan_modifications')
                    .select('date, modified_data')
                    .eq('user_id', userId)
                    .gte('date', startDate)
                    .lte('date', endDate);
                modifications = mods || [];
            }

            return {
                ...routineData,
                startDate: status.cycle_start_date,
                modifications: modifications 
            };
        })();

        activeRoutineRequestCache[key] = {
            timestamp: now,
            promise: fetchPromise
        };

        return fetchPromise;
    }

    async function saveDailyModification(userId, date, data) {
        if (!userId || !date) return;
        const { data: saved, error } = await supabase
            .from('daily_plan_modifications')
            .upsert({ user_id: userId, date: date, modified_data: data, updated_at: new Date() })
            .select('id, date')
            .single();
        return saved;
    }

    async function fetchActiveRoutine(userId) {
        // LEGACY SUPPORT
        if (!userId) return transformRoutineToState([]);
        const routineId = await getActiveRoutineId(userId);
        if (!routineId) return transformRoutineToState([]);
        const { data: days } = await supabase.from('routine_days').select('day_number, day_type, title, instructions, exercises').eq('routine_id', routineId).order('day_number');
        return (days && days.length > 0) ? transformRoutineToState(days) : transformRoutineToState([]);
    }

    async function saveTrainingUpdate(userId, dayNumber, newData) {
        console.log(`[DataModule] Saving update for Day ${dayNumber}...`);
        if (!userId) return; 
        let routineId = await getActiveRoutineId(userId);
        const { data: routine } = await supabase.from('routines').select('is_system_default').eq('id', routineId).single();
        if (routine?.is_system_default) {
            routineId = await forkSystemRoutine(userId, routineId);
        }
        
        const { error } = await supabase.from('routine_days')
            .update({ exercises: newData.exercises, instructions: newData.instructions })
            .eq('routine_id', routineId)
            .eq('day_number', dayNumber);

        return await fetchRawActiveRoutine(userId);
    }

    async function revertToDefault(userId) {
        if (!userId) return;
        const { data: def } = await supabase.from('routines').select('id').eq('is_system_default', true).limit(1).single();
        if (def) { await supabase.from('user_routine_status').update({ active_routine_id: def.id }).eq('user_id', userId); return await fetchActiveRoutine(userId); }
    }

    // --- DEBUGGING SYNC LOGS ---
    async function syncLogsForDay(userId, dayKey, exercises, targetDate) {
        if (!userId) return JSON.parse(localStorage.getItem(`training_logs_${dayKey}`) || '{}');
        
        // If no target date, avoid fetching potentially huge history. Return empty or local.
        if (!targetDate) {
            console.warn("[Sync] Skipping log sync: No target date provided.");
            return JSON.parse(localStorage.getItem(`training_logs_${dayKey}`) || '{}');
        }

        const englishDays = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
        
        // Optimized Query: Specific columns + Strict Date Filtering
        const { data: cloudLogs, error } = await supabase
            .from('workout_logs')
            .select('id, exercise_name, weight, reps, rpe, tempo, intensity, duration_minutes, logged_at, scheduled_for, day_key')
            .eq('user_id', userId)
            .eq('scheduled_for', targetDate)
            .order('logged_at', { ascending: true });

        if (error) { console.error("Sync Error:", error); return {}; }
        
        console.log(`[Sync] Found ${cloudLogs?.length} logs from DB for ${targetDate}.`);

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
                    intensity: log.intensity, // NEW
                    duration_minutes: log.duration_minutes,
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
            intensity: entry.intensity ? parseFloat(entry.intensity) : null, // NEW
            tempo: entry.tempo,
            duration_minutes: entry.duration ? parseFloat(entry.duration) : null, // NEW
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

    async function savePushSubscription(userId, subscription) {
        if (!userId || !subscription) return;
        
        // Check if exists for this user and endpoint to avoid duplicates
        const { data: existing } = await supabase
            .from('push_subscriptions')
            .select('id')
            .eq('user_id', userId)
            .eq('subscription->>endpoint', subscription.endpoint)
            .single();

        if (existing) {
            // Update last used
            await supabase
                .from('push_subscriptions')
                .update({ last_used_at: new Date() })
                .eq('id', existing.id);
        } else {
            // Insert new
            const { error } = await supabase.from('push_subscriptions').insert({
                user_id: userId,
                subscription: subscription,
                user_agent: navigator.userAgent
            });
            if (error) console.error("Push Sub Error:", error);
        }
    }

    async function listRoutines(userId) {
        if (!userId) return [];
        const { data, error } = await supabase
            .from('routines')
            .select('id, name, description, cycle_length, is_system_default')
            .or(`is_system_default.eq.true,owner_user_id.eq.${userId}`)
            .order('is_system_default', { ascending: false });
        return data || [];
    }

    async function createRoutine(userId, name, description = "") {
        const { data, error } = await supabase
            .from('routines')
            .insert({ 
                name, 
                description, 
                owner_user_id: userId, 
                is_system_default: false,
                cycle_length: 7 // Default length
            })
            .select().single();
        return data;
    }

    async function deleteRoutine(routineId) {
        // Only allow if not system default
        await supabase.from('routines').delete().eq('id', routineId).eq('is_system_default', false);
    }

    async function getRoutineDetails(routineId) {
        const { data: routine } = await supabase.from('routines').select('id, name, description, cycle_length, is_system_default').eq('id', routineId).single();
        if (!routine) return null;
        
        const { data: days } = await supabase
            .from('routine_days')
            .select('day_number, day_type, title, instructions, exercises')
            .eq('routine_id', routineId)
            .order('day_number', { ascending: true });
            
        return { ...routine, days: days || [] };
    }

    async function updateRoutineStructure(routineId, days) {
        // 1. Update cycle length in parent
        await supabase.from('routines').update({ cycle_length: days.length }).eq('id', routineId);

        // 2. Upsert days (re-indexing day_number to ensure 1, 2, 3... sequence)
        const upserts = days.map((d, index) => ({
            ...d,
            day_number: index + 1, // Force sequential numbering
            routine_id: routineId
        }));

        // We delete existing and re-insert to handle removals cleanly, 
        // or we can strictly upsert if we track IDs. 
        // Safer strategy for now: Delete all days for routine, Insert new.
        // NOTE: In production, this might lose day-specific logs if logs linked to routine_day_id. 
        // But our logs link to 'exercise_name', so it's safe to replace the template.
        
        await supabase.from('routine_days').delete().eq('routine_id', routineId);
        const { error } = await supabase.from('routine_days').insert(upserts);
        if (error) console.error("Structure Update Error:", error);
    }

    async function activateRoutine(userId, routineId, startDate, endDate) {
        await supabase.from('user_routine_status').insert({
            user_id: userId,
            active_routine_id: routineId,
            cycle_start_date: startDate || new Date().toISOString(),
            cycle_end_date: endDate || null,
            updated_at: new Date()
        });
    }

    async function saveChecklistLog(userId, itemId, completed, scheduledDate, dayKey, metaData = {}) {
        if (!userId) {
            // Fallback to local only
            const s = JSON.parse(localStorage.getItem('nutrition_plan_checkboxes') || '{}');
            s[itemId] = completed;
            localStorage.setItem('nutrition_plan_checkboxes', JSON.stringify(s));
            return;
        }

        // Optimistic Local Update
        const s = JSON.parse(localStorage.getItem('nutrition_plan_checkboxes') || '{}');
        s[itemId] = completed;
        localStorage.setItem('nutrition_plan_checkboxes', JSON.stringify(s));

        // DB Update
        const { error } = await supabase.from('daily_checklist_logs').upsert({
            user_id: userId,
            item_id: itemId,
            day_key: dayKey,
            completed: completed,
            scheduled_for: scheduledDate,
            meta_data: metaData, // NEW: Store exact details
            updated_at: new Date()
        }, { onConflict: 'user_id, item_id, scheduled_for' });

        if (error) console.error("Checklist Save Error:", error);
    }

    async function syncChecklistLogs(userId, weekDatesMap) {
        if (!userId || !weekDatesMap) return {};
        
        // Get range
        const dates = Object.values(weekDatesMap).map(d => d.fullDate);
        if (dates.length === 0) return {};
        const minDate = dates.reduce((a, b) => a < b ? a : b);
        const maxDate = dates.reduce((a, b) => a > b ? a : b);

        const { data, error } = await supabase
            .from('daily_checklist_logs')
            .select('item_id, completed, scheduled_for, meta_data')
            .eq('user_id', userId)
            .gte('scheduled_for', minDate)
            .lte('scheduled_for', maxDate);

        if (error) { console.error("Checklist Sync Error:", error); return {}; }
        
        const state = {};
        data.forEach(row => {
            if (row.completed) {
                // Return keys as "YYYY-MM-DD_itemId"
                state[`${row.scheduled_for}_${row.item_id}`] = true;
            }
        });

        return state;
    }

    async function saveExerciseStatus(userId, date, dayKey, exerciseIndex, isCompleted) {
        if (!userId || !date) return;
        
        const { error } = await supabase.from('daily_exercise_status').upsert({
            user_id: userId,
            date: date,
            day_key: dayKey,
            exercise_index: exerciseIndex,
            is_completed: isCompleted,
            updated_at: new Date()
        }, { onConflict: 'user_id, date, exercise_index' });
        
        if (error) console.error("Ex Status Save Error:", error);
    }

    async function syncExerciseStatus(userId, date) {
        if (!userId || !date) return [];
        const { data, error } = await supabase.from('daily_exercise_status')
            .select('exercise_index')
            .eq('user_id', userId)
            .eq('date', date)
            .eq('is_completed', true);
            
        if (error) { console.error("Ex Status Sync Error:", error); return []; }
        return data.map(d => d.exercise_index);
    }

    async function updateActiveTimer(userId, timerId, endTime) {
        if (!userId) return;
        await supabase.from('active_timers').upsert({
            user_id: userId,
            timer_id: timerId,
            end_time: new Date(endTime).toISOString(),
            status: 'running',
            updated_at: new Date()
        });
    }

    async function getProfile(userId) {
        if (!userId) return null;
        const { data, error } = await supabase
            .from('profiles')
            .select('full_name, age, weight, theme_preference, navigation_mode')
            .eq('id', userId)
            .single();
        if (error && error.code !== 'PGRST116') console.error("Get Profile Error:", error);
        return data || { full_name: '', age: '', weight: '', theme_preference: 'default', navigation_mode: 'week' };
    }

    async function saveProfile(userId, profileData) {
        if (!userId) return null;
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                ...profileData,
                updated_at: new Date()
            })
            .select('id')
            .single();
        if (error) console.error("Save Profile Error:", error);
        return data;
    }

    async function fetchModifications(userId, startDate, endDate) {
        if (!userId || !startDate || !endDate) return [];
        const { data, error } = await supabase
            .from('daily_plan_modifications')
            .select('date, modified_data')
            .eq('user_id', userId)
            .gte('date', startDate)
            .lte('date', endDate);
        
        if (error) console.error("Fetch Mods Error:", error);
        return data || [];
    }

    async function fetchRoutineHistory(userId) {
        if (!userId) return [];
        const { data, error } = await supabase
            .from('user_routine_status')
            .select(`
                id,
                cycle_start_date,
                cycle_end_date,
                routines ( name, cycle_length )
            `)
            .eq('user_id', userId)
            .order('cycle_start_date', { ascending: true });
        if (error) console.error("History Fetch Error:", error);
        return data || [];
    }

    async function resolveRoutineConflict(userId, action, newAssignment, conflicts) {
        if (!userId) return;

        const { routineId, start, end } = newAssignment;

        if (action === 'DELETE_EXISTING') {
            const idsToDelete = conflicts.map(c => c.id);
            await supabase.from('user_routine_status').delete().in('id', idsToDelete);
        } 
        else if (action === 'OVERWRITE_OVERLAP') {
            for (const conflict of conflicts) {
                const cStart = conflict.cycle_start_date;
                const cEnd = conflict.cycle_end_date;

                if (!cEnd) {
                    // Open ended routine - just move start to after new end
                    const nextDay = new Date(new Date(end).getTime() + 86400000).toISOString().split('T')[0];
                    await supabase.from('user_routine_status').update({ cycle_start_date: nextDay }).eq('id', conflict.id);
                } else if (start <= cStart && end >= cEnd) {
                    // Fully covered - delete
                    await supabase.from('user_routine_status').delete().eq('id', conflict.id);
                } else if (start > cStart && end < cEnd) {
                    // New is in middle - Split into two (or just truncate for now)
                    await supabase.from('user_routine_status').update({ cycle_end_date: new Date(new Date(start).getTime() - 86400000).toISOString().split('T')[0] }).eq('id', conflict.id);
                } else if (end >= cStart && end < cEnd) {
                    // Overlap at start of legacy
                    const nextDay = new Date(new Date(end).getTime() + 86400000).toISOString().split('T')[0];
                    await supabase.from('user_routine_status').update({ cycle_start_date: nextDay }).eq('id', conflict.id);
                } else if (start > cStart && start <= cEnd) {
                    // Overlap at end of legacy
                    const prevDay = new Date(new Date(start).getTime() - 86400000).toISOString().split('T')[0];
                    await supabase.from('user_routine_status').update({ cycle_end_date: prevDay }).eq('id', conflict.id);
                }
            }
        }
        else if (action === 'PUSH_EXISTING') {
            // Move all conflicting routines forward
            for (const conflict of conflicts) {
                const durationMs = conflict.cycle_end_date ? (new Date(conflict.cycle_end_date) - new Date(conflict.cycle_start_date)) : 0;
                const newStart = new Date(new Date(end).getTime() + 86400000);
                const newEnd = conflict.cycle_end_date ? new Date(newStart.getTime() + durationMs) : null;
                
                await supabase.from('user_routine_status').update({
                    cycle_start_date: newStart.toISOString().split('T')[0],
                    cycle_end_date: newEnd ? newEnd.toISOString().split('T')[0] : null
                }).eq('id', conflict.id);
            }
        }

        // Final Step: Insert the new one
        await activateRoutine(userId, routineId, start, end);
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
        saveCheckboxState: saveChecklistLog, // Updated to use new function
        syncChecklistLogs, // Exported
        updateActiveTimer, // Exported
        getProfile, // Exported
        saveProfile, // Exported
        saveDailyModification, // Exported
        fetchModifications, // Exported
        fetchRoutineHistory, // Exported
        resolveRoutineConflict, // Exported
        resetCheckboxes: (dk, t) => { if (t === 'training') localStorage.removeItem(`training_state_${dk}`); else { const s = JSON.parse(localStorage.getItem('nutrition_plan_checkboxes') || '{}'); const p = `${dk}-${t.slice(0, 4)}`; Object.keys(s).forEach(k => { if (k.startsWith(p)) delete s[k]; }); localStorage.setItem('nutrition_plan_checkboxes', JSON.stringify(s)); } },
        addLog: createCloudLog,
        deleteLog: deleteCloudLog,
        cleanHtml,
        searchExercises: async (query) => {
            if (!query || query.length < 2) return [];
            const { data, error } = await supabase.from('exercise_library').select('*').ilike('name', `%${query}%`).limit(5);
            if (error) { console.error("Search Error:", error); return []; }
            return data || [];
        },
        savePushSubscription,
        listRoutines,
        createRoutine,
        deleteRoutine,
        activateRoutine,
        getActiveRoutineId,
        getRoutineDetails,
        updateRoutineStructure,
        loadRawRoutine: fetchRawActiveRoutine,
        saveExerciseStatus, // Exported
        syncExerciseStatus  // Exported
    };
})();
