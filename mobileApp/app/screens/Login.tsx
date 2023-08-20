import {
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { endsWithCanadianUniversitySuffix } from "../utils/emailVerification";
import { initializeExpoToken } from "../utils/notifications";
import { getUserById, updateUserFields, getUserByEmail } from "../utils/db";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const auth = FIREBASE_AUTH;
  const signIn = async () => {
    setLoading(true);

    try {
      const user1 = await getUserByEmail(email);

      if (user1 === null) {
        alert("This email is not registered!");
        setLoading(false);
        return;
      }
      if (user1.expoToken) {
        alert("You have signed in from another mobile device!");
        setLoading(false);
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      const expoToken = await initializeExpoToken();
      if (expoToken == undefined) {
        console.log("issue with expo token");
        return;
      }
      await updateUserFields({
        expoToken: expoToken,
      });
    } catch (e: any) {
      console.log(e);
      alert("Sign in failed" + e.message);
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

        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <>
            <Button title="Login" onPress={() => signIn()} />
            <Button
              title="Create a free account"
              onPress={() => navigation.navigate("Signup")}
            />
            <Button
              title="Forgot my password"
              onPress={() => navigation.navigate("ResetPassword")}
            />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

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
