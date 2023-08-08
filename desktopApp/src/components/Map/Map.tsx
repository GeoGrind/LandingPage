import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import MapPopup from './MapPopup/MapPopup';
import markerIconPng from '../../../assets/956fd6.png';
import { User } from '../../types/user.type';
import styles from './Map.module.scss';

interface IMapProps {
  activeUsers: Array<User>;
}

function Map({ activeUsers }: IMapProps) {
  return (
    <MapContainer
      className={styles.Map}
      center={[43.472286, -80.544861]}
      zoomControl={false}
      zoomDelta={2}
      zoom={14}
      minZoom={3}
      maxZoom={18}
      scrollWheelZoom
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="Map data © OpenStreetMap contributors"
      />
      <ZoomControl position="bottomright" />
      {activeUsers.map(
        (user) =>
          user.session && (
            <Marker
              key={user.uid}
              position={[
                user.session.location.longitude,
                user.session.location.latitude,
              ]}
              icon={
                new Icon({
                  iconUrl: markerIconPng,
                  iconSize: [25, 41],
                  iconAnchor: [12, 20],
                })
              }
            >
              <MapPopup user={user} />
            </Marker>
          )
      )}
    </MapContainer>
  );
}

export default Map;
