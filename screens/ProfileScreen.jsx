import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View } from "react-native";

const Stack = createStackNavigator();

const ProfileScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileMainScreen} />
    </Stack.Navigator>
  );
};

const ProfileMainScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This is the Profile Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default ProfileScreen;
