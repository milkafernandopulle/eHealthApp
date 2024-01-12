import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import SecondryButton from "../components/SecondryButton";
import Loading from "../components/Loading";
import { useUserInfo } from "../context/userContext";
import { query } from "firebase/database";
import * as Linking from "expo-linking";

const BookingDetail = ({ route, navigation }) => {
  const { doctorId, patientId, bookingId, userRole } = route.params;
  const { userInfo } = useUserInfo();
  console.log("User info Inside Booking Details is", userInfo);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log(
    "doctor id",
    doctorId,
    "and patient id is",
    patientId,
    "on detail page",
    "bookingId",
    bookingId,
    "and Role is",
    userRole
  );
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const docRef = doc(firestore, "bookings", bookingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBookingDetails(docSnap.data());
        } else {
          console.log("No such booking!");
        }
      } catch (error) {
        console.error("Error fetching booking details: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);
  console.log("Booking details fetched is", bookingDetails);
  const cancelBooking = async () => {
    setIsLoading(true); // Start loading
    try {
      const bookingRef = doc(firestore, "bookings", bookingId);
      await updateDoc(bookingRef, {
        status: "cancelled",
      });
      alert("Booking cancelled successfully!");
      // Update the local state to reflect the change immediately
      setBookingDetails({ ...bookingDetails, status: "cancelled" });
      navigation.navigate("Show Booking", { bookingCanceled: true });
    } catch (error) {
      alert("Failed to cancel the booking.");
      console.error("Error cancelling booking: ", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  // const startChat = async () => {
  //   // Assuming you have a function to create a new chat document
  //   const newChatDoc = {
  //     patientId: patientId.toString(),
  //     doctorId: doctorId.toString(),
  //     userRole:userRole,
  //     messages: [],
  //     createdAt: serverTimestamp(),
  //   };
  //   addDoc(collection(firestore, "chats"), newChatDoc)
  //     .then(() => {
  //       console.log("Chat has been created successfully");
  //       // Navigate to the chat screen
  //     })
  //     .catch((err) => {
  //       console.error("Error starting chat: ", err);
  //       alert("Failed to start the chat.");
  //     });
  // };

  const handleConnectWhatsApp = async () => {
    try {
      // Retrieve the doctor's WhatsApp number from the database
      const doctorRef = doc(firestore, "users", doctorId);
      const doctorSnap = await getDoc(doctorRef);

      if (doctorSnap.exists()) {
        const doctorData = doctorSnap.data();
        console.log("Doctor Data", doctorData);
        const whatsappNumber = doctorData.phoneNumber; // assuming the field is named whatsappNumber

        // Use Linking to open WhatsApp with the doctor's number
        const whatsappUrl = `whatsapp://send?phone=${whatsappNumber}`;
        const canOpen = await Linking.canOpenURL(whatsappUrl);

        if (canOpen) {
          Linking.openURL(whatsappUrl);
        } else {
          alert(
            "Cannot open WhatsApp. Please make sure WhatsApp is installed."
          );
        }
      } else {
        console.log("No such doctor!");
      }
    } catch (error) {
      console.error("Error connecting to WhatsApp: ", error);
      alert("An error occurred while trying to connect to WhatsApp.");
    }
  };

  const startChat = async () => {
    try {
      // Check if a chat already exists between the patient and doctor
      const chatsRef = collection(firestore, "chats");
      const q = query(
        chatsRef,
        where("patientId", "==", patientId.toString()),
        where("doctorId", "==", doctorId.toString())
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Chat already exists, navigate to it
        const existingChatId = querySnapshot.docs[0].id;
        navigation.navigate("Chat", { chatId: existingChatId });
      } else {
        // No chat exists, create a new one
        const newChatDoc = {
          patientId: patientId.toString(),
          doctorId: doctorId.toString(),
          userRole: userRole,
          messages: [],
          createdAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(firestore, "chats"), newChatDoc);
        navigation.navigate("Chat", { chatId: docRef.id });
      }
    } catch (err) {
      console.error("Error in starting chat: ", err);
      alert("Failed to start the chat.");
    }
  };

  const handleWritePrescription = async () => {
    try {
      const prescriptionsRef = collection(firestore, "prescriptions");
      const q = query(
        prescriptionsRef,
        where("patientId", "==", bookingDetails.patientId),
        where("doctorId", "==", bookingDetails.doctorId)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Prescription exists, navigate to view it
        const existingPrescriptionId = querySnapshot.docs[0].id;
        navigation.navigate("ViewPrescription", {
          prescriptionId: existingPrescriptionId,
        });
      } else {
        // No prescription exists, navigate to create a new one
        navigation.navigate("Prescription", {
          patientName: bookingDetails.patientName,
          patientId: bookingDetails.patientId,
          doctorId: bookingDetails.doctorId,
        });
      }
    } catch (error) {
      console.error("Error checking for existing prescription: ", error);
      alert("An error occurred while checking for an existing prescription.");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!bookingDetails) {
    return (
      <View style={styles.container}>
        <Text>No Booking Details Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Details</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellTitle}>Patient Name:</Text>
          <Text style={styles.tableCellValue}>
            {bookingDetails.patientName}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellTitle}>Date:</Text>
          <Text style={styles.tableCellValue}>
            {bookingDetails.selectedDate}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellTitle}>Time:</Text>
          <Text style={styles.tableCellValue}>
            {bookingDetails.selectedTime}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellTitle}>Appointment Type:</Text>
          <Text style={styles.tableCellValue}>
            {bookingDetails.appointmentType}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellTitle}>Status:</Text>
          <Text style={styles.tableCellValue}>{bookingDetails.status}</Text>
        </View>
      </View>
      {/* Button Logic Based on Status and Role */}
      {bookingDetails.status === "upcoming" && (
        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <SecondryButton buttonText="Start Chat" onPress={startChat} />
            <SecondryButton
              buttonText="Cancel Booking"
              onPress={cancelBooking}
            />
          </View>
          {userInfo.role === "doctor" && (
            <SecondryButton
              buttonText="Write Prescription"
              onPress={handleWritePrescription}
            />
          )}
        </View>
      )}

      {bookingDetails.status === "completed" && (
        <View style={styles.button}>
          <SecondryButton buttonText="Start Chat" onPress={startChat} />
        </View>
      )}

      {userInfo.role === "patient" &&
        bookingDetails.status === "upcoming" &&
        bookingDetails.appointmentType === "Video Call" && (
          <View style={styles.buttonContainer}>
            <SecondryButton
              buttonText="Connect WhatsApp"
              onPress={handleConnectWhatsApp}
            />
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 70,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 50,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  tableCellTitle: {
    fontWeight: "bold",
    paddingHorizontal: 10,
    width: "50%",
  },
  tableCellValue: {
    paddingHorizontal: 10,
    width: "50%",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 30,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  button: {
    marginTop:40
  },
  // Add other styles as needed
});

export default BookingDetail;
