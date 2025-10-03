import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AuthPage: React.FC<{ mode: 'login' | 'signup' }> = ({ mode }) => {
  const { users, addUser, login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [major, setMajor] = useState('');
  const [accountType, setAccountType] = useState<'student' | 'organization'>('student');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    if (!email || !password || (mode === 'signup' && !name)) {
      setError('Please fill in all required fields');
      return;
    }
  
    if (mode === 'signup') {
      // Check if user already exists using context users
      if (users.some(user => user.email === email)) {
        setError('User already exists with this email');
        return;
      }
  
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        bio,
        major,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
        followers: [],
        following: [],
        organizationsJoined: [],
        organizationsFollowed: [],
        eventsAttending: [],
        activityFeed: [],
        isOrganization: accountType === 'organization',
      };
  
      addUser(newUser); // Update context state
      login(newUser);
      navigate('/profile');
    } else {
      // Login using context users
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (user) {
        login(user);
        navigate('/profile');
      } else {
        setError('Invalid credentials');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === 'signup' ? 'Join CommunityConnect' : 'Welcome Back'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {mode === 'signup' 
              ? 'Create your account to manage campus activities'
              : 'Sign in to continue'}
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account Type
                </label>
                <div className="mt-1 flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="accountType"
                      value="student"
                      checked={accountType === 'student'}
                      onChange={() => setAccountType('student')}
                      className="form-radio"
                    />
                    <span className="ml-2">Student</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="accountType"
                      value="organization"
                      checked={accountType === 'organization'}
                      onChange={() => setAccountType('organization')}
                      className="form-radio"
                    />
                    <span className="ml-2">Organization</span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {accountType === 'student' ? 'Bio' : 'Description'}
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1 block w-full rounded-md border dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>

              {accountType === 'student' && (
                <div>
                  <label
                    htmlFor="major"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Major
                  </label>
                  <input
                    id="major"
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="mt-1 block w-full rounded-md border dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    placeholder="Computer Science"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none dark:bg-blue-800 dark:hover:bg-blue-900"
          >
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {mode === 'signup' 
              ? 'Already have an account? '
              : 'Need an account? '}
            <Link 
              to={mode === 'signup' ? '/login' : '/signup'}
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              {mode === 'signup' ? 'Sign In' : 'Sign Up'}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;