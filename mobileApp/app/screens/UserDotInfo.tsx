import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import React from 'react';
import { User } from '../types';
import { Button, Icon } from 'react-native-elements';
import { incrementNumberOfCheerers } from '../utils/db';

type Props = {
  userMarker: User;
};

const handleLikeButtonPress = async (uid:string) => {
  try {
    await incrementNumberOfCheerers(uid);
  } catch (error) {
    console.error('Error occurred while incrementing numberOfCheerers:', error);
  }
};
export default function UserDotInfo({ userMarker }: Props) {
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{userMarker.onGoingSession?.course}</Text>
      
      <Text style={styles.randomText}>
        This is a random paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Text>
      
      <Button
        title="Like"
        icon={<Icon name="thumb-up" type="material" color="white" />}
        buttonStyle={styles.button}
        onPress={() => handleLikeButtonPress(userMarker.uid)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  randomText: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});







  
