import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import Geolocation from "react-native-geolocation-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { REACT_APP_BACKEND_URL } from "@env";

const LocationPermissionHelper = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    Geolocation.requestAuthorization("whenInUse").then((granted) => {
      if (granted === "granted") {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const locationString = `${latitude},${longitude}`;
            setLocation(locationString);
            updateLocation(locationString);
          },
          (error) => setErrorMsg(error.message),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      } else {
        setErrorMsg("Permission denied");
      }
    });
  };

  const updateLocation = async (locationString) => {
    try {
      const sessionToken = await AsyncStorage.getItem("sessionToken");
      if (!sessionToken) {
        throw new Error("Session token is missing.");
      }

      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        throw new Error("User data is missing.");
      }
      const user = JSON.parse(userData);

      await axios.put(
        `${REACT_APP_BACKEND_URL}/api/users/${user.id}/update-location`,
        {
          default_location: locationString,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );

      user.default_location = locationString;
      await AsyncStorage.setItem("userData", JSON.stringify(user));

      Alert.alert("Location updated successfully.");
      navigation.navigate("Home"); // Navigate to Home after updating location
    } catch (error) {
      console.error("Error updating location:", error);
      Alert.alert("Failed to update location.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Updating your location...</Text>
      {location ? <Text>Location: {location}</Text> : <Text>{errorMsg}</Text>}
      <Button title="Retry Permission" onPress={requestLocation} />
      <Button title="Skip" onPress={() => navigation.navigate("Home")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    marginBottom: 20,
    textAlign: "center",
  },
});

export default LocationPermissionHelper;
