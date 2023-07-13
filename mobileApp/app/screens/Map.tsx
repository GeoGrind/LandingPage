import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import  {FIREBASE_DB} from '../../FirebaseConfig';
import 'firebase/firestore';
import firebase from 'firebase/compat/app';
import {getAllLocations} from '../utils/db'
const locations = [
  { id: 1, latitude: 43.470149, longitude: -80.546788 },
  { id: 2, latitude: 43.472989, longitude: -80.543479 },
  { id: 3, latitude: 43.471996, longitude: -80.541837 },
  // Add more dummy locations here...
];

interface Location {
  latitude: number;
  longitude: number;
}

const Map = () => {
  
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const newLocations = await getAllLocations();
      setLocations(newLocations);
    };

    const timer = setInterval(fetchData, 30000);

    return () => {
      clearInterval(timer);
    };
  }, []);
  
  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {locations.map((location, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            pinColor="red"
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default Map;
