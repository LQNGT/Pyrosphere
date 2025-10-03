import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Edit, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import OrganizationCard from '../components/OrganizationCard';
import EventCard from '../components/EventCard';
import { format, parseISO } from 'date-fns';

const ProfilePage = () => {
  const { currentUser, themeMode, getOrganizationById, getEventById } = useApp();

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Please Sign In</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">You need to be logged in to view this page.</p>
        <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className={`rounded-lg ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <img
              src={currentUser.avatar || 'https://via.placeholder.com/150'}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">{currentUser.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{currentUser.bio || "No bio provided"}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="mr-4">{currentUser.followers?.length || 0} followers</span>
                <span>{currentUser.following?.length || 0} following</span>
              </div>
            </div>
          </div>
          <Link to="/settings" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <Edit size={20} />
          </Link>
        </div>
      </div>

      {/* Member of Organizations */}
      <div className={`rounded-lg ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm p-6`}>
        <h2 className="text-xl font-medium mb-4 flex items-center">
          <Users size={20} className="mr-2" /> Member of
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentUser.organizationsJoined?.map(orgId => {
            const org = getOrganizationById(orgId);
            return org && <OrganizationCard key={org.id} organization={org} compact />;
          }) || <p className="text-gray-500 dark:text-gray-400">Not a member of any organizations</p>}
        </div>
      </div>

      {/* Following Organizations */}
      <div className={`rounded-lg ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm p-6`}>
        <h2 className="text-xl font-medium mb-4 flex items-center">
          <Users size={20} className="mr-2" /> Following
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentUser.organizationsFollowed?.map(orgId => {
            const org = getOrganizationById(orgId);
            return org && <OrganizationCard key={org.id} organization={org} compact />;
          }) || <p className="text-gray-500 dark:text-gray-400">Not following any organizations</p>}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className={`rounded-lg ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm p-6`}>
        <h2 className="text-xl font-medium mb-4 flex items-center">
          <Calendar size={20} className="mr-2" /> Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentUser.eventsAttending?.map(eventId => {
            const event = getEventById(eventId);
            return event && <EventCard key={event.id} event={event} compact />;
          }) || <p className="text-gray-500 dark:text-gray-400">No upcoming events</p>}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`rounded-lg ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm p-6`}>
        <h2 className="text-xl font-medium mb-4 flex items-center">
          <Activity size={20} className="mr-2" /> Recent Activity
        </h2>
        <div className="space-y-4">
          {currentUser.activityFeed?.map((activity, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${themeMode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} flex items-start`}
            >
              {activity.type === 'event' ? (
                <Calendar size={16} className="mr-2 text-gray-500" />
              ) : (
                <Users size={16} className="mr-2 text-gray-500" />
              )}
              <div>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {format(parseISO(activity.timestamp), 'MMM d, h:mm a')}
                </span>
                <p className="text-sm">
                  {activity.type === 'event' ? 'Attended ' : 'Joined '}
                  <Link
                    to={activity.type === 'event' ? `/events/${activity.id}` : `/organizations/${activity.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {activity.name}
                  </Link>
                </p>
              </div>
            </div>
          )) || <p className="text-gray-500 dark:text-gray-400">No recent activity</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;