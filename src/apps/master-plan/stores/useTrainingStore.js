import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../../../supabaseClient';

export const useTrainingStore = create(
    persist(
        (set, get) => ({
            activeSession: null,
            expandedBlockId: null,
            systemStep: null, 
            activeFocusId: null,
            
            availableRoutineDays: [], 
            recommendedDayId: null,
            selectedDayId: null,
            isLoading: false,

            // History State
            sessionHistory: [],
            globalHistory: [],
            dailyVolumes: {}, 
            uniqueExercises: [],
            activeHistorySession: null,
            activeExerciseHistory: [],

            // Retroactive State
            retroactiveDate: null,

            fetchRoutineDays: async () => {
                console.log("[Store] fetchRoutineDays starting...");
                set({ isLoading: true });
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    
                    const { data: days, error: daysErr } = await supabase.schema('v2').from('routine_days').select('*').order('sequence_number');
                    const { data: workouts, error: workErr } = await supabase.schema('v2').from('workouts').select('id, routine_day_id');
                    const { data: blocks, error: blockErr } = await supabase.schema('v2').from('workout_blocks').select('id, workout_id, label');
                    const { data: beData, error: beErr } = await supabase.schema('v2').from('block_exercises').select('id, block_id, exercises(name)');

                    if (daysErr || workErr || blockErr || beErr) throw (daysErr || workErr || blockErr || beErr);

                    const { data: history, error: histErr } = await supabase
                        .schema('v2')
                        .from('session_logs')
                        .select('id, routine_day_id, start_time, end_time') 
                        .eq('user_id', user?.id)
                        .order('end_time', { ascending: false });

                    if (histErr) throw histErr;

                    const latestDaySessions = {};
                    history.forEach(log => {
                        if (!latestDaySessions[log.routine_day_id]) {
                            latestDaySessions[log.routine_day_id] = log.id;
                        }
                    });

                    const sessionIdsToFetch = Object.values(latestDaySessions);
                    let snapshots = [];
                    if (sessionIdsToFetch.length > 0) {
                        const { data: sData } = await supabase
                            .schema('v2')
                            .from('set_logs')
                            .select('session_log_id, block_exercise_id, weight, reps')
                            .in('session_log_id', sessionIdsToFetch);
                        snapshots = sData || [];
                    }

                    const processedDays = days.map(day => {
                        const dayHistory = history.filter(h => h.routine_day_id === day.id);
                        const lastSession = dayHistory[0] || null;
                        const workout = workouts.find(w => w.routine_day_id === day.id);
                        const dayBlocks = workout ? blocks.filter(b => b.workout_id === workout.id) : [];
                        
                        const exerciseData = [];
                        dayBlocks.forEach(b => {
                            if (b.label === 'MAIN PHASE') {
                                const activeBe = beData.filter(be => be.block_id === b.id);
                                activeBe.forEach(be => {
                                    if (be.exercises?.name) {
                                        const sessionForPreview = latestDaySessions[day.id];
                                        const lastSets = snapshots
                                            .filter(s => s.session_log_id === sessionForPreview && s.block_exercise_id === be.id)
                                            .map(s => `${s.weight} KG · ${s.reps}`);
                                        exerciseData.push({ name: be.exercises.name, snapshot: lastSets.length > 0 ? lastSets.join(', ') : null });
                                    }
                                });
                            }
                        });
                        return { ...day, last_session: lastSession, exercisePreview: exerciseData };
                    });

                    let recommendedId = processedDays[0]?.id;
                    if (history.length > 0) {
                        const lastGlobalSession = history[0];
                        const lastDayIdx = processedDays.findIndex(d => d.id === lastGlobalSession.routine_day_id);
                        if (lastDayIdx !== -1) recommendedId = processedDays[(lastDayIdx + 1) % processedDays.length].id;
                    }

                    set((state) => ({ 
                        availableRoutineDays: processedDays, 
                        recommendedDayId: recommendedId,
                        selectedDayId: state.selectedDayId === null ? recommendedId : (processedDays.some(d => d.id === state.selectedDayId) ? state.selectedDayId : recommendedId), 
                        isLoading: false 
                    }));
                } catch (err) { console.error("[Store] fetchRoutineDays FAILED:", err); set({ isLoading: false }); }
            },

            deleteSessionLog: async (sessionId) => {
                set({ isLoading: true });
                try {
                    const { error } = await supabase.schema('v2').from('session_logs').delete().eq('id', sessionId);
                    if (error) throw error;
                    await get().fetchGlobalHistory();
                    await get().fetchRoutineDays();
                    set({ isLoading: false });
                } catch (err) { console.error("Failed to delete log:", err); set({ isLoading: false }); throw err; }
            },

            fetchDayHistory: async (dayId) => {
                set({ isLoading: true, sessionHistory: [] });
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    const { data, error } = await supabase.schema('v2').from('session_logs').select('*').eq('routine_day_id', dayId).eq('user_id', user?.id).order('end_time', { ascending: false });
                    if (error) throw error;
                    set({ sessionHistory: data, isLoading: false });
                } catch (err) { console.error("[Store] fetchDayHistory FAILED:", err); set({ isLoading: false }); }
            },

            fetchGlobalHistory: async () => {
                set({ isLoading: true });
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    const { data, error } = await supabase
                        .schema('v2')
                        .from('session_logs')
                        .select('*, routine_days(label), set_logs(weight, reps, rpe)') 
                        .eq('user_id', user?.id)
                        .order('end_time', { ascending: false });

                    if (error) throw error;

                    const volumeMap = {};
                    data.forEach(session => {
                        const dateKey = new Date(session.end_time).toDateString();
                        let sessionVolume = 0;
                        session.set_logs.forEach(set => {
                            let w = 0;
                            const weightStr = String(set.weight || '0').toLowerCase();
                            if (weightStr === 'bw') w = 0; 
                            else {
                                const parts = weightStr.match(/\d+(\.\d+)?/);
                                w = parts ? parseFloat(parts[0]) : 0;
                            }
                            const r = parseInt(set.reps) || 0;
                            sessionVolume += (w * r);
                        });
                        volumeMap[dateKey] = (volumeMap[dateKey] || 0) + sessionVolume;
                    });

                    set({ globalHistory: data, dailyVolumes: volumeMap, isLoading: false });
                } catch (err) { console.error("Failed to fetch global history:", err); set({ isLoading: false }); }
            },

            fetchUniqueExercises: async () => {
                set({ isLoading: true, uniqueExercises: [] });
                try {
                    const { data, error } = await supabase.schema('v2').from('exercises').select('name').order('name', { ascending: true });
                    if (error) throw error;
                    set({ uniqueExercises: [...new Set(data.map(e => e.name))], isLoading: false });
                } catch (err) { console.error("Failed to fetch exercises:", err); set({ isLoading: false }); }
            },

            fetchExerciseHistory: async (exerciseName) => {
                set({ isLoading: true, activeExerciseHistory: [] });
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    const { data, error = null } = await supabase.schema('v2').from('set_logs').select(`weight, reps, rpe, created_at, session_logs!inner ( end_time, user_id ), block_exercises!inner ( target_weight, target_reps, target_rpe, exercises!inner ( name ) )`).eq('session_logs.user_id', user?.id).eq('block_exercises.exercises.name', exerciseName);
                    if (error) throw error;
                    const grouped = data.reduce((acc, log) => {
                        const date = new Date(log.session_logs.end_time).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
                        let group = acc.find(g => g.date === date);
                        if (!group) { group = { date, sets: [], rawDate: log.session_logs.end_time }; acc.push(group); }
                        group.sets.push(log);
                        return acc;
                    }, []);
                    grouped.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
                    set({ activeExerciseHistory: grouped, isLoading: false });
                } catch (err) { console.error("Failed to fetch exercise history:", err); set({ isLoading: false }); }
            },

            fetchSessionDetails: async (sessionId) => {
                set({ isLoading: true, activeHistorySession: null });
                try {
                    const { data: session, error: sErr } = await supabase.schema('v2').from('session_logs').select('*, routine_days(label)').eq('id', sessionId).single();
                    if (sErr) throw sErr;
                    
                    // FETCH WITH TEMPO AND ALL TARGETS FOR AI ANALYSIS
                    const { data: logs, error: lErr } = await supabase
                        .schema('v2')
                        .from('set_logs')
                        .select(`*, block_exercises!inner ( target_weight, target_reps, target_rpe, target_tempo, sort_order, exercises!inner ( name ) )`)
                        .eq('session_log_id', sessionId)
                        .order('created_at', { ascending: true });
                    
                    if (lErr) throw lErr;
                    const groups = [];
                    logs.forEach(log => {
                        const exName = log.block_exercises.exercises.name;
                        const lastGroup = groups[groups.length - 1];
                        if (!lastGroup || lastGroup.name !== exName) {
                            groups.push({ 
                                name: exName, 
                                targets: { 
                                    w: log.block_exercises.target_weight, 
                                    r: log.block_exercises.target_reps, 
                                    e: log.block_exercises.target_rpe,
                                    t: log.block_exercises.target_tempo // Added target tempo
                                }, 
                                sets: [log] 
                            });
                        } else { lastGroup.sets.push(log); }
                    });
                    set({ activeHistorySession: { ...session, groupedLogs: groups }, isLoading: false });
                } catch (err) { console.error("Failed to fetch session details:", err); set({ isLoading: false }); }
            },

            setSelectedDay: (id) => set((state) => ({ 
                selectedDayId: state.selectedDayId === id ? null : id 
            })),

            startSession: async (dayId, customDate = null) => {
                set({ isLoading: true, retroactiveDate: customDate });
                try {
                    const { data: workout, error } = await supabase.schema('v2').from('workouts').select(`id, name, workout_notes, workout_blocks ( id, label, block_type, sort_order, block_exercises ( id, target_sets, target_reps, target_weight, target_rpe, target_tempo, set_targets, sort_order, exercises ( name, technique_notes ) ) )`).eq('routine_day_id', dayId).maybeSingle();
                    if (error) throw error;
                    if (!workout) {
                        const session = { id: crypto.randomUUID(), startTime: customDate || new Date().toISOString(), routine_day_id: dayId, isRestDay: true, blocks: [], logs: {} };
                        set({ activeSession: session, isLoading: false });
                        return;
                    }
                    const activeBlocks = (workout.workout_blocks || []).filter(b => b.label === 'MAIN PHASE').sort((a,b) => a.sort_order - b.sort_order);
                    const session = {
                        id: crypto.randomUUID(), startTime: customDate || new Date().toISOString(), routine_day_id: dayId, isRestDay: false, workoutNotes: workout.workout_notes,
                        blocks: activeBlocks.map(b => ({
                            id: b.id, label: b.label, block_type: b.block_type,
                            exercises: (b.block_exercises || []).sort((a,b) => a.sort_order - b.sort_order).map(be => ({
                                id: be.id, name: be.exercises.name, technique: be.exercises.technique_notes,
                                target_sets: be.target_sets, target_reps: be.target_reps, target_weight: be.target_weight,
                                target_rpe: be.target_rpe, target_tempo: be.target_tempo, set_targets: be.set_targets, sort_order: be.sort_order
                            }))
                        })),
                        logs: {}
                    };
                    set({ activeSession: session, expandedBlockId: session.blocks[0]?.id, systemStep: { blockId: session.blocks[0]?.id, exerciseId: session.blocks[0]?.exercises[0]?.id, round: 1 }, activeFocusId: session.blocks[0]?.exercises[0]?.id, isLoading: false });
                } catch (err) { console.error("startSession FAILED:", err); set({ isLoading: false }); }
            },

            finishSession: async () => {
                const session = get().activeSession;
                if (!session) return;
                set({ isLoading: true });
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    const { data: sessionData, error: sessionError } = await supabase.schema('v2').from('session_logs').insert([{ user_id: user?.id, routine_day_id: session.routine_day_id, start_time: session.startTime, end_time: get().retroactiveDate ? session.startTime : new Date().toISOString() }]).select().single();
                    if (sessionError) throw sessionError;
                    const setLogsToInsert = [];
                    Object.entries(session.logs).forEach(([blockExId, sets]) => {
                        sets.forEach((setEntry, index) => {
                            setLogsToInsert.push({ session_log_id: sessionData.id, block_exercise_id: blockExId, weight: String(setEntry.weight), reps: parseInt(setEntry.reps) || 0, rpe: parseFloat(setEntry.rpe) || null, set_number: index + 1, created_at: session.startTime });
                        });
                    });
                    if (setLogsToInsert.length > 0) {
                        const { error: setLogsError } = await supabase.schema('v2').from('set_logs').insert(setLogsToInsert);
                        if (setLogsError) throw setLogsError;
                    }
                    set({ activeSession: null, systemStep: null, activeFocusId: null, expandedBlockId: null, retroactiveDate: null, isLoading: false });
                } catch (err) { console.error("finishSession FAILED:", err); alert("Sync Error: " + err.message); set({ isLoading: false }); }
            },

            toggleFocus: (exId, blockId) => set((state) => {
                const isClosing = state.activeFocusId === exId;
                const newState = { activeFocusId: isClosing ? null : exId, expandedBlockId: blockId };
                if (!isClosing && blockId && blockId !== state.systemStep?.blockId) {
                    const block = state.activeSession.blocks.find(b => b.id === blockId);
                    const firstIncomplete = block.exercises.find(e => {
                        const logs = state.activeSession.logs[e.id] || [];
                        return logs.length < parseInt(e.target_sets || 3);
                    }) || block.exercises[0];
                    newState.systemStep = { blockId, exerciseId: firstIncomplete.id, round: state.systemStep?.round || 1 };
                }
                return newState;
            }),

            addLogEntry: (exId, blockId, data, isCircuit) => {
                const state = get();
                const session = state.activeSession;
                if (!session) return;
                const exLogs = session.logs[exId] || [];
                const updatedLogs = { ...session.logs, [exId]: [...exLogs, { ...data, id: Date.now() }] };
                const blockIdx = session.blocks.findIndex(b => b.id === blockId);
                const block = session.blocks[blockIdx];
                const exIdx = block.exercises.findIndex(e => e.id === exId);
                const totalSets = parseInt(block.exercises[exIdx].target_sets || 3);
                set({ activeSession: { ...session, logs: updatedLogs } });
                let next = null;
                if (isCircuit) {
                    if (exIdx < block.exercises.length - 1) { next = { blockId, exerciseId: block.exercises[exIdx + 1].id, round: state.systemStep.round }; }
                    else if (state.systemStep.round < totalSets) { next = { blockId, exerciseId: block.exercises[0].id, round: state.systemStep.round + 1 }; }
                } else if (updatedLogs[exId].length >= totalSets) {
                    if (exId === state.systemStep?.exerciseId && exIdx < block.exercises.length - 1) { next = { blockId, exerciseId: block.exercises[exIdx + 1].id, round: 1 }; }
                }
                if (!next && updatedLogs[exId].length >= totalSets) {
                    for (const b of session.blocks) {
                        const firstIncompleteEx = b.exercises.find(e => {
                            const logs = updatedLogs[e.id] || [];
                            return logs.length < parseInt(e.target_sets || 3);
                        });
                        if (firstIncompleteEx) { next = { blockId: b.id, exerciseId: firstIncompleteEx.id, round: 1 }; break; }
                    }
                }
                if (next) { set({ systemStep: next, activeFocusId: next.exerciseId, expandedBlockId: next.blockId }); }
            },

            updateLogEntry: (exId, logId, field, value) => {
                const session = get().activeSession;
                if (!session) return;
                const updatedLogs = { ...session.logs, [exId]: (session.logs[exId] || []).map(l => l.id === logId ? { ...l, [field]: value } : l) };
                set({ activeSession: { ...session, logs: updatedLogs } });
            },

            resetStore: () => set({ activeSession: null, systemStep: null, activeFocusId: null, expandedBlockId: null, selectedDayId: null, retroactiveDate: null }),
            setExpandedBlock: (blockId) => set({ expandedBlockId: blockId })
        }),
        { name: 'mp-training-storage-v33' }
    )
);