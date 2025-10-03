import React from 'react';
import { Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NotificationsPage: React.FC = () => {
  const { themeMode } = useApp();
  
  // Mock notifications for demo
  const notifications = [
    {
      id: 'notif1',
      title: 'New Event: Coding Hackathon',
      message: 'Computer Science Club has posted a new event: Coding Hackathon',
      time: '2 hours ago',
      read: false
    },
    {
      id: 'notif2',
      title: 'Event Reminder',
      message: 'Town Hall Meeting starts tomorrow at 3:00 PM',
      time: '5 hours ago',
      read: false
    },
    {
      id: 'notif3',
      title: 'New Follower',
      message: 'Taylor Smith is now following you',
      time: '1 day ago',
      read: true
    },
    {
      id: 'notif4',
      title: 'Organization Update',
      message: 'Robotics Club has updated their information',
      time: '2 days ago',
      read: true
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Notifications</h1>
      </div>
      
      {notifications.length > 0 ? (
        <div className={`rounded-lg ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm overflow-hidden`}>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`p-4 ${notification.read ? '' : themeMode === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-full ${notification.read ? 'bg-gray-200 dark:bg-gray-600' : 'bg-blue-100 dark:bg-blue-900'} mr-3`}>
                    <Bell size={16} className={notification.read ? 'text-gray-500 dark:text-gray-400' : 'text-blue-500 dark:text-blue-300'} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${notification.read ? '' : 'text-blue-600 dark:text-blue-400'}`}>
                      {notification.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                      {notification.message}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Bell size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">No notifications</h3>
          <p className="text-gray-500 dark:text-gray-400">
            You don't have any notifications at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;