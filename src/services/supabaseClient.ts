import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate if keys are default placeholders or empty
export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-project') && 
  !supabaseAnonKey.includes('your-supabase-anonymous');

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ SUPABASE SYSTEM: Connection keys are unconfigured or using placeholders in .env! Storefront will utilize robust local mock data fallback mode. Navigate to /admin or check .env to connect your database.'
  );
}

// Graceful initialization (fallback to dummy URL/Key if empty to prevent throw on client load)
const activeUrl = isSupabaseConfigured ? supabaseUrl : 'https://dummyprojectid.supabase.co';
const activeKey = isSupabaseConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummykey';

export const supabase = createClient(activeUrl, activeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
