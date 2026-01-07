import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vhqgufwgzspwmztpswdn.supabase.co'
const supabaseKey = 'sb_publishable_JY77JwClTybP7S_TpLPKgA_RLNqI9L0'

export const supabase = createClient(supabaseUrl, supabaseKey)
