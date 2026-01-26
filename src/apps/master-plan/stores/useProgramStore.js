import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getActiveSchema } from '../../../supabaseClient';

// Slices
import { createUISlice } from './slices/uiSlice';
import { createProgramSlice } from './slices/programSlice';
import { createSessionSlice } from './slices/sessionSlice';
import { createHistorySlice } from './slices/historySlice';

/**
 * MASTER PROGRAM STORE (Native V3 Modular)
 * A unified store composed of specialized domain slices.
 */
export const useProgramStore = create(
    persist(
        (set, get, ...a) => ({
            ...createUISlice(set, get, ...a),
            ...createProgramSlice(set, get, ...a),
            ...createSessionSlice(set, get, ...a),
            ...createHistorySlice(set, get, ...a),
        }),
        { 
            name: `mp-v3-storage-${getActiveSchema()}`,
            // We only persist the essential navigation and session recovery state
            partialize: (state) => ({
                lastView: state.lastView,
                activeProgramId: state.activeProgramId,
                activeSession: state.activeSession,
                retroactiveDate: state.retroactiveDate
            })
        }
    )
);