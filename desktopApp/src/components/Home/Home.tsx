import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import styles from './Home.module.scss';
import markerIconPng from '../../../assets/956fd6.png';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from 'firebase';

// TODO: fetch the data from firebase
function Map() {
  // useEffect(() => {
  //   onAuthStateChanged(FIREBASE_AUTH, (user) => {
  //     setUser(user);
  //   });
  // }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     getUserLocationAndStoreInDb();
  // }, 30000);

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

      <Marker
        position={[43.472286, -80.544861]}
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
function setUser(user: import('@firebase/auth').User | null) {
  throw new Error('Function not implemented.');
}

function getUserLocationAndStoreInDb() {
  throw new Error('Function not implemented.');
}
