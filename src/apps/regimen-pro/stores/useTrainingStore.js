import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTrainingStore = create(
    persist(
        (set, get) => ({
            activeSession: null,
            collapsedBlocks: [],
            
            // SYSTEM CHOICE: Always exists
            systemStep: null, 
            // ACTIVE FOCUS: What is currently expanded (can be null!)
            activeFocusId: null,

            startSession: (date) => {
                const session = { 
                    id: crypto.randomUUID(), date, startTime: new Date().toISOString(),
                    blocks: [
                        { id: 'b1', label: 'Strength Phase', block_type: 'STANDARD', exercises: [
                            { id: 'e1', name: 'Barbell Squats', target_sets: '3', target_reps: '5', target_weight: '100', target_rpe: '8', target_tempo: '3-0-1-0' },
                            { id: 'e2', name: 'Bench Press', target_sets: '3', target_reps: '8', target_weight: '80', target_rpe: '9', target_tempo: '2-0-1-0' },
                            { id: 'e3', name: 'Deadlifts', target_sets: '2', target_reps: '5', target_weight: '140', target_rpe: '8', target_tempo: '1-0-1-0' },
                            { id: 'e4', name: 'Overhead Press', target_sets: '3', target_reps: '10', target_weight: '50', target_rpe: '9', target_tempo: '2-0-1-0' }
                        ]},
                        { id: 'b2', label: 'Power Circuit', block_type: 'CIRCUIT', exercises: [
                            { id: 'c1', name: 'Kettlebell Swings', target_reps: '20', target_weight: '24', target_rpe: '9', target_tempo: 'X-0-X-0' },
                            { id: 'c2', name: 'Goblet Squats', target_reps: '15', target_weight: '24', target_rpe: '8', target_tempo: '3-0-1-0' },
                            { id: 'c3', name: 'Push-ups', target_reps: 'MAX', target_weight: 'BW', target_rpe: '10', target_tempo: '1-0-1-0' },
                            { id: 'c4', name: 'Pull-ups', target_reps: '8', target_weight: 'BW', target_rpe: '9', target_tempo: '2-0-1-2' },
                            { id: 'c5', name: 'Burpees', target_reps: '12', target_weight: 'BW', target_rpe: '10', target_tempo: 'X-X-X-X' },
                            { id: 'c6', name: 'Box Jumps', target_reps: '10', target_weight: 'High', target_rpe: '8', target_tempo: 'EXPL' },
                            { id: 'c7', name: 'Battle Ropes', target_reps: '30s', target_weight: 'Heavy', target_rpe: '10', target_tempo: 'FAST' }
                        ]}
                    ],
                    logs: {}
                };

                set({ 
                    activeSession: session,
                    collapsedBlocks: [],
                    systemStep: { blockId: 'b1', exerciseId: 'e1', round: 1 },
                    activeFocusId: 'e1' // Initial focus
                });
            },

            toggleFocus: (exId) => set((state) => ({
                activeFocusId: state.activeFocusId === exId ? null : exId
            })),

            addLogEntry: (exId, blockId, data, isCircuit) => {
                const state = get();
                const session = state.activeSession;
                if (!session) return;

                const exLogs = session.logs[exId] || [];
                const updatedLogs = { ...session.logs, [exId]: [...exLogs, { ...data, id: Date.now() }] };
                set({ activeSession: { ...session, logs: updatedLogs } });

                if (exId === state.systemStep?.exerciseId) {
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
                        } else if (exIdx < block.exercises.length - 1) {
                            next = { blockId, exerciseId: block.exercises[exIdx + 1].id, round: 1 };
                        }

                        if (!next && blockIdx < session.blocks.length - 1) {
                            const nextBlock = session.blocks[blockIdx + 1];
                            next = { blockId: nextBlock.id, exerciseId: nextBlock.exercises[0].id, round: 1 };
                        }

                        set({ systemStep: next, activeFocusId: next?.exerciseId || null });
                    }
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
        { name: 'mp-training-storage-v12' }
    )
);