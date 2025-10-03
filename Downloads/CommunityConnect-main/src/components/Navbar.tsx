import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar: React.FC = () => {
  const { currentUser, themeMode, setThemeMode, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className={`sticky top-0 z-10 ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'} border-b ${themeMode === 'dark' ? 'border-gray-700' : 'border-gray-200'} px-4 py-3`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="md:hidden mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="flex items-center">
            <span className="text-xl font-semibold">CommunityConnect</span>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className={`relative w-full ${themeMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-full px-3 py-2`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events, organizations, people..."
              className={`w-full pl-8 pr-4 bg-transparent border-none focus:ring-0 focus:outline-none ${themeMode === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <Link to="/notifications" className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </Link>
          
          {currentUser ? (
            <div className="relative group">
              <Link to="/profile" className="flex items-center">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="h-8 w-8 rounded-full object-cover"
                />
              </Link>
              <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'} ring-1 ring-black ring-opacity-5 hidden group-hover:block`}>
                <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Your Profile</Link>
                <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Settings</Link>
                <button 
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm hover:text-blue-500">
                Login
              </Link>
              <Link 
                to="/signup"
                className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search */}
      <div className={`md:hidden mt-2 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <form onSubmit={handleSearch} className="flex items-center">
          <div className={`relative w-full ${themeMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-full px-3 py-2`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className={`w-full pl-8 pr-4 bg-transparent border-none focus:ring-0 focus:outline-none ${themeMode === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;