import { DB } from '../../services/database.service';
import { supabase } from '../../../../supabaseClient';

export const createSessionSlice = (set, get) => ({
    activeSession: null,
    expandedBlockId: null,
    systemStep: null,
    activeFocusId: null,
    retroactiveDate: null,

    // Session Progress Analytics
    getSessionProgress: () => {
        const session = get().activeSession;
        if (!session || !session.blocks) return { totalTarget: 0, totalLogged: 0, percent: 0 };

        let totalTarget = 0;
        let totalLogged = 0;

        session.blocks.forEach(block => {
            (block.items || []).forEach(item => {
                const target = parseInt(item.target_sets || 3);
                const logged = (session.logs[item.id] || []).length;
                totalTarget += target;
                totalLogged += Math.min(logged, target);
            });
        });

        const percent = totalTarget > 0 ? (totalLogged / totalTarget) * 100 : 0;
        return { totalTarget, totalLogged, percent };
    },

    getWorkoutLabel: () => {
        const session = get().activeSession;
        if (!session) return 'Activity';
        return get().programDays.find(d => d.id === session.program_day_id)?.label || 'Activity';
    },

    startSession: async (dayId, customDate = null) => {
        set({ isLoading: true, retroactiveDate: customDate });
        try {
            const { data: days, error } = await DB.fetchDeepProgram(); // This needs dayId filter
            // Refactor: We need a specific fetcher for startSession in DB service
            const { data: sessionTemplate } = await supabase
                .schema(get().activeSchema)
                .from('sessions')
                .select(`
                    id, name, session_focus, 
                    blocks ( 
                        id, label, block_type, sort_order, 
                        block_items ( 
                            id, exercise_library_id, target_sets, target_reps, target_weight, target_rpe, tempo, set_targets, metric_type, sort_order, 
                            exercise_library ( name, technique_cues ) 
                        ) 
                    )
                `)
                .eq('program_day_id', dayId)
                .maybeSingle();

            if (!sessionTemplate) {
                console.warn("[SessionSlice] No session template found.");
                set({ isLoading: false });
                return;
            }

            const activeBlocks = (sessionTemplate.blocks || [])
                .filter(b => !b.label?.startsWith('HISTORY') && !b.label?.startsWith('ARCHIVED'))
                .sort((a,b) => a.sort_order - b.sort_order);

            const session = {
                id: crypto.randomUUID(),
                startTime: customDate || new Date().toISOString(),
                program_day_id: dayId,
                sessionFocus: sessionTemplate.session_focus,
                blocks: activeBlocks.map(b => ({
                    id: b.id,
                    label: b.label,
                    block_type: b.block_type,
                    items: (b.block_items || []).sort((a,b) => a.sort_order - b.sort_order).map(bi => ({
                        id: bi.id,
                        exercise_library_id: bi.exercise_library_id,
                        name: bi.exercise_library.name,
                        target_sets: bi.target_sets,
                        target_reps: bi.target_reps,
                        target_weight: bi.target_weight,
                        target_rpe: bi.target_rpe,
                        tempo: bi.tempo,
                        metric_type: bi.metric_type
                    }))
                })),
                logs: {}
            };

            set({ 
                activeSession: session, 
                expandedBlockId: session.blocks[0]?.id, 
                activeFocusId: session.blocks[0]?.items[0]?.id,
                systemStep: { blockId: session.blocks[0]?.id, itemId: session.blocks[0]?.items[0]?.id, round: 1 },
                isLoading: false 
            });
        } catch (err) {
            console.error("[SessionSlice] startSession FAILED:", err);
            set({ isLoading: false });
        }
    },

    finishSession: async () => {
        const session = get().activeSession;
        if (!session) return;
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            const sessionPayload = { 
                user_id: user?.id, 
                program_day_id: session.program_day_id, 
                start_time: session.startTime, 
                end_time: get().retroactiveDate ? session.startTime : new Date().toISOString() 
            };

            const { data: sessionData, error: sessionError } = await DB.insertCompletedSession(sessionPayload);
            if (sessionError) throw sessionError;

            const logsToInsert = [];
            Object.entries(session.logs).forEach(([itemId, sets]) => {
                let snapshotName = null;
                let snapshotTarget = null;

                for (const b of session.blocks) {
                    const item = b.items.find(i => i.id === itemId);
                    if (item) {
                        snapshotName = item.name;
                        snapshotTarget = `${item.target_sets}x${item.target_reps} @ ${item.target_weight}`;
                        break;
                    }
                }

                sets.forEach((setEntry, index) => {
                    logsToInsert.push({
                        completed_session_id: sessionData.id,
                        block_item_id: itemId,
                        exercise_name_snapshot: snapshotName,
                        target_snapshot: snapshotTarget,
                        weight: String(setEntry.weight),
                        reps: parseInt(setEntry.reps) || 0,
                        rpe: parseFloat(setEntry.rpe) || null,
                        set_number: index + 1,
                        created_at: session.startTime
                    });
                });
            });

            if (logsToInsert.length > 0) {
                const { error: logsError } = await DB.insertPerformanceLogs(logsToInsert);
                if (logsError) throw logsError;
            }

            set({ activeSession: null, systemStep: null, activeFocusId: null, retroactiveDate: null, isLoading: false });
        } catch (err) {
            console.error("[SessionSlice] finishSession FAILED:", err);
            set({ isLoading: false });
            throw err;
        }
    },

    addLogEntry: (itemId, blockId, data, isCircuit) => {
        const session = get().activeSession;
        if (!session) return;
        
        const updatedLogs = { ...session.logs, [itemId]: [...(session.logs[itemId] || []), { ...data, id: Date.now() }] };
        set({ activeSession: { ...session, logs: updatedLogs } });

        // Focus advancing logic...
        const block = session.blocks.find(b => b.id === blockId);
        const itemIdx = block.items.findIndex(i => i.id === itemId);
        const totalSets = parseInt(block.items[itemIdx].target_sets || 3);

        let next = null;
        if (isCircuit) {
            if (itemIdx < block.items.length - 1) next = { blockId, itemId: block.items[itemIdx + 1].id, round: get().systemStep.round };
            else if (get().systemStep.round < totalSets) next = { blockId, itemId: block.items[0].id, round: get().systemStep.round + 1 };
        } else if (updatedLogs[itemId].length >= totalSets) {
            if (itemIdx < block.items.length - 1) next = { blockId, itemId: block.items[itemIdx + 1].id, round: 1 };
        }

        if (next) set({ systemStep: next, activeFocusId: next.itemId, expandedBlockId: next.blockId });
    },

    resetStore: () => set({ activeSession: null, systemStep: null, activeFocusId: null, expandedBlockId: null, retroactiveDate: null }),
    setExpandedBlock: (id) => set({ expandedBlockId: id })
});
