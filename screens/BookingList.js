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
// import { AntDesign } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { useUserInfo } from "../context/userContext";
// import { Icon } from 'react-native-vector-icons/Icon';
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

  // console.log("Booking List inside Booking List Component",BookingList);

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
              source={{ uri: userInfo.role==="role" ? item.dcoctorProfile : item.patientProfile }}
              style={styles.doctorImage}
            />
          ) : (
              <Text style={styles.iconContainer}>
                <Icon name="user-circle-o" size={50} color="#000" />
              </Text>
          )}
          <View style={styles.infoContainer}>
            <Text style={styles.doctorName}>{item.patientName}</Text>
            <Text style={styles.bookingAddress}>Status: {item.status}</Text>
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
    borderRadius: 8
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    paddingTop:10,
    paddingLeft:10
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookingAddress: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
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
