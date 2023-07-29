import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';
import { fetchActiveUsers } from 'utils/db';
import MapPopup from './MapPopup/MapPopup';
import markerIconPng from '../../../assets/956fd6.png';
import { User } from '../../types/user.type';
import styles from './Map.module.scss';

function Map() {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const users = await fetchActiveUsers();
      setActiveUsers(users);
    };
    fetchData();
    const timer = setInterval(fetchData, 30000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <MapContainer
      className={styles.Map}
      center={[43.472286, -80.544861]}
      zoomDelta={0.1}
      zoom={14}
      minZoom={3}
      maxZoom={18}
      scrollWheelZoom
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="Map data © OpenStreetMap contributors"
      />
      {activeUsers.map(
        (user) =>
          user.location && (
            <Marker
              key={user.uid}
              position={[user.location.longitude, user.location.latitude]}
              icon={
                new Icon({
                  iconUrl: markerIconPng,
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })
              }
            >
              <MapPopup user={user}/>

            </Marker>
          )
      )}
    </MapContainer>
  );
}

export default Map;