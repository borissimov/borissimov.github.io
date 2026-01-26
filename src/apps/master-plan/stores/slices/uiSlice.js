import { getActiveSchema } from '../../../../supabaseClient';

export const createUISlice = (set, get) => ({
    lastView: 'library',
    isLoading: false,
    activeSchema: getActiveSchema(),

    setLastView: (view) => set({ lastView: view }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    
    // Derived schema helper
    getFKConstraint: () => get().activeSchema === 'v3_dev' 
        ? 'dev_performance_logs_block_item_fkey' 
        : 'performance_logs_block_item_id_fkey'
});
