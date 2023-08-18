import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useCallback } from 'react';
import { useAppContext } from 'context/AppContext';
import MapPopup from './MapPopup/MapPopup';
import styles from './Map.module.scss';

function Map() {
  const { activeUsers } = useAppContext();

  // const RecenterAutomatically = ({ lat, lng }) => {
  //   const map = useMap();
  //   useEffect(() => {
  //     map.setView([lat, lng]);
  //   }, [lat, lng]);
  //   return null;
  // }; // TODO: move map to user on discovery click

  const customIcon = useCallback((profilePicture: string) => {
    return L.divIcon({
      html: `<img src="${profilePicture}" width="30" height="30" />`, // Use img tag to display the image
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  }, []);

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
      {/* <RecenterAutomatically lat={43.472286} lng={-80.544861} /> */}

      {activeUsers.map((user) => {
        return (
          user.session && (
            <Marker
              key={user.uid}
              position={[
                user.session.location.latitude,
                user.session.location.longitude,
              ]}
              icon={customIcon(user.profilePicture)}
            >
              <MapPopup user={user} />
            </Marker>
          )
        );
      })}
    </MapContainer>
  );
}

export default Map;
