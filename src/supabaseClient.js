import { createClient } from '@supabase/supabase-js'
import { mockSupabase } from './data/MockSupabase'

const supabaseUrl = 'https://vhqgufwgzspwmztpswdn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocWd1ZndnenNwd216dHBzd2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NTc2NjUsImV4cCI6MjA4MzMzMzY2NX0.0z_hSGbzjzSWkXaZjgJ76uWsVdBa4h0OCkzEXs727pc'

const useMock = localStorage.getItem('mp_use_mock_db') === 'true';

console.log("[Supabase] Mode:", useMock ? "MOCK (Offline)" : "REAL (Cloud)");

export const supabase = useMock ? mockSupabase : createClient(supabaseUrl, supabaseKey);