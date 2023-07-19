import React, {useRef} from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Modal, TextInput, TouchableOpacity, Text, AppState } from 'react-native';
import { useState, useEffect } from 'react';
import 'firebase/firestore';
import {updateSession, getUserLocationAndStoreInDb, stopSessionOfCurrentUser, fetchActiveUsers} from '../utils/db'
import { Button } from 'react-native';
import { signOut,getAuth } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { Session, User } from '../types';
import { useNavigation, ParamListBase } from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import UserDotInfo from './UserDotInfo';
import { Use } from 'react-native-svg';


const Map = () => {

  const [inSessionUsers, setInSessionUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState({ course: '' });
  const [loading, setLoading] = React.useState(false)
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const appState = useRef(AppState.currentState);
  const { currentUser } = FIREBASE_AUTH;
  const signedInUser: any = currentUser;

  useEffect(() => {
    fetchData();
  }, []);

  // This tracks if the user exit the app.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        // Fetch the data when the user comes back.
        fetchData();
      }
      appState.current = nextAppState;
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  // This use effect can fetch the data when there is a navigation even happened
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    const temp1 = await fetchActiveUsers();
    setInSessionUsers(temp1);
  };
  const handleStartSessionClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async () => {
    /* TODO: This process is very slow, needs optimization 
    Try to update the UI at client side first, then update the DB in the background
    */
    
    const newSession: Session = {
      course: formValues.course,
      startTime: Date.now(),
      isVisible: true,
      sessionStartLocation: { longitude: 0, latitude: 0 }, // Set initial location
      numberOfCheerers: 0,
      cheerers: [],
    };
    
    // BUG: Potential bug, there session might not have initial starting location;
    await updateSession(newSession);
    
    // Get user location and store in DB
    const userLocation = await getUserLocationAndStoreInDb();
    
    // Update the session with the user's location
    newSession.sessionStartLocation = userLocation;
    await updateSession(newSession);
    setShowForm(false);
    console.log(`Form submitted, course: ${formValues.course}`);
  };
  

  const handleSignOffClick = async () => {
    try {
      await stopSessionOfCurrentUser();
      await signOut(FIREBASE_AUTH);
    } catch (error) {
      console.log('Error signing off:', error);
    }
  };
  const handleStopSessionClick = async () => {
    // TODO: Needs the UI update immediately after the button is clicked
    try{
      await stopSessionOfCurrentUser();
    } catch (error) {
      console.log('Error stopping session:', error);
    }
  }
  const handleProfileClick = () => {
    navigation.navigate('Profile'); 
  }
  const handleTestClick = () => {
    navigation.navigate('Test');
  }
  const handleRefreshClick = () => {
    fetchData();
  };
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
          {inSessionUsers.map((user, index) => {
            const isCurrentUser = user.uid === currentUser!.uid
            const pinColor = isCurrentUser ? 'green' : 'red';

            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: user.location!.latitude,
                  longitude: user.location!.longitude
                }}
                pinColor={pinColor}
              >
                {!isCurrentUser && (
                  <Callout>
                    <UserDotInfo userMarker={user} userClicker={signedInUser as User} />
                  </Callout>
                )}
              </Marker>
            );
          })}
        </MapView>
        <View style={styles.buttonContainer}>
          <Button title="Refresh" onPress={handleRefreshClick} /> 
          <Button title="Start your study session" onPress={handleStartSessionClick} />
          <Button title="Stop your study session" onPress={handleStopSessionClick} />
          <Button title="Sign off" onPress={handleSignOffClick} />
          <Button title="Test" onPress={handleTestClick} />
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
  callout: {
    height:400,
    width: 200, // Adjust the width as needed
    padding: 10,
    borderRadius: 5,
  },
});

export default Map;
