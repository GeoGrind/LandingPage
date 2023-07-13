import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './app/screens/Login';
import Map from './app/screens/Map';
import HomePage from './app/screens/HomePage';
import Profile from './app/screens/Profile';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import { getUserLocationAndStoreInDb } from './app/utils/db';

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout(){
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="HomePage" component={HomePage} />
      <InsideStack.Screen name="Details" component={Map} />
      <InsideStack.Screen name="Profile" component={Profile} />
    </InsideStack.Navigator>
  )
}

export default function App() { 
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    }); 
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getUserLocationAndStoreInDb();
  }, 30000); 

    // Clean up the interval when the component is unmounted or dependencies change
    return () => clearInterval(intervalId);
  }, []);
  
  return ( 
    
    <NavigationContainer>
       <Stack.Navigator initialRouteName="Login">
       {user ? (
        <Stack.Screen name="Inside" component={InsideLayout} options={{headerShown:false}} />
        ) : (
          <Stack.Screen name="Login" component={Login} options={{headerShown:false}} />
        ) }
       </Stack.Navigator>
    </NavigationContainer>
  );
}



