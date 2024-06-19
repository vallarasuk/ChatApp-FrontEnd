// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userApi from "../api/userApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem("sessionToken");
      const userId = await AsyncStorage.getItem("userId");

      console.log(sessionToken, userId);
      if (sessionToken && userId) {

        // Validate the session token and userId with the server
        const response = await userApi.validateSessionToken(
          sessionToken,
          userId
        );

        if (response.isValid) {
          setIsAuthenticated(true);
        } else {
          // If session validation fails, clear the session
          await AsyncStorage.removeItem("sessionToken");
          await AsyncStorage.removeItem("userId");
          setIsAuthenticated(false);
        }
      } else {
        // If no session token or userId found, consider the user not authenticated
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (sessionToken, userId) => {
    try {
      await AsyncStorage.setItem("sessionToken", sessionToken);
      await AsyncStorage.setItem("userId", userId);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("sessionToken");
      await AsyncStorage.removeItem("userId");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
