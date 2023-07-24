import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/screens/Login";
import Map from "./app/screens/Map";
import Profile from "./app/screens/Profile";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./FirebaseConfig";
import { Provider } from "react-redux";
import { store } from "./app/store/store";
import Test from "./app/screens/Test";
import { Keyboard } from "react-native";
import ListView from "./app/screens/ListView";
import AllChats from "./app/screens/AllChats";
import SingleChat from "./app/screens/SingleChat";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createNativeStackNavigator();
type RootStackParamList = {
  Map: {};
  Profile: {};
  Test: {};
  ListView: {};
  AllChats: {};
  SingleChat: { id: string };
};

const InsideStack = createStackNavigator<RootStackParamList>();

function InsideLayout() {
  return (
    <InsideStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <InsideStack.Screen name="Map" component={Map} />
      <InsideStack.Screen name="Profile" component={Profile} />
      <InsideStack.Screen name="Test" component={Test} />
      <InsideStack.Screen name="ListView" component={ListView} />
      <InsideStack.Screen name="AllChats" component={AllChats} />
      <InsideStack.Screen
        name="SingleChat"
        component={SingleChat}
        initialParams={{ id: "temp" }}
      />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const handleKeyboardFrameChange = (event: any) => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  };
  useEffect(() => {
    const keyboardListener = Keyboard.addListener(
      "keyboardWillChangeFrame",
      handleKeyboardFrameChange
    );
    return () => keyboardListener.remove();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {user && user.emailVerified ? (
            <Stack.Screen
              name="Inside"
              component={InsideLayout}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
