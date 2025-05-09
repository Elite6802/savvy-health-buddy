
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

      return { data, error: null };
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

      return { data, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { data: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  // Message operations
  const saveMessage = async (content: string, isAI: boolean, category: string, sessionId: string): Promise<DatabaseResult<Message>> => {
    try {
      setLoading(true);
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const message: Partial<Message> = {
        user_id: user.id,
        content,
        is_ai: isAI,
        category,
        session_id: sessionId,
      };

      const { data, error } = await supabase
        .from('messages')
        .insert([message])
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
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

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error getting messages:', error);
      return { data: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  // Chat session operations
  const createChatSession = async (category: string, title: string): Promise<DatabaseResult<ChatSession>> => {
    try {
      setLoading(true);
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const session: Partial<ChatSession> = {
        id: uuidv4(),
        user_id: user.id,
        category,
        title,
      };

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([session])
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
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

      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      return { data: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  // Contact form operations
  const submitContactForm = async (name: string, email: string, message: string): Promise<DatabaseResult<ContactForm>> => {
    try {
      setLoading(true);

      const contactForm: Partial<ContactForm> = {
        name,
        email,
        message,
      };

      const { data, error } = await supabase
        .from('contact_forms')
        .insert([contactForm])
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
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
