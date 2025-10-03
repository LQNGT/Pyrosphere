import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Tag, Image, Link as LinkIcon, ArrowLeft, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Autocomplete } from '@react-google-maps/api';

const CreateEventPage: React.FC = () => {
  const { currentUser, createEvent, themeMode } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geocodingError, setGeocodingError] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const API_KEY = 'AIzaSyCZTpFTMTK-fUz4F3hHZbqpwsj7GALg0pA'; // Ensure this matches App.tsx

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        setLocation(place.formatted_address || place.name || '');
        setLat(place.geometry.location.lat());
        setLng(place.geometry.location.lng());
      } else {
        setLocation(place.name || '');
        setLat(null);
        setLng(null);
      }
    }
  };

  const geocodeAddress = async (address: string) => {
    try {
      const encodedAddress = encodeURIComponent(address);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const loc = data.results[0].geometry.location;
        return { lat: loc.lat, lng: loc.lng };
      } else {
        console.error('Geocoding failed:', data.status, data.error_message);
        return null;
      }
    } catch (error) {
      console.error('Error during geocoding:', error);
      return null;
    }
  };

  if (!currentUser?.isOrganization) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Access Denied</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Only organization accounts can create events.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setGeocodingError('');

    try {
      const dateTime = `${date}T${time}`;
      let eventLat = lat;
      let eventLng = lng;

      if (eventLat === null || eventLng === null) {
        if (location.trim()) {
          const geocodeResult = await geocodeAddress(location);
          if (geocodeResult) {
            eventLat = geocodeResult.lat;
            eventLng = geocodeResult.lng;
            console.log('Geocoded coordinates:', { lat: eventLat, lng: eventLng });
          } else {
            console.log('Geocoding failed for address:', location);
            setGeocodingError(
              'Could not find coordinates for the provided address. The event will be created but may not appear on the map.'
            );
          }
        }
      } else {
        console.log('Using autocomplete coordinates:', { lat: eventLat, lng: eventLng });
      }

      const eventData = {
        title,
        organizerId: currentUser.id,
        organizerName: currentUser.name,
        date: dateTime,
        location,
        description: description || undefined,
        tags,
        image: image || undefined,
        externalLink: externalLink || undefined,
        lat: eventLat,
        lng: eventLng,
        creatorType: 'organization'
      };

      console.log('Creating event with data:', eventData);

      await createEvent(eventData);

      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
      setGeocodingError('An error occurred while creating the event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-500 hover:text-blue-600 mb-4"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back
      </button>

      <div className={`rounded-lg ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm p-6`}>
        <h1 className="text-2xl font-bold mb-6">Create New Event</h1>

        {geocodingError && (
          <div
            className={`p-3 mb-4 rounded-md ${
              themeMode === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            <p>{geocodingError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={`w-full px-3 py-2 rounded-md ${
                  themeMode === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">
                  Date *
                </label>
                <div className={`relative ${themeMode === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-md`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className={`w-full pl-10 pr-3 py-2 rounded-md ${
                      themeMode === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium mb-1">
                  Time *
                </label>
                <input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className={`w-full px-3 py-2 rounded-md ${
                    themeMode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                Location *
              </label>
              <div className={`relative ${themeMode === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-md`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={16} className="text-gray-400" />
                </div>
                <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceSelect}>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setLat(null);
                      setLng(null);
                    }}
                    required
                    placeholder="Building, Room, or Address"
                    className={`w-full pl-10 pr-3 py-2 rounded-md ${
                      themeMode === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </Autocomplete>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Provide a specific address so the event can be displayed on the map
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Provide details about your event..."
                className={`w-full px-3 py-2 rounded-md ${
                  themeMode === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium mb-1">
                Image URL
              </label>
              <div className={`relative ${themeMode === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-md`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Image size={16} className="text-gray-400" />
                </div>
                <input
                  type="url"
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className={`w-full pl-10 pr-3 py-2 rounded-md ${
                    themeMode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Optional: Add an image URL for your event flyer
              </p>
            </div>

            <div>
              <label htmlFor="externalLink" className="block text-sm font-medium mb-1">
                External RSVP Link
              </label>
              <div className={`relative ${themeMode === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-md`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon size={16} className="text-gray-400" />
                </div>
                <input
                  type="url"
                  id="externalLink"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder="https://example.com/rsvp"
                  className={`w-full pl-10 pr-3 py-2 rounded-md ${
                    themeMode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Optional: Add a link to an external RSVP page
              </p>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-1">
                Tags
              </label>
              <div className="flex">
                <div
                  className={`relative flex-1 ${themeMode === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-md`}
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tags..."
                    className={`w-full pl-10 pr-3 py-2 rounded-md ${
                      themeMode === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className={`ml-2 px-4 py-2 rounded-md ${
                    themeMode === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  Add
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        themeMode === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-4 py-2 rounded-md font-medium flex items-center justify-center ${
                  themeMode === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={16} className="animate-spin mr-2" />
                    Creating Event...
                  </>
                ) : (
                  'Create Event'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;