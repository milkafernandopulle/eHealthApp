import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import moment from 'moment';
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { useUserInfo } from "../context/userContext";
const BookingList = ({ route }) => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigation = useNavigation();
  const [bookingList, setBookingList] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const { userInfo } = useUserInfo();
  // const { userInfo.userID, userInfo.role } = route.params;

  useEffect(() => {
    // Refetch bookings when the screen comes into focus
    const unsubscribeFocus = navigation.addListener("focus", () => {
      setRefreshTrigger((prev) => !prev); // Toggle the trigger to refetch bookings
    });

    return unsubscribeFocus;
  }, [navigation]);
  console.log(
    "the data receive through Props Inside Booking List",
    userInfo.userID,
    userInfo.role
  );
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        let q;
        const bookingsRef = collection(firestore, "bookings");
        if (userInfo.role === "patient") {
          q = query(bookingsRef, where("patientId", "==", userInfo.userID));
        } else if (userInfo.role === "doctor") {
          q = query(bookingsRef, where("doctorId", "==", userInfo.userID));
        } else {
          // Handle other userInfo.roles or errors
        }

        const querySnapshot = await getDocs(q);
        const bookings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookingList(bookings);
      } catch (err) {
        console.error("Error getting documents:", err);
      }
    };

    if (userInfo.userID && userInfo.role) {
      fetchBookings();
    }
  }, [userInfo.userID, userInfo.role, refreshTrigger]);
  console.log("Booking List is:", bookingList);

  const parseBookingDateTime = (selectedDate, selectedTime) => {
    // Assuming selectedDate format is 'ddd D MMM' and does not include year
    const dateParts = selectedDate.split(' ').slice(1).join(' '); // Removes day of week
  
    const currentYear = new Date().getFullYear();
    let dateTimeString = `${dateParts} ${currentYear} ${selectedTime}`;
    let parsedDate = moment(dateTimeString, 'D MMM YYYY hh:mm A');
  
    // If the date has already passed, assume it is for the next year
    if (parsedDate.isBefore(moment())) {
      dateTimeString = `${dateParts} ${currentYear + 1} ${selectedTime}`;
      parsedDate = moment(dateTimeString, 'D MMM YYYY hh:mm A');
    }
  
    if (!parsedDate.isValid()) {
      console.error('Invalid date:', dateTimeString);
      return null;
    }
  
    return parsedDate.toDate();
  };
  
  
  
  
  useEffect(() => {
    const updateBookingStatuses = async () => {
      const now = moment(); // Current time in Moment.js
      console.log("Now is",now);
      let hasUpdates = false;
  
      const updatedBookings = bookingList.map((booking) => {
        const bookingDateTime = parseBookingDateTime(booking.selectedDate, booking.selectedTime);
  
        // Check if the bookingDateTime is valid and the booking is upcoming
        if (booking.status === 'upcoming') {
          // Convert bookingDateTime to a moment object for comparison
          const bookingMoment = moment(bookingDateTime);
             console.log("booking Moment", bookingMoment);
          // Check if the booking date and time are in the past
          if (now.isAfter(bookingMoment)) {
            console.log("Booking is in the past, marking as completed:", booking);
            hasUpdates = true;
            return { ...booking, status: 'completed' };
          }
        }
        return booking;
      });
  
      if (hasUpdates) {
        setBookingList(updatedBookings);
        await updateBookingsInDb(updatedBookings.filter(b => b.status === 'completed'));
      }
    };
  
    if (bookingList.length > 0) {
      updateBookingStatuses();
    }
  }, [bookingList]);
  
  

  const updateBookingsInDb = async (bookingsToUpdate) => {
    bookingsToUpdate.forEach(async (booking) => {
      const bookingRef = doc(firestore, "bookings", booking.id);
      await updateDoc(bookingRef, {
        status: 'completed'
      });
    });
  };

  useEffect(() => {
    // Refetch bookings when the screen comes into focus or a booking is canceled
    const unsubscribeFocus = navigation.addListener("focus", (e) => {
      // Check if the navigation event has the bookingCanceled parameter
      if (e?.data?.bookingCanceled) {
        setRefreshTrigger((prev) => !prev); // Toggle the trigger to refetch bookings
      }
    });

    return unsubscribeFocus;
  }, [navigation]);

  const getFilteredData = () => {
    return bookingList?.filter((booking) => booking.status === activeTab);
  };
  const navigateToDetails = (bookingId) => {
    console.log("Navigate to details of booking with ID:", bookingId);
  };
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  console.log("Booking List inside Booking List Component",BookingList);
  console.log("User info inside Booking List is", userInfo);
  const renderBookingItem = ({ item }) => {
    console.log("Item inside BookinG List is >>>>>>", item);
    return (
      <TouchableOpacity
        style={styles.bookingCard}
        onPress={() =>
          navigation.navigate("bookingDetail", {
            doctorId: item.doctorId,
            patientId: item.patientId,
            bookingId: item.id,
            userRole: userInfo.role,
          })
        }
      >
        <View style={styles.doctorInfo}>
          {item.dcoctorProfile ? (
            <Image
              source={{
                uri:
                  userInfo.role === "doctor"
                    ? item.patientProfile
                    : item.dcoctorProfile,
              }}
              style={styles.doctorImage}
            />
          ) : (
            <Text style={styles.iconContainer}>
              <Icon name="user-circle-o" size={50} color="#000" />
            </Text>
          )}
          <View style={styles.infoContainer}>
            {userInfo.role === "doctor" ? (
              <Text style={styles.doctorName}>{item.patientName}</Text>
              ) : (
                <Text style={styles.doctorName}>{item.doctorName}</Text>
            )}
            <Text style={styles.bookingAddress}>Status: {item.status}</Text>
            <Text style={styles.bookingAddress}>Booking Time: {item.selectedTime}</Text>
            <Text style={styles.bookingAddress}>Booking Date: {item.selectedDate}</Text>
            <Text style={styles.bookingId}>Booking ID : {item.id}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const renderTabBar = () => {
    return (
      <View style={styles.tabBar}>
        {["upcoming", "completed", "cancelled"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={styles.tabText}>{capitalizeFirstLetter(tab)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointment List</Text>
      </View> */}
      {renderTabBar()}
      <FlatList
        data={getFilteredData()}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        // ListHeaderComponent={<YourComponent />} // If you need to render anything above the list
        // ListFooterComponent={<YourComponent />} // If you need to render anything below the list
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingTop: 10, // Adjust for the status bar height
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  bookingCard: {
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 16,
  },
  bookingDate: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  doctorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    marginLeft: 10,
    flex: 1,
  },
  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    paddingTop: 10,
    paddingLeft: 10,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookingAddress: {
    fontSize: 14,
    color: "#666",
    marginVertical: 2,
  },
  bookingId: {
    fontSize: 12,
    color: "#666",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 10,
  },
  tabItem: {
    padding: 10,
    borderBottomWidth: 3,
    borderBottomColor: "transparent", // Default non-active color
  },
  activeTab: {
    borderBottomColor: "blue", // Active tab color
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});

export default BookingList;
