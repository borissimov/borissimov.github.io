import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTrainingStore = create(
    persist(
        (set, get) => ({
            activeSession: null,
            // Single focus at block level
            expandedBlockId: null,
            systemStep: null, 
            activeFocusId: null,

            startSession: (date) => {
                const session = { 
                    id: crypto.randomUUID(), date, startTime: new Date().toISOString(),
                    blocks: [
                        { id: 'b1', label: 'Circuit Phase 1: Warmup', block_type: 'CIRCUIT', exercises: [
                            { id: 'c1_1', name: 'Jumping Jacks', target_sets: '3', target_reps: '30', target_weight: 'BW', target_rpe: '5', target_tempo: 'FAST' },
                            { id: 'c1_2', name: 'Mountain Climbers', target_sets: '3', target_reps: '20', target_weight: 'BW', target_rpe: '6', target_tempo: 'STEADY' },
                            { id: 'c1_3', name: 'Bodyweight Squats', target_sets: '3', target_reps: '15', target_weight: 'BW', target_rpe: '5', target_tempo: '2-0-2-0' }
                        ]},
                        { id: 'b2', label: 'Circuit Phase 2: Power', block_type: 'CIRCUIT', exercises: [
                            { id: 'c2_1', name: 'KB Swings', target_sets: '3', target_reps: '20', target_weight: '24', target_rpe: '8', target_tempo: 'EXPL' },
                            { id: 'c2_2', name: 'Box Jumps', target_sets: '3', target_reps: '10', target_weight: 'High', target_rpe: '9', target_tempo: 'EXPL' },
                            { id: 'c2_3', name: 'Medicine Ball Slams', target_sets: '3', target_reps: '12', target_weight: '10', target_rpe: '8', target_tempo: 'FAST' }
                        ]},
                        { id: 'b3', label: 'Circuit Phase 3: Metabolic', block_type: 'CIRCUIT', exercises: [
                            { id: 'c3_1', name: 'Burpees', target_sets: '3', target_reps: '12', target_weight: 'BW', target_rpe: '10', target_tempo: 'MAX' },
                            { id: 'c3_2', name: 'Battle Ropes', target_sets: '3', target_reps: '30s', target_weight: 'Heavy', target_rpe: '9', target_tempo: 'FAST' },
                            { id: 'c3_3', name: 'Plank Jacks', target_sets: '3', target_reps: '20', target_weight: 'BW', target_rpe: '7', target_tempo: 'STEADY' }
                        ]},
                        { id: 'b4', label: 'Hypertrophy: Accessory', block_type: 'STANDARD', exercises: [
                            { id: 's1', name: 'Lateral Raises', target_sets: '3', target_reps: '15', target_weight: '10', target_rpe: '9', target_tempo: '2-0-2-0' },
                            { id: 's2', name: 'Tricep Pushdowns', target_sets: '3', target_reps: '12', target_weight: '25', target_rpe: '8', target_tempo: '2-0-1-1' },
                            { id: 's3', name: 'Bicep Curls', target_sets: '3', target_reps: '12', target_weight: '15', target_rpe: '8', target_tempo: '3-0-1-0' },
                            { id: 's4', name: 'Face Pulls', target_sets: '3', target_reps: '20', target_weight: '20', target_rpe: '7', target_tempo: '2-1-2-1' },
                            { id: 's5', name: 'Hammer Curls', target_sets: '3', target_reps: '10', target_weight: '12', target_rpe: '9', target_tempo: '2-0-1-0' },
                            { id: 's6', name: 'Reverse Flys', target_sets: '3', target_reps: '15', target_weight: '8', target_rpe: '8', target_tempo: '2-0-2-0' }
                        ]}
                    ],
                    logs: {}
                };

                set({ 
                    activeSession: session,
                    expandedBlockId: 'b1',
                    systemStep: { blockId: 'b1', exerciseId: 'c1_1', round: 1 },
                    activeFocusId: 'c1_1'
                });
            },

            // Set specific block as the ONLY one expanded
            setExpandedBlock: (blockId) => set({
                expandedBlockId: blockId
            }),

            toggleFocus: (exId, blockId) => set((state) => {
                const isClosing = state.activeFocusId === exId;
                const newState = { 
                    activeFocusId: isClosing ? null : exId,
                    expandedBlockId: blockId // Ensure parent block stays open
                };
                
                if (!isClosing && blockId && blockId !== state.systemStep?.blockId) {
                    const block = state.activeSession.blocks.find(b => b.id === blockId);
                    const firstIncomplete = block.exercises.find(e => {
                        const logs = state.activeSession.logs[e.id] || [];
                        const tSets = parseInt(e.target_sets || 3);
                        return logs.length < tSets;
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
                set({ activeSession: { ...session, logs: updatedLogs } });

                const blockIdx = session.blocks.findIndex(b => b.id === blockId);
                const block = session.blocks[blockIdx];
                const exIdx = block.exercises.findIndex(e => e.id === exId);
                const totalSets = parseInt(block.exercises[exIdx].target_sets || 3);
                const isExerciseDoneNow = isCircuit ? true : updatedLogs[exId].length >= totalSets;

                if (isExerciseDoneNow) {
                    let next = null;
                    if (isCircuit) {
                        if (exIdx < block.exercises.length - 1) next = { blockId, exerciseId: block.exercises[exIdx + 1].id, round: state.systemStep.round };
                        else if (state.systemStep.round < 3) next = { blockId, exerciseId: block.exercises[0].id, round: state.systemStep.round + 1 };
                    } else {
                        const remainingExercisesInBlock = block.exercises.slice(exIdx + 1);
                        const nextIncompleteInBlock = remainingExercisesInBlock.find(e => {
                            const l = updatedLogs[e.id] || [];
                            return l.length < parseInt(e.target_sets || 3);
                        });
                        if (nextIncompleteInBlock) next = { blockId, exerciseId: nextIncompleteInBlock.id, round: 1 };
                    }

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

                    set({ 
                        systemStep: next, 
                        activeFocusId: next?.exerciseId || null,
                        expandedBlockId: next?.blockId || null // AUTO-SNAP BLOCK
                    });
                }
            },

            updateLogEntry: (exId, logId, field, value) => {
                const session = get().activeSession;
                if (!session) return;
                const updatedLogs = { ...session.logs, [exId]: (session.logs[exId] || []).map(l => l.id === logId ? { ...l, [field]: value } : l) };
                set({ activeSession: { ...session, logs: updatedLogs } });
            },

            resetStore: () => set({ activeSession: null, systemStep: null, activeFocusId: null, expandedBlockId: null })
        }),
        { name: 'mp-training-storage-v18' }
    )
);