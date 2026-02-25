import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

// Create Supabase client for database/storage with RLS enforcement
// SECURITY: Only public anon key is used on client - RLS policies enforce data access
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
    realtime: {
        headers: {
            'User-Agent': 'supabase-js-react-native',
        }
    }
})
