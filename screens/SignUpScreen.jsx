import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_BACKEND_URL } from "@env";

const SignUpScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    re_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    const { username, email, password, re_password } = formData;

    if (password !== re_password) {
      Alert.alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${REACT_APP_BACKEND_URL}/api/users`, {
        username,
        email,
        password,
        re_password,
      });

      if (response.status === 201) {
        Alert.alert("User created successfully");

        await AsyncStorage.setItem(
          "userData",
          JSON.stringify(response.data.user)
        );
        await AsyncStorage.setItem(
          "sessionToken",
          response.data.user.session_token
        );

        navigation.navigate("Home"); // Ensure navigation works correctly here
      } else {
        Alert.alert("Failed to create user");
        console.error(
          `Unexpected status code: ${response.status}`,
          response.data
        );
      }
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.response) {
        console.error("Server responded with an error:", error.response);
        const errorMessage =
          error.response.data.error || "An error occurred during signup";
        Alert.alert("Failed to create user", errorMessage);
      } else if (error.request) {
        console.error("No response received:", error.request);
        Alert.alert("Failed to create user", "No response from server");
      } else {
        console.error("Error setting up the request:", error.message);
        Alert.alert("Failed to create user", error.message);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleChangeText = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="User Name"
        value={formData.username}
        onChangeText={(text) => handleChangeText("username", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleChangeText("email", text)}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword} // Hide or show password based on showPassword state
          value={formData.password}
          onChangeText={(text) => handleChangeText("password", text)}
        />
        <Ionicons
          name={showPassword ? "eye-off-outline" : "eye-outline"} // Toggle eye icon based on showPassword state
          size={24}
          color="#888"
          style={styles.eyeIcon}
          onPress={toggleShowPassword} // Toggle password visibility
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry={true}
        value={formData.re_password}
        onChangeText={(text) => handleChangeText("re_password", text)}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Button
        title="Back to Login"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
});

export default SignUpScreen;
