// Sidebar.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, MapPin, Home, User, Settings, PlusCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Sidebar: React.FC = () => {
  const { themeMode, currentUser } = useApp();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/events', icon: <Calendar size={20} />, label: 'Events' },
    { path: '/organizations', icon: <Users size={20} />, label: 'Organizations' },
    { path: '/map', icon: <MapPin size={20} />, label: 'Map' },
    { path: '/profile', icon: <User size={20} />, label: 'Profile' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside 
      className={`${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'} border-r ${themeMode === 'dark' ? 'border-gray-700' : 'border-gray-200'} h-screen sticky top-0 pt-16 hidden md:block transition-all duration-300 ${isExpanded ? 'w-56' : 'w-16'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-2 py-2 rounded-md ${
                location.pathname === item.path
                  ? `${themeMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} text-blue-500`
                  : `${themeMode === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
              } transition-colors duration-200`}
            >
              <div className="flex items-center justify-center w-8">{item.icon}</div>
              <span className={`ml-3 ${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {currentUser?.isOrganization && (
          <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/create-event"
              className={`flex items-center px-2 py-2 rounded-md ${themeMode === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors duration-200`}
            >
              <div className="flex items-center justify-center w-8">
                <PlusCircle size={20} />
              </div>
              <span className={`ml-3 ${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                Create Event
              </span>
            </Link>
            <Link
              to="/manage-organization"
              className={`flex items-center px-2 py-2 rounded-md ${location.pathname === '/manage-organization' ? (themeMode === 'dark' ? 'bg-gray-700 text-blue-500' : 'bg-gray-100 text-blue-500') : (themeMode === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')} transition-colors duration-200`}
            >
              <div className="flex items-center justify-center w-8">
                <Users size={20} />
              </div>
              <span className={`ml-3 ${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                Manage Organization
              </span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;