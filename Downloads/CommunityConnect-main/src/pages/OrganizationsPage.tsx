import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import OrganizationCard from '../components/OrganizationCard';

const OrganizationsPage: React.FC = () => {
  const { organizations, themeMode } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'university' | 'student'>('all');
  
  // Get all unique tags from organizations
  const allTags = Array.from(new Set(organizations.flatMap(org => org.tags)));
  
  // Filter organizations based on search query, tags, and type
  const filteredOrganizations = organizations.filter(org => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Tags filter
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => org.tags.includes(tag));
    
    // Type filter
    let matchesType = true;
    if (filterType === 'university') {
      matchesType = org.isUniversitySponsored;
    } else if (filterType === 'student') {
      matchesType = !org.isUniversitySponsored;
    }
    
    return matchesSearch && matchesTags && matchesType;
  });
  
  // Sort organizations by follower count
  const sortedOrganizations = [...filteredOrganizations].sort((a, b) => {
    return b.followerCount - a.followerCount;
  });
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Organizations</h1>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className={`relative flex-1 ${themeMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-full px-3 py-2`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search organizations..."
            className={`w-full pl-8 pr-4 bg-transparent border-none focus:ring-0 focus:outline-none ${themeMode === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="flex rounded-full overflow-hidden">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-2 text-sm ${
                filterType === 'all'
                  ? `${themeMode === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} text-white`
                  : `${themeMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('university')}
              className={`px-3 py-2 text-sm ${
                filterType === 'university'
                  ? `${themeMode === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} text-white`
                  : `${themeMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`
              }`}
            >
              University
            </button>
            <button
              onClick={() => setFilterType('student')}
              className={`px-3 py-2 text-sm ${
                filterType === 'student'
                  ? `${themeMode === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} text-white`
                  : `${themeMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} ${themeMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`
              }`}
            >
              Student
            </button>
          </div>
          
          <div className="relative group">
            <button className={`flex items-center ${themeMode === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-full px-3 py-2`}>
              <Filter size={16} className="mr-1" />
              <span>Filter</span>
            </button>
            
            <div className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'} ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10`}>
              <div className="px-4 py-2">
                <h3 className="text-sm font-medium mb-2">Filter by tags</h3>
                <div className="flex flex-wrap gap-1">
                  {allTags.map(tag => (
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
      
      {sortedOrganizations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedOrganizations.map(org => (
            <OrganizationCard key={org.id} organization={org} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No organizations found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
};

export default OrganizationsPage;