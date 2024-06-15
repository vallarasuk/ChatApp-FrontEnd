// /components/Layout.js

import React from "react";
import { View, StyleSheet } from "react-native";

const Layout = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Your header content goes here */}
        {/* Example: <Text style={styles.headerText}>Header</Text> */}
      </View>
      <View style={styles.content}>
        {/* Screen content goes here */}
        {children}
      </View>
      <View style={styles.footer}>
        {/* Your footer content goes here */}
        {/* Example: <Text style={styles.footerText}>Footer</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    backgroundColor: "#f4511e",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "start",
  },
  footer: {
    height: 50,
    backgroundColor: "#f4511e",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Layout;
