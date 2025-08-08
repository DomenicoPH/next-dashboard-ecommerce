'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  // puedes añadir más campos si tu API devuelve más datos
}

interface UserContextProps {
  user: User | null;
  token: string | null;
  login: (token: string, userData?: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Cargar token y datos del usuario al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);
      Cookies.set('token', storedToken); // Mantener middleware funcional
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (newToken: string, userData?: User) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    Cookies.set('token', newToken);

    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Cookies.remove('token');

    // Redirigir al login
    window.location.href = '/dashboard/login';
  };

  const value: UserContextProps = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de un UserProvider');
  }
  return context;
};
