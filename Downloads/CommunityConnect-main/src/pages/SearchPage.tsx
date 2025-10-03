import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Calendar, Users, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import OrganizationCard from '../components/OrganizationCard';
import UserCard from '../components/UserCard';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const { events, organizations, users, themeMode } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'events' | 'organizations' | 'users'>('all');
  
  // Get search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [location.search]);
  
  // Filter results based on search query
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.organizerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredOrganizations = organizations.filter(org => 
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search query
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex items-center">
          <div className={`relative flex-1 ${themeMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-full px-3 py-2`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events, organizations, people..."
              className={`w-full pl-8 pr-4 bg-transparent border-none focus:ring-0 focus:outline-none ${themeMode === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className={`ml-2 px-4 py-2 rounded-md ${themeMode === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            Search
          </button>
        </form>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'all' 
                ? 'border-b-2 border-blue-500 text-blue-500' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'events' 
                ? 'border-b-2 border-blue-500 text-blue-500' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <span className="flex items-center">
              <Calendar size={16} className="mr-1" />
              Events
            </span>
          </button>
          <button
            onClick={() => setActiveTab('organizations')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'organizations' 
                ? 'border-b-2 border-blue-500 text-blue-500' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <span className="flex items-center">
              <Users size={16} className="mr-1" />
              Organizations
            </span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'users' 
                ? 'border-b-2 border-blue-500 text-blue-500' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <span className="flex items-center">
              <UserIcon size={16} className="mr-1" />
              People
            </span>
          </button>
        </div>
      </div>
      
      {searchQuery ? (
        <>
          {(activeTab === 'all' || activeTab === 'events') && filteredEvents.length > 0 && (
            <section className="mb-8">
              {activeTab === 'all' && <h2 className="text-xl font-medium mb-4">Events</h2>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEvents.slice(0, activeTab === 'all' ? 2 : undefined).map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}
          
          {(activeTab === 'all' || activeTab === 'organizations') && filteredOrganizations.length > 0 && (
            <section className="mb-8">
              {activeTab === 'all' && <h2 className="text-xl font-medium mb-4">Organizations</h2>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOrganizations.slice(0, activeTab === 'all' ? 2 : undefined).map(org => (
                  <OrganizationCard key={org.id} organization={org} />
                ))}
              </div>
            </section>
          )}
          
          {(activeTab === 'all' || activeTab === 'users') && filteredUsers.length > 0 && (
            <section>
              {activeTab === 'all' && <h2 className="text-xl font-medium mb-4">People</h2>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUsers.slice(0, activeTab === 'all' ? 2 : undefined).map(user => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </section>
          )}
          
          {((activeTab === 'all' && 
             filteredEvents.length === 0 && 
             filteredOrganizations.length === 0 && 
             filteredUsers.length === 0) ||
            (activeTab === 'events' && filteredEvents.length === 0) ||
            (activeTab === 'organizations' && filteredOrganizations.length === 0) ||
            (activeTab === 'users' && filteredUsers.length === 0)) && (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search query
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Search size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Enter a search query</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Search for events, organizations, or people
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;