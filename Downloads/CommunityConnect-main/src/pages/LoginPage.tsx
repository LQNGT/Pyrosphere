import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const LoginPage: React.FC = () => {
  const { login, users, themeMode } = useApp();
  const navigate = useNavigate();
  
  const regularUsers = users.filter(user => !user.isOrganization);
  const organizationUsers = users.filter(user => user.isOrganization);
  
  const handleLogin = (user) => {
    login(user);
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className={`rounded-lg ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm p-6`}>
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
          For demo purposes, select a user to login as:
        </p>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Student Accounts</h2>
          <div className="space-y-2">
            {regularUsers.map(user => (
              <button
                key={user.id}
                onClick={() => handleLogin(user)}
                className={`flex items-center w-full p-3 rounded-lg ${
                  themeMode === 'dark' 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div className="text-left">
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-3">Organization Accounts</h2>
          <div className="space-y-2">
            {organizationUsers.map(user => (
              <button
                key={user.id}
                onClick={() => handleLogin(user)}
                className={`flex items-center w-full p-3 rounded-lg ${
                  themeMode === 'dark' 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div className="text-left">
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;