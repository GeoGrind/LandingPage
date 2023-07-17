import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { User } from '../types';

type TestProps = {
  user: User;
};

export default function Test({ user }: TestProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{user.email}</Text>
      <Text style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
      <Text style={styles.text}>Nullam tempus vestibulum semper.</Text>
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
  });
  
