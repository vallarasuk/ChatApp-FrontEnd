import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar, View, StyleSheet, Platform } from "react-native"; // Import Platform from react-native
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LocationPermissionHelper from "../helper/LocationPermissionHelper";

const Stack = createStackNavigator();

const AuthenticatedRoutes = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" /> 
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="ProfileMain" component={ProfileScreen} />
        <Stack.Screen
          name="LocationPermission"
          component={LocationPermissionHelper}
        />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default AuthenticatedRoutes;
