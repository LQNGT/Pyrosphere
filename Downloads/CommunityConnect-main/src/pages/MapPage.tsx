import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { useApp } from '../context/AppContext';
import { format, parseISO } from 'date-fns';
import { Filter, User, Building } from 'lucide-react';

const MapPage: React.FC = () => {
  const { events, themeMode } = useApp();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'student' | 'organization'>('all');

  // Get user's current location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access was denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'The request to get location timed out';
              break;
          }
          setLocationError(errorMessage);
          console.error('Geolocation error:', errorMessage);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser');
      console.error('Geolocation is not supported by this browser');
    }
  }, []);

  // Filter events by type and valid coordinates
  const filteredEvents = events
    .filter(event => event.lat != null && event.lng != null)
    .filter(event => {
      // Check if event is student or organization based on possible fields
      const isStudentEvent = event.createdByStudent === true ||
                            event.isStudentEvent === true ||
                            event.creatorType === 'student';
      const isOrganizationEvent = event.isOrganizationEvent === true ||
                                 event.createdByOrganization === true ||
                                 event.creatorType === 'organization' ||
                                 (!isStudentEvent); // Default to organization if no student flag

      if (filterType === 'all') return true;
      if (filterType === 'student') return isStudentEvent;
      if (filterType === 'organization') return isOrganizationEvent;
      return true;
    });

  // Map filtered events to markers
  const markers = filteredEvents.map(event => {
    const isStudentEvent = event.createdByStudent === true ||
                          event.isStudentEvent === true ||
                          event.creatorType === 'student';
    const isOrganizationEvent = event.isOrganizationEvent === true ||
                               event.createdByOrganization === true ||
                               event.creatorType === 'organization' ||
                               (!isStudentEvent);

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      organizerName: event.organizerName,
      image: event.image,
      isStudentEvent,
      isOrganizationEvent,
      position: { lat: Number(event.lat), lng: Number(event.lng) },
    };
  });

  // Define map container style
  const mapContainerStyle = {
    width: '100%',
    height: '600px',
  };

  // Use user location as center if available, then first event marker, then default
  const center = userLocation
    ? userLocation
    : markers.length > 0
      ? markers[0].position
      : { lat: 38.5407, lng: -121.7769 };

  // Get marker color based on event type
  const getMarkerColor = (marker) => {
    if (marker.isStudentEvent) {
      return {
        background: '#00cc00', // Green for student events
        borderColor: '#009900',
        glyphColor: '#ffffff',
      };
    } else {
      return {
        background: '#0000ff', // Blue for organization events
        borderColor: '#0000ab',
        glyphColor: '#ffffff',
      };
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Filter controls */}
      <div className={`absolute top-4 right-4 z-10 p-3 rounded-lg shadow-md ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center mb-2">
          <Filter size={16} className="mr-1" />
          <span className="text-sm font-medium">Filter Events</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 text-xs rounded-full flex items-center ${
              filterType === 'all'
                ? themeMode === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                : themeMode === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('organization')}
            className={`px-3 py-1 text-xs rounded-full flex items-center ${
              filterType === 'organization'
                ? themeMode === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                : themeMode === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <Building size={12} className="mr-1" />
            Organizations
          </button>
          <button
            onClick={() => setFilterType('student')}
            className={`px-3 py-1 text-xs rounded-full flex items-center ${
              filterType === 'student'
                ? themeMode === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                : themeMode === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <User size={12} className="mr-1" />
            Students
          </button>
        </div>
        {/* Legend */}
        <div className="mt-3 pt-2 border-t border-gray-300 dark:border-gray-600">
          <span className="text-xs text-gray-500 dark:text-gray-400">Legend:</span>
          <div className="flex items-center mt-1">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span className="text-xs">You</span>
          </div>
          <div className="flex items-center mt-1">
            <div className="w-3 h-3 rounded-full bg-blue-600 mr-1"></div>
            <span className="text-xs">Organization Events</span>
          </div>
          <div className="flex items-center mt-1">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-xs">Student Events</span>
          </div>
        </div>
      </div>

      <APIProvider apiKey="map api key: AIzaSyCZTpFTMTK-fUz4F3hHZbqpwsj7GALg0pA">
        <Map
          style={mapContainerStyle}
          defaultCenter={center}
          defaultZoom={16}
          mapId="e7be140eebb4ecd6"
          options={{
            styles: themeMode === 'dark' ? [
              { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
              { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
              { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
              { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
              { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
              { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
              { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
              { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
              { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
              { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
              { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
              { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
              { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
              { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
              { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
              { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
            ] : [],
          }}
        >
          {/* User location marker */}
          {userLocation && (
            <AdvancedMarker position={userLocation}>
              <Pin
                background={'#ff0000'}
                borderColor={'#ab0000'}
                glyphColor={'#ffffff'}
                scale={1.2}
              />
            </AdvancedMarker>
          )}

          {/* Event markers */}
          {markers.map(marker => (
            <AdvancedMarker
              key={marker.id}
              position={marker.position}
              onClick={() => setSelectedEvent(marker)}
            >
              <Pin {...getMarkerColor(marker)} />
            </AdvancedMarker>
          ))}

          {/* Info Window */}
          {selectedEvent && (
            <InfoWindow
              position={selectedEvent.position}
              onCloseClick={() => setSelectedEvent(null)}
            >
              <div className={`p-2 max-w-xs ${themeMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                {selectedEvent.image && (
                  <div className="mb-2 rounded overflow-hidden">
                    <img
                      src={selectedEvent.image}
                      alt={selectedEvent.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
                <h3 className="font-medium">{selectedEvent.title}</h3>
                {selectedEvent.date && (
                  <p className="text-sm mt-1">
                    {format(parseISO(selectedEvent.date), 'MMM d, yyyy • h:mm a')}
                  </p>
                )}
                <p className="text-sm mt-1 flex items-center">
                  {selectedEvent.isStudentEvent ? (
                    <>
                      <User size={12} className="mr-1 text-green-500" />
                      <span>Student Event: {selectedEvent.organizerName}</span>
                    </>
                  ) : (
                    <>
                      <Building size={12} className="mr-1 text-blue-500" />
                      <span>By: {selectedEvent.organizerName}</span>
                    </>
                  )}
                </p>
                {selectedEvent.description && (
                  <p className="text-sm mt-1 line-clamp-2">{selectedEvent.description}</p>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Display error message if geolocation fails */}
      {locationError && !userLocation && (
        <div className={`absolute top-2 left-2 right-2 p-2 text-center rounded ${
          themeMode === 'dark' ? 'bg-red-900 text-white' : 'bg-red-100 text-red-700'
        }`}>
          {locationError}
        </div>
      )}
    </div>
  );
};

export default MapPage;
