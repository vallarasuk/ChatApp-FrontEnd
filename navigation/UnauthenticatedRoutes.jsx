// src/navigation/UnauthenticatedRoutes.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import CategorySelectionScreen from "../screens/CategorySelectionScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createStackNavigator();

const UnauthenticatedRoutes = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen
        name="CategorySelection"
        component={CategorySelectionScreen}
      />
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default UnauthenticatedRoutes;
