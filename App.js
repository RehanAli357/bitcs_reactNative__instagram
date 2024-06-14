import React from "react";
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import store from "./store";
import LandingScreen from "./Screens/LandingScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import LoginScreen from "./Screens/LoginScreen";
import UploadScreen from "./Screens/UploadScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import EditScreen from "./Screens/EditScreen";
import PrivacyScreen from "./Screens/PrivacyScreen";
import SearchScreen from "./Screens/SearchScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator 
        initialRouteName="Login"
        >
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="Upload"
            component={UploadScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{headerShown:true}}
          />
          <Stack.Screen
          name="Edit"
          component={EditScreen}
          options={{headerShown:true}}
          />
          <Stack.Screen
          name="Privacy"
          component={PrivacyScreen}
          />
          <Stack.Screen
          name="Search"
          component={SearchScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
