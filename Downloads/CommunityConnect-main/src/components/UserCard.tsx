import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { useApp } from '../context/AppContext';
import { UserPlus, UserMinus, UserX } from 'lucide-react';

interface UserCardProps {
  user: User;
  compact?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, compact = false }) => {
  const { themeMode, currentUser, followUser, unfollowUser, blockUser } = useApp();
  const isFollowing = currentUser?.following?.includes(user.id);
  const isCurrentUser = currentUser?.id === user.id;

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFollowing) {
      unfollowUser(user.id);
    } else {
      followUser(user.id);
    }
  };

  const handleBlock = (e: React.MouseEvent) => {
    e.preventDefault();
    blockUser(user.id);
  };

  if (compact) {
    return (
      <Link 
        to={`/users/${user.id}`}
        className={`relative flex items-center p-2 rounded-lg ${
          themeMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
        } transition-colors`}
      >
        {!isCurrentUser && (
          <button
            onClick={handleBlock}
            className="absolute top-1 right-1 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-100"
          >
            <UserX size={14} />
          </button>
        )}
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-8 h-8 rounded-full object-cover mr-2"
        />
        <div className="flex-1 min-w-0">
          <span className="font-medium text-sm truncate">{user.name}</span>
          {user.major && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.major} {user.graduationYear && `'${user.graduationYear.slice(-2)}`}
            </p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${
      themeMode === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
    } shadow-sm transition duration-150 ease-in-out`}>
      <Link to={`/users/${user.id}`} className="block p-4">
        <div className="flex items-start">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-12 h-12 rounded-full object-cover mr-3"
          />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <h3 className="font-medium text-lg truncate">{user.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  {user.major && (
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      themeMode === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.major}{user.graduationYear && ` '${user.graduationYear.slice(-2)}`}
                    </span>
                  )}
                  {user.isOrganization && (
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      themeMode === 'dark' ? 'bg-purple-900 text-purple-100' : 'bg-purple-100 text-purple-800'
                    }`}>
                      Organization
                    </span>
                  )}
                </div>
              </div>
              {!isCurrentUser && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleFollow}
                    className={`p-2 rounded-full ${
                      isFollowing 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100'
                    }`}
                  >
                    {isFollowing ? <UserMinus size={16} /> : <UserPlus size={16} />}
                  </button>
                </div>
              )}
            </div>

            {user.bio && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {user.bio}
              </p>
            )}

            <div className="mt-3 flex space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{user.following.length} Following</span>
              <span>{user.followers.length} Followers</span>
            </div>
          </div>
        </div>
      </Link>

      {!isCurrentUser && (
        <button
          onClick={handleBlock}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-100"
        >
          <UserX size={16} />
        </button>
      )}
    </div>
  );
};

export default UserCard;