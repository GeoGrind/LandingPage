import { View, Text } from 'react-native'
import React from 'react'
import {FIREBASE_AUTH_DOMAIN} from '@env'
const Profile = () => {
  return (
    <View>
      <Text>{FIREBASE_AUTH_DOMAIN}</Text>
      <Text>Profile</Text>
    </View>
  )
}

export default Profile