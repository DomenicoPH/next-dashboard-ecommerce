'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface UserContextProps {
  user: User | null;
  token: string | null;
  login: (token: string, userData?: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

interface JwtPayload {
  exp?: number;
  [key: string]: any;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();

  // Carga token y datos del usuario al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);
      Cookies.set('token', storedToken, {path: '/', expires: 1}); // Mantiene middleware funcional

      // Valida si el token está expirado
      try {
        const decoded = jwtDecode<JwtPayload>(storedToken);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          logout(); // Expirado: salir
          return;
        }
      } catch {
        logout(); // Token corrupto: salir
        return;
      }

      // Valida contra el backend ( * En desarrollo no valida con el backend )
      if(process.env.NODE_ENV !== 'development'){
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })
          .then(res => {
            if (!res.ok) throw new Error('Unauthorized');
            return res.json();
          })
          .then(data => {
            if (!storedUser) {
              setUser(data);
              localStorage.setItem('user', JSON.stringify(data));
            }
          })
          .catch(() => logout());
      }

    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (newToken: string, userData?: User) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    Cookies.set('token', newToken, {path: '/', expires: 1});

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

    router.push('/login');
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
