import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables: Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

/**
 * Utility function to verify the Supabase client connection
 */
export async function verifySupabaseConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    // Attempt a light ping/query
    const { error } = await supabase.from('_health_check').select('*').limit(1);
    
    // Relation not found (42P01 / PGRST301) implies valid API auth and connection to Supabase endpoint
    if (error && (error.code === '42P01' || error.code === 'PGRST301' || error.message?.includes('relation'))) {
      return { success: true };
    }

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error during Supabase ping';
    return { success: false, error: message };
  }
}