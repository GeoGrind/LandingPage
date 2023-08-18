import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/screens/Login";
import Map from "./app/screens/Map";
import Setting from "./app/screens/Setting";
import { useEffect, useRef, useState } from "react";
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
import UpdateTermCourses from "./app/screens/userInfoEditScreens/UpdateTermCourses";
import ResetPassword from "./app/screens/ResetPassword";
import SingleChat from "./app/screens/SingleChat";
import { initializeExpoToken } from "./app/utils/notifications";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

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
      <InsideStack.Screen
        name="BottomTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <InsideStack.Screen name="SingleChat" component={SingleChat} />
      <InsideStack.Screen name="UpdateEmoji" component={UpdateEmoji} />
      <InsideStack.Screen name="UpdateBase" component={UpdateBase} />
      <InsideStack.Screen name="Profile" component={Profile} />
      <InsideStack.Screen
        name="UpdateProfilePicture"
        component={UpdateProfilePicture}
      />
      <InsideStack.Screen
        name="UpdateTermCourses"
        component={UpdateTermCourses}
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
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
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

const BottomTab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen name="Map" component={Map} />
      <BottomTab.Screen name="Setting" component={Setting} />
      <BottomTab.Screen name="AllChats" component={AllChats} />
      <BottomTab.Screen name="Test" component={Test} />
    </BottomTab.Navigator>
  );
}
export default function App() {
  // Set the notification listener
  const [user, setUser] = useState<User | null>(null);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    initializeExpoToken().then((token: any) => setExpoPushToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
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
