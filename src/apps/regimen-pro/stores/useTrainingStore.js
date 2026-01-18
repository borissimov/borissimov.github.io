import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTrainingStore = create(
    persist(
        (set, get) => ({
            activeSession: null, // { id, date, startTime, blocks: [] }
            isSyncing: false,

            startSession: (date) => set({ 
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
                                { id: 'e1', name: 'Barbell Squats', target_sets: '3', target_reps: '5', target_weight: '100kg' }
                            ]
                        },
                        {
                            id: 'b2',
                            label: 'Core Burnout',
                            block_type: 'CIRCUIT',
                            exercises: [
                                { id: 'e2', name: 'Plank', target_reps: '60s', target_weight: 'BW' },
                                { id: 'e3', name: 'Leg Raises', target_reps: '15', target_weight: 'BW' }
                            ]
                        }
                    ],
                    notes: ''
                } 
            }),

            endSession: () => set((state) => ({
                activeSession: state.activeSession ? { 
                    ...state.activeSession, 
                    endTime: new Date().toISOString() 
                } : null
            })),

            logSet: (blockId, exerciseId, setNumber, roundNumber, data) => set((state) => {
                if (!state.activeSession) return state;
                
                // Logic to update local logs within the session
                // In V2, we also trigger a background sync to Supabase (TanStack Query handles that better)
                return {
                    // update state logic here
                };
            }),

            resetStore: () => set({ activeSession: null, isSyncing: false })
        }),
        {
            name: 'mp-training-storage', // key in IndexedDB/LocalStorage
        }
    )
);
