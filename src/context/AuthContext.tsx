
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/lib/supabase';
import { User, AuthError, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: Profile | null;
  supabaseUser: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, age?: number, gender?: string, location?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const signUp = async (
    email: string, 
    password: string, 
    name: string, 
    age?: number, 
    gender?: string, 
    location?: string
  ) => {
    try {
      setLoading(true);
      
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            age,
            gender,
            location
          }
        }
      });
      
      if (error) throw error;
      
      // Check if user was created successfully
      if (data.user) {
        toast({
          title: "Account created successfully",
          description: "Please check your email for verification link."
        });
        
        navigate('/login');
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error('Error signing up:', authError);
      toast({
        title: "Signup failed",
        description: authError.message || "There was a problem creating your account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        setSupabaseUser(data.user);
        setSession(data.session);
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();
          
        if (!profileError && profileData) {
          setUser(profileData as Profile);
        } else {
          // Create a profile if it doesn't exist
          const newProfile: Partial<Profile> = {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata.name || '',
            age: data.user.user_metadata.age,
            gender: data.user.user_metadata.gender,
            location: data.user.user_metadata.location,
          };
          
          const { data: insertedProfile, error: insertError } = await supabase
            .from('profiles')
            .upsert(newProfile)
            .select()
            .single();
            
          if (!insertError && insertedProfile) {
            setUser(insertedProfile as Profile);
          }
        }
        
        toast({
          title: "Logged in successfully",
          description: "Welcome back to HealthMate AI!"
        });
        
        navigate('/dashboard');
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error('Error signing in:', authError);
      toast({
        title: "Login failed",
        description: authError.message || "Invalid email or password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account"
      });
      
      navigate('/');
    } catch (error) {
      const authError = error as AuthError;
      console.error('Error signing out:', authError);
      toast({
        title: "Logout failed",
        description: authError.message || "There was a problem logging out",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profile: Partial<Profile>) => {
    try {
      setLoading(true);
      
      if (!supabaseUser) throw new Error("User not authenticated");
      
      // Update profile in profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: supabaseUser.id,
          ...profile
        } as any);
        
      if (error) throw error;
      
      // Update local user state
      setUser(prev => prev ? { ...prev, ...profile } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully"
      });
    } catch (error) {
      const authError = error as AuthError;
      console.error('Error updating password:', authError);
      toast({
        title: "Update failed",
        description: authError.message || "There was a problem updating your password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for a link to reset your password"
      });
    } catch (error) {
      const authError = error as AuthError;
      console.error('Error resetting password:', authError);
      toast({
        title: "Reset failed",
        description: authError.message || "There was a problem sending the password reset email",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        // Only synchronous state updates here
        setSession(currentSession);
        setSupabaseUser(currentSession?.user || null);
        
        // Defer Supabase calls with setTimeout
        if (currentSession?.user) {
          setTimeout(async () => {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .maybeSingle();
              
            if (!error && data) {
              setUser(data as Profile);
            } else {
              // Try to create a profile from user metadata
              const newProfile: Partial<Profile> = {
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                name: currentSession.user.user_metadata.name || '',
              };
              
              const { data: insertedProfile } = await supabase
                .from('profiles')
                .upsert(newProfile as any)
                .select()
                .maybeSingle();
                
              if (insertedProfile) {
                setUser(insertedProfile as Profile);
              }
            }
          }, 0);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );
    
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setSupabaseUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .maybeSingle()
          .then(({ data, error }) => {
            if (!error && data) {
              setUser(data as Profile);
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        updatePassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
