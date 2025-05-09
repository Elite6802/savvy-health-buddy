
import { createClient } from '@supabase/supabase-js';

// Default values for local development - these won't work in production
// Replace these with your Supabase project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Log warning if environment variables are missing
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables. Using placeholder values for development.');
}

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export type Profile = {
  id: string;
  email: string;
  name: string;
  age?: number;
  gender?: string;
  location?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
};

export type Message = {
  id: string;
  user_id: string;
  content: string;
  is_ai: boolean;
  category?: string;
  created_at: string;
  session_id: string;
};

export type ChatSession = {
  id: string;
  user_id: string;
  category: string;
  title: string;
  created_at: string;
};

export type ContactForm = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};
