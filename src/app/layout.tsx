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
import { UserProvider } from '@/context/UserContext';

import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
};

const inter = Inter({ subsets: ['latin'] });

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
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const isAuthPage = pathname.startsWith('/login');

  return (
    <html lang="es">
      <body>
        <ThemeProviderCustom>
          <UserProvider>
            <AppThemeWrapper>
              <div className="flex w-full h-screen">
                {/* Sidebar */}
                {!isAuthPage && (
                  <>
                    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                    {/* Botón toggle para móvil */}
                    <div className="absolute top-4 left-4 md:hidden z-30">
                      <IconButton onClick={toggleSidebar} >
                        <MenuIcon />
                      </IconButton>
                    </div>
                  </>
                )}

                {/* Contenido principal */}
                <main className="flex-1 overflow-y-auto p-5 pt-10 w-full">
                  {children}
                  <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
                </main>
              </div>
            </AppThemeWrapper>
          </UserProvider>
        </ThemeProviderCustom>
      </body>
    </html>
  );
};

export default Layout;
