
import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
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
