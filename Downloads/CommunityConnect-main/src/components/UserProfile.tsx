import React from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import OrganizationCard from '../components/OrganizationCard';
import EventCard from '../components/EventCard';

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { users, getOrganizationById, getEventById } = useApp();
  const user = users.find(u => u.id === userId);

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">User Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400">This user doesn’t exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Profile Header */}
      <div className="flex items-center mb-6">
        <img
          src={user.avatar || 'https://via.placeholder.com/150'}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover mr-4"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600 dark:text-gray-300">{user.bio || "No bio provided"}</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Details</h3>
          <p><strong>Email:</strong> {user.email || "Not specified"}</p>
          <p><strong>Major:</strong> {user.major || "Not specified"}</p>
          <p><strong>Graduation Year:</strong> {user.graduationYear || "Not specified"}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Social Media</h3>
          {user.socialMedia?.website && (
            <p><strong>Website:</strong> <a href={user.socialMedia.website} className="text-blue-500">{user.socialMedia.website}</a></p>
          )}
          {user.socialMedia?.linkedin && (
            <p><strong>LinkedIn:</strong> <a href={user.socialMedia.linkedin} className="text-blue-500">{user.socialMedia.linkedin}</a></p>
          )}
        </div>
      </div>

      {/* Organizations Section */}
      {(user.privacy?.showOrganizationsJoined ?? true) && (
        <div className="mt-6">
          <h2 className="text-xl font-medium mb-4">Member of</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.organizationsJoined?.map(orgId => {
              const org = getOrganizationById(orgId);
              return org && <OrganizationCard key={org.id} organization={org} compact />;
            })}
            {(!user.organizationsJoined || user.organizationsJoined.length === 0) && (
              <p className="text-gray-500 dark:text-gray-400">Not a member of any organizations</p>
            )}
          </div>
        </div>
      )}

      {/* Events Section */}
      {(user.privacy?.showEventsAttending ?? true) && (
        <div className="mt-6">
          <h2 className="text-xl font-medium mb-4">Events Attending</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.eventsAttending?.map(eventId => {
              const event = getEventById(eventId);
              return event && <EventCard key={event.id} event={event} compact />;
            })}
            {(!user.eventsAttending || user.eventsAttending.length === 0) && (
              <p className="text-gray-500 dark:text-gray-400">No events attending</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;