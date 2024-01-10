import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";

const CustomToast = ({ message, visible }) => {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(true);
  // Function to hide the toast
  const hideToast = () => {
    setIsVisible(false);
  };

  const handleNavigate = () => {
    navigation.navigate("DoctorProfile");
    setIsVisible(false);
  };
  return (
    visible && (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={hideToast}
      >
        <View style={styles.container}>
          <View style={styles.toast}>
            <Text style={styles.text}>{message}</Text>
            <TouchableOpacity onPress={handleNavigate}>
              <Text style={styles.Profile}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  toast: {
    backgroundColor: "white",
    padding: 12,
    paddingLeft: 67,
    flexDirection: "row",
    borderRadius: 8,
    alignItems: "center",
    justifyContentL: "center",
    width: 330,
    height: 60,
    borderWidth: 2,
    borderColor: "gray",
    position: "absolute",
    bottom: 16,
  },
  text: {
    fontSize: 14,
  },
  Profile: {
    fontSize: 14,
    marginLeft: 4.5,
    textDecorationLine: "underline",
    color: "blue",
  },
});

export default CustomToast;
