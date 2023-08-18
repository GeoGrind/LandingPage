import {
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import React from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { User } from "../types";
import { initializeExpoToken } from "../utils/notifications";

const Signup = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const auth = FIREBASE_AUTH;

  const signUp = async () => {
    // if (endsWithCanadianUniversitySuffix(email) == false) {
    //   alert("Your university email is not registered in our system");
    //   return;
    // }
    if (username.trim() === "") {
      alert("The username cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await sendEmailVerification(auth.currentUser!);
      const expoToken = await initializeExpoToken();
      const user: User = {
        uid: response.user.uid,
        expoToken: expoToken,
        email: response.user.email!,
        username: username,
        emoji: "",
        termCourses: [],
        session: null,
        program: null,
        yearOfGraduation: null,
        university: "University of Waterloo",
        profilePicture:
          "https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png",
      };
      setEmail("");
      setPassword("");
      setUsername("");
      await setDoc(doc(FIREBASE_DB, "users", response.user.uid), user);
      Keyboard.dismiss();
      await signOut(auth);
      alert("Check your emails");
    } catch (e: any) {
      console.log(e);
      alert("Sign up failed" + e.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        ></TextInput>
        <TextInput
          value={username}
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          onChangeText={(text) => setUsername(text)}
        ></TextInput>

        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <>
            <Button title="Create an account" onPress={() => signUp()} />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
});
