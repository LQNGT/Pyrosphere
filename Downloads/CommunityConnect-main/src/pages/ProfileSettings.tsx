import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const ProfileSettings: React.FC = () => {
  const { currentUser, organizations, updateUser, updateOrganization } = useApp();

  if (!currentUser) return null;

  // Define default placeholder images
  const defaultLogo = 'https://placehold.co/100x100?text=Logo';
  const defaultCover = 'https://placehold.co/800x200?text=Cover';

  // Initialize form data based on user type
  let formDataInitial = {};
  if (currentUser.isOrganization) {
    const organization = organizations.find(org => org.id === currentUser.id);
    if (organization) {
      formDataInitial = {
        name: organization.name,
        description: organization.description,
        logo: organization.logo || '',
        coverImage: organization.coverImage || '',
        tags: organization.tags.join(', '),
      };
    }
  } else {
    formDataInitial = {
      name: currentUser.name,
      bio: currentUser.bio,
      major: currentUser.major,
      graduationYear: currentUser.graduationYear,
      avatar: currentUser.avatar,
      socialMedia: {
        website: currentUser.socialMedia?.website || '',
        linkedin: currentUser.socialMedia?.linkedin || '',
        instagram: currentUser.socialMedia?.instagram || '',
      },
    };
  }

  const [formData, setFormData] = useState(formDataInitial);

  // Separate state for URL input fields to manage display
  const [logoUrlInput, setLogoUrlInput] = useState(
    currentUser.isOrganization && formData.logo && !formData.logo.startsWith('data:')
      ? formData.logo
      : ''
  );
  const [coverUrlInput, setCoverUrlInput] = useState(
    currentUser.isOrganization && formData.coverImage && !formData.coverImage.startsWith('data:')
      ? formData.coverImage
      : ''
  );

  // Handle file upload for logo
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, logo: event.target?.result as string });
        setLogoUrlInput(''); // Clear URL input when file is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file upload for cover image
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, coverImage: event.target?.result as string });
        setCoverUrlInput(''); // Clear URL input when file is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.isOrganization) {
      const organization = organizations.find(org => org.id === currentUser.id);
      if (organization) {
        updateOrganization({
          ...organization,
          name: formData.name,
          description: formData.description,
          logo: formData.logo,
          coverImage: formData.coverImage,
          tags: formData.tags.split(',').map(tag => tag.trim()),
        });
      }
    } else {
      updateUser({
        ...currentUser,
        name: formData.name,
        bio: formData.bio,
        major: formData.major,
        graduationYear: formData.graduationYear,
        avatar: formData.avatar,
        socialMedia: {
          website: formData.socialMedia.website,
          linkedin: formData.socialMedia.linkedin,
          instagram: formData.socialMedia.instagram,
        },
      });
    }
  };

  // Organization Settings Form
  if (currentUser.isOrganization) {
    const organization = organizations.find(org => org.id === currentUser.id);
    if (!organization) return <div>Organization not found</div>;

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Organization Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Organization Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Logo Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Logo</label>
            <div className="flex items-center space-x-4">
              <img
                src={formData.logo || defaultLogo}
                alt="Logo Preview"
                className="w-24 h-24 object-cover rounded-full"
              />
              <div className="flex-1 space-y-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Enter URL</label>
                  <input
                    type="url"
                    value={logoUrlInput}
                    onChange={(e) => {
                      setLogoUrlInput(e.target.value);
                      setFormData({ ...formData, logo: e.target.value });
                    }}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Or upload file</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Cover Image</label>
            <div className="space-y-2">
              <div
                className="w-full h-32 bg-cover bg-center rounded-md"
                style={{ backgroundImage: `url(${formData.coverImage || defaultCover})` }}
              ></div>
              <div>
                <label className="block text-sm font-medium mb-1">Enter URL</label>
                <input
                  type="url"
                  value={coverUrlInput}
                  onChange={(e) => {
                    setCoverUrlInput(e.target.value);
                    setFormData({ ...formData, coverImage: e.target.value });
                  }}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Or upload file</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    );
  }

  // User Settings Form (unchanged)
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Profile Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center mb-6">
          <img
            src={formData.avatar || 'https://via.placeholder.com/150'}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <input
            type="url"
            placeholder="Avatar URL"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Display Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Major</label>
            <input
              type="text"
              value={formData.major}
              onChange={(e) => setFormData({ ...formData, major: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Graduation Year</label>
            <input
              type="number"
              value={formData.graduationYear}
              onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Social Media</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input
              type="url"
              placeholder="https://yourwebsite.com"
              value={formData.socialMedia.website}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialMedia: { ...formData.socialMedia, website: e.target.value },
                })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <input
              type="text"
              placeholder="linkedin.com/in/yourprofile"
              value={formData.socialMedia.linkedin}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialMedia: { ...formData.socialMedia, linkedin: e.target.value },
                })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instagram</label>
            <input
              type="text"
              placeholder="@yourhandle"
              value={formData.socialMedia.instagram}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialMedia: { ...formData.socialMedia, instagram: e.target.value },
                })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;