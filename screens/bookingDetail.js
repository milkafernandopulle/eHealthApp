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
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import SecondryButton from "../components/SecondryButton";
import Loading from "../components/Loading";
import { useUserInfo } from "../context/userContext";

const BookingDetail = ({ route, navigation }) => {
  const { doctorId, patientId, bookingId,userRole } = route.params;
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
    "and Role is",userRole
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
      navigation.navigate('Show Booking', { bookingCanceled: true });
    } catch (error) {
      alert("Failed to cancel the booking.");
      console.error("Error cancelling booking: ", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  const startChat = async () => {
    // Assuming you have a function to create a new chat document
    const newChatDoc = {
      patientId: patientId.toString(),
      doctorId: doctorId.toString(),
      userRole:userRole,
      messages: [],
      createdAt: serverTimestamp(),
    };
    addDoc(collection(firestore, "chats"), newChatDoc)
      .then(() => {
        console.log("Chat has been created successfully");
        // Navigate to the chat screen
      })
      .catch((err) => {
        console.error("Error starting chat: ", err);
        alert("Failed to start the chat.");
      });
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
      {bookingDetails.status === "cancelled" ||
      bookingDetails.status === "completed" ? null : (
        <View style={styles.buttonRow}>
          <SecondryButton buttonText="Cancel Booking" onPress={cancelBooking} />
        </View>
      )}
      <View style={styles.buttonRow}>
        {userInfo.role === "doctor" && bookingDetails.status === "upcoming" && (
          <SecondryButton
            buttonText="Write Prescription"
            onPress={() =>
              navigation.navigate("Prescription", {
                bookingId: bookingDetails.id,
              })
            }
          />
        )}
        <SecondryButton buttonText="Start Chat" onPress={startChat} />
      </View>
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 50,
  },
  // Add other styles as needed
});

export default BookingDetail;
