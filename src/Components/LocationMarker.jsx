import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

const LocationMarker = ({ setFieldValue }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setFieldValue('location', { lat, lng });

      // Reverse geocoding to get street name
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      const street = data.address?.road || data.display_name || '';
      setFieldValue('streetName', street);
    },
  });

  return null;
};

export const MapLocationPicker = ({ formik }) => {
  const [search, setSearch] = useState('');
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef();

  const location = formik.values.location;

  // Update map view whenever location changes
  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.setView([location.lat, location.lng], 13);
    }
  }, [location]);

  // Set default location on mount
  useEffect(() => {
    if (!location) {
      formik.setFieldValue('location', { lat: 25.276987, lng: 55.296249 }); // Dubai
    }
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) return;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`
    );
    const data = await res.json();
    if (data?.length) {
      const { lat, lon } = data[0];
      const newLocation = { lat: parseFloat(lat), lng: parseFloat(lon) };
      formik.setFieldValue('location', newLocation);
      setShowMap(true);
    } else {
      alert('Location not found');
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter city, country, or pin code"
          className="flex-1 px-3 py-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Map Display */}
      {showMap && location && (
        <div className="h-64 rounded overflow-hidden border">
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
            whenCreated={(mapInstance) => {
              mapRef.current = mapInstance;
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[location.lat, location.lng]}
              icon={L.icon({
                iconUrl:
                  'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            />
            <LocationMarker setFieldValue={formik.setFieldValue} />
          </MapContainer>
        </div>
      )}

      {/* Street Name Input (readonly) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street Name
        </label>
        <input
          type="text"
          name="streetName"
          value={formik.values.streetName || ''}
          readOnly
          className="w-full px-3 py-2 border rounded bg-gray-100"
        />
      </div>
    </div>
  );
};
