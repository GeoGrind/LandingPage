import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Home.module.scss';

function Map() {
  return (
    <MapContainer
      className={styles.Map}
      center={[43.472286, -80.544861]}
      zoom={14}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="Map data © OpenStreetMap contributors"
      />

      <Marker position={[43.472286, -80.544861]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
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
