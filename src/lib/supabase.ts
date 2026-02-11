
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  // Instead of crashing the entire app, we log the error.
  console.error('Missing Supabase environment variables! Please check your .env or build configuration.');
}

// Create client even with empty strings to allow app to mount, requests will just fail with 400/401 instead of white screen
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
