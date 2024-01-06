import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";

const Heading = () => {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>e-Doc</Text>
    </View>
  );
};

export default Heading;

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    color: "#0165fc",
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});
