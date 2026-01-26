import { DB } from '../../services/database.service';
import { supabase } from '../../../../supabaseClient';

export const createProgramSlice = (set, get) => ({
    programs: [],
    activeProgramId: null,
    showArchivedPrograms: false,
    programDays: [],
    recommendedDayId: null,
    selectedDayId: null,
    uniqueExercises: [],

    setShowArchivedPrograms: (show) => {
        set({ showArchivedPrograms: show });
        get().fetchProgramManifest();
    },

    setActiveProgramId: (id) => {
        set({ activeProgramId: id, selectedDayId: null });
        get().fetchProgramManifest();
    },

    fetchProgramManifest: async () => {
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: progs, error: progsErr } = await DB.fetchPrograms(get().showArchivedPrograms);
            if (progsErr) throw progsErr;

            let currentActiveId = get().activeProgramId;
            if (!currentActiveId && progs.length > 0) {
                const activeOnes = progs.filter(p => !p.archived_at);
                currentActiveId = activeOnes.length > 0 ? activeOnes[0].id : progs[0].id;
            }

            let processedDays = [];
            if (currentActiveId) {
                const { data: days } = await DB.fetchProgramDays(currentActiveId);
                const { data: sessions } = await DB.fetchSessions();
                const { data: blocks } = await DB.fetchBlocks();
                const { data: items } = await DB.fetchBlockItems();
                const { data: history } = await DB.fetchGlobalHistory(user?.id);

                const latestDaySessions = {};
                history.forEach(log => {
                    if (!latestDaySessions[log.program_day_id]) latestDaySessions[log.program_day_id] = log.id;
                });

                const sessionIdsToFetch = Object.values(latestDaySessions);
                let snapshots = [];
                if (sessionIdsToFetch.length > 0) {
                    const { data: sData } = await supabase
                        .schema(get().activeSchema)
                        .from('performance_logs')
                        .select('completed_session_id, block_item_id, weight, reps')
                        .in('completed_session_id', sessionIdsToFetch);
                    snapshots = sData || [];
                }

                processedDays = days.map(day => {
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
            }

            let recommendedId = processedDays[0]?.id;
            const history = await DB.fetchGlobalHistory(user?.id);
            if (history.data?.length > 0) {
                const lastGlobalSession = history.data[0];
                const lastDayIdx = processedDays.findIndex(d => d.id === lastGlobalSession.program_day_id);
                if (lastDayIdx !== -1) recommendedId = processedDays[(lastDayIdx + 1) % processedDays.length].id;
            }

            set({
                programs: progs,
                activeProgramId: currentActiveId,
                programDays: processedDays,
                recommendedDayId: recommendedId,
                selectedDayId: get().selectedDayId === null ? recommendedId : (processedDays.some(d => d.id === get().selectedDayId) ? get().selectedDayId : recommendedId),
                isLoading: false
            });
        } catch (err) {
            console.error("[ProgramSlice] fetchProgramManifest FAILED:", err);
            set({ isLoading: false });
        }
    },

    saveProgram: async (programName, days, existingProgramId = null) => {
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const programPayload = { name: programName, user_id: user.id, cycle_length: days.length };
            if (existingProgramId) programPayload.id = existingProgramId;

            const { data: program } = await DB.upsertProgram(programPayload);
            const { data: library } = await DB.fetchExerciseLibrary();

            const { data: existingDays } = await DB.fetchProgramDays(program.id);
            const existingDayIds = existingDays?.map(d => d.id) || [];

            for (const day of days) {
                const { data: progDay } = await supabase.schema(get().activeSchema).from('program_days').upsert([{ 
                    id: day.id.length > 30 ? day.id : undefined,
                    program_id: program.id, label: day.label, sequence_number: day.sequence_number 
                }]).select().single();

                const { data: session } = await supabase.schema(get().activeSchema).from('sessions').upsert([{ 
                    program_day_id: progDay.id, name: `${day.label} SESSION` 
                }], { onConflict: 'program_day_id' }).select().single();

                const { data: existingBlocks } = await supabase.schema(get().activeSchema).from('blocks').select('id').eq('session_id', session.id);
                const existingBlockIds = existingBlocks?.map(b => b.id) || [];
                const incomingBlockIds = day.blocks.map(b => b.id);

                for (const block of day.blocks) {
                    const { data: v3Block } = await supabase.schema(get().activeSchema).from('blocks').upsert([{ 
                        id: block.id.length > 30 ? block.id : undefined,
                        session_id: session.id, label: block.label, block_type: block.block_type, sort_order: block.sort_order 
                    }]).select().single();

                    const { data: existingItems } = await supabase.schema(get().activeSchema).from('block_items').select('id').eq('session_block_id', v3Block.id);
                    const existingItemIds = existingItems?.map(i => i.id) || [];
                    const incomingItemIds = block.items.map(i => i.id);

                    for (const item of block.items) {
                        const libItem = library.find(l => l.name === item.name);
                        if (!libItem) continue;
                        await supabase.schema(get().activeSchema).from('block_items').upsert([{
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
                    }
                    const itemsToDelete = existingItemIds.filter(id => !incomingItemIds.includes(id));
                    if (itemsToDelete.length > 0) await supabase.schema(get().activeSchema).from('block_items').delete().in('id', itemsToDelete);
                }
                const blocksToDelete = existingBlockIds.filter(id => !incomingBlockIds.includes(id));
                if (blocksToDelete.length > 0) await supabase.schema(get().activeSchema).from('blocks').delete().in('id', blocksToDelete);
            }
            const finalIncomingDayIds = days.map(d => d.id);
            const daysToDelete = existingDayIds.filter(id => !finalIncomingDayIds.includes(id));
            if (daysToDelete.length > 0) await supabase.schema(get().activeSchema).from('program_days').delete().in('id', daysToDelete);

            await get().fetchProgramManifest();
            set({ isLoading: false });
            return true;
        } catch (err) { console.error("[ProgramSlice] saveProgram FAILED:", err); set({ isLoading: false }); throw err; }
    },

    archiveProgram: async (programId) => {
        set({ isLoading: true });
        try {
            await DB.setProgramArchivedStatus(programId, new Date().toISOString());
            if (get().activeProgramId === programId) set({ activeProgramId: null });
            await get().fetchProgramManifest();
            set({ isLoading: false });
        } catch (err) { console.error("[ProgramSlice] archiveProgram FAILED:", err); set({ isLoading: false }); throw err; }
    },

    unarchiveProgram: async (programId) => {
        set({ isLoading: true });
        try {
            await DB.setProgramArchivedStatus(programId, null);
            await get().fetchProgramManifest();
            set({ isLoading: false });
        } catch (err) { console.error("[ProgramSlice] unarchiveProgram FAILED:", err); set({ isLoading: false }); throw err; }
    },

    fetchProgramDetails: async (programId) => {
        set({ isLoading: true });
        try {
            const { data: program } = await supabase.schema(get().activeSchema).from('programs').select('*').eq('id', programId).single();
            const { data: days } = await DB.fetchDeepProgram(programId);

            const hydratedDays = days.map(d => {
                const session = Array.isArray(d.sessions) ? d.sessions[0] : d.sessions;
                const blocks = (session?.blocks || []).sort((a,b) => a.sort_order - b.sort_order);
                return {
                    id: d.id, label: d.label, sequence_number: d.sequence_number,
                    blocks: blocks.map(b => ({
                        id: b.id, label: b.label, block_type: b.block_type, sort_order: b.sort_order,
                        items: (b.block_items || []).sort((a,b) => a.sort_order - b.sort_order).map(i => ({
                            id: i.id, name: i.exercise_library.name, target_sets: i.target_sets, target_reps: i.target_reps,
                            target_weight: i.target_weight, target_rpe: i.target_rpe, tempo: i.tempo, metric_type: i.metric_type, sort_order: i.sort_order
                        }))
                    }))
                };
            });
            set({ isLoading: false });
            return { name: program.name, days: hydratedDays };
        } catch (err) { console.error("[ProgramSlice] fetchProgramDetails FAILED:", err); set({ isLoading: false }); throw err; }
    },

    fetchUniqueExercises: async () => {
        const { data } = await DB.fetchExerciseLibrary();
        set({ uniqueExercises: [...new Set(data.map(e => e.name))] });
    },

    setSelectedDay: (id) => set({ selectedDayId: get().selectedDayId === id ? null : id })
});