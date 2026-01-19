import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vhqgufwgzspwmztpswdn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocWd1ZndnenNwd216dHBzd2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NTc2NjUsImV4cCI6MjA4MzMzMzY2NX0.0z_hSGbzjzSWkXaZjgJ76uWsVdBa4h0OCkzEXs727pc'

// Unified V2 Client
export const supabase = createClient(supabaseUrl, supabaseKey);

console.log("[Supabase] V2 Client Initialized.");
