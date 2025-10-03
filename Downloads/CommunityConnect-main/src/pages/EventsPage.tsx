import React, { useState } from 'react';
import { Calendar, Filter, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import { parseISO, format, isAfter } from 'date-fns';

const EventsPage: React.FC = () => {
  const { events, themeMode } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>('');

  // Get all unique tags from events, handling undefined tags
  const allTags = Array.from(new Set(events.flatMap((event) => event.tags || [])));

  // Filter events based on search query, tags, and date
  const filteredEvents = events.filter((event) => {
    // Search filter
    const matchesSearch =
      searchQuery === '' ||
      (event.title && event.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.organizerName && event.organizerName.toLowerCase().includes(searchQuery.toLowerCase()));

    // Tags filter
    const matchesTags =
      selectedTags.length === 0 ||
      (event.tags && selectedTags.some((tag) => event.tags.includes(tag)));

    // Date filter
    let matchesDate = true;
    if (dateFilter) {
      matchesDate = isAfter(parseISO(event.date), parseISO(dateFilter));
    }

    return matchesSearch && matchesTags && matchesDate;
  });

  // Sort events by date
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return parseISO(a.date).getTime() - parseISO(b.date).getTime();
  });

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Events</h1>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div
          className={`relative flex-1 ${
            themeMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          } rounded-full px-3 py-2`}
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search events..."
            className={`w-full pl-8 pr-4 bg-transparent border-none focus:ring-0 focus:outline-none ${
              themeMode === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div
            className={`relative ${
              themeMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            } rounded-full px-3 py-2`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={16} className="text-gray-400" />
            </div>
            <input
              type="date"
              className={`pl-8 pr-4 bg-transparent border-none focus:ring-0 focus:outline-none ${
                themeMode === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="relative group">
            <button
              className={`flex items-center ${
                themeMode === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } rounded-full px-3 py-2`}
            >
              <Filter size={16} className="mr-1" />
              <span>Filter</span>
            </button>

            <div
              className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 ${
                themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'
              } ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10`}
            >
              <div className="px-4 py-2">
                <h3 className="text-sm font-medium mb-2">Filter by tags</h3>
                <div className="flex flex-wrap gap-1">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-500 text-white'
                          : `${themeMode === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {sortedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">No events found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
