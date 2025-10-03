import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api'; // Import LoadScript
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EventsPage from './pages/EventsPage';
import EventDetail from './pages/EventDetail';
import OrganizationsPage from './pages/OrganizationsPage';
import OrganizationDetail from './pages/OrganizationDetail';
import ProfilePage from './pages/ProfilePage';
import CreateEventPage from './pages/CreateEventPage';
import NotificationsPage from './pages/NotificationsPage';
import SearchPage from './pages/SearchPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';
import ProfileSettings from './pages/ProfileSettings';
import UserProfile from './components/UserProfile';
import ManageOrganization from './pages/ManageOrganization';
import Map from './pages/MapPage';

function App() {
  const API_KEY = 'AIzaSyCZTpFTMTK-fUz4F3hHZbqpwsj7GALg0pA'; // Replace with your Google Maps API key

  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={['places']}>
      <AppProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />

            {/* Protected routes under Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="users/:userId" element={<UserProfile />} />
              <Route path="/manage-organization" element={<ManageOrganization />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="settings/profile" element={<ProfileSettings />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="events/:eventId" element={<EventDetail />} />
              <Route path="organizations" element={<OrganizationsPage />} />
              <Route path="organizations/:orgId" element={<OrganizationDetail />} />
              <Route path="organizations/:orgId/events" element={<EventsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="create-event" element={<CreateEventPage />} />
              <Route path="map" element={<Map />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </LoadScript>
  );
}

export default App;