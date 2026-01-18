import { createClient } from '@supabase/supabase-js'
import { mockSupabase } from './data/MockSupabase'

const supabaseUrl = 'https://vhqgufwgzspwmztpswdn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocWd1ZndnenNwd216dHBzd2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NTc2NjUsImV4cCI6MjA4MzMzMzY2NX0.0z_hSGbzjzSWkXaZjgJ76uWsVdBa4h0OCkzEXs727pc'

const isTempOnline = sessionStorage.getItem('mp_is_temp_online') === 'true';
let useMock = true;

if (isTempOnline) {
    useMock = false;
    // Sync local storage just in case, though session storage rules
    localStorage.setItem('mp_use_mock_db', 'false');
} else {
    useMock = true;
    localStorage.setItem('mp_use_mock_db', 'true');
}

console.log("[Supabase] Mode:", useMock ? "MOCK (Offline)" : "REAL (Cloud)");

export const supabase = useMock ? mockSupabase : createClient(supabaseUrl, supabaseKey);