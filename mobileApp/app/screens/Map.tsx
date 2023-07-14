import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Modal, TextInput, TouchableOpacity, Text } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import 'firebase/firestore';
import {fetchAllLocations, updateSession, getUserLocationAndStoreInDb, logOutCleanUp} from '../utils/db'
import { Button } from 'react-native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { Session } from '../types';
import Profile from './Profile';
import { useNavigation, ParamListBase } from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
interface Location {
  latitude: number;
  longitude: number;
}

const Map = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState({ course: '' });
  const [loading, setLoading] = React.useState(false)
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
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
    /* TODO: This process is very slow, needs optimization 
    Try to update the UI at client side first, then update the DB in the background
    */
    setLoading(true);
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
    setLoading(false);
  };

  const handleSignOffClick = async () => {
    try {
      await logOutCleanUp();
      await signOut(FIREBASE_AUTH);
    } catch (error) {
      console.log('Error signing off:', error);
    }
  };

  const handleProfileClick = () => {
    navigation.navigate('Profile'); 
  }
  if (loading) {
    return (
      // TODO: Make the loading look better
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }
  else {
    return (
      <View style={styles.container}>
        <Button title="See my profile" onPress={handleProfileClick} />
        <MapView style={styles.map}>
          {locations.map((location, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              pinColor="red"
              onPress={()=>(console.log("pressed"))}
            />
          ))}
        </MapView>
        <View style={styles.buttonContainer}>
          <Button title="Start your study session" onPress={handleStartSessionClick} />
          <Button title="Sign off" onPress={handleSignOffClick} />
        </View>
        
      
        {showForm && !loading && (
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
  }
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
