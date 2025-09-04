"use client";

import React, { useState } from "react";
import Sidebar from "@/components/ui/Sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, ThemeProvider, CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { lightTheme, darkTheme } from "@/theme/theme";
import { useThemeContext } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { mode } = useThemeContext();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const isAuthPage = pathname.startsWith("/login");

  return (
    <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <div className="flex w-full h-screen">
        {/* Sidebar */}
        {!isAuthPage && (
          <>
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />

            {/* Botón toggle para móvil */}
            <div className="absolute top-4 left-4 md:hidden z-30">
              <IconButton onClick={toggleSidebar}>
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
    </ThemeProvider>
  );
};

export default ClientLayout;
