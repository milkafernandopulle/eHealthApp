import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import Loading from "../components/Loading";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const PatientPrescription = ({ route }) => {
  // Assume we have a prescriptionId passed through route params
  //   const { prescriptionId } = route.params;
  const prescriptionId = "sbEfj8FGu2gs0b4aNdY3";
  const [prescriptionData, setPrescriptionData] = useState("");

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      try {
        // console.log("ID>>>>>",prescriptionId);
        const docRef = doc(firestore, "prescriptions", prescriptionId);
        const docSnap = await getDoc(docRef);
        // console.log("doc snapshot", docSnap);
        if (docSnap.exists()) {
          setPrescriptionData(docSnap.data());
        } else {
          console.log("No such prescription!");
        }
      } catch (error) {
        console.error("Error fetching prescription data: ", error);
      }
    };

    fetchPrescriptionData();
  }, []);

  // if (!prescriptionData) {
  //   return <Loading />;
  // }
  const source = {
    html: prescriptionData.prescription || "", // Ensure you have a fallback in case it's undefined
  };
  console.log("Prescription data", prescriptionData);

  const handleEdit = () => {
    // Logic for handling edit
  };

  const handleDelete = () => {
    // Logic for handling delete
  };

  return (
    <>
      {prescriptionData ? (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.doctorName}>
            Doctor: {prescriptionData.doctorName}
          </Text>
          <View style={styles.prescriptionContainer}>
            {/* Render the prescription HTML content using RenderHtml */}
            <RenderHtml
              contentWidth={50} // You need to specify the contentWidth prop
              source={source}
            />
            {/* <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
              <MaterialIcons name="edit" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
              <MaterialIcons name="delete" size={24} color="#000" />
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.message}>
          <Text>No Prescription found!</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  prescriptionContainer: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 15,
    borderRadius: 8,
  },
  prescriptionContent: {
    fontSize: 16,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "red",
  },
  iconButton: {
    padding: 8,
    marginLeft: 5, // To give some space between the HTML content and icons
    borderWidth: 2,
    borderColor: "red",
  },
  message: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
});

export default PatientPrescription;
