// src/api/userApi.js

import axios from "axios";
import { USER_API } from "../config/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage for data storage

// Arrow function to validate the session token
const validateSessionToken = async (sessionToken, userId) => {
  try {
    const response = await axios.post(USER_API.VALIDATE_SESSION, {
      sessionToken,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error("Error validating session token:", error);
    throw error; // Propagate the error for handling in the caller function
  }
};

// Function to create a new user
const createUser = async (
  username,
  email,
  mobile_number,
  password,
  re_password
) => {
  try {
    const response = await axios.post(USER_API.USER_CREATE, {
      username,
      email,
      mobile_number,
      password,
      re_password,
    });

    if (response.status === 201) {
      Alert.alert("User created successfully");

      // Store user data and session token in AsyncStorage
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify(response.data.user)
      );
      await AsyncStorage.setItem(
        "sessionToken",
        response.data.user.session_token
      );
    }

    return response.data; // Return the response data to the caller
  } catch (error) {
    console.error("Error creating user:", error);
    throw error; // Propagate the error for handling in the caller function
  }
};

// Function to log in with session
const loginSession = async (emailOrMobile, password) => {
  try {
    const response = await axios.post(USER_API.LOGIN_SESSION, {
      email: emailOrMobile,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; // Propagate the error for handling in the caller function
  }
};

// Exporting all functions as an object
export default {
  validateSessionToken,
  loginSession,
  createUser, // Include the createUser function in the export
};
