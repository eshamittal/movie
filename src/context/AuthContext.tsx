import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.ts';
import { api, setToken, removeToken, getToken } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  loginAsDemoUser: () => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth from stored token
  useEffect(() => {
    async function loadUser() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.auth.getMe();
        if (res.user) {
          setUser(res.user);
        } else {
          removeToken();
        }
      } catch (err) {
        console.warn('Session expired or invalid, logging out.');
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.auth.login({ email, password: pass });
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (name: string, email: string, pass: string) => {
    const res = await api.auth.register({ name, email, password: pass });
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const loginAsDemoUser = async () => {
    await login('user@imovies.com', 'User@123');
  };

  const loginAsDemoAdmin = async () => {
    await login('admin@imovies.com', 'Admin@123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        loginAsDemoUser,
        loginAsDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
