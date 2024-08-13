// src/screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { REACT_APP_BACKEND_URL } from "@env";
import { CommonActions } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/api/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("sessionToken");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navigateToProfile = (user) => {
    navigation.navigate("ProfileMainScreen", { user });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Screen</Text>
      <ScrollView style={styles.userList}>
        {users.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.card}
            onPress={() => navigateToProfile(user)}  
          >
            <Text style={styles.cardText}>{user.username}</Text>
            <Text style={styles.cardText}>{user.email}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  userList: {
    marginTop: 20,
    flex: 1,
  },
  card: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default HomeScreen;
