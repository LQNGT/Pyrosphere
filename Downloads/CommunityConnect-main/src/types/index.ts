interface PrivacySettings {
  profileVisible: boolean;
  showOrganizationsJoined: boolean;
  showEventsAttending: boolean;
}

interface SocialMedia {
  website?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  major?: string;
  graduationYear?: string;
  socialMedia?: SocialMedia;
  notifications?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  privacy: PrivacySettings;
  organizationsJoined: string[];
  organizationsFollowed: string[];
  eventsAttending: string[];
  activityFeed: ActivityItem[];
  followers: string[];
  following: string[];
  isOrganization: boolean;
  blockedUsers: string[];
  notInterestedOrgs: string[];
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage?: string;
  tags: string[];
  isUniversitySponsored: boolean;
  followerCount: number;
  memberCount: number;
  events: string[];
  relatedOrganizations: string[];
  members: { userId: string; role: 'president' | 'officer' | 'member' }[];
  joinMode?: 'immediate' | 'form';
}

export type Event = {
  id: string;
  title: string;
  organizerId: string;
  organizerName: string;
  date: string;
  location: string;
  description?: string;
  tags: string[];
  image?: string;
  externalLink?: string;
  lat?: number;
  lng?: number;
  attendees: string[];
  attendanceCount: number;
  creatorType?: string;
};

export type ThemeMode = 'light' | 'dark';