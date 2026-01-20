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

            fetchRoutineDays: async () => {
                set({ isLoading: true });
                try {
                    const { data: days, error } = await supabase
                        .schema('v2')
                        .from('routine_days')
                        .select(`
                            *,
                            session_logs (
                                end_time,
                                start_time
                            )
                        `)
                        .order('sequence_number', { ascending: true });

                    if (error) throw error;

                    const processedDays = days.map(day => {
                        const sortedLogs = (day.session_logs || [])
                            .filter(l => l.end_time)
                            .sort((a, b) => new Date(b.end_time) - new Date(a.end_time));
                        
                        return {
                            ...day,
                            last_session: sortedLogs[0] || null
                        };
                    });

                    const allSessions = processedDays
                        .filter(d => d.last_session)
                        .map(d => d.last_session)
                        .sort((a, b) => new Date(b.end_time) - new Date(a.end_time));

                    let recommendedId = processedDays[0]?.id;
                    if (allSessions.length > 0) {
                        const lastGlobalSession = allSessions[0];
                        const lastDayObj = processedDays.find(d => 
                            days.find(orig => orig.id === d.id).session_logs.some(sl => sl.end_time === lastGlobalSession.end_time)
                        );
                        if (lastDayObj) {
                            const lastDayIdx = processedDays.findIndex(d => d.id === lastDayObj.id);
                            const nextIdx = (lastDayIdx + 1) % processedDays.length;
                            recommendedId = processedDays[nextIdx].id;
                        }
                    }

                    set({ 
                        availableRoutineDays: processedDays, 
                        recommendedDayId: recommendedId,
                        selectedDayId: recommendedId, 
                        isLoading: false 
                    });
                } catch (err) {
                    console.error("Failed to fetch routine:", err);
                    set({ isLoading: false });
                }
            },

            setSelectedDay: (id) => set({ selectedDayId: id }),

            setExpandedBlock: (blockId) => set({
                expandedBlockId: blockId
            }),

            startSession: async (dayId) => {
                set({ isLoading: true });
                try {
                    const { data: workout, error } = await supabase
                        .schema('v2')
                        .from('workouts')
                        .select(`
                            id,
                            name,
                            workout_blocks (
                                id, label, block_type, sort_order,
                                block_exercises (
                                    id, target_sets, target_reps, target_weight, target_rpe, target_tempo, sort_order,
                                    exercises ( name )
                                )
                            )
                        `)
                        .eq('routine_day_id', dayId)
                        .maybeSingle();

                    if (error) throw error;

                    if (!workout) {
                        const session = {
                            id: crypto.randomUUID(),
                            startTime: new Date().toISOString(),
                            routine_day_id: dayId,
                            isRestDay: true,
                            blocks: [],
                            logs: {}
                        };
                        set({ activeSession: session, isLoading: false });
                        return;
                    }

                    const session = {
                        id: crypto.randomUUID(),
                        startTime: new Date().toISOString(),
                        routine_day_id: dayId,
                        blocks: (workout.workout_blocks || []).sort((a,b) => a.sort_order - b.sort_order).map(b => ({
                            id: b.id,
                            label: b.label,
                            block_type: b.block_type,
                            exercises: (b.block_exercises || []).sort((a,b) => a.sort_order - b.sort_order).map(be => ({
                                id: be.id,
                                name: be.exercises.name,
                                target_sets: be.target_sets,
                                target_reps: be.target_reps,
                                target_weight: be.target_weight,
                                target_rpe: be.target_rpe,
                                target_tempo: be.target_tempo
                            }))
                        })),
                        logs: {}
                    };

                    set({ 
                        activeSession: session,
                        expandedBlockId: session.blocks[0]?.id,
                        systemStep: { 
                            blockId: session.blocks[0]?.id, 
                            exerciseId: session.blocks[0]?.exercises[0]?.id, 
                            round: 1 
                        },
                        activeFocusId: session.blocks[0]?.exercises[0]?.id,
                        isLoading: false
                    });
                } catch (err) {
                    console.error("Start session failed:", err);
                    set({ isLoading: false });
                }
            },

            finishSession: async () => {
                const session = get().activeSession;
                if (!session) return;

                set({ isLoading: true });
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    const { error } = await supabase
                        .schema('v2')
                        .from('session_logs')
                        .insert([{
                            user_id: user?.id, 
                            routine_day_id: session.routine_day_id,
                            start_time: session.startTime,
                            end_time: new Date().toISOString()
                        }]);

                    if (error) throw error;
                    set({ activeSession: null, systemStep: null, activeFocusId: null, expandedBlockId: null, isLoading: false });
                } catch (err) {
                    console.error("Finish session failed:", err);
                    set({ isLoading: false });
                }
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
                const isExerciseDone = isCircuit ? true : updatedLogs[exId].length >= totalSets;

                set({ activeSession: { ...session, logs: updatedLogs } });

                if (isExerciseDone) {
                    let next = null;
                    if (isCircuit) {
                        // Dynamic transition based on target_sets (rounds)
                        if (exIdx < block.exercises.length - 1) {
                            next = { blockId, exerciseId: block.exercises[exIdx + 1].id, round: state.systemStep.round };
                        } else if (state.systemStep.round < totalSets) {
                            next = { blockId, exerciseId: block.exercises[0].id, round: state.systemStep.round + 1 };
                        }
                    } else if (exId === state.systemStep?.exerciseId && exIdx < block.exercises.length - 1) {
                        next = { blockId, exerciseId: block.exercises[exIdx + 1].id, round: 1 };
                    }

                    // GLOBAL SEEK: Find first incomplete across entire plan
                    if (!next) {
                        for (const b of session.blocks) {
                            const firstIncompleteEx = b.exercises.find(e => {
                                const logs = updatedLogs[e.id] || [];
                                const tSets = parseInt(e.target_sets || 3);
                                return logs.length < tSets;
                            });
                            if (firstIncompleteEx) {
                                next = { blockId: b.id, exerciseId: firstIncompleteEx.id, round: 1 };
                                break;
                            }
                        }
                    }
                    set({ systemStep: next, activeFocusId: next?.exerciseId || null, expandedBlockId: next?.blockId || null });
                }
            },

            updateLogEntry: (exId, logId, field, value) => {
                const session = get().activeSession;
                if (!session) return;
                const updatedLogs = { ...session.logs, [exId]: (session.logs[exId] || []).map(l => l.id === logId ? { ...l, [field]: value } : l) };
                set({ activeSession: { ...session, logs: updatedLogs } });
            },

            resetStore: () => set({ activeSession: null, systemStep: null, activeFocusId: null, expandedBlockId: null, selectedDayId: null })
        }),
        { name: 'mp-training-storage-v22' }
    )
);