// src/navigation/AuthenticatedRoutes.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LocationPermissionHelper from "../helper/LocationPermissionHelper";

const Stack = createStackNavigator();

const AuthenticatedRoutes = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="LocationPermission"
        component={LocationPermissionHelper}
      />
    </Stack.Navigator>
  );
};

export default AuthenticatedRoutes;
