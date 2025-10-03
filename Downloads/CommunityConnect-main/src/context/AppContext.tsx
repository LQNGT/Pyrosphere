import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Organization, Event, ThemeMode, ActivityItem } from '../types';
import { mockUsers, mockOrganizations, mockEvents } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  organizations: Organization[];
  events: Event[];
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  joinOrganization: (orgId: string) => void;
  leaveOrganization: (orgId: string) => void;
  followOrganization: (orgId: string) => void;
  unfollowOrganization: (orgId: string) => void;
  attendEvent: (eventId: string) => void;
  unattendEvent: (eventId: string) => void;
  createEvent: (event: Omit<Event, 'id' | 'attendees' | 'attendanceCount'>) => void;
  blockUser: (userId: string) => void;
  markNotInterested: (orgId: string) => void;
  getUserById: (id: string) => User | undefined;
  getOrganizationById: (id: string) => Organization | undefined;
  getEventById: (id: string) => Event | undefined;
  getUserEvents: (userId: string) => Event[];
  getOrganizationEvents: (orgId: string) => Event[];
  addActivity: (activity: ActivityItem) => void;
  removeMemberFromOrganization: (orgId: string, userId: string) => void;
  inviteMemberToOrganization: (orgId: string, userId: string) => void;
  updateOrganization: (updatedOrg: Organization) => void;
  addUser: (newUser: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    const loadedUsers = saved ? JSON.parse(saved) : mockUsers;
    return loadedUsers.map(user => ({
      ...user,
      eventsAttending: Array.isArray(user.eventsAttending) ? user.eventsAttending : [],
    }));
  });

  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem('organizations');
    return saved ? JSON.parse(saved) : mockOrganizations;
  });

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('events');
    const loadedEvents = saved ? JSON.parse(saved) : mockEvents;
    return loadedEvents.map(event => ({
      ...event,
      attendees: Array.isArray(event.attendees) ? event.attendees : [],
      attendanceCount: typeof event.attendanceCount === 'number' ? event.attendanceCount : 0,
      lat: event.lat != null ? Number(event.lat) : undefined,
      lng: event.lng != null ? Number(event.lng) : undefined,
    }));
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUserId = localStorage.getItem('currentUserId');
    return savedUserId ? users.find(u => u.id === savedUserId) || null : null;
  });

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('themeMode') as ThemeMode) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('organizations', JSON.stringify(organizations));
    localStorage.setItem('events', JSON.stringify(events));
  }, [users, organizations, events]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  const login = useCallback((user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUserId', user.id);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserId');
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  }, [currentUser]);

  const joinOrganization = useCallback((orgId: string) => {
    if (!currentUser || currentUser.organizationsJoined.includes(orgId)) return;
    setCurrentUser(prev => ({
      ...prev!,
      organizationsJoined: [...prev!.organizationsJoined, orgId]
    }));
    setOrganizations(prev =>
      prev.map(org =>
        org.id === orgId ? { ...org, memberCount: org.memberCount + 1 } : org
      )
    );
  }, [currentUser]);

  const leaveOrganization = useCallback((orgId: string) => {
    if (!currentUser || !currentUser.organizationsJoined.includes(orgId)) return;
    setCurrentUser(prev => ({
      ...prev!,
      organizationsJoined: prev!.organizationsJoined.filter(id => id !== orgId)
    }));
    setOrganizations(prev =>
      prev.map(org =>
        org.id === orgId ? { ...org, memberCount: Math.max(0, org.memberCount - 1) } : org
      )
    );
  }, [currentUser]);

  const followOrganization = useCallback((orgId: string) => {
    if (!currentUser || currentUser.organizationsFollowed.includes(orgId)) return;
    setCurrentUser(prev => ({
      ...prev!,
      organizationsFollowed: [...prev!.organizationsFollowed, orgId]
    }));
    setOrganizations(prev =>
      prev.map(org =>
        org.id === orgId ? { ...org, followerCount: org.followerCount + 1 } : org
      )
    );
  }, [currentUser]);

  const unfollowOrganization = useCallback((orgId: string) => {
    if (!currentUser || !currentUser.organizationsFollowed.includes(orgId)) return;
    setCurrentUser(prev => ({
      ...prev!,
      organizationsFollowed: prev!.organizationsFollowed.filter(id => id !== orgId)
    }));
    setOrganizations(prev =>
      prev.map(org =>
        org.id === orgId ? { ...org, followerCount: Math.max(0, org.followerCount - 1) } : org
      )
    );
  }, [currentUser]);

  const attendEvent = useCallback((eventId: string) => {
    if (!currentUser) return;
    setEvents(prev =>
      prev.map(event => {
        if (event.id === eventId && !event.attendees.includes(currentUser.id)) {
          return {
            ...event,
            attendees: [...event.attendees, currentUser.id],
            attendanceCount: event.attendanceCount + 1
          };
        }
        return event;
      })
    );
    setCurrentUser(prev => ({
      ...prev!,
      eventsAttending: prev.eventsAttending ? [...prev.eventsAttending, eventId] : [eventId]
    }));
  }, [currentUser]);

  const unattendEvent = useCallback((eventId: string) => {
    if (!currentUser) return;
    setEvents(prev =>
      prev.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            attendees: event.attendees.filter(id => id !== currentUser.id),
            attendanceCount: Math.max(0, event.attendanceCount - 1)
          };
        }
        return event;
      })
    );
    setCurrentUser(prev => ({
      ...prev!,
      eventsAttending: prev.eventsAttending ? prev.eventsAttending.filter(id => id !== eventId) : []
    }));
  }, [currentUser]);

  const blockUser = useCallback((userId: string) => {
    if (!currentUser) return;
    setCurrentUser(prev => ({
      ...prev!,
      blockedUsers: [...prev!.blockedUsers, userId]
    }));
  }, [currentUser]);

  const markNotInterested = useCallback((orgId: string) => {
    if (!currentUser) return;
    setCurrentUser(prev => ({
      ...prev!,
      notInterestedOrgs: [...prev!.notInterestedOrgs, orgId]
    }));
  }, [currentUser]);

  const createEvent = useCallback((
    eventData: Omit<Event, 'id' | 'attendees' | 'attendanceCount'>
  ) => {
    if (!currentUser?.isOrganization) return;
    const newEvent: Event = {
      ...eventData,
      id: `event-${Date.now()}`,
      attendees: [],
      attendanceCount: 0
    };
    console.log('New event created:', newEvent);
    setEvents(prev => [...prev, newEvent]);
  }, [currentUser]);

  const addActivity = useCallback((activity: ActivityItem) => {
    if (!currentUser) return;
    setCurrentUser(prev => ({
      ...prev!,
      activityFeed: [activity, ...prev!.activityFeed]
    }));
  }, [currentUser]);

  const getUserById = useCallback((id: string) =>
    users.find(user => user.id === id), [users]);

  const getOrganizationById = useCallback((id: string) =>
    organizations.find(org => org.id === id), [organizations]);

  const getEventById = useCallback((id: string) =>
    events.find(event => event.id === id), [events]);

  const getUserEvents = useCallback((userId: string) =>
    events.filter(event =>
      event.attendees.includes(userId) ||
      event.organizerId === userId
    ), [events]);

  const getOrganizationEvents = useCallback((orgId: string) =>
    events.filter(event => event.organizerId === orgId), [events]);

  const addUser = useCallback((newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    if (newUser.isOrganization) {
      const newOrganization: Organization = {
        id: newUser.id,
        name: newUser.name,
        description: newUser.bio || '',
        logo: newUser.avatar,
        coverImage: '',
        tags: [],
        isUniversitySponsored: false,
        followerCount: 0,
        memberCount: 1,
        events: [],
        relatedOrganizations: [],
        members: [{ userId: newUser.id, role: 'president' }],
      };
      setOrganizations(prev => [...prev, newOrganization]);
    }
  }, []);

  const removeMemberFromOrganization = useCallback((orgId: string, userId: string) => {
    setOrganizations(prev =>
      prev.map(org =>
        org.id === orgId
          ? {
              ...org,
              members: org.members.filter(m => m.userId !== userId),
              memberCount: Math.max(0, org.memberCount - 1)
            }
          : org
      )
    );
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? {
              ...user,
              organizationsJoined: user.organizationsJoined.filter(id => id !== orgId)
            }
          : user
      )
    );
    if (currentUser?.id === userId) {
      setCurrentUser(prev => ({
        ...prev!,
        organizationsJoined: prev!.organizationsJoined.filter(id => id !== orgId)
      }));
    }
  }, [currentUser]);

  const inviteMemberToOrganization = useCallback((orgId: string, userId: string) => {
    setOrganizations(prev =>
      prev.map(org =>
        org.id === orgId
          ? {
              ...org,
              members: [...org.members, { userId, role: 'member' }],
              memberCount: org.memberCount + 1
            }
          : org
      )
    );
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? {
              ...user,
              organizationsJoined: [...user.organizationsJoined, orgId]
            }
          : user
      )
    );
    if (currentUser?.id === userId) {
      setCurrentUser(prev => ({
        ...prev!,
        organizationsJoined: [...prev!.organizationsJoined, orgId]
      }));
    }
  }, [currentUser]);

  const updateOrganization = useCallback((updatedOrg: Organization) => {
    setOrganizations(prev =>
      prev.map(org => (org.id === updatedOrg.id ? updatedOrg : org))
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        organizations,
        events,
        themeMode,
        setThemeMode,
        login,
        logout,
        updateUser,
        joinOrganization,
        leaveOrganization,
        followOrganization,
        unfollowOrganization,
        attendEvent,
        unattendEvent,
        createEvent,
        blockUser,
        markNotInterested,
        getUserById,
        getOrganizationById,
        getEventById,
        getUserEvents,
        getOrganizationEvents,
        addActivity,
        removeMemberFromOrganization,
        inviteMemberToOrganization,
        updateOrganization,
        addUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};