import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, getMe, logout as apiLogout } from '@/lib/api';
import type { AuthResponse } from '@/lib/types';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: 'admin' | 'instructor' | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'instructor' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getMe();
          setUser(userData);
          setRole(userData.role);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
          setRole(null);
        }
      }
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await loginUser(email, password);
      
      // Only set auth state if we have valid data
      if (data._id && data.role) {
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role
        });
        setRole(data.role);
        setIsAuthenticated(true);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
      throw error; // Re-throw to be handled by the login form
    }
  };

  const logout = () => {
    apiLogout();
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
