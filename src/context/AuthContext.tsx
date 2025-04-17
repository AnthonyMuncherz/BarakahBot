'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { account } from '@/lib/appwrite-client'; // Keep for client-side logout
import { Models } from 'appwrite';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  // Use a simplified user type or define one if needed
  user: Omit<Models.User<Models.Preferences>, 'password' | 'hash' | 'hashOptions'> | null; 
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkSession = async () => {
    try {
      // Fetch user data from our backend API route
      const response = await fetch('/api/auth/me'); 
      const data = await response.json();

      if (response.ok && data.user) {
        setUser(data.user); // Set user state from API response
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user session:', error);
      setUser(null);
    } finally {
       if (isLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed from context');
      }
      // Check session via API route to update user state AFTER successful login
      await checkSession(); 
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      console.error("Login failed in context:", error);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Client-side session deletion is less critical now but can be kept
      // try {
      //      await account.deleteSession('current');
      // } catch (clientLogoutError) {
      //     console.warn("Client-side session deletion failed:", clientLogoutError);
      // }

      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error("Logout process failed:", error);
      setUser(null); 
      router.push('/');
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 