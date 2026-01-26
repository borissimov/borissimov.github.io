import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vhqgufwgzspwmztpswdn.supabase.co'
const supabaseAnonKey = 'sb_publishable_GXjgWtcXYHF4QxwUUkKkCw_JnrXCzUC'

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
