// src/screens/ProfileMainScreen.js
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { REACT_APP_BACKEND_URL } from "@env";

const ProfileMainScreen = ({ route }) => {
  const user = route?.params?.user || {};
  console.log("User received:", user);

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (user && user.id) {
          const response = await axios.get(
            `${REACT_APP_BACKEND_URL}/api/users/${user.id}`
          );
          setProfileData(response.data);
        } else {
          setError("User ID is missing.");
        }
      } catch (error) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      {profileData ? (
        <>
          <Text style={styles.title}>Profile Details</Text>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{profileData.username}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{profileData.email}</Text>
          {/* Add more profile details as needed */}
        </>
      ) : (
        <Text>No profile data available.</Text>
      )}
      <Button
        title="Edit Profile"
        onPress={() => {
          /* Navigate to edit profile screen */
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ProfileMainScreen;
