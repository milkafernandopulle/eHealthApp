import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const PrimaryButton = ({ buttonText, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // styles for your button
    backgroundColor: '#0165fc',
    padding: 15,
    borderRadius: 32,
    marginBottom: 20,
    alignItems: 'center', // Center the text inside the button
  },
  buttonText: {
    // styles for your button text
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default PrimaryButton;
