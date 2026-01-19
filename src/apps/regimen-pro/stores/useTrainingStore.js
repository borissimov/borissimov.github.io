import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTrainingStore = create(
    persist(
        (set, get) => ({
            activeSession: null,
            collapsedBlocks: [],
            systemStep: null, 
            activeFocusId: null,

            startSession: (date) => {
                const session = { 
                    id: crypto.randomUUID(), date, startTime: new Date().toISOString(),
                    blocks: [
                        { id: 'b1', label: 'Strength Phase', block_type: 'STANDARD', exercises: [
                            { id: 'e1', name: 'Barbell Squats', target_sets: '3', target_reps: '5', target_weight: '100', target_rpe: '8', target_tempo: '3-0-1-0' },
                            { id: 'e2', name: 'Bench Press', target_sets: '3', target_reps: '8', target_weight: '80', target_rpe: '9', target_tempo: '2-0-1-0' }
                        ]},
                        { id: 'b2', label: 'Power Circuit', block_type: 'CIRCUIT', exercises: [
                            { id: 'c1', name: 'Kettlebell Swings', target_reps: '20', target_weight: '24', target_rpe: '9', target_tempo: 'X-0-X-0' },
                            { id: 'c2', name: 'Goblet Squats', target_reps: '15', target_weight: '24', target_rpe: '8', target_tempo: '3-0-1-0' }
                        ]},
                        { id: 'b3', label: 'Core & Recovery', block_type: 'STANDARD', exercises: [
                            { id: 'r1', name: 'Plank', target_sets: '3', target_reps: '60s', target_weight: 'BW', target_rpe: '7', target_tempo: 'HOLD' },
                            { id: 'r2', name: 'Stretching', target_sets: '1', target_reps: '5m', target_weight: 'Relax', target_rpe: '0', target_tempo: 'SLOW' }
                        ]}
                    ],
                    logs: {}
                };

                set({ 
                    activeSession: session,
                    collapsedBlocks: [],
                    systemStep: { blockId: 'b1', exerciseId: 'e1', round: 1 },
                    activeFocusId: 'e1'
                });
            },

            // REFINED SHADOW: Only teleport if switching BLOCKS
            toggleFocus: (exId, blockId) => set((state) => {
                const isClosing = state.activeFocusId === exId;
                const newState = { activeFocusId: isClosing ? null : exId };
                
                // If opening an exercise in a NEW block, move the system cursor there
                if (!isClosing && blockId && blockId !== state.systemStep?.blockId) {
                    const block = state.activeSession.blocks.find(b => b.id === blockId);
                    const firstIncomplete = block.exercises.find(e => {
                        const logs = state.activeSession.logs[e.id] || [];
                        const tSets = parseInt(e.target_sets || 3);
                        return logs.length < tSets;
                    }) || block.exercises[0];

                    newState.systemStep = { 
                        blockId, 
                        exerciseId: firstIncomplete.id, 
                        round: state.systemStep?.round || 1 
                    };
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
                const isExerciseDone = isCircuit ? true : updatedLogs[exId].length >= totalSets;

                if (isExerciseDone) {
                    let next = null;
                    if (isCircuit) {
                        if (exIdx < block.exercises.length - 1) next = { blockId, exerciseId: block.exercises[exIdx + 1].id, round: state.systemStep.round };
                        else if (state.systemStep.round < 3) next = { blockId, exerciseId: block.exercises[0].id, round: state.systemStep.round + 1 };
                    } else if (exId === state.systemStep?.exerciseId && exIdx < block.exercises.length - 1) {
                        next = { blockId, exerciseId: block.exercises[exIdx + 1].id, round: 1 };
                    }

                    // Seek first incomplete overall if block finished
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

                    set({ systemStep: next, activeFocusId: next?.exerciseId || null });
                }
            },

            updateLogEntry: (exId, logId, field, value) => {
                const session = get().activeSession;
                if (!session) return;
                const updatedLogs = { ...session.logs, [exId]: (session.logs[exId] || []).map(l => l.id === logId ? { ...l, [field]: value } : l) };
                set({ activeSession: { ...session, logs: updatedLogs } });
            },

            toggleBlockCollapse: (blockId) => set((state) => ({
                collapsedBlocks: state.collapsedBlocks.includes(blockId) ? state.collapsedBlocks.filter(id => id !== blockId) : [...state.collapsedBlocks, blockId]
            })),

            setBlockCollapsed: (blockId, isCollapsed) => set((state) => ({
                collapsedBlocks: isCollapsed ? [...new Set([...state.collapsedBlocks, blockId])] : state.collapsedBlocks.filter(id => id !== blockId)
            })),

            resetStore: () => set({ activeSession: null, systemStep: null, activeFocusId: null, collapsedBlocks: [] })
        }),
        { name: 'mp-training-storage-v15' }
    )
);