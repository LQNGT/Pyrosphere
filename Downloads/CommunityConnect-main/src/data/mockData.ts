import { User, Organization, Event } from '../types';
import { addDays, format } from 'date-fns';

// Helper to generate dates relative to today
const getDate = (daysFromNow: number): string => {
  return format(addDays(new Date(), daysFromNow), "yyyy-MM-dd'T'HH:mm");
};

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Cheeto',
    email: 'cheeto@ucdavis.edu',
    avatar: 'https://images.unsplash.com/photo-1593483316242-efb5420596ca?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3JhbmdlJTIwY2F0fGVufDB8fDB8fHww',
    bio: 'Computer Science major, mice enthusiast',
    isOrganization: false,
    organizationsJoined: ['org1', 'org3'],
    organizationsFollowed: ['org2', 'org4'],
    friends: ['user2', 'user3'],
    following: ['user2', 'user3', 'user4'],
    followers: ['user2', 'user5']
  },
  {
    id: 'user2',
    name: 'Gunrock',
    email: 'gunrock@ucdavis.edu',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9LhUPkLHz9-dBRK_hBd9H6WrXrRgR7gOxqQ&s',
    bio: 'Veterinary major',
    isOrganization: false,
    organizationsJoined: ['org2'],
    organizationsFollowed: ['org1', 'org3'],
    friends: ['user1', 'user4'],
    following: ['user1', 'user3'],
    followers: ['user1', 'user3', 'user4']
  },
  {
    id: 'org1',
    name: 'Computer Science Club',
    email: 'cs-club@university.edu',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Official Computer Science Club',
    isOrganization: true,
    organizationsJoined: [],
    organizationsFollowed: [],
    friends: [],
    following: [],
    followers: []
  }
];

export const mockOrganizations: Organization[] = [
  {
    id: 'org1',
    name: 'Arbor Analytics Club',
    description: 'A community for Computer and Finance enthusiasts to collaborate and learn together',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    tags: ['Technology', 'Programming', 'Academic'],
    isUniversitySponsored: false,
    followerCount: 245,
    memberCount: 15,
    events: ['event1', 'event3'],
    relatedOrganizations: ['org3', 'org5']
  },
  {
    id: 'org2',
    name: 'ASUCD',
    description: 'Associated Students, University of California, Davis',
    logo: 'https://executiveoffice.ucdavis.edu/sites/g/files/dgvnsk13416/files/Executive-icon-color.png',
    coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwZf_7_9b-2qaQa-aP-hYVkN7qyvsowHpLqA&s',
    tags: ['Leadership', 'Governance', 'University'],
    isUniversitySponsored: true,
    followerCount: 512,
    memberCount: 65,
    events: ['event2'],
    relatedOrganizations: ['org4']
  },
  {
    id: 'org3',
    name: 'AvenueE',
    description: 'Roadmap to your career in Engineering and Computer Science',
    logo: 'https://scc.losrios.edu/scc/main/img/reuse-event-735-414/student-resources/AvenueE-735x414.jpg',
    coverImage: 'https://avenuee.engineering.ucdavis.edu/sites/g/files/dgvnsk9286/files/styles/sf_landscape_4x3/public/media/images/apply_avenuee_uc_davis.png?h=52d3fcb6&itok=ydjMCFuR',
    tags: ['Technology', 'Engineering', 'Robotics'],
    isUniversitySponsored: false,
    followerCount: 187,
    memberCount: 140,
    events: ['event4'],
    relatedOrganizations: ['org1', 'org5']
  },
  {
    id: 'org4',
    name: 'UC Davis Athletics',
    description: 'Official Athletics Department of UC Davis',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/UC_Davis_Aggies_logo.svg/1200px-UC_Davis_Aggies_logo.svg.png',
    coverImage: 'https://www.ucdavis.edu/sites/default/files/styles/hero_ambient_2000_x_770/public/media/images/uc-davis-athletics-hero.jpg?h=8e58fdb5&itok=kzGsVZb9',
    tags: ['Sports', 'Fitness', 'University'],
    isUniversitySponsored: true,
    followerCount: 876,
    memberCount: 320,
    events: ['event5'],
    relatedOrganizations: ['org2']
  },
  {
    id: 'org5',
    name: 'AI Research Group',
    description: 'Exploring the frontiers of artificial intelligence',
    logo: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    tags: ['Technology', 'AI', 'Research', 'Academic'],
    isUniversitySponsored: false,
    followerCount: 156,
    memberCount: 28,
    events: [],
    relatedOrganizations: ['org1', 'org3']
  }
];

export const mockEvents: Event[] = [
  {
    id: 'event1',
    title: 'SacHacks VI',
    organizerId: 'org1',
    organizerName: 'ASUCD',
    date: '2025-03-01T10:30', // Manually set date and time
    location: 'TLC 1020',
    description: '24-hour coding challenge to build innovative solutions. Prizes for top teams!',
    tags: ['Hackathon', 'Programming', 'Competition'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuZznhRTw9wt_-cfXClNxmHCNxPn3CvgMG8g&s',
    externalLink: 'https://sachacks.io/',
    attendanceCount: 175,
    attendees: ['user1', 'user2'],
    lat: 38.5389,
    lng: -121.7542,
  },
  {
    id: 'event2',
    title: 'AAG Club Meeting',
    organizerId: 'org2',
    organizerName: 'Arbor Analytics Club',
    date: '2023-03-02T21:00', // Manually set date and time
    location: 'Wellman Hall 2',
    description: 'General Meeting with workshops!',
    tags: ['Meeting', 'Discussion', 'Campus', 'Club', 'Finance'],
    image: 'https://www.herecollegestation.com/wp-content/uploads/2025/02/aggie-investment-club-meeting.webp.webp',
    attendanceCount: 25,
    attendees: ['user2'],
    lat: 38.5417,
    lng: -121.7513,
  },
  {
    id: 'event3',
    title: 'Volleyball Game',
    organizerId: 'org3',
    organizerName: 'AI Research Group',
    date: '2025-03-03T18:00', // Manually set date and time
    location: 'Beach Volleyball Courts',
    description: 'Come play volleyball with us!',
    tags: ['Sport', 'Volleyball', 'Game'],
    image: 'https://www.allvolleyball.com/cdn/shop/articles/beach-volleyball-faq_0376d8f4-9999-4701-880c-be8d22b5eb29.jpg?v=1717684316&width=1600',
    attendanceCount: 4,
    attendees: ['user1'],
    lat: 38.5450,
    lng: -121.7495,
  },
  {
    id: 'event4',
    title: 'Exploring Old Sacramento',
    organizerId: 'org4',
    organizerName: 'AvenueE',
    date: '2025-03-12T10:00', // Manually set date and time
    location: 'Engineering Building, Lab 2',
    description: 'Come with us on a tour of Old Sacramento!',
    tags: ['Visit', 'Exploring', 'Food'],
    image: 'https://www.oldsacramento.com/sites/main/files/imagecache/medium/main-images/old-sac-district.jpg?1578058947',
    externalLink: 'https://example.com/robotshowcase',
    attendanceCount: 6,
    attendees: [],
    lat: 38.5832,
    lng: -121.5052,
  },
  {
    id: 'event5',
    title: 'Games Night',
    organizerId: 'org5',
    organizerName: 'AvenueE',
    date: '2025-03-10T19:00', // Manually set date and time
    location: 'Games Area at the MU',
    description: 'Come and enjoy the night while Bowling and eating pizza!',
    tags: ['Sports', 'Game', 'Food'],
    image: 'https://plus.unsplash.com/premium_photo-1679321795564-f73ec1c21fcd?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ym93bGluZ3xlbnwwfHwwfHx8MA%3D%3D',
    externalLink: 'https://example.com/championship',
    attendanceCount: 30,
    attendees: ['user2'],
    lat: 38.5428,
    lng: -121.7492,
  }
];
