import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import PrimaryButton from "../components/PrimaryButton";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { useUserInfo } from "../context/userContext";

const Appointment = ({ navigation, route }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentType, setAppointmentType] = useState(null);
  const [bookedSlots, setBookedSlots] = useState({});
  const [dates, setDates] = useState([]);
  // const dates = ["Today", "Mon 5 Oct", "Tue 6 Oct", "Wed 7 Oct"]; // Add more dates as needed
  const times = [
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
    "11:00 PM",
  ]; // Add more times as needed
  const appointmentTypes = ["Video Call", "Visit"];
  const { doctorId, doctorName, doctorSpeciality, dcotorImage } = route.params;
  const { userInfo } = useUserInfo();
  console.log("User Info >>>>>>>>>", userInfo);
  console.log(
    "Dcotor Id and name on Appointment Booking Page is",
    doctorId,
    doctorName,
    doctorSpeciality,
    dcotorImage
  );

  useEffect(() => {
    console.log("use effect running");
    // Example usage:
    const date = getNextSevenDays();
    setDates(date);
    // console.log(".....>>>>>>",date);
    fetchBookings();
  }, []); // Depend on doctorId to refetch when it changes

  // Placeholder function for making an appointment
  const makeAppointment = async () => {
    // navigation.navigate("bookingList");
    // Implement your logic to make an appointment
    console.log("Appointment made!");
    console.log("dcotorID", doctorId);
    console.log("doctorName", doctorName);
    console.log("patientName", userInfo.name);
    console.log("doctorSpeciality", doctorSpeciality);
    console.log("selectedDate", selectedDate);
    console.log("selectedTime", selectedTime);
    console.log("appointmentType", appointmentType);
    if (selectedDate && selectedTime && appointmentType) {
      // Define the booking object
      const bookingDetails = {
        doctorId,
        doctorName,
        patientName: userInfo.name,
        doctorSpeciality,
        selectedDate,
        selectedTime,
        appointmentType,
        patientId: userInfo.userID, // Assuming the patient is the current user
        status: "upcoming", // Initial status of the booking
        createdAt: new Date(), // Timestamp for when the booking is created
        dcoctorProfile:dcotorImage,
        patientProfile:userInfo.image
      };
      console.log("bookingDetails is>>", bookingDetails);
      try {
        // Add a new document with an auto-generated id to the "bookings" collection
        const docRef = await setDoc(
          doc(collection(firestore, "bookings")),
          bookingDetails
        )
          .then((res) => {
            //  navigation.navigate("BookingConfirmation");
            // ... attempt to create the booking
            console.log("res", res);
            console.log("Booking successfully created with ID: ", docRef);
            // Navigate to the BookingConfirmation screen
            navigation.navigate("Payment");
            // navigation.navigate("BookingConfirmation");
          })
          .catch((err) => {
            console.log("error:", err);
          });

        console.log("Booking successfully");
        // Optional: Navigate to a confirmation screen or alert the user of success
        // navigation.navigate("BookingConfirmation", { bookingId: docRef.id });
      } catch (error) {
        console.error("Error booking the appointment: ", error);
        // Optional: Alert the user of the error
      }
    } else {
      // Alert the user that they must fill in all fields
      console.log("Please select a date, time, and appointment type.");
      Alert.alert(
        "Alert Title", // Title of the alert
        "Please select a date, time, and appointment type.", // Message of the alert
      );
    }
  };
  const fetchBookings = async () => {
    console.log("fetch booking run");
    // Assuming you have a collection called 'bookings' in Firestore
    const querySnapshot = await getDocs(collection(firestore, "bookings"));
    // console.log("query Snap SHot is",querySnapshot);
    const bookings = querySnapshot.docs
      .map((doc) => doc.data())
      .filter((booking) => booking.doctorId === doctorId);
    console.log("the Booking before save to state is", bookings);
    // Process the bookings to find booked dates and times
    processBookings(bookings);
  };
  const processBookings = (bookings) => {
    let slots = {};

    bookings.forEach((booking) => {
      console.log("the book are", booking);
      const date = booking.selectedDate; // Assuming this is how your date is stored
      const time = booking.selectedTime;

      if (!slots[date]) {
        slots[date] = new Set();
      }
      slots[date].add(time);
    });
    console.log("Processed booked slots>>>>>>:", slots);
    setBookedSlots(slots);
  };
  function getNextSevenDays() {
    const daysList = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + i);

      const options = { weekday: "short", day: "2-digit", month: "short" };
      const formattedDate = futureDate.toLocaleDateString("en-US", options);

      daysList.push(formattedDate.replace(",", ""));
    }

    return daysList;
  }

  // Call the function
  const nextSevenDays = getNextSevenDays();
  console.log("Seven days", nextSevenDays);

  console.log("now date in state are", dates);
  console.log("The Booking SLot are ", bookedSlots);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
      </View>

      {/* Doctor Profile Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: dcotorImage,
          }} // Replace with actual image path
          style={styles.doctorImage}
        />
      </View>
      {/* Doctor Details */}
      <View style={styles.doctorDetails}>
        <Text style={styles.doctorName}>{doctorName}</Text>
        <Text style={styles.specialty}>{doctorSpeciality}</Text>
        {/* <Text style={styles.location}>New York, United States</Text> */}
      </View>

      {/* Date Selection */}
      <Text style={styles.sectionTitle}>Select Date</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.dateScrollView}
      >
        {dates.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dateButton,
              selectedDate === date && styles.selectedDateButton,
            ]}
            onPress={() => setSelectedDate(date)}
          >
            <Text
              style={[
                styles.dateText,
                selectedDate === date && styles.selectedDateText,
              ]}
            >
              {date} {/* Day */}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Time Selection */}
      <Text style={styles.sectionTitle}>Select Time</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.timeScrollView}
      >
        {times.map((time, index) => {
          const isDisabled = bookedSlots[selectedDate]?.has(time);
          console.log(`Is ${time} on ${selectedDate} disabled?`, isDisabled);
          return (
            <TouchableOpacity
              key={index}
              disabled={isDisabled}
              style={[
                styles.timeButton,
                selectedTime === time && styles.selectedTimeButton,
                isDisabled && styles.disabledTimeButton,
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={styles.timeText}>{time}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Appointment Type Selection */}
      <Text style={styles.sectionTitle}>Appointment Type</Text>
      <View style={styles.appointmentTypeContainer}>
        {appointmentTypes.map((type, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.appointmentTypeButton,
              appointmentType === type && styles.selectedAppointmentTypeButton,
            ]}
            onPress={() => setAppointmentType(type)}
          >
            <Text
              style={[
                styles.appointmentTypeText,
                appointmentType === type && styles.selectedAppointmentTypeText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Make Appointment Button */}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          buttonText="Book Appointment"
          onPress={makeAppointment}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 44, // Adjust for the status bar height
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 16,
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  doctorImage: {
    width: "90%",
    height: 180, // Adjust the height as necessary
    borderRadius: 8,
    objectFit: "cover",
  },
  doctorDetails: {
    padding: 16,
    backgroundColor: "#fff",
  },
  doctorName: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 4,
  },
  specialty: {
    fontSize: 18,
    color: "#666",
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: "#666",
  },
  horizontalScrollView: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 16,
  },
  makeAppointmentButton: {
    marginHorizontal: 20,
    backgroundColor: "#4F8EF7",
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  makeAppointmentText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  dateScrollView: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dateButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    borderRadius: 40,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    height: 65,
    width: 130,
  },
  selectedDateButton: {
    backgroundColor: "#4F8EF7",
  },
  dateText: {
    color: "black",
    textAlign: "center",
  },
  selectedDateText: {
    color: "white",
  },
  dateText: {
    color: "black",
  },

  // Styles for the time ScrollView
  timeScrollView: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  timeButton: {
    // Same styles as dateButton
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    borderRadius: 40,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    height: 65,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTimeButton: {
    // Same styles as selectedDateButton
    backgroundColor: "#4F8EF7",
  },

  timeText: {
    // Same styles as dateText
    color: "black",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 5,
    marginBottom: 5,
  },
  buttonContainer: {
    paddingHorizontal: 16,
  },
  appointmentTypeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
  },
  appointmentTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
  },
  selectedAppointmentTypeButton: {
    borderColor: "#4F8EF7",
    backgroundColor: "#4F8EF7",
  },
  appointmentTypeText: {
    textAlign: "center",
    color: "black",
  },
  selectedAppointmentTypeText: {
    color: "white",
  },
  disabledTimeButton: {
    backgroundColor: "#ccc",
    borderColor: "#aaa",
  },
});

export default Appointment;
