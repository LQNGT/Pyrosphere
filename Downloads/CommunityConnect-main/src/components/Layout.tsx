import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useApp } from '../context/AppContext';

const Layout: React.FC = () => {
  const { themeMode } = useApp();
  
  return (
    <div className={`min-h-screen ${themeMode === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;