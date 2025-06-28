'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../../stores/authStore';
import Navbar from './Navbar';

const NavbarWrapper: React.FC = () => {
  const pathname = usePathname();
  const { student, isAuthenticated, logout } = useAuthStore();

  // Hide navbar on auth pages
  const isAuthPage = pathname?.startsWith('/auth');
  
  if (isAuthPage) {
    return null;
  }

  return (
    <Navbar 
      isAuthenticated={isAuthenticated} 
      onLogout={logout}
      username={student?.name}
    />
  );
};

export default NavbarWrapper; 