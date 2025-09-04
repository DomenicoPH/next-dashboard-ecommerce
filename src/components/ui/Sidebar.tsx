'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@mui/material';
import {
  Dashboard,
  ShoppingCart,
  Inventory2,
  LocalOffer,
  People,
  Campaign,
  Close,
  Logout,
  Home
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useThemeContext } from '@/context/ThemeContext';
import ThemeToggleSwitch from './ThemeToggleSwitch';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { mode } = useThemeContext();
  const { logout } = useUser();
  const theme = useTheme();
  const router = useRouter();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [landingOpen, setLandingOpen] = useState(false);

  const linkClass = `flex items-center gap-2 hover:bg-sky-300 transition-colors duration-200 py-4 px-4 text-lg tracking-wider w-full md:w-auto justify-center md:justify-start ${
    mode === 'light' ? 'hover:bg-sky-300' : 'hover:bg-slate-900'
  }`;

  // logout centralizado en el context
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Cierra el sidebar solo en modo móvil
  const handleLinkClick = (isLandingSubMenu = false) => {
    if(!isLandingSubMenu){
      setLandingOpen(false)
    }
    if (window.innerWidth < 768) onClose();
  };

  return (
    <>
      {/* Overlay en modo celular */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 block md:hidden transition-colors duration-300"
          style={{
            backgroundColor:
              theme.palette.mode === 'light'
                ? theme.palette.background.default + 'CC' // CC ≈ 80% opacity
                : theme.palette.background.default + 'CC',
            backdropFilter: 'blur(10px)', // efecto glass
          }}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-screen md:w-[250px] transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static flex flex-col`}
      >
        {/* Botón cerrar en móvil */}
        <div className="flex justify-end md:hidden p-2 pr-4">
          <button onClick={onClose}>
            <Close fontSize="small" />
          </button>
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center justify-center py-6">
          <Image
            src={mode === 'light' ? '/logo_light.png' : '/logo_dark.png'}
            alt="Logo"
            width={200}
            height={40}
            priority
            style={{ objectFit: 'contain', height: 'auto', width: '200px' }}
          />
          <p className="opacity-40 font-extralight tracking-[6px] mt-2">
            Administración
          </p>
        </div>

        {/* Navegación */}
        <nav className="flex flex-col items-center md:items-start w-full">
          <ul className="flex flex-col gap-2 w-full text-center md:text-left">
            
            <li>
              <Link href="/dashboard/general" onClick={() => handleLinkClick(false)} className={linkClass}>
                <Dashboard fontSize="small" />
                General
              </Link>
            </li>
            <li>
              <Link href="/dashboard/orders" onClick={() => handleLinkClick(false)} className={linkClass}>
                <ShoppingCart fontSize="small" />
                Pedidos
              </Link>
            </li>
            <li>
              <Link href="/dashboard/articles" onClick={() => handleLinkClick(false)} className={linkClass}>
                <Inventory2 fontSize="small" />
                Artículos
              </Link>
            </li>
            <li>
              <Link href="/dashboard/coupons" onClick={() => handleLinkClick(false)} className={linkClass}>
                <LocalOffer fontSize="small" />
                Cupones
              </Link>
            </li>
            <li>
              <Link href="/dashboard/customers" onClick={() => handleLinkClick(false)} className={linkClass}>
                <People fontSize="small" />
                Clientes
              </Link>
            </li>
            <li>
              <Link href="/dashboard/ads" onClick={() => handleLinkClick(false)} className={linkClass}>
                <Campaign fontSize="small" />
                Anuncios
              </Link>
            </li>
            <li>
              {/* Landing Page */}
              <button
                onClick={() => setLandingOpen(!landingOpen)}
                className={`${linkClass} justify-between`}
              >
                <div className="flex items-center gap-2">
                  <Home fontSize="small" />
                  Landing Page
                </div>
                <span className={`transition-transform ${landingOpen ? "rotate-90" : ""}`}>
                  ▶
                </span>
              </button>

              {/* Submenú */}
              {landingOpen && (
                <ul className="flex flex-col ml-6 border-l border-gray-300 dark:border-gray-700">
                  <li>
                    <Link
                      href="/dashboard/landing_create/categoria"
                      onClick={() => handleLinkClick(true)}
                      className={`${linkClass} py-2 text-base`}
                    >
                      Categoría
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/landing_create/landingpage"
                      onClick={() => handleLinkClick(true)}
                      className={`${linkClass} py-2 text-base`}
                    >
                      Landing
                    </Link>
                  </li>
                </ul>
              )}
            </li>


          </ul>
        </nav>

        
        <div className="mt-auto p-4 mb-10">
          {/* Switch cambiar tema */}
          <ThemeToggleSwitch />
          {/* Botón Logout */}
          <Button
            onClick={() => {setConfirmOpen(true)}}
            variant="contained"
            //color="error"
            startIcon={<Logout fontSize="small" />}
            sx={{
              px: 2,
              py: .5,
              mx: 'auto',
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-start' },
              borderRadius: 2,
              textTransform: 'none',
              borderWidth: 2,
              backgroundColor: (theme) => theme.palette.background.default,
              color: (theme) => theme.palette.text.primary,
              '&:hover': {
                backgroundColor: (theme) => theme.palette.background.paper,
                color: (theme) => theme.palette.error.main,
              },
            }}
          >
            Cerrar sesión
          </Button>
        </div>
      </aside>

      <ConfirmDialog 
        open={confirmOpen}
        title="Cerrar sesión"
        message="¿Estás seguro de que quieres cerrar sesión?"
        action="Cerrar"
        onConfirm={handleLogout}
        onCancel={() => setConfirmOpen(false)}
      />

    </>
  );
};

export default Sidebar;
