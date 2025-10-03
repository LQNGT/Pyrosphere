import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '../types';
import { format, parseISO } from 'date-fns';
import { useApp } from '../context/AppContext';

interface EventCardProps {
  event: Event;
  compact?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, compact = false }) => {
  const { themeMode, attendEvent, unattendEvent, currentUser, getOrganizationById } = useApp();
  const organization = getOrganizationById(event.organizerId); // Fetch organization

  const formattedDate = format(parseISO(event.date), 'MMM d, yyyy • h:mm a');
  const isAttending = currentUser && event.attendees && event.attendees.includes(currentUser.id);

  const handleAttend = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAttending) {
      unattendEvent(event.id);
    } else {
      attendEvent(event.id);
    }
  };

  if (compact) {
    return (
      <Link
        to={`/events/${event.id}`}
        className={`block rounded-lg overflow-hidden ${
          themeMode === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
        } shadow-sm transition duration-150 ease-in-out`}
      >
        <div className="p-4">
          <h3 className="font-medium text-sm truncate">{event.title}</h3>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-300 mt-1">
            <Calendar size={12} className="mr-1" />
            {format(parseISO(event.date), 'MMM d')}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <Link to={`/events/${event.id}`}>
        {event.image && (
          <div className="h-40 overflow-hidden">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-medium text-lg">{event.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {organization?.name || 'Unknown Organization'} {/* Use organization name */}
          </p>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
          <Calendar size={16} className="mr-2" />
          {formattedDate}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-300 mt-2">
          <MapPin size={16} className="mr-2" />
          {event.location}
        </div>
        {event.tags && event.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-block px-2 py-1 text-xs rounded-full ${
                  themeMode === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 flex justify-between items-center">
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
              className="text-sm text-blue-500 hover:underline"
            >
              RSVP External
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;