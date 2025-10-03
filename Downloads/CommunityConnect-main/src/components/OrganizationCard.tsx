import React from 'react';
import { Link } from 'react-router-dom';
import { Users, X } from 'lucide-react';
import { Organization } from '../types';
import { useApp } from '../context/AppContext';

interface OrganizationCardProps {
  organization: Organization;
  compact?: boolean;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization, compact = false }) => {
  const { themeMode, currentUser, followOrganization, unfollowOrganization } = useApp();
  
  const isFollowing = currentUser?.organizationsFollowed?.includes(organization.id);
  const isMember = currentUser?.organizationsJoined?.includes(organization.id); // Assuming this exists
  
  const handleFollowAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFollowing) {
      unfollowOrganization(organization.id);
    } else {
      followOrganization(organization.id);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMember) {
      // Assuming leaveOrganization exists or needs to be added
      // leaveOrganization(organization.id);
      console.log('Leaving organization:', organization.id);
    } else if (isFollowing) {
      unfollowOrganization(organization.id);
    }
  };

  if (compact) {
    return (
      <Link 
        to={`/organizations/${organization.id}`}
        className={`block relative rounded-lg overflow-hidden ${
          themeMode === 'dark' 
            ? 'bg-gray-800 hover:bg-gray-700' 
            : 'bg-white hover:bg-gray-50'
        } shadow-sm transition duration-150 ease-in-out`}
      >
        <div className="p-3 flex items-center">
          {(isFollowing || isMember) && (
            <button
              onClick={handleRemove}
              className="absolute top-1 right-1 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-100"
            >
              <X size={14} />
            </button>
          )}
          <img 
            src={organization.logo} 
            alt={organization.name} 
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <h3 className="font-medium text-sm">{organization.name}</h3>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Users size={12} className="mr-1" />
              {organization.followerCount}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${
      themeMode === 'dark' 
        ? 'bg-gray-800 hover:bg-gray-700' 
        : 'bg-white hover:bg-gray-50'
    } shadow-sm transition duration-150 ease-in-out`}>
      <Link to={`/organizations/${organization.id}`}>
        {organization.coverImage && (
          <div className="h-32 overflow-hidden">
            <img 
              src={organization.coverImage} 
              alt={organization.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start">
            <img 
              src={organization.logo} 
              alt={organization.name} 
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{organization.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Users size={16} className="mr-1" />
                    {organization.followerCount} followers
                  </div>
                </div>
                <button
                  onClick={handleFollowAction}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    isFollowing
                      ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100'
                      : `${themeMode === 'dark' 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-blue-500 hover:bg-blue-600'} text-white`
                  }`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {organization.description}
              </p>
              {organization.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {organization.tags.map(tag => (
                    <span 
                      key={tag} 
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        themeMode === 'dark' 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          {organization.isUniversitySponsored && (
            <div className="mt-3 flex items-center text-sm text-blue-600 dark:text-blue-400">
              <span className="inline-block px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900">
                University Sponsored
              </span>
            </div>
          )}
        </div>
      </Link>
      {(isFollowing || isMember) && (
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-100"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default OrganizationCard;