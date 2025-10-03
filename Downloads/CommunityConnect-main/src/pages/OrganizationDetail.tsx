import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, Calendar, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import OrganizationCard from '../components/OrganizationCard';

const OrganizationDetail: React.FC = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const {
    getOrganizationById,
    getOrganizationEvents,
    organizations,
    joinOrganization,
    leaveOrganization,
    followOrganization,
    unfollowOrganization,
    currentUser,
    themeMode
  } = useApp();
  const navigate = useNavigate();

  const organization = orgId ? getOrganizationById(orgId) : undefined;
  const events = organization ? getOrganizationEvents(organization.id) : [];

  const isJoined = currentUser?.organizationsJoined.includes(organization?.id || '');
  const isFollowed = currentUser?.organizationsFollowed.includes(organization?.id || '');

  const relatedOrganizations = organization
    ? organization.relatedOrganizations
        .map(id => organizations.find(org => org.id === id))
        .filter(Boolean)
    : [];

  if (!organization) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Organization not found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          The organization you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/organizations"
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          Back to Organizations
        </Link>
      </div>
    );
  }

  const handleJoin = () => {
    if (isJoined) {
      leaveOrganization(organization.id);
    } else {
      joinOrganization(organization.id);
    }
  };

  const handleFollow = () => {
    if (isFollowed) {
      unfollowOrganization(organization.id);
    } else {
      followOrganization(organization.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-500 hover:text-blue-600 mb-4"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back
      </button>

      {/* Main Card */}
      <div className={`rounded-lg ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm overflow-hidden mb-6`}>
        {/* Cover Image */}
        {organization.coverImage && (
          <div className="h-48 md:h-64 overflow-hidden">
            <img
              src={organization.coverImage}
              alt={organization.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content Section */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center">
            {/* Logo */}
            <img
              src={organization.logo}
              alt={organization.name}
              className="w-20 h-20 rounded-full object-cover mr-4 mb-4 md:mb-0"
            />

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  {/* Organization Name */}
                  <h1 className="text-2xl md:text-3xl font-bold">{organization.name}</h1>

                  {/* Sponsored Badge */}
                  {organization.isUniversitySponsored && (
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${themeMode === 'dark' ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'} mt-1`}>
                      University Sponsored
                    </span>
                  )}
                </div>

                {/* Join/Follow Button */}
                <div className="flex items-center mt-4 md:mt-0">
                  {organization.isUniversitySponsored ? (
                    <button
                      onClick={handleFollow}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        isFollowed
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          : `${themeMode === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`
                      }`}
                    >
                      {isFollowed ? 'Following' : 'Follow'}
                    </button>
                  ) : (
                    <button
                      onClick={handleJoin}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        isJoined
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          : `${themeMode === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`
                      }`}
                    >
                      {isJoined ? 'Joined' : 'Join'}
                    </button>
                  )}
                </div>
              </div>

              {/* Follower and Member Counts */}
              <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400">
                <div className="flex items-center mr-4">
                  <Users size={16} className="mr-1" />
                  <span>{organization.followerCount} followers</span>
                </div>
                <div className="flex items-center">
                  <Users size={16} className="mr-1" />
                  <span>{organization.memberCount} members</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-6">
            <h2 className="text-xl font-medium mb-2">About</h2>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
              {organization.description}
            </p>
          </div>

          {/* Tags */}
          {organization.tags.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {organization.tags.map(tag => (
                  <span
                    key={tag}
                    className={`inline-block px-3 py-1 text-sm rounded-full ${themeMode === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Upcoming Events</h2>
            {events.length > 2 && (
              <Link
                to={`/organizations/${organization.id}/events`}
                className="text-blue-500 hover:text-blue-600"
              >
                View all
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.slice(0, 2).map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Related Organizations */}
      {relatedOrganizations.length > 0 && (
        <div>
          <h2 className="text-xl font-medium mb-4">Related Organizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedOrganizations.map(org => (
              org && <OrganizationCard key={org.id} organization={org} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationDetail;