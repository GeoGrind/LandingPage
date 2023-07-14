import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Modal, TextInput, TouchableOpacity, Text } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import 'firebase/firestore';
import {fetchAllLocations, updateSession, getUserLocationAndStoreInDb} from '../utils/db'
import { Button } from 'react-native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { Session } from '../types';
interface Location {
  latitude: number;
  longitude: number;
}

const Map = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState({ course: '' });
  useEffect(() => {
    const fetchData = async () => {
      const newLocations = await fetchAllLocations();
      setLocations(newLocations);
    };
    fetchData();
    const timer = setInterval(fetchData, 30000);

    return () => {
      clearInterval(timer);
    };
  }, []);
  
  const handleStartSessionClick = () => {
    setShowForm(true);
  };
  const handleFormSubmit = async () => {
    const newSession: Session = {
      course: formValues.course,
      startTime: Date.now(),
      isVisible: true,
    };
    await updateSession(newSession);
    await getUserLocationAndStoreInDb();
    const newLocations = await fetchAllLocations();
    setLocations(newLocations)
    setShowForm(false);
    console.log(`Form submiited, course: ${formValues.course}`);
  };

  const handleSignOffClick = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      // TODO: finish the current user's session
    } catch (error) {
      console.log('Error signing off:', error);
    }
  };

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
      <View style={styles.buttonContainer}>
        <Button title="Start your study session" onPress={handleStartSessionClick} />
        <Button title="Sign off" onPress={handleSignOffClick} />
      </View>
      {showForm && (
        <Modal visible={showForm} transparent>
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={() => setShowForm(false)}
          >
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Course Name"
                value={formValues.course}
                onChangeText={(text) => setFormValues({ course: text })}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleFormSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
      
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
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  input: {
    width: '80%',
    height: 40,
    backgroundColor: 'white',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
});

export default Map;
