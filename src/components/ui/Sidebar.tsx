'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Dashboard,
  ShoppingCart,
  Inventory2,
  LocalOffer,
  People,
  Campaign,
  Close,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useThemeContext } from '@/context/ThemeContext';
import ThemeToggleSwitch from './ThemeToggleSwitch';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { mode } = useThemeContext();
  const theme = useTheme();

  const linkClass = `flex items-center gap-2 hover:bg-sky-300 transition-colors duration-200 py-4 px-4 text-lg tracking-wider w-full md:w-auto justify-center md:justify-start ${
    mode === 'light' ? 'hover:bg-sky-300' : 'hover:bg-slate-900'
  }`;

  // Cierra el sidebar solo en modo móvil
  const handleLinkClick = () => {
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
              <Link href="/" onClick={handleLinkClick} className={linkClass}>
                <Dashboard fontSize="small" />
                General
              </Link>
            </li>
            <li>
              <Link href="/orders" onClick={handleLinkClick} className={linkClass}>
                <ShoppingCart fontSize="small" />
                Pedidos
              </Link>
            </li>
            <li>
              <Link href="/articles" onClick={handleLinkClick} className={linkClass}>
                <Inventory2 fontSize="small" />
                Artículos
              </Link>
            </li>
            <li>
              <Link href="/coupons" onClick={handleLinkClick} className={linkClass}>
                <LocalOffer fontSize="small" />
                Cupones
              </Link>
            </li>
            <li>
              <Link href="/customers" onClick={handleLinkClick} className={linkClass}>
                <People fontSize="small" />
                Clientes
              </Link>
            </li>
            <li>
              <Link href="/ads" onClick={handleLinkClick} className={linkClass}>
                <Campaign fontSize="small" />
                Anuncios
              </Link>
            </li>
          </ul>
        </nav>

        {/* Botón cambiar tema */}
        <div className="mt-auto p-4">
          <ThemeToggleSwitch />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
