// ManageOrganization.tsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const ManageOrganization: React.FC = () => {
  const { currentUser, organizations, users, removeMemberFromOrganization, inviteMemberToOrganization } = useApp();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const organization = organizations.find(org => org.id === currentUser?.id);
  if (!organization) {
    return <div>Organization not found</div>;
  }

  const president = organization.members.find(m => m.role === 'president');
  const officers = organization.members.filter(m => m.role === 'officer');
  const members = organization.members.filter(m => m.role === 'member');

  const presidentUser = users.find(u => u.id === president?.userId);
  const nonMembers = users.filter(user => !organization.members.some(m => m.userId === user.id) && !user.isOrganization);
  const filteredUsers = nonMembers.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Organization: {organization.name}</h1>
      
      {/* President Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
        <h2 className="text-lg font-medium mb-2">President</h2>
        {presidentUser ? (
          <div className="flex items-center">
            <img src={presidentUser.avatar} alt={presidentUser.name} className="w-10 h-10 rounded-full mr-3" />
            <span>{presidentUser.name}</span>
          </div>
        ) : (
          <p className="text-gray-500">No president assigned</p>
        )}
      </div>
      
      {/* Officers Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
        <h2 className="text-lg font-medium mb-2">Officers</h2>
        {officers.length > 0 ? (
          <ul className="space-y-3">
            {officers.map(officer => {
              const officerUser = users.find(u => u.id === officer.userId);
              return officerUser ? (
                <li key={officer.userId} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={officerUser.avatar} alt={officerUser.name} className="w-8 h-8 rounded-full mr-3" />
                    <span>{officerUser.name}</span>
                  </div>
                  <button
                    onClick={() => removeMemberFromOrganization(organization.id, officer.userId)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Kick
                  </button>
                </li>
              ) : null;
            })}
          </ul>
        ) : (
          <p className="text-gray-500">No officers</p>
        )}
      </div>
      
      {/* Members Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
        <h2 className="text-lg font-medium mb-2">Members</h2>
        {members.length > 0 ? (
          <ul className="space-y-3">
            {members.map(member => {
              const memberUser = users.find(u => u.id === member.userId);
              return memberUser ? (
                <li key={member.userId} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={memberUser.avatar} alt={memberUser.name} className="w-8 h-8 rounded-full mr-3" />
                    <span>{memberUser.name}</span>
                  </div>
                  <button
                    onClick={() => removeMemberFromOrganization(organization.id, member.userId)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Kick
                  </button>
                </li>
              ) : null;
            })}
          </ul>
        ) : (
          <p className="text-gray-500">No members</p>
        )}
      </div>
      
      {/* Invite Button */}
      <button
        onClick={() => setShowInviteModal(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
      >
        Invite Members
      </button>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-xl font-medium mb-4">Invite Members</h2>
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-3 py-2 border rounded-md mb-4 dark:bg-gray-700 dark:border-gray-600"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <div className="max-h-60 overflow-y-auto mb-4">
              {filteredUsers.map(user => (
                <div key={user.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => {
                      setSelectedUsers(prev => 
                        prev.includes(user.id) 
                          ? prev.filter(id => id !== user.id) 
                          : [...prev, user.id]
                      );
                    }}
                    className="mr-2"
                  />
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-2" />
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  selectedUsers.forEach(userId => inviteMemberToOrganization(organization.id, userId));
                  setShowInviteModal(false);
                  setSelectedUsers([]);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrganization;