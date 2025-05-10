
import { supabase, Profile, Message, ChatSession, ContactForm } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Generic type for database operations
type DatabaseResult<T> = {
  data: T | null;
  error: Error | null;
};

const useSupabase = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  // Profile operations
  const getProfile = async (): Promise<DatabaseResult<Profile>> => {
    try {
      setLoading(true);
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return { data: data as Profile, error: null };
    } catch (error) {
      console.error('Error getting profile:', error);
      return { data: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profile: Partial<Profile>): Promise<DatabaseResult<Profile>> => {
    try {
      setLoading(true);
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      return { data: data as Profile, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { data: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  // Message operations - These functions will throw errors until the tables are created
  const saveMessage = async (content: string, isAI: boolean, category: string, sessionId: string): Promise<DatabaseResult<Message>> => {
    try {
      setLoading(true);
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // This would need a "messages" table to be created in Supabase
      console.warn("The messages table doesn't exist yet. Create it first in Supabase.");
      
      // Return a mock result for now
      return { 
        data: {
          id: uuidv4(),
          user_id: user.id,
          content,
          is_ai: isAI,
          category,
          session_id: sessionId,
          created_at: new Date().toISOString()
        } as Message, 
        error: null 
      };
    } catch (error) {
      console.error('Error saving message:', error);
      return { data: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const getMessages = async (sessionId: string): Promise<DatabaseResult<Message[]>> => {
    try {
      setLoading(true);
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // This would need a "messages" table to be created in Supabase
      console.warn("The messages table doesn't exist yet. Create it first in Supabase.");
      
      // Return a mock empty array for now
      return { data: [] as Message[], error: null };
    } catch (error) {
      console.error('Error getting messages:', error);
      return { data: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  // Chat session operations - These functions will throw errors until the tables are created
  const createChatSession = async (category: string, title: string): Promise<DatabaseResult<ChatSession>> => {
    try {
      setLoading(true);
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // This would need a "chat_sessions" table to be created in Supabase
      console.warn("The chat_sessions table doesn't exist yet. Create it first in Supabase.");
      
      // Return a mock result for now
      return { 
        data: {
          id: uuidv4(),
          user_id: user.id,
          category,
          title,
          created_at: new Date().toISOString()
        } as ChatSession, 
        error: null 
      };
    } catch (error) {
      console.error('Error creating chat session:', error);
      return { data: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const getChatSessions = async (): Promise<DatabaseResult<ChatSession[]>> => {
    try {
      setLoading(true);
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // This would need a "chat_sessions" table to be created in Supabase
      console.warn("The chat_sessions table doesn't exist yet. Create it first in Supabase.");
      
      // Return a mock empty array for now
      return { data: [] as ChatSession[], error: null };
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      return { data: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  // Contact form operations - This function will throw errors until the table is created
  const submitContactForm = async (name: string, email: string, message: string): Promise<DatabaseResult<ContactForm>> => {
    try {
      setLoading(true);

      // This would need a "contact_forms" table to be created in Supabase
      console.warn("The contact_forms table doesn't exist yet. Create it first in Supabase.");
      
      // Return a mock result for now
      return { 
        data: {
          id: uuidv4(),
          name,
          email,
          message,
          created_at: new Date().toISOString()
        } as ContactForm, 
        error: null 
      };
    } catch (error) {
      console.error('Error submitting contact form:', error);
      return { data: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  // Storage operations
  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Check if the avatars bucket exists in Supabase Storage
      console.warn("Make sure the 'avatars' bucket exists in Supabase Storage.");

      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  };

  return {
    loading,
    profile: {
      get: getProfile,
      update: updateProfile,
    },
    messages: {
      save: saveMessage,
      getAll: getMessages,
    },
    chatSessions: {
      create: createChatSession,
      getAll: getChatSessions,
    },
    contact: {
      submit: submitContactForm,
    },
    storage: {
      uploadAvatar,
    },
  };
};

export default useSupabase;
