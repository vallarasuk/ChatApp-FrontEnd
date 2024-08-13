// LoginScreen.jsx

import React, { useState } from "react";
import { View, StyleSheet, ImageBackground, Image } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import CustomAlert from "../helper/customAlert";

// Import constants from content module
import {
  PASSWORD_LABEL,
  LOGIN_BUTTON_LABEL,
  CREATE_ACCOUNT_BUTTON_LABEL,
  INVALID_CREDENTIALS_MESSAGE,
  ERROR_MESSAGE,
  BACKGROUND_IMAGE,
  LOGO_IMAGE,
  LOGIN_EMAIL_LABEL,
  SHOW_LOGIN_LOGO,
} from "../content/content";
import userApi from "../api/userApi";

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: "",
    type: "", // "email" or "mobile"
    errors: {
      emailOrMobile: "",
      password: "",
    },
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  // UseFonts hook to load fonts
  let [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

  const handleLogin = async () => {
    const { emailOrMobile, password } = formData;

    // Basic validation for required fields
    if (!emailOrMobile || !password) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        errors: {
          ...prevFormData.errors,
          emailOrMobile: !emailOrMobile ? "Email/Mobile is required." : "",
          password: !password ? "Password is required." : "",
        },
      }));
      return;
    }

    // Additional validation for email or mobile format
    let fieldType = "";
    if (/^\d+$/.test(emailOrMobile) && emailOrMobile.length === 10) {
      fieldType = "mobile";
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrMobile)) {
      fieldType = "email";
    } else {
      // Invalid input format
      setAlertTitle("Invalid Input");
      setAlertMessage("Please enter a valid email or 10-digit mobile number.");
      setShowAlert(true);
      return;
    }

    try {
      const response = await userApi.loginSession(emailOrMobile, password);
      if (response.status === 200) {
        // Successfully logged in, save the session token
        await AsyncStorage.setItem(
          "sessionToken",
          response.data.user.session_token
        );
        await AsyncStorage.setItem("userId", response.data.user.id.toString());

        // Navigate to Home
        navigation.navigate("Home"); // Ensure "Home" is the correct screen name in your navigation stack
      } else {
        // Handle invalid credentials or other errors
        setFormData((prevFormData) => ({
          ...prevFormData,
          errors: {
            ...prevFormData.errors,
            emailOrMobile: INVALID_CREDENTIALS_MESSAGE,
          },
        }));
      }
    } catch (error) {
      console.error("Error logging in:", error);
      let errorMessage =
        "An unexpected error occurred. Please try again later.";

      // Check if the error is a 502 error
      if (error.response && error.response.status === 502) {
        errorMessage =
          "Unable to connect to the server. Please try again later.";
      }

      // Display the error message using custom alert
      setAlertTitle("Login Error");
      setAlertMessage(errorMessage);
      setShowAlert(true);

      // Handle network errors or other exceptions
      setFormData((prevFormData) => ({
        ...prevFormData,
        errors: {
          ...prevFormData.errors,
          emailOrMobile: ERROR_MESSAGE,
        },
      }));
    }
  };

  const handleChangeText = (key, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
      errors: {
        ...prevFormData.errors,
        [key]: "",
      },
    }));
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage}>
      <View style={styles.container}>
        {SHOW_LOGIN_LOGO ? (
          <View style={styles.logoContainer}>
            <Image source={LOGO_IMAGE} style={styles.logoImage} />
          </View>
        ) : (
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Logo</Text>
          </View>
        )}
        <TextInput
          label={LOGIN_EMAIL_LABEL}
          value={formData.emailOrMobile}
          onChangeText={(text) => handleChangeText("emailOrMobile", text)}
          keyboardType="email-address"
          style={styles.input}
          error={!!formData.errors.emailOrMobile}
          theme={{
            fonts: {
              regular: { fontFamily: "OpenSans_400Regular" },
              medium: { fontFamily: "OpenSans_700Bold" },
            },
          }}
        />

        <TextInput
          label={PASSWORD_LABEL}
          value={formData.password}
          onChangeText={(text) => handleChangeText("password", text)}
          secureTextEntry={true}
          style={styles.input}
          error={!!formData.errors.password}
          theme={{
            fonts: {
              regular: { fontFamily: "OpenSans_400Regular" },
              medium: { fontFamily: "OpenSans_700Bold" },
            },
          }}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          {LOGIN_BUTTON_LABEL}
        </Button>
        <Button
          onPress={() => navigation.navigate("SignUp")}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          {CREATE_ACCOUNT_BUTTON_LABEL}
        </Button>
      </View>

      <CustomAlert
        visible={showAlert}
        title={alertTitle}
        message={alertMessage}
        onClose={handleCloseAlert}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  input: {
    marginBottom: 12,
    fontFamily: "OpenSans_400Regular",
    backgroundColor: "None",
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: "OpenSans_700Bold",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    marginBottom: 40,
    fontFamily: "OpenSans_700Bold",
  },
  logoImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
});

export default LoginScreen;
