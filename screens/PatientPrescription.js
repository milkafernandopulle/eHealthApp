import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import Loading from "../components/Loading";
import { useUserInfo } from "../context/userContext";

const PatientPrescription = ({ route }) => {
  const { userInfo } = useUserInfo();
  const patientId  = userInfo.userID; // Assuming you have the patient ID

  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const prescriptionsRef = collection(firestore, "prescriptions");
        const q = query(prescriptionsRef, where("patientId", "==", patientId));
        const querySnapshot = await getDocs(q);
        const prescriptionsData = [];

        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            prescriptionsData.push({ id: doc.id, ...doc.data() });
          }
        });

        setPrescriptions(prescriptionsData);
      } catch (error) {
        console.error("Error fetching prescriptions: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : prescriptions.length === 0 ? (
        <View style={styles.message}>
          <Text>No Prescriptions found!</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {prescriptions.map((prescription) => (
            <View key={prescription.id} style={styles.prescriptionContainer}>
              <Text style={styles.doctorName}>
                Doctor: {prescription.doctorName}
              </Text>
              {/* Render the prescription HTML content using RenderHtml */}
              <RenderHtml
                contentWidth={50} // You need to specify the contentWidth prop
                source={{ html: prescription.prescription || "" }}
              />
            </View>
          ))}
        </ScrollView>
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
    marginBottom: 20,
  },
  message: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PatientPrescription;
