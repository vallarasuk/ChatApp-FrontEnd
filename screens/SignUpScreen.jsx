import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Alert,
  Image,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { REACT_APP_BACKEND_URL } from "@env";
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";

// Import constants from content module
import {
  BACKGROUND_IMAGE,
  SIGN_UP_TITLE,
  USERNAME_LABEL,
  EMAIL_LABEL,
  MOBILE_LABEL,
  PASSWORD_LABEL,
  CONFIRM_PASSWORD_LABEL,
  SIGN_UP_BUTTON_LABEL,
  BACK_TO_LOGIN_BUTTON_LABEL,
  PASSWORDS_DO_NOT_MATCH_MESSAGE,
  SHOW_SIGN_UP_LOGO,
  SERVER_ERROR_MESSAGE,
  UNEXPECTED_STATUS_CODE_MESSAGE,
  SIGN_UP_LOGO_IMAGE,
} from "../content/content";

const SignUpScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile_number: "",
    password: "",
    re_password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    mobile_number: "",
    password: "",
    re_password: "",
  });

  // UseFonts hook to load fonts
  let [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

  const handleSignUp = async () => {
    const { username, email, mobile_number, password, re_password } = formData;
    let formErrors = {};

    // Basic validation for required fields
    if (!username) {
      formErrors = { ...formErrors, username: "Username is required." };
    }
    if (!email) {
      formErrors = { ...formErrors, email: "Email is required." };
    }
    if (!mobile_number) {
      formErrors = {
        ...formErrors,
        mobile_number: "Mobile number is required.",
      };
    }
    if (!password) {
      formErrors = { ...formErrors, password: "Password is required." };
    }
    if (!re_password) {
      formErrors = {
        ...formErrors,
        re_password: "Confirm Password is required.",
      };
    }

    // Check if passwords match
    if (password !== re_password) {
      formErrors = {
        ...formErrors,
        re_password: PASSWORDS_DO_NOT_MATCH_MESSAGE,
      };
    }

    setErrors(formErrors);

    // If there are errors, stop sign up process
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    try {
      const response = await axios.post(`${REACT_APP_BACKEND_URL}/api/users`, {
        username,
        email,
        mobile_number,
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

        navigation.navigate("Home");
      } else {
        console.error(
          `${UNEXPECTED_STATUS_CODE_MESSAGE}: ${response.status}`,
          response.data
        );
        // Handle other status codes or errors if needed
      }
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.response) {
        console.error("Server responded with an error:", error.response);
        const errorMessage = error.response.data.error || SERVER_ERROR_MESSAGE;
        // Handle specific error message from server
      } else if (error.request) {
        console.error("No response received:", error.request);
        // Handle network error
      } else {
        console.error("Error setting up the request:", error.message);
        // Handle other errors
      }
    }
  };

  const handleNavigateToLogin = () => {
    navigation.navigate("Login");
  };

  const handleChangeText = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });

    // Clear the error message when the user starts typing again
    setErrors({
      ...errors,
      [key]: "",
    });
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage}>
      <View style={styles.container}>
        {SHOW_SIGN_UP_LOGO ? (
          <View style={styles.logoContainer}>
            <Image source={SIGN_UP_LOGO_IMAGE} style={styles.logoImage} />
          </View>
        ) : (
          <Text style={styles.title}>{SIGN_UP_TITLE}</Text>
        )}
        <TextInput
          label={USERNAME_LABEL}
          value={formData.username}
          onChangeText={(text) => handleChangeText("username", text)}
          placeholder={errors.username || USERNAME_LABEL}
          error={!!errors.username}
          style={styles.input}
          theme={{
            fonts: {
              regular: { fontFamily: "OpenSans_400Regular" },
            },
          }}
        />
        <TextInput
          label={EMAIL_LABEL}
          value={formData.email}
          onChangeText={(text) => handleChangeText("email", text)}
          placeholder={errors.email || EMAIL_LABEL}
          error={!!errors.email}
          keyboardType="email-address"
          style={styles.input}
          theme={{
            fonts: {
              regular: { fontFamily: "OpenSans_400Regular" },
            },
          }}
        />
        <TextInput
          label={MOBILE_LABEL}
          value={formData.mobile_number}
          onChangeText={(text) => handleChangeText("mobile_number", text)}
          placeholder={errors.mobile_number || MOBILE_LABEL}
          error={!!errors.mobile_number}
          keyboardType="phone-pad"
          style={styles.input}
          theme={{
            fonts: {
              regular: { fontFamily: "OpenSans_400Regular" },
            },
          }}
        />
        <TextInput
          label={PASSWORD_LABEL}
          value={formData.password}
          onChangeText={(text) => handleChangeText("password", text)}
          placeholder={errors.password || PASSWORD_LABEL}
          error={!!errors.password}
          secureTextEntry={true}
          style={styles.input}
          theme={{
            fonts: {
              regular: { fontFamily: "OpenSans_400Regular" },
            },
          }}
        />
        <TextInput
          label={CONFIRM_PASSWORD_LABEL}
          value={formData.re_password}
          onChangeText={(text) => handleChangeText("re_password", text)}
          placeholder={errors.re_password || CONFIRM_PASSWORD_LABEL}
          error={!!errors.re_password}
          secureTextEntry={true}
          style={styles.input}
          theme={{
            fonts: {
              regular: { fontFamily: "OpenSans_400Regular" },
            },
          }}
        />
        <Button
          mode="contained"
          onPress={handleSignUp}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          {SIGN_UP_BUTTON_LABEL}
        </Button>
        <Button
          onPress={handleNavigateToLogin}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          {BACK_TO_LOGIN_BUTTON_LABEL}
        </Button>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
    textAlign: "center",
    fontFamily: "OpenSans_700Bold",
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
  logoImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
});

export default SignUpScreen;
