import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useEffect } from 'react';
import MapPopup from './MapPopup/MapPopup';
import markerIconPng from '../../../assets/956fd6.png';
import { User } from '../../types/user.type';
import styles from './Map.module.scss';

interface IMapProps {
  activeUsers: Array<User>;
}

function Map({ activeUsers }: IMapProps) {
  const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng]);
    }, [lat, lng]);
    return null;
  };
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
      <RecenterAutomatically lat={43.472286} lng={-80.544861} />

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
