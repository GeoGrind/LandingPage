import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { getUserLocationAndStoreInDb } from '../utils/db';
import { User } from '../types';
const Login = () => {
    
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const auth = FIREBASE_AUTH
    const signIn = async () => {
        setLoading(true);
        try {
          const response = await signInWithEmailAndPassword(auth, email, password);
        } catch (e: any) {
          console.log(e);
          alert('Sign in failed' + e.message);
        }
        setLoading(false);
    };

    const signUp = async () => {
        setLoading(true);
        try {
          const response = await createUserWithEmailAndPassword(auth, email, password);
          // Add the new user to the "users" collection with UID as document ID
          const user: User = {
            uid: response.user.uid,
            email: response.user.email,
            location: null,
            isInSession: false,
            onGoingSession: null,
          };
          await setDoc(doc(FIREBASE_DB, 'users', response.user.uid), user);
          alert('Check your emails');
        } catch (e: any) {
          console.log(e);
          alert('Sign in failed' + e.message);
        }
        setLoading(false);
      };

  return (  
    <View style={styles.container}>
        <KeyboardAvoidingView behavior='padding'>
            <TextInput value={email} style={styles.input} placeholder='Email' autoCapitalize='none' onChangeText={(text) => setEmail(text)}></TextInput>
            <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder='Password' autoCapitalize='none' onChangeText={(text) => setPassword(text)}></TextInput>
                {loading ? (
                <ActivityIndicator size='large' color='blue' />) : (
                    <>
                    <Button title="Login" onPress={() => signIn()}/>
                    <Button title="Create an account" onPress={() => signUp()}/>
                    </>
                )
                } 
        </KeyboardAvoidingView>
    </View>
  )
}


export default Login

const styles = StyleSheet.create({
    container:{
        marginHorizontal:20,
        flex:1,
        justifyContent:'center'
    },
    input: {
        marginVertical:4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff',
    }
})