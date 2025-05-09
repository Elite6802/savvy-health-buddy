
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

type User = {
  id: string;
  email: string;
  name: string;
  age?: number;
  gender?: string;
  location?: string;
  avatar_url?: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, age?: number, gender?: string, location?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<User>) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock auth functions - would be replaced with actual Supabase auth calls
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
      
      // This would be a Supabase createUser call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful signup
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 15),
        email,
        name,
        age,
        gender,
        location,
      };
      
      // Store in local storage for demo purposes
      localStorage.setItem('healthmate-user', JSON.stringify(newUser));
      localStorage.setItem('healthmate-token', 'mock-auth-token');
      
      setUser(newUser);
      
      toast({
        title: "Account created successfully",
        description: "Welcome to HealthMate AI!"
      });
      
      navigate('/profile');
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: "Signup failed",
        description: "There was a problem creating your account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // This would be a Supabase signIn call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser: User = {
        id: "123456",
        email,
        name: "Demo User",
        age: 30,
        gender: "prefer-not-to-say",
        location: "New York",
      };
      
      // Store in local storage for demo purposes
      localStorage.setItem('healthmate-user', JSON.stringify(mockUser));
      localStorage.setItem('healthmate-token', 'mock-auth-token');
      
      setUser(mockUser);
      
      toast({
        title: "Logged in successfully",
        description: "Welcome back to HealthMate AI!"
      });
      
      navigate('/profile');
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // This would be a Supabase signOut call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from local storage
      localStorage.removeItem('healthmate-user');
      localStorage.removeItem('healthmate-token');
      
      setUser(null);
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account"
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging out",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profile: Partial<User>) => {
    try {
      setLoading(true);
      
      // This would be a Supabase updateUser call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local user
      if (user) {
        const updatedUser = { ...user, ...profile };
        setUser(updatedUser);
        
        // Update in local storage
        localStorage.setItem('healthmate-user', JSON.stringify(updatedUser));
        
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully"
        });
      }
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
      
      // This would be a Supabase updatePassword call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully"
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      
      // This would be a Supabase resetPassword call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for a link to reset your password"
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: "Reset failed",
        description: "There was a problem sending the password reset email",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('healthmate-user');
        const token = localStorage.getItem('healthmate-token');
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
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
