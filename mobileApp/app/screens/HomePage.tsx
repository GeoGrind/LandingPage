import { View, Text } from 'react-native'
import React from 'react'
import { NavigationProp } from '@react-navigation/native'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { Button } from 'react-native'
import Navbar from '../components/NavBar'

interface RouterProps {
  navigation: NavigationProp<any, any> 
}

const HomePage = ({navigation}: RouterProps) => {
  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleMapPress = () => {
    navigation.navigate('Details');
  };

  const handleLogoutPress = () => {
    FIREBASE_AUTH.signOut();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Content of the HomePage */}
      </View>
      <View style={{ paddingBottom: 20 }}>
        <Navbar
          onProfilePress={handleProfilePress}
          onMapPress={handleMapPress}
          onLogoutPress={handleLogoutPress}
        />
      </View>
    </View>
  )
}

export default HomePage
