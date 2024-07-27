// src/navigation/UnauthenticatedRoutes.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import CategorySelectionScreen from "../screens/CategorySelectionScreen";

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
    </Stack.Navigator>
  );
};

export default UnauthenticatedRoutes;
