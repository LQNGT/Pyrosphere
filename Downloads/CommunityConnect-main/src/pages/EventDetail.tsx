import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, ExternalLink, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format, parseISO } from 'date-fns';

const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { getEventById, getOrganizationById, attendEvent, unattendEvent, currentUser, themeMode } = useApp();
  const navigate = useNavigate();

  const event = eventId ? getEventById(eventId) : undefined;
  const organization = event ? getOrganizationById(event.organizerId) : undefined;

  const isAttending = currentUser && event?.attendees.includes(currentUser.id);

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Event not found</h2>
        <p className="text-gray-500 dark:text-gray-300 mb-4">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/events"
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  const formattedDate = format(parseISO(event.date), 'EEEE, MMMM d, yyyy');
  const formattedTime = format(parseISO(event.date), 'h:mm a');

  const handleAttend = () => {
    if (isAttending) {
      unattendEvent(event.id);
    } else {
      attendEvent(event.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-500 hover:text-blue-600 mb-4"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back
      </button>

      {event.image && (
        <div className="h-64 md:h-80 rounded-lg overflow-hidden mb-6">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className={`rounded-lg ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm p-6 mb-6`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold">{event.title}</h1>

          <div className="flex items-center mt-2 md:mt-0">
            <button
              onClick={handleAttend}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isAttending
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : `${themeMode === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`
              }`}
            >
              {isAttending ? 'Attending' : 'Attend'}
            </button>

            {event.externalLink && (
              <a
                href={event.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`ml-2 px-4 py-2 rounded-full text-sm font-medium ${themeMode === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} flex items-center`}
              >
                RSVP <ExternalLink size={14} className="ml-1" />
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center mb-4">
          <Link
            to={`/organizations/${event.organizerId}`}
            className="flex items-center text-blue-500 hover:text-blue-600"
          >
            {organization && (
              <img
                src={organization.logo}
                alt={organization.name}
                className="w-6 h-6 rounded-full object-cover mr-2"
              />
            )}
            <span>{organization?.name || 'Unknown Organization'}</span> {/* Use organization name */}
          </Link>

          <div className="ml-auto flex items-center text-gray-500 dark:text-gray-300">
            <Users size={18} className="mr-1" />
            <span>{event.attendanceCount} attending</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${themeMode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-start">
              <Calendar size={20} className="mr-3 mt-1 text-blue-500" />
              <div>
                <h3 className="font-medium">Date & Time</h3>
                <p className="text-gray-600 dark:text-gray-300">{formattedDate}</p>
                <p className="text-gray-600 dark:text-gray-300">{formattedTime}</p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${themeMode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-start">
              <MapPin size={20} className="mr-3 mt-1 text-blue-500" />
              <div>
                <h3 className="font-medium">Location</h3>
                <p className="text-gray-600 dark:text-gray-300">{event.location}</p>
              </div>
            </div>
          </div>
        </div>

        {event.description && (
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-2">About this event</h2>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
              {event.description}
            </p>
          </div>
        )}

        {event.tags.length > 0 && (
          <div>
            <h2 className="text-xl font-medium mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
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

      {organization && (
        <div className={`rounded-lg ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm p-6`}>
          <h2 className="text-xl font-medium mb-4">Organized by</h2>
          <div className="flex items-center">
            <img
              src={organization.logo}
              alt={organization.name}
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
            <div>
              <h3 className="font-medium">{organization.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
                {organization.description}
              </p>
            </div>
            <Link
              to={`/organizations/${organization.id}`}
              className={`ml-auto px-4 py-2 rounded-full text-sm font-medium ${themeMode === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              View
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;