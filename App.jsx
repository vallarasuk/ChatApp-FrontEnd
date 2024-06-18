import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { REACT_APP_BACKEND_URL } from "@env";

// Importing screens
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LocationPermissionHelper from "./helper/LocationPermissionHelper";

const Stack = createStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem("sessionToken");
      const userId = await AsyncStorage.getItem("userId");
      console.log(sessionToken, userId);
      console.log(REACT_APP_BACKEND_URL)
      if (sessionToken && userId) {
        // Validate the session token and userId with the server
        const response = await axios.post(
          `${REACT_APP_BACKEND_URL}/api/users/validate-session`,
          { sessionToken, userId }
        );

        if (response.data.isValid) {
          setIsAuthenticated(true);
        } else {
          // If session validation fails, clear the session
          await AsyncStorage.removeItem("sessionToken");
          await AsyncStorage.removeItem("userId");
          setIsAuthenticated(false);
        }
      } else {
        // If no session token or userId found, consider the user not authenticated
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Render a loading indicator or a splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Home" : "Login"}
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen
              name="LocationPermission"
              component={LocationPermissionHelper}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
