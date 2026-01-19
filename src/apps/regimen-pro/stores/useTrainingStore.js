import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTrainingStore = create(
    persist(
        (set, get) => ({
            activeSession: null,
            isSyncing: false,
            collapsedBlocks: [],
            collapsedExercises: [],

            startSession: (date) => set({ 
                collapsedBlocks: [],
                collapsedExercises: [],
                activeSession: { 
                    id: crypto.randomUUID(), 
                    date, 
                    startTime: new Date().toISOString(),
                    blocks: [
                        {
                            id: 'b1',
                            label: 'Strength Phase',
                            block_type: 'STANDARD',
                            exercises: [
                                { id: 'e1', name: 'Barbell Squats', target_sets: '3', target_reps: '5', target_weight: '100', target_rpe: '8', target_tempo: '3-0-1-0' },
                                { id: 'e2', name: 'Bench Press', target_sets: '3', target_reps: '8', target_weight: '80', target_rpe: '9', target_tempo: '2-0-1-0' },
                                { id: 'e3', name: 'Deadlifts', target_sets: '2', target_reps: '5', target_weight: '140', target_rpe: '8', target_tempo: '1-0-1-0' },
                                { id: 'e4', name: 'Overhead Press', target_sets: '3', target_reps: '10', target_weight: '50', target_rpe: '9', target_tempo: '2-0-1-0' }
                            ]
                        },
                        {
                            id: 'b2',
                            label: 'Power Circuit',
                            block_type: 'CIRCUIT',
                            exercises: [
                                { id: 'c1', name: 'Kettlebell Swings', target_reps: '20', target_weight: '24', target_rpe: '9', target_tempo: 'X-0-X-0' },
                                { id: 'c2', name: 'Goblet Squats', target_reps: '15', target_weight: '24', target_rpe: '8', target_tempo: '3-0-1-0' },
                                { id: 'c3', name: 'Push-ups', target_reps: 'MAX', target_weight: 'BW', target_rpe: '10', target_tempo: '1-0-1-0' },
                                { id: 'c4', name: 'Pull-ups', target_reps: '8', target_weight: 'BW', target_rpe: '9', target_tempo: '2-0-1-2' },
                                { id: 'c5', name: 'Burpees', target_reps: '12', target_weight: 'BW', target_rpe: '10', target_tempo: 'X-X-X-X' },
                                { id: 'c6', name: 'Box Jumps', target_reps: '10', target_weight: 'High', target_rpe: '8', target_tempo: 'EXPL' },
                                { id: 'c7', name: 'Battle Ropes', target_reps: '30s', target_weight: 'Heavy', target_rpe: '10', target_tempo: 'FAST' }
                            ]
                        }
                    ],
                    notes: ''
                } 
            }),

            toggleBlockCollapse: (blockId) => set((state) => ({
                collapsedBlocks: state.collapsedBlocks.includes(blockId)
                    ? state.collapsedBlocks.filter(id => id !== blockId)
                    : [...state.collapsedBlocks, blockId]
            })),

            toggleExerciseCollapse: (exId) => set((state) => ({
                collapsedExercises: state.collapsedExercises.includes(exId)
                    ? state.collapsedExercises.filter(id => id !== exId)
                    : [...state.collapsedExercises, exId]
            })),

            setExerciseCollapsed: (exId, isCollapsed) => set((state) => ({
                collapsedExercises: isCollapsed 
                    ? [...new Set([...state.collapsedExercises, exId])]
                    : state.collapsedExercises.filter(id => id !== exId)
            })),

            resetStore: () => set({ activeSession: null, isSyncing: false, collapsedBlocks: [], collapsedExercises: [] })
        }),
        {
            name: 'mp-training-storage-v5', 
        }
    )
);