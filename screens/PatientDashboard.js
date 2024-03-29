import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Home from "./Home";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

const PatientDashboard = ({ route }) => {
  const [doctorList, setDoctorList] = useState([]);
  console.log("the patams on dcotor dashboard is", route.params);
  useEffect(() => {
    const getData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "users"));
        const doctors = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.role === "doctor") {
            doctors.push({
              id: doc.id, // Include the doc id
              ...data,
            });
          }
        });
        setDoctorList(doctors); // Update the state with the doctors list
      } catch (err) {
        console.log("Error getting documents:", err);
      }
    };
    getData();
  }, []);
  console.log("Doctor List:", doctorList);
  return <Home DoctorList={doctorList} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default PatientDashboard;
