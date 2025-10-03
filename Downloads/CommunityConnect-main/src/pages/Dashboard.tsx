import React, { useState } from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import OrganizationCard from '../components/OrganizationCard';
import { format, parseISO, isBefore, isToday, addDays } from 'date-fns';

const Dashboard: React.FC = () => {
  const { currentUser, events, organizations, getUserEvents } = useApp();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'today' | 'discover'>('upcoming');
  
  // Get user's events if logged in
  const userEvents = currentUser ? getUserEvents(currentUser.id) : [];
  
  // Filter events based on active tab
  const filteredEvents = userEvents.filter(event => {
    const eventDate = parseISO(event.date);
    
    if (activeTab === 'today') {
      return isToday(eventDate);
    } else if (activeTab === 'upcoming') {
      return isBefore(new Date(), eventDate);
    }
    
    return true;
  });
  
  // Sort events by date
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return parseISO(a.date).getTime() - parseISO(b.date).getTime();
  });
  
  // For discover tab, show some recommended organizations
  const recommendedOrgs = organizations.slice(0, 3);
  
  // For discover tab, show some upcoming events
  const upcomingEvents = events
    .filter(event => isBefore(new Date(), parseISO(event.date)))
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'upcoming' 
                ? 'bg-blue-500 text-white dark:bg-blue-600' 
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <span className="flex items-center">
              <Calendar size={16} className="mr-1" />
              Upcoming
            </span>
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'today' 
                ? 'bg-blue-500 text-white dark:bg-blue-600' 
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <span className="flex items-center">
              <Clock size={16} className="mr-1" />
              Today
            </span>
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'discover' 
                ? 'bg-blue-500 text-white dark:bg-blue-600' 
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <span className="flex items-center">
              <Users size={16} className="mr-1" />
              Discover
            </span>
          </button>
        </div>
      </div>

      {activeTab !== 'discover' ? (
        <>
          {sortedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {activeTab === 'today' 
                  ? "You don't have any events scheduled for today." 
                  : "You don't have any upcoming events."}
              </p>
              <button 
                onClick={() => setActiveTab('discover')}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Discover Events
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-medium mb-4">Recommended Organizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedOrgs.map(org => (
                <OrganizationCard key={org.id} organization={org} />
              ))}
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-medium mb-4">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Dashboard;