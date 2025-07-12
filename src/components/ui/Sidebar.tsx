'use client';

import React from 'react';
import Link from 'next/link';
import {
  Dashboard,
  ShoppingCart,
  Inventory2,
  LocalOffer,
  People,
  Close,
} from '@mui/icons-material';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const linkClass = 'flex items-center gap-2 text-white hover:bg-blue-600 transition-colors duration-200 py-4 px-4 text-lg';

  // cierra el sidebar solo en modo móvil
  const handleLinkClick = () => {
    if (window.innerWidth < 768) onClose();
  };

  return (
    <>
      {/* Overlay en modo celular */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 block md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-screen md:w-[250px] bg-gray-900 text-white transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}
      >
        {/* Botón cerrar en móvil */}
        <div className="flex justify-end md:hidden p-2 pr-4">
          <button onClick={onClose}>
            <Close fontSize="small" />
          </button>
        </div>

        <nav>
          <ul>
            <li>
              <Link href="/" onClick={handleLinkClick} className={linkClass}>
                <Dashboard fontSize="small" />
                Resumen General
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
                <People fontSize="small" />
                Anuncios
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;