import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getActiveSchema } from '../../../supabaseClient';

// Slices
import { createProgramSlice } from './slices/programSlice';
import { createSessionSlice } from './slices/sessionSlice';
import { createHistorySlice } from './slices/historySlice';
import { createUISlice } from './slices/uiSlice';
import { createSleepSlice } from './slices/sleepSlice';

export const useProgramStore = create(
    persist(
        (set, get) => ({
            ...createProgramSlice(set, get),
            ...createSessionSlice(set, get),
            ...createHistorySlice(set, get),
            ...createUISlice(set, get),
            ...createSleepSlice(set, get)
        }),
        {
            name: `mp-v3-storage-${getActiveSchema()}`,
            partialize: (state) => ({
                activeProgramId: state.activeProgramId,
                lastView: state.lastView,
                activeSession: state.activeSession,
                retroactiveDate: state.retroactiveDate,
                activeSleepSession: state.activeSleepSession
            })
        }
    )
);