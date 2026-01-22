import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vhqgufwgzspwmztpswdn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocWd1ZndnenNwd216dHBzd2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NTc2NjUsImV4cCI6MjA4MzMzMzY2NX0.0z_hSGbzjzSWkXaZjgJ76uWsVdBa4h0OCkzEXs727pc'

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log("--- Fetching Routine Days ---");
    const { data: days } = await supabase
        .schema('v2')
        .from('routine_days')
        .select('*')
        .order('sequence_number');
    
    console.log(`Found ${days?.length || 0} days.`);

    for (const day of days || []) {
        console.log(`
Checking Day: ${day.label} (${day.id})`);
        
        const { data: workout, error } = await supabase
            .schema('v2')
            .from('workouts')
            .select(
                `
                id,
                name,
                workout_blocks (
                    id, label, block_type,
                    block_exercises (
                        id,
                        exercises ( name )
                    )
                )
            `
            )
            .eq('routine_day_id', day.id)
            .maybeSingle();

        if (error) console.error("Error:", error);
        if (workout) {
            console.log(`✅ Found Workout: ${workout.name} with ${workout.workout_blocks.length} blocks.`);
        } else {
            console.log(`❌ NO WORKOUT FOUND for this day.`);
        }
    }
}

verify();
