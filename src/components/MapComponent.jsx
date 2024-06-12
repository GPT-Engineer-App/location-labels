import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import { Box, Input, Button } from '@chakra-ui/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

const MapComponent = () => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState(null);
  const [locationName, setLocationName] = useState('');

  const handleMapClick = (latlng) => {
    setNewLocation(latlng);
  };

  const handleAddLocation = () => {
    if (newLocation && locationName) {
      setLocations([...locations, { ...newLocation, name: locationName }]);
      setNewLocation(null);
      setLocationName('');
    }
  };

  return (
    <Box position="relative" height="100vh" width="100%">
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker onClick={handleMapClick} />
        {locations.map((loc, idx) => (
          <Marker key={idx} position={[loc.lat, loc.lng]} draggable>
            <Popup>{loc.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
      {newLocation && (
        <Box position="absolute" bottom="10px" left="50%" transform="translateX(-50%)" bg="white" p={4} borderRadius="md" boxShadow="md">
          <Input
            placeholder="Enter location name"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            mb={2}
          />
          <Button onClick={handleAddLocation} colorScheme="blue">
            Add Location
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MapComponent;