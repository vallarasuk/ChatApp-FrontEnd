// src/screens/ProfileScreen.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileMainScreen from "../screens/ProfileMainScreen"; // Import the ProfileMainScreen component

const Stack = createStackNavigator();

const ProfileScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen name="ProfileMainScreen" component={ProfileMainScreen} />
    </Stack.Navigator>
  );
};

export default ProfileScreen;
