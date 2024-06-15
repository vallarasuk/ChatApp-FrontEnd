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
import Layout from "../components/Layouts";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { REACT_APP_BACKEND_URL } from "@env";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BACKEND_URL}/api/users`); // Correct interpolation of URL
        setUsers(response.data); // Set users state with fetched data
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("sessionToken");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to HomeScreen</Text>
        <ScrollView style={styles.userList}>
          {users.map((user) => (
            <TouchableOpacity key={user.id} style={styles.card}>
              <Text style={styles.cardText}>{user.username}</Text>
              <Text style={styles.cardText}>{user.email}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  userList: {
    marginTop: 20,
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
