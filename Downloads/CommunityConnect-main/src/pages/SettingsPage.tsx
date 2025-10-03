import React, { useState } from 'react';
import ProfileSettings from './ProfileSettings';
import GeneralSettings from './GeneralSettings';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${activeTab === 'profile' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'general' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
      </div>
      {activeTab === 'profile' && <ProfileSettings />}
      {activeTab === 'general' && <GeneralSettings />}
    </div>
  );
};

export default SettingsPage;