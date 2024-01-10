// AlertConfirmation.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";

const AlertConfirmation = ({ message, buttonText, onButtonClick, visible }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onButtonClick}>
            <Text style={styles.button}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 4,
    height:160,
    alignItems:"center",
    justifyContent:"center",
  },
  message: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    color: "#0165fc",
    fontSize: 18,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default AlertConfirmation;
