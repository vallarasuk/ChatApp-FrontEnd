import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const SignUpScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    re_password: "",
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleSignUp = async () => {
    const { username, email, password, re_password } = formData;

    if (password !== re_password) {
      Alert.alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users`,
        {
          username,
          email,
          password,
          re_password,
        }
      );

      console.log(response);

      if (response.status === 201) {
        Alert.alert("User created successfully");
        navigation.replace("UserListPage"); // Navigate to UserListPage
      } else {
        Alert.alert("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      Alert.alert("Failed to create user");
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
