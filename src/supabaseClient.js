import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vhqgufwgzspwmztpswdn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocWd1ZndnenNwd216dHBzd2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NTc2NjUsImV4cCI6MjA4MzMzMzY2NX0.0z_hSGbzjzSWkXaZjgJ76uWsVdBa4h0OCkzEXs727pc'

// Unified persistence key for schema preference
const SCHEMA_KEY = 'mp-active-schema';

export const getActiveSchema = () => {
    return localStorage.getItem(SCHEMA_KEY) || 'v3';
};

export const setActiveSchema = (schema) => {
    localStorage.setItem(SCHEMA_KEY, schema);
    window.location.reload(); // Hard reload to reset all store states
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
