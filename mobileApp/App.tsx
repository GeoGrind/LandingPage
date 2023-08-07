import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/screens/Login";
import Map from "./app/screens/Map";
import Setting from "./app/screens/Setting";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./FirebaseConfig";
import { Provider } from "react-redux";
import { store } from "./app/store/store";
import Test from "./app/screens/Test";
import AllChats from "./app/screens/AllChats";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";
import {
  InsideRootStackParamList,
  OutsideRootStackParamList,
} from "./app/types";
import Signup from "./app/screens/Signup";
import UpdateEmoji from "./app/screens/userInfoEditScreens/UpdateEmoji";
import UpdateBase from "./app/screens/userInfoEditScreens/UpdateBase";
import Profile from "./app/screens/Profile";
import UpdateProfilePicture from "./app/screens/userInfoEditScreens/UpdateProfilePicture";

const Stack = createNativeStackNavigator();

const InsideStack = createStackNavigator<InsideRootStackParamList>();
const OutsideStack = createStackNavigator<OutsideRootStackParamList>();

function InsideLayout() {
  return (
    <InsideStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <InsideStack.Screen name="Map" component={Map} />
      <InsideStack.Screen name="Setting" component={Setting} />
      <InsideStack.Screen name="Test" component={Test} />
      <InsideStack.Screen name="AllChats" component={AllChats} />
      <InsideStack.Screen name="UpdateEmoji" component={UpdateEmoji} />
      <InsideStack.Screen name="UpdateBase" component={UpdateBase} />
      <InsideStack.Screen name="Profile" component={Profile} />
      <InsideStack.Screen
        name="UpdateProfilePicture"
        component={UpdateProfilePicture}
      />
    </InsideStack.Navigator>
  );
}
function OutsideLayout() {
  return (
    <OutsideStack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false }}
      />
    </OutsideStack.Navigator>
  );
}
Notifications.setNotificationHandler({
  handleNotification: async (notification: any) => {
    return {
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowAlert: true,
    };
  },
});
export default function App() {
  // Set the notification listener
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    // This line can dismiss the notification when appState is at foreground
    Notifications.setNotificationHandler(null);
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {}
    );

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {}
    );
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);
  // End of notification stuff

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
              name="Outside"
              component={OutsideLayout}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
