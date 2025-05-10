
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Types for database tables
export type Profile = {
  id: string;
  email: string;
  name?: string;
  age?: number;
  gender?: string;
  location?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
};

// These types need to be aligned with the database schema
// Since these tables don't exist yet, we're defining them here
// They would need to be created in Supabase
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

export { supabase };
