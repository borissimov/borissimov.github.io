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
                    blocks: [],
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
