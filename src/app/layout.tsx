'use client';

import './globals.css';
import React, { useState } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '@/theme/theme';
import { ThemeProviderCustom, useThemeContext } from '@/context/ThemeContext';

import { Inter } from 'next/font/google';

interface LayoutProps {
  children: React.ReactNode;
};

const inter = Inter({ subsets: ['latin'] });

// ✅ Componente wrapper para aplicar el tema dinámico
const AppThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode } = useThemeContext();

  return (
    <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <html lang="es">
      <body>
        {/* ✅ Envuelve todo en el provider del contexto */}
        <ThemeProviderCustom>
          {/* ✅ Envuelve en ThemeProvider para aplicar el tema */}
          <AppThemeWrapper>
            <div className="flex w-full h-screen">
              {/* Sidebar */}
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

              {/* Botón toggle para móvil */}
              <div className="absolute top-4 left-4 md:hidden z-30">
                <IconButton onClick={toggleSidebar} >
                  <MenuIcon />
                </IconButton>
              </div>

              {/* Contenido principal */}
              <main className="flex-1 overflow-y-auto p-5 pt-10 w-full">
                {children}
                <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
              </main>
            </div>
          </AppThemeWrapper>
        </ThemeProviderCustom>
      </body>
    </html>
  );
};

export default Layout;
