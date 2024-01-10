import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { firestore } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import PrimaryButton from "../components/PrimaryButton";

const Prescription = ({ route ,params,navigation }) => {
  const {patientName,patientId,doctorId} = route.params;
  const richText = useRef();
   console.log("IDDDD",patientName,patientId,doctorId);
  const savePrescription = async () => {
    let html = await richText.current?.getContentHtml();
    try {
      const docRef = await addDoc(collection(firestore, "prescriptions"), {
        patientId,
        patientName,
        doctorId,
        prescription: html,
      });
      console.log("Document written with ID: ", docRef.id);
      alert("Prescription saved successfully!");
      navigation.navigate("Show Booking");
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to save the prescription.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Patient Name</Text>
      <TextInput
        value={patientName}
        // onChangeText={setPatientName}
        style={styles.input}
        placeholder="Enter patient's name"
        editable={false}
      />
      <Text style={styles.label}>Prescription</Text>
      <RichEditor
        ref={richText}
        style={styles.richEditor}
        placeholder="Start typing the prescription..."
      />
      <RichToolbar
        style={styles.richBar}
        editor={richText}
        selectedIconTint={"#2095F2"}
        unselectedIconTint={"#bfbfbf"}
        iconSize={24}
        actions={[
          "bold",
          "italic",
          "unorderedList",
          "orderedList",
          "alignLeft",
          "alignCenter",
          "alignRight",
        ]}
      />
      <View style={styles.buttonContainer}>
        <PrimaryButton
          onPress={savePrescription}
          buttonText="Save Prescription"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    paddingTop: 70,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    minHeight: 40, // Changed from fixed height to minHeight
    borderColor: "lightgrey",
    borderWidth: 2,
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#ebebeb",
  },
  richEditor: {
    minHeight: 250,
    borderColor: "lightgrey",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  richBar: {
    borderColor: "lightgrey",
    borderWidth: 1,
    marginVertical: 10,
    borderRadius:8,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default Prescription;