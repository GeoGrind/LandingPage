import { View, Text, Button } from 'react-native'
import React from 'react'
import {FIREBASE_AUTH_DOMAIN} from '@env'
import { useAppDispatch } from '../store/store'
import { addPerson } from '../store/features/personSlice'

// Test


const Profile = () => {
  // const dispatch = useAppDispatch()

  return (
    <View>
      <Text>{FIREBASE_AUTH_DOMAIN}</Text>
      <Text>Profile</Text>
    </View>
  )
}

export default Profile