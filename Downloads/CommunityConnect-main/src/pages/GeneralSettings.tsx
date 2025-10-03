import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Switch } from '@headlessui/react';

const GeneralSettings = () => {
  const { currentUser, updateUser, themeMode, setThemeMode } = useApp();

  const [notifications, setNotifications] = useState({
    emailNotifications: currentUser?.notifications?.emailNotifications || false,
    pushNotifications: currentUser?.notifications?.pushNotifications || false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: currentUser?.privacy?.profileVisible || true,
    showOrganizationsJoined: currentUser?.privacy?.showOrganizationsJoined || true,
    showEventsAttending: currentUser?.privacy?.showEventsAttending || true,
  });

  const handleSave = () => {
    if (currentUser) {
      updateUser({ ...currentUser, notifications, privacy });
      alert("Settings saved!");
    }
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold text-center">General Settings</h1>
      
      {/* Notifications */}
      <div>
        <h2 className="text-lg font-medium mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Email Notifications</span>
            <Switch
              checked={notifications.emailNotifications}
              onChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
              className={`${notifications.emailNotifications ? 'bg-blue-500' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className={`${notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white`} />
            </Switch>
          </div>
          <div className="flex items-center justify-between">
            <span>Push Notifications</span>
            <Switch
              checked={notifications.pushNotifications}
              onChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
              className={`${notifications.pushNotifications ? 'bg-blue-500' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className={`${notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white`} />
            </Switch>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div>
        <h2 className="text-lg font-medium mb-4">Theme</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setThemeMode('light')}
            className={`px-4 py-2 rounded-md ${themeMode === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            Light
          </button>
          <button
            onClick={() => setThemeMode('dark')}
            className={`px-4 py-2 rounded-md ${themeMode === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            Dark
          </button>
        </div>
      </div>

      {/* Privacy */}
      <div>
        <h2 className="text-lg font-medium mb-4">Privacy</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Profile Visible to Others</span>
            <Switch
              checked={privacy.profileVisible}
              onChange={(checked) => setPrivacy({ ...privacy, profileVisible: checked })}
              className={`${privacy.profileVisible ? 'bg-blue-500' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className={`${privacy.profileVisible ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white`} />
            </Switch>
          </div>
          <div className="flex items-center justify-between">
            <span>Show Organizations Joined</span>
            <Switch
              checked={privacy.showOrganizationsJoined}
              onChange={(checked) => setPrivacy({ ...privacy, showOrganizationsJoined: checked })}
              className={`${privacy.showOrganizationsJoined ? 'bg-blue-500' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className={`${privacy.showOrganizationsJoined ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white`} />
            </Switch>
          </div>
          <div className="flex items-center justify-between">
            <span>Show Events Attending</span>
            <Switch
              checked={privacy.showEventsAttending}
              onChange={(checked) => setPrivacy({ ...privacy, showEventsAttending: checked })}
              className={`${privacy.showEventsAttending ? 'bg-blue-500' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className={`${privacy.showEventsAttending ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white`} />
            </Switch>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Save Settings
      </button>
    </div>
  );
};

export default GeneralSettings;