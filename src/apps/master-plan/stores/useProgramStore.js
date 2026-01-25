import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../../../supabaseClient';

/**
 * NATIVE V3 STORE
 * Directly communicates with V3 Schema.
 */
export const useProgramStore = create(
    persist(
        (set, get) => ({
            activeSession: null,
            expandedBlockId: null,
            systemStep: null, 
            activeFocusId: null,
            lastView: 'library',
            
            programs: [],
            activeProgramId: null,
            programDays: [], 
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

            fetchProgramManifest: async () => {
                console.log("[Store] fetchProgramManifest V3 starting...");
                set({ isLoading: true });
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    console.log("[Store] Authenticated User:", user?.email, user?.id);
                    
                    // 1. FETCH ALL PROGRAMS
                    const { data: progs, error: progsErr } = await supabase
                        .schema('v3')
                        .from('programs')
                        .select('*')
                        .order('created_at', { ascending: false });
                    
                    if (progsErr) {
                        console.error("[Store] Programs Fetch ERROR:", progsErr.message);
                        throw progsErr;
                    }

                    console.log("[Store] Fetched Programs Count:", progs?.length);
                    console.log("[Store] Programs Detail:", progs);

                    // Determine active program ID (default to first if none set)
                    let currentActiveId = get().activeProgramId;
                    if (!currentActiveId && progs.length > 0) {
                        currentActiveId = progs[0].id;
                    }
                    console.log("[Store] Current Active Program ID:", currentActiveId);

                    // 2. FETCH V3 NATIVE DAYS (Filtered by active program)
                    let days = [];
                    if (currentActiveId) {
                        const { data: d, error: daysErr } = await supabase
                            .schema('v3')
                            .from('program_days')
                            .select('*')
                            .eq('program_id', currentActiveId)
                            .order('sequence_number');
                        if (daysErr) throw daysErr;
                        days = d;
                    }
                    console.log("[Store] Fetched Days Count:", days?.length);

                    const { data: sessions, error: sessErr } = await supabase.schema('v3').from('sessions').select('id, program_day_id');
                    const { data: blocks, error: blockErr } = await supabase.schema('v3').from('blocks').select('id, session_id, label, block_type, sort_order');
                    const { data: items, error: itemErr } = await supabase.schema('v3').from('block_items').select('id, session_block_id, target_sets, target_reps, target_weight, target_rpe, tempo, metric_type, sort_order, exercise_library(name, technique_cues)');

                    if (sessErr || blockErr || itemErr) throw (sessErr || blockErr || itemErr);

                    const { data: history, error: histErr } = await supabase
                        .schema('v3')
                        .from('completed_sessions')
                        .select('id, program_day_id, start_time, end_time') 
                        .eq('user_id', user?.id)
                        .order('end_time', { ascending: false });

                    if (histErr) throw histErr;

                    const latestDaySessions = {};
                    history.forEach(log => {
                        if (!latestDaySessions[log.program_day_id]) {
                            latestDaySessions[log.program_day_id] = log.id;
                        }
                    });

                    const sessionIdsToFetch = Object.values(latestDaySessions);
                    let snapshots = [];
                    if (sessionIdsToFetch.length > 0) {
                        const { data: sData } = await supabase
                            .schema('v3')
                            .from('performance_logs')
                            .select('completed_session_id, block_item_id, weight, reps')
                            .in('completed_session_id', sessionIdsToFetch);
                        snapshots = sData || [];
                    }

                    const processedDays = days.map(day => {
                        const dayHistory = history.filter(h => h.program_day_id === day.id);
                        const lastSession = dayHistory[0] || null;
                        const session = sessions.find(s => s.program_day_id === day.id);
                        
                        // SMART FILTER: Exclude History/Archived blocks
                        const sessionBlocks = session ? blocks.filter(b => b.session_id === session.id && !b.label?.startsWith('HISTORY') && !b.label?.startsWith('ARCHIVED')) : [];
                        
                        const exerciseData = [];
                        sessionBlocks.forEach(b => {
                            const blockItems = items.filter(i => i.session_block_id === b.id);
                            blockItems.forEach(i => {
                                if (i.exercise_library?.name) {
                                    const sessionForPreview = latestDaySessions[day.id];
                                    const lastSets = snapshots
                                        .filter(s => s.completed_session_id === sessionForPreview && s.block_item_id === i.id)
                                        .map(s => `${s.weight} KG · ${s.reps}`);
                                    exerciseData.push({ name: i.exercise_library.name, snapshot: lastSets.length > 0 ? lastSets.join(', ') : null });
                                }
                            });
                        });
                        
                        return { 
                            ...day, 
                            last_session: lastSession, 
                            exercisePreview: exerciseData 
                        };
                    });

                    let recommendedId = processedDays[0]?.id;
                    if (history.length > 0) {
                        const lastGlobalSession = history[0];
                        const lastDayIdx = processedDays.findIndex(d => d.id === lastGlobalSession.program_day_id);
                        if (lastDayIdx !== -1) recommendedId = processedDays[(lastDayIdx + 1) % processedDays.length].id;
                    }

                    set((state) => ({ 
                        programs: progs,
                        activeProgramId: currentActiveId,
                        programDays: processedDays, 
                        recommendedDayId: recommendedId,
                        selectedDayId: state.selectedDayId === null ? recommendedId : (processedDays.some(d => d.id === state.selectedDayId) ? state.selectedDayId : recommendedId), 
                        isLoading: false 
                    }));
                } catch (err) { console.error("[Store V3] fetchProgramManifest FAILED:", err); set({ isLoading: false }); }
            },

            setActiveProgramId: (id) => {
                set({ activeProgramId: id, selectedDayId: null });
                get().fetchProgramManifest();
            },

            deleteSessionRecord: async (sessionId) => {
                set({ isLoading: true });
                try {
                    const { error } = await supabase.schema('v3').from('completed_sessions').delete().eq('id', sessionId);
                    if (error) throw error;
                    await get().fetchGlobalHistory();
                    await get().fetchProgramManifest();
                    set({ isLoading: false });
                } catch (err) { console.error("Failed to delete log:", err); set({ isLoading: false }); throw err; }
            },

            fetchGlobalHistory: async () => {
                set({ isLoading: true });
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    const { data, error } = await supabase
                        .schema('v3')
                        .from('completed_sessions')
                        .select('*, program_days(label), performance_logs(weight, reps, rpe)') 
                        .eq('user_id', user?.id)
                        .order('end_time', { ascending: false });

                    if (error) throw error;

                    const volumeMap = {};
                    data.forEach(session => {
                        const dateKey = new Date(session.end_time).toDateString();
                        let sessionVolume = 0;
                        session.performance_logs.forEach(log => {
                            let w = 0;
                            const weightStr = String(log.weight || '0').toLowerCase();
                            if (weightStr === 'bw') w = 0; 
                            else {
                                const parts = weightStr.match(/\d+(\.\d+)?/);
                                w = parts ? parseFloat(parts[0]) : 0;
                            }
                            const r = parseInt(log.reps) || 0;
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
                    const { data, error } = await supabase.schema('v3').from('exercise_library').select('name').order('name', { ascending: true });
                    if (error) throw error;
                    set({ uniqueExercises: [...new Set(data.map(e => e.name))], isLoading: false });
                } catch (err) { console.error("Failed to fetch exercises:", err); set({ isLoading: false }); }
            },

            fetchSessionDetails: async (sessionId) => {
                set({ isLoading: true, activeHistorySession: null });
                try {
                    const { data: session, error: sErr } = await supabase.schema('v3').from('completed_sessions').select('*, program_days(label)').eq('id', sessionId).single();
                    if (sErr) throw sErr;
                    
                    const { data: logs, error: lErr } = await supabase
                        .schema('v3')
                        .from('performance_logs')
                        .select(`*, block_items!inner ( target_weight, target_reps, target_rpe, tempo, sort_order, exercise_library!inner ( name ) )`)
                        .eq('completed_session_id', sessionId)
                        .order('created_at', { ascending: true });
                    
                    if (lErr) throw lErr;
                    const groups = [];
                    logs.forEach(log => {
                        const exName = log.block_items.exercise_library.name;
                        const lastGroup = groups[groups.length - 1];
                        if (!lastGroup || lastGroup.name !== exName) {
                            groups.push({ 
                                name: exName, 
                                targets: { 
                                    w: log.block_items.target_weight, 
                                    r: log.block_items.target_reps, 
                                    e: log.block_items.target_rpe,
                                    t: log.block_items.tempo
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
                    // FETCH NATIVE V3
                    const { data: sessionTemplate, error } = await supabase.schema('v3').from('sessions').select(`id, name, session_focus, blocks ( id, label, block_type, sort_order, block_items ( id, target_sets, target_reps, target_weight, target_rpe, tempo, set_targets, metric_type, sort_order, exercise_library ( name, technique_cues ) ) )`).eq('program_day_id', dayId).maybeSingle();
                    if (error) throw error;
                    
                    if (!sessionTemplate) {
                        const session = { id: crypto.randomUUID(), startTime: customDate || new Date().toISOString(), program_day_id: dayId, isRestDay: true, blocks: [], logs: {} };
                        set({ activeSession: session, isLoading: false });
                        return;
                    }

                    const activeBlocks = (sessionTemplate.blocks || [])
                        .filter(b => !b.label?.startsWith('HISTORY') && !b.label?.startsWith('ARCHIVED'))
                        .sort((a,b) => a.sort_order - b.sort_order);

                    const session = {
                        id: crypto.randomUUID(), 
                        startTime: customDate || new Date().toISOString(), 
                        program_day_id: dayId, 
                        isRestDay: false, 
                        sessionFocus: sessionTemplate.session_focus, 
                        blocks: activeBlocks.map(b => ({
                            id: b.id, 
                            label: b.label, 
                            block_type: b.block_type,
                            // Direct Mapping: V3 DB structure matches V3 Store structure
                            items: (b.block_items || []).sort((a,b) => a.sort_order - b.sort_order).map(bi => ({
                                id: bi.id, 
                                name: bi.exercise_library.name, 
                                technique_cues: bi.exercise_library.technique_cues,
                                target_sets: bi.target_sets, 
                                target_reps: bi.target_reps, 
                                target_weight: bi.target_weight,
                                target_rpe: bi.target_rpe, 
                                tempo: bi.tempo, 
                                set_targets: bi.set_targets, 
                                sort_order: bi.sort_order,
                                metric_type: bi.metric_type
                            }))
                        })),
                        logs: {}
                    };
                    set({ 
                        activeSession: session, 
                        expandedBlockId: session.blocks[0]?.id, 
                        systemStep: { blockId: session.blocks[0]?.id, itemId: session.blocks[0]?.items[0]?.id, round: 1 }, 
                        activeFocusId: session.blocks[0]?.items[0]?.id, 
                        isLoading: false 
                    });
                } catch (err) { console.error("startSession FAILED:", err); set({ isLoading: false }); }
            },

            finishSession: async () => {
                const session = get().activeSession;
                if (!session) return;
                set({ isLoading: true });
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    
                    // SAVE TO V3
                    const { data: sessionData, error: sessionError } = await supabase.schema('v3').from('completed_sessions').insert([{ user_id: user?.id, program_day_id: session.program_day_id, start_time: session.startTime, end_time: get().retroactiveDate ? session.startTime : new Date().toISOString() }]).select().single();
                    if (sessionError) throw sessionError;
                    
                    const logsToInsert = [];
                    Object.entries(session.logs).forEach(([itemId, sets]) => {
                        sets.forEach((setEntry, index) => {
                            logsToInsert.push({ 
                                completed_session_id: sessionData.id, 
                                block_item_id: itemId, 
                                weight: String(setEntry.weight), 
                                reps: parseInt(setEntry.reps) || 0, 
                                rpe: parseFloat(setEntry.rpe) || null, 
                                duration_seconds: setEntry.duration_seconds, // V3 FIELD
                                distance_meters: setEntry.distance_meters, // V3 FIELD
                                set_number: index + 1, 
                                created_at: session.startTime 
                            });
                        });
                    });
                    
                    if (logsToInsert.length > 0) {
                        const { error: logsError } = await supabase.schema('v3').from('performance_logs').insert(logsToInsert);
                        if (logsError) throw logsError;
                    }
                    set({ activeSession: null, systemStep: null, activeFocusId: null, expandedBlockId: null, retroactiveDate: null, isLoading: false });
                } catch (err) { console.error("finishSession FAILED:", err); alert("Sync Error: " + err.message); set({ isLoading: false }); }
            },

            toggleFocus: (itemId, blockId) => set((state) => {
                const isClosing = state.activeFocusId === itemId;
                const newState = { activeFocusId: isClosing ? null : itemId, expandedBlockId: blockId };
                if (!isClosing && blockId && blockId !== state.systemStep?.blockId) {
                    const block = state.activeSession.blocks.find(b => b.id === blockId);
                    const firstIncomplete = block.items.find(item => {
                        const logs = state.activeSession.logs[item.id] || [];
                        return logs.length < parseInt(item.target_sets || 3);
                    }) || block.items[0];
                    newState.systemStep = { blockId, itemId: firstIncomplete.id, round: state.systemStep?.round || 1 };
                }
                return newState;
            }),

            addLogEntry: (itemId, blockId, data, isCircuit) => {
                const state = get();
                const session = state.activeSession;
                if (!session) return;
                const itemLogs = session.logs[itemId] || [];
                const updatedLogs = { ...session.logs, [itemId]: [...itemLogs, { ...data, id: Date.now() }] };
                
                const block = session.blocks.find(b => b.id === blockId);
                const itemIdx = block.items.findIndex(i => i.id === itemId);
                const totalSets = parseInt(block.items[itemIdx].target_sets || 3);
                
                set({ activeSession: { ...session, logs: updatedLogs } });
                
                let next = null;
                if (isCircuit) {
                    if (itemIdx < block.items.length - 1) { 
                        next = { blockId, itemId: block.items[itemIdx + 1].id, round: state.systemStep.round }; 
                    }
                    else if (state.systemStep.round < totalSets) { 
                        next = { blockId, itemId: block.items[0].id, round: state.systemStep.round + 1 }; 
                    }
                } else if (updatedLogs[itemId].length >= totalSets) {
                    if (itemId === state.systemStep?.itemId && itemIdx < block.items.length - 1) { 
                        next = { blockId, itemId: block.items[itemIdx + 1].id, round: 1 }; 
                    }
                }
                
                if (!next && updatedLogs[itemId].length >= totalSets) {
                    for (const b of session.blocks) {
                        const firstIncompleteItem = b.items.find(i => {
                            const logs = updatedLogs[i.id] || [];
                            return logs.length < parseInt(i.target_sets || 3);
                        });
                        if (firstIncompleteItem) { 
                            next = { blockId: b.id, itemId: firstIncompleteItem.id, round: 1 }; 
                            break; 
                        }
                    }
                }
                
                if (next) { 
                    set({ systemStep: next, activeFocusId: next.itemId, expandedBlockId: next.blockId }); 
                }
            },

            updateLogEntry: (itemId, logId, field, value) => {
                const session = get().activeSession;
                if (!session) return;
                const updatedLogs = { ...session.logs, [itemId]: (session.logs[itemId] || []).map(l => l.id === logId ? { ...l, [field]: value } : l) };
                set({ activeSession: { ...session, logs: updatedLogs } });
            },

            resetStore: () => set({ activeSession: null, systemStep: null, activeFocusId: null, expandedBlockId: null, selectedDayId: null, retroactiveDate: null }),
            setExpandedBlock: (blockId) => set({ expandedBlockId: blockId }),
            setLastView: (view) => set({ lastView: view }),

            saveProgram: async (programName, days) => {
                console.log("[Store] Starting complex V3 Program Save...");
                set({ isLoading: true });
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error("Authentication required to save programs.");

                    // 1. Create Program with correct cycle_length
                    const { data: program, error: progErr } = await supabase
                        .schema('v3')
                        .from('programs')
                        .insert([{ name: programName, user_id: user.id, cycle_length: days.length }])
                        .select()
                        .single();
                    if (progErr) throw progErr;

                    // 2. Fetch full library for ID mapping
                    const { data: library } = await supabase.schema('v3').from('exercise_library').select('id, name');

                    // 3. Sequential Hierarchical Insert (Maintain relational integrity)
                    for (const day of days) {
                        // A. Program Day
                        const { data: progDay, error: dayErr } = await supabase
                            .schema('v3')
                            .from('program_days')
                            .insert([{ program_id: program.id, label: day.label, sequence_number: day.sequence_number }])
                            .select()
                            .single();
                        if (dayErr) throw dayErr;

                        // B. Session
                        const { data: session, error: sessErr } = await supabase
                            .schema('v3')
                            .from('sessions')
                            .insert([{ program_day_id: progDay.id, name: `${day.label} SESSION` }])
                            .select()
                            .single();
                        if (sessErr) throw sessErr;

                        // C. Blocks
                        for (const block of day.blocks) {
                            const { data: v3Block, error: blockErr } = await supabase
                                .schema('v3')
                                .from('blocks')
                                .insert([{ 
                                    session_id: session.id, 
                                    label: block.label, 
                                    block_type: block.block_type, 
                                    sort_order: block.sort_order 
                                }])
                                .select()
                                .single();
                            if (blockErr) throw blockErr;

                            // D. Block Items
                            const itemsToInsert = block.items.map(item => {
                                const libItem = library.find(l => l.name === item.name);
                                return {
                                    session_block_id: v3Block.id,
                                    exercise_library_id: libItem?.id,
                                    target_sets: parseInt(item.target_sets),
                                    target_reps: String(item.target_reps),
                                    target_weight: String(item.target_weight),
                                    target_rpe: String(item.target_rpe),
                                    tempo: String(item.tempo),
                                    metric_type: item.metric_type,
                                    sort_order: item.sort_order
                                };
                            }).filter(i => i.exercise_library_id); // Only insert if exercise exists

                            if (itemsToInsert.length > 0) {
                                const { error: itemErr } = await supabase
                                    .schema('v3')
                                    .from('block_items')
                                    .insert(itemsToInsert);
                                if (itemErr) throw itemErr;
                            }
                        }
                    }

                    console.log("✨ Program Saved Successfully!");
                    set({ activeProgramId: program.id }); // Automatically switch to new program
                    await get().fetchProgramManifest();
                    set({ isLoading: false });
                    return true;
                } catch (err) {
                    console.error("[Store V3] saveProgram FAILED:", err);
                    set({ isLoading: false });
                    throw err;
                }
            }
        }),
        { name: 'mp-program-storage-v3-native' }
    )
);