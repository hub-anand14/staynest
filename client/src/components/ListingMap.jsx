import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default marker icon in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function ListingMap({ listing }) {
  const lat = Number(listing?.location?.lat);
  const lng = Number(listing?.location?.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return <p className="muted">Map coordinates have not been added for this stay yet.</p>;
  }

  return (
    <div className="map-container" style={{ margin: '16px 0' }}>
      <MapContainer
        key={`${lat},${lng}`}
        center={[lat, lng]}
        zoom={13}
        scrollWheelZoom={false}
        className="listing-map"
        aria-label={`Map showing ${listing.title}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>{listing.title}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
