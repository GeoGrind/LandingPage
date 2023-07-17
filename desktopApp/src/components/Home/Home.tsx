import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';
import { fetchActiveUsers } from 'utils/db';
import markerIconPng from '../../../assets/956fd6.png';
import styles from './Home.module.scss';
import { User } from '../../types/user.type';

// TODO: fetch the data from firebase
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
      minZoom={0}
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
              position={[user.location.latitude, user.location.longitude]}
              icon={
                new Icon({
                  iconUrl: markerIconPng,
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })
              }
            >
              test
            </Marker>
          )
      )}
    </MapContainer>
  );
}
function Home() {
  return (
    <div className={styles.Home}>
      <Map />
    </div>
  );
}

export default Home;
