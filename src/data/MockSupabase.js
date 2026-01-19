// Mock Supabase Client for Master Plan
// Mirrors the v2 relational structure for offline development

const MOCK_DATA = {
    exercises: [
        { id: 'ex1', name: 'Barbell Squat', category: 'Legs' },
        { id: 'ex2', name: 'Bench Press', category: 'Push' },
        { id: 'ex3', name: 'KB Swing', category: 'Power' },
        { id: 'ex4', name: 'Plank', category: 'Core' }
    ],
    routines: [
        { id: 'r1', user_id: 'mock-user', name: 'Alpha 5-Day Split', loop_length: 5 }
    ],
    routine_days: [
        { id: 'rd1', routine_id: 'r1', sequence_number: 1, label: 'Legs Day', is_rest_day: false },
        { id: 'rd2', routine_id: 'r1', sequence_number: 2, label: 'Push Day', is_rest_day: false },
        { id: 'rd3', routine_id: 'r1', sequence_number: 3, label: 'Pull Day', is_rest_day: false },
        { id: 'rd4', routine_id: 'r1', sequence_number: 4, label: 'Swim & Core', is_rest_day: false },
        { id: 'rd5', routine_id: 'r1', sequence_number: 5, label: 'Rest Day', is_rest_day: true }
    ],
    workouts: [
        { id: 'w1', routine_day_id: 'rd1', name: 'Heavy Leg Session' },
        { id: 'w2', routine_day_id: 'rd2', name: 'Push Focus' }
    ],
    workout_blocks: [
        { id: 'b1', workout_id: 'w1', label: 'STRENGTH PHASE', block_type: 'STANDARD', sort_order: 1 },
        { id: 'b2', workout_id: 'w1', label: 'POWER CIRCUIT', block_type: 'CIRCUIT', sort_order: 2 }
    ],
    block_exercises: [
        { id: 'be1', block_id: 'b1', exercise_id: 'ex1', target_sets: 3, target_reps: '5', target_weight: '100', target_rpe: '8', sort_order: 1, exercises: { name: 'Barbell Squat' } },
        { id: 'be2', block_id: 'b2', exercise_id: 'ex3', target_sets: 3, target_reps: '20', target_weight: '24', target_rpe: '9', sort_order: 1, exercises: { name: 'KB Swing' } },
        { id: 'be3', block_id: 'b2', exercise_id: 'ex4', target_sets: 3, target_reps: '60s', target_weight: 'BW', target_rpe: '10', sort_order: 2, exercises: { name: 'Plank' } }
    ],
    session_logs: []
};

export const mockSupabase = {
    auth: {
        getSession: async () => ({ data: { session: { user: { id: 'mock-user-id' } } }, error: null }),
        onAuthStateChange: (callback) => {
            // Immediately trigger once for initialization
            callback('SIGNED_IN', { user: { id: 'mock-user-id' } });
            return { data: { subscription: { unsubscribe: () => {} } } };
        },
        signOut: async () => ({ error: null })
    },
    schema: (schemaName) => {
        return {
            from: (tableName) => {
                return {
                    select: (query) => {
                        return {
                            order: (col, options) => {
                                let data = [...(MOCK_DATA[tableName] || [])];
                                return { data, error: null };
                            },
                            not: (col, op, val) => {
                                // Simple mock for cursor logic
                                return { 
                                    order: () => ({ 
                                        limit: () => ({ data: [], error: null }) 
                                    }) 
                                };
                            },
                            eq: (col, val) => {
                                // Specialized handling for Workout loading
                                if (tableName === 'workouts') {
                                    const workout = MOCK_DATA.workouts.find(w => w.routine_day_id === val);
                                    if (workout) {
                                        // Clone to avoid mutation of source
                                        const workoutClone = JSON.parse(JSON.stringify(workout));
                                        workoutClone.workout_blocks = MOCK_DATA.workout_blocks
                                            .filter(b => b.workout_id === workout.id)
                                            .map(b => ({
                                                ...JSON.parse(JSON.stringify(b)),
                                                block_exercises: MOCK_DATA.block_exercises.filter(be => be.block_id === b.id)
                                            }));
                                        return { single: () => ({ data: workoutClone, error: null }) };
                                    }
                                    return { single: () => ({ data: null, error: null }) };
                                }
                                let data = MOCK_DATA[tableName]?.filter(item => item[col] === val);
                                return { data, error: null };
                            }
                        };
                    }
                };
            }
        };
    }
};