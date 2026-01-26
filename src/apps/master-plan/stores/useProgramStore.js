import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, getActiveSchema } from '../../../supabaseClient';

/**
 * NATIVE V3 STORE
 * Directly communicates with the active schema (v3 or v3_dev).
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
            showArchivedPrograms: false,
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

            setShowArchivedPrograms: (show) => {
                set({ showArchivedPrograms: show });
                get().fetchProgramManifest();
            },

            fetchProgramManifest: async () => {
                const activeSchema = getActiveSchema();
                console.log(`[Store] fetchProgramManifest starting (${activeSchema})...`);
                set({ isLoading: true });
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    
                    // 1. FETCH PROGRAMS
                    let query = supabase.schema(activeSchema).from('programs').select('*');
                    if (!get().showArchivedPrograms) {
                        query = query.is('archived_at', null);
                    }
                    const { data: progs, error: progsErr } = await query.order('created_at', { ascending: false });
                    
                    if (progsErr) throw progsErr;

                    // Determine active program ID
                    let currentActiveId = get().activeProgramId;
                    if (!currentActiveId && progs.length > 0) {
                        const activeOnes = progs.filter(p => !p.archived_at);
                        currentActiveId = activeOnes.length > 0 ? activeOnes[0].id : progs[0].id;
                    }

                    if (currentActiveId && !get().showArchivedPrograms) {
                        const activeMatch = progs.find(p => p.id === currentActiveId);
                        if (!activeMatch && progs.length > 0) currentActiveId = progs[0].id;
                    }

                    // 2. FETCH DAYS
                    let days = [];
                    if (currentActiveId) {
                        const { data: d, error: daysErr } = await supabase
                            .schema(activeSchema)
                            .from('program_days')
                            .select('*')
                            .eq('program_id', currentActiveId)
                            .order('sequence_number');
                        if (daysErr) throw daysErr;
                        days = d;
                    }

                    const { data: sessions, error: sessErr } = await supabase.schema(activeSchema).from('sessions').select('id, program_day_id');
                    const { data: blocks, error: blockErr } = await supabase.schema(activeSchema).from('blocks').select('id, session_id, label, block_type, sort_order');
                    const { data: items, error: itemErr } = await supabase.schema(activeSchema).from('block_items').select('id, session_block_id, target_sets, target_reps, target_weight, target_rpe, tempo, metric_type, sort_order, exercise_library(name, technique_cues)');

                    if (sessErr || blockErr || itemErr) throw (sessErr || blockErr || itemErr);

                    const { data: history, error: histErr } = await supabase
                        .schema(activeSchema)
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
                            .schema(activeSchema)
                            .from('performance_logs')
                            .select('completed_session_id, block_item_id, weight, reps')
                            .in('completed_session_id', sessionIdsToFetch);
                        snapshots = sData || [];
                    }

                    const processedDays = days.map(day => {
                        const dayHistory = history.filter(h => h.program_day_id === day.id);
                        const lastSession = dayHistory[0] || null;
                        const session = sessions.find(s => s.program_day_id === day.id);
                        
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
                        
                        return { ...day, last_session: lastSession, exercisePreview: exerciseData };
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

            fetchProgramDetails: async (programId) => {
                const activeSchema = getActiveSchema();
                console.log(`[Store] Deep loading program details from ${activeSchema} for ID:`, programId);
                set({ isLoading: true });
                try {
                    const { data: program, error: pErr } = await supabase.schema(activeSchema).from('programs').select('*').eq('id', programId).single();
                    if (pErr) throw pErr;

                    const { data: days, error: dErr } = await supabase
                        .schema(activeSchema)
                        .from('program_days')
                        .select(`
                            id, label, sequence_number,
                            sessions (
                                id, name,
                                blocks (
                                    id, label, block_type, sort_order,
                                    block_items (
                                        id, target_sets, target_reps, target_weight, target_rpe, tempo, metric_type, sort_order,
                                        exercise_library ( name )
                                    )
                                )
                            )
                        `)
                        .eq('program_id', programId)
                        .order('sequence_number');
                    
                    if (dErr) throw dErr;

                    const hydratedDays = days.map(d => {
                        // Handle both object (due to unique constraint) and array responses
                        const session = Array.isArray(d.sessions) ? d.sessions[0] : d.sessions;
                        const blocks = (session?.blocks || []).sort((a,b) => a.sort_order - b.sort_order);

                        return {
                            id: d.id,
                            label: d.label,
                            sequence_number: d.sequence_number,
                            blocks: blocks.map(b => ({
                                id: b.id,
                                label: b.label,
                                block_type: b.block_type,
                                sort_order: b.sort_order,
                                items: (b.block_items || []).sort((a,b) => a.sort_order - b.sort_order).map(i => ({
                                    id: i.id,
                                    name: i.exercise_library.name,
                                    target_sets: i.target_sets,
                                    target_reps: i.target_reps,
                                    target_weight: i.target_weight,
                                    target_rpe: i.target_rpe,
                                    tempo: i.tempo,
                                    metric_type: i.metric_type,
                                    sort_order: i.sort_order
                                }))
                            }))
                        };
                    });

                    set({ isLoading: false });
                    return { name: program.name, days: hydratedDays };
                } catch (err) {
                    console.error("[Store] fetchProgramDetails FAILED:", err);
                    set({ isLoading: false });
                    throw err;
                }
            },

            archiveProgram: async (programId) => {
                const activeSchema = getActiveSchema();
                set({ isLoading: true });
                try {
                    const { error } = await supabase
                        .schema(activeSchema)
                        .from('programs')
                        .update({ archived_at: new Date().toISOString() })
                        .eq('id', programId);
                    
                    if (error) throw error;
                    
                    if (get().activeProgramId === programId) {
                        set({ activeProgramId: null });
                    }
                    
                    await get().fetchProgramManifest();
                    set({ isLoading: false });
                } catch (err) {
                    console.error("[Store] archiveProgram FAILED:", err);
                    set({ isLoading: false });
                    throw err;
                }
            },

            unarchiveProgram: async (programId) => {
                const activeSchema = getActiveSchema();
                set({ isLoading: true });
                try {
                    const { error } = await supabase
                        .schema(activeSchema)
                        .from('programs')
                        .update({ archived_at: null })
                        .eq('id', programId);
                    
                    if (error) throw error;
                    await get().fetchProgramManifest();
                    set({ isLoading: false });
                } catch (err) {
                    console.error("[Store] unarchiveProgram FAILED:", err);
                    set({ isLoading: false });
                    throw err;
                }
            },

            setActiveProgramId: (id) => {
                set({ activeProgramId: id, selectedDayId: null });
                get().fetchProgramManifest();
            },

            deleteSessionRecord: async (sessionId) => {
                const activeSchema = getActiveSchema();
                set({ isLoading: true });
                try {
                    const { error } = await supabase.schema(activeSchema).from('completed_sessions').delete().eq('id', sessionId);
                    if (error) throw error;
                    await get().fetchGlobalHistory();
                    await get().fetchProgramManifest();
                    set({ isLoading: false });
                } catch (err) { console.error("Failed to delete log:", err); set({ isLoading: false }); throw err; }
            },

            fetchGlobalHistory: async () => {
                const activeSchema = getActiveSchema();
                set({ isLoading: true });
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    const { data, error } = await supabase
                        .schema(activeSchema)
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
                const activeSchema = getActiveSchema();
                set({ isLoading: true, uniqueExercises: [] });
                try {
                    const { data, error } = await supabase.schema(activeSchema).from('exercise_library').select('name').order('name', { ascending: true });
                    if (error) throw error;
                    set({ uniqueExercises: [...new Set(data.map(e => e.name))], isLoading: false });
                } catch (err) { console.error("Failed to fetch exercises:", err); set({ isLoading: false }); }
            },

            fetchSessionDetails: async (sessionId) => {
                const activeSchema = getActiveSchema();
                set({ isLoading: true, activeHistorySession: null });
                try {
                    const { data: session, error: sErr } = await supabase.schema(activeSchema).from('completed_sessions').select('*, program_days(label)').eq('id', sessionId).single();
                    if (sErr) throw sErr;
                    
                    // SNAPSHOT STRATEGY: Fetch both relational data AND snapshots
                    const { data: logs, error: lErr } = await supabase
                        .schema(activeSchema)
                        .from('performance_logs')
                        .select(`*, 
                            block_items ( target_weight, target_reps, target_rpe, tempo, sort_order, exercise_library ( name ) )
                        `)
                        .eq('completed_session_id', sessionId)
                        .order('created_at', { ascending: true });
                    
                    if (lErr) throw lErr;
                    
                    const groups = [];
                    logs.forEach(log => {
                        // FALLBACK LOGIC: Try relational link first, then snapshot
                        const exName = log.block_items?.exercise_library?.name || log.exercise_name_snapshot || 'Unknown Exercise';
                        
                        const targets = {
                            w: log.block_items?.target_weight || '?',
                            r: log.block_items?.target_reps || '?',
                            e: log.block_items?.target_rpe || '?',
                            t: log.block_items?.tempo || ''
                        };

                        // Use snapshot target if available and relational is dead
                        if (!log.block_items && log.target_snapshot) {
                            targets.w = log.target_snapshot; // We stored the whole string here in migration
                        }

                        const lastGroup = groups[groups.length - 1];
                        if (!lastGroup || lastGroup.name !== exName) {
                            groups.push({ 
                                name: exName, 
                                targets, 
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
                const activeSchema = getActiveSchema();
                console.log(`[Store] Starting Session for Day ID: ${dayId}`);
                set({ isLoading: true, retroactiveDate: customDate });
                try {
                    const { data: sessionTemplate, error } = await supabase.schema(activeSchema).from('sessions').select(`id, name, session_focus, blocks ( id, label, block_type, sort_order, block_items ( id, exercise_library_id, target_sets, target_reps, target_weight, target_rpe, tempo, set_targets, metric_type, sort_order, exercise_library ( name, technique_cues ) ) )`).eq('program_day_id', dayId).maybeSingle();
                    if (error) throw error;
                    
                    if (!sessionTemplate) {
                        console.warn("[Store] No session template found for this Day ID. It might have been deleted.");
                        alert("Template not found. Please refresh the library.");
                        set({ isLoading: false });
                        return;
                    }

                    console.log("[Store] Session Template Loaded:", sessionTemplate);

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
                            items: (b.block_items || []).sort((a,b) => a.sort_order - b.sort_order).map(bi => ({
                                id: bi.id, 
                                exercise_library_id: bi.exercise_library_id,
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
                    const activeSchema = getActiveSchema();
                    const { data: sessionData, error: sessionError } = await supabase.schema(activeSchema).from('completed_sessions').insert([{ user_id: user?.id, program_day_id: session.program_day_id, start_time: session.startTime, end_time: get().retroactiveDate ? session.startTime : new Date().toISOString() }]).select().single();
                    if (sessionError) throw sessionError;
                    
                    const logsToInsert = [];
                    Object.entries(session.logs).forEach(([itemId, sets]) => {
                        // Snapshot Strategy: Capture the text truth at moment of completion
                        let snapshotName = null;
                        let snapshotTarget = null;

                        for (const b of session.blocks) {
                            const item = b.items.find(i => i.id === itemId);
                            if (item) {
                                snapshotName = item.name; // Preserved from Library
                                snapshotTarget = `${item.target_sets}x${item.target_reps} @ ${item.target_weight}`;
                                break;
                            }
                        }

                        sets.forEach((setEntry, index) => {
                            logsToInsert.push({ 
                                completed_session_id: sessionData.id, 
                                block_item_id: itemId,
                                exercise_name_snapshot: snapshotName, // THE SNAPSHOT
                                target_snapshot: snapshotTarget,
                                weight: String(setEntry.weight), 
                                reps: parseInt(setEntry.reps) || 0, 
                                rpe: parseFloat(setEntry.rpe) || null, 
                                duration_seconds: setEntry.duration_seconds, 
                                distance_meters: setEntry.distance_meters, 
                                set_number: index + 1, 
                                created_at: session.startTime 
                            });
                        });
                    });
                    
                    if (logsToInsert.length > 0) {
                        const { error: logsError } = await supabase.schema(activeSchema).from('performance_logs').insert(logsToInsert);
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

            saveProgram: async (programName, days, existingProgramId = null) => {
                const activeSchema = getActiveSchema();
                console.log(`[Store] Starting Surgical Program Save (${activeSchema})...`);
                set({ isLoading: true });
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error("Authentication required to save programs.");

                    const programPayload = { 
                        name: programName, 
                        user_id: user.id, 
                        cycle_length: days.length 
                    };
                    if (existingProgramId) programPayload.id = existingProgramId;

                    // 1. UPSERT PROGRAM
                    const { data: program, error: progErr } = await supabase
                        .schema(activeSchema)
                        .from('programs')
                        .upsert([programPayload])
                        .select()
                        .single();
                    if (progErr) throw progErr;

                    const { data: library } = await supabase.schema(activeSchema).from('exercise_library').select('id, name');

                    // 2. GET EXISTING DATA FOR DIFFING
                    const { data: existingDays } = await supabase.schema(activeSchema).from('program_days').select('id').eq('program_id', program.id);
                    const existingDayIds = existingDays?.map(d => d.id) || [];
                    const incomingDayIds = days.map(d => d.id).filter(id => !id.includes('-') || id.length > 30); // simplistic UUID check

                    // 3. SURGICAL DAY SAVING
                    for (const day of days) {
                        const { data: progDay, error: dayErr } = await supabase
                            .schema(activeSchema)
                            .from('program_days')
                            .upsert([{ 
                                id: day.id.length > 30 ? day.id : undefined, // Only pass ID if it looks like a UUID
                                program_id: program.id, 
                                label: day.label, 
                                sequence_number: day.sequence_number 
                            }])
                            .select()
                            .single();
                        if (dayErr) throw dayErr;

                        // Upsert Session for this day
                        const { data: session, error: sessErr } = await supabase
                            .schema(activeSchema)
                            .from('sessions')
                            .upsert([{ 
                                program_day_id: progDay.id, 
                                name: `${day.label} SESSION` 
                            }], { onConflict: 'program_day_id' })
                            .select()
                            .single();
                        if (sessErr) throw sessErr;

                        // Get existing blocks for this session to diff
                        const { data: existingBlocks } = await supabase.schema(activeSchema).from('blocks').select('id').eq('session_id', session.id);
                        const existingBlockIds = existingBlocks?.map(b => b.id) || [];
                        const incomingBlockIds = day.blocks.map(b => b.id);

                        for (const block of day.blocks) {
                            const { data: v3Block, error: blockErr } = await supabase
                                .schema(activeSchema)
                                .from('blocks')
                                .upsert([{ 
                                    id: block.id.length > 30 ? block.id : undefined,
                                    session_id: session.id, 
                                    label: block.label, 
                                    block_type: block.block_type, 
                                    sort_order: block.sort_order 
                                }])
                                .select()
                                .single();
                            if (blockErr) throw blockErr;

                            // Diff Items
                            const { data: existingItems } = await supabase.schema(activeSchema).from('block_items').select('id').eq('session_block_id', v3Block.id);
                            const existingItemIds = existingItems?.map(i => i.id) || [];
                            const incomingItemIds = block.items.map(i => i.id);

                            for (const item of block.items) {
                                const libItem = library.find(l => l.name === item.name);
                                if (!libItem) continue;

                                const { error: itemErr } = await supabase
                                    .schema(activeSchema)
                                    .from('block_items')
                                    .upsert([{
                                        id: item.id.length > 30 ? item.id : undefined,
                                        session_block_id: v3Block.id,
                                        exercise_library_id: libItem.id,
                                        target_sets: parseInt(item.target_sets),
                                        target_reps: String(item.target_reps),
                                        target_weight: String(item.target_weight),
                                        target_rpe: String(item.target_rpe),
                                        tempo: String(item.tempo),
                                        metric_type: item.metric_type,
                                        sort_order: item.sort_order
                                    }]);
                                if (itemErr) throw itemErr;
                            }

                            // DELETE REMOVED ITEMS
                            const itemsToDelete = existingItemIds.filter(id => !incomingItemIds.includes(id));
                            if (itemsToDelete.length > 0) {
                                await supabase.schema(activeSchema).from('block_items').delete().in('id', itemsToDelete);
                            }
                        }

                        // DELETE REMOVED BLOCKS
                        const blocksToDelete = existingBlockIds.filter(id => !incomingBlockIds.includes(id));
                        if (blocksToDelete.length > 0) {
                            await supabase.schema(activeSchema).from('blocks').delete().in('id', blocksToDelete);
                        }
                    }

                    // DELETE REMOVED DAYS
                    const finalIncomingDayIds = days.map(d => d.id);
                    const daysToDelete = existingDayIds.filter(id => !finalIncomingDayIds.includes(id));
                    if (daysToDelete.length > 0) {
                        await supabase.schema(activeSchema).from('program_days').delete().in('id', daysToDelete);
                    }

                    console.log("✨ Program Saved Surgically!");
                    set({ activeProgramId: program.id }); 
                    await get().fetchProgramManifest();
                    set({ isLoading: false });
                    return true;
                } catch (err) { console.error("[Store V3] saveProgram FAILED:", err); set({ isLoading: false }); throw err; }
            }
        }),
                { 
                    name: `mp-v3-storage-${getActiveSchema()}`, // DYNAMIC KEY for isolation
                    storage: {
                        getItem: (name) => localStorage.getItem(name),
                        setItem: (name, value) => localStorage.setItem(name, value),
                        removeItem: (name) => localStorage.removeItem(name),
                    }
                }
            )
        );
        