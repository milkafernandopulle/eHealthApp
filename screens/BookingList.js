import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Dimensions,ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from '../firebaseConfig';
const bookingsData = [
    {
      doctorName: 'Dr. Jenny William',
      doctorImage: { uri: 'https://cdn.pixabay.com/photo/2017/03/14/03/20/woman-2141808_1280.jpg' },
      date: 'Aug 25, 2023 - 10:00 AM',
      status: 'Upcoming',
      bookingId: 'DR452SA54',
    },
    {
      doctorName: 'Dr. Guy Hawkins',
      doctorImage: { uri: 'https://cdn.pixabay.com/photo/2017/03/14/03/20/woman-2141808_1280.jpg' },
      date: 'Aug 26, 2023 - 11:00 AM',
      status: 'Upcoming',
      bookingId: 'DR458SA34',
    },
    {
      doctorName: 'Dr. Samantha Jones',
      doctorImage: { uri: 'https://cdn.pixabay.com/photo/2017/03/14/03/20/woman-2141808_1280.jpg' },
      date: 'Sep 05, 2023 - 09:30 AM',
      status: 'Completed',
      bookingId: 'DR462JA89',
    },
    {
      doctorName: 'Dr. Edward Norton',
      doctorImage: { uri: 'https://cdn.pixabay.com/photo/2017/03/14/03/20/woman-2141808_1280.jpg' },
      date: 'Sep 10, 2023 - 08:00 AM',
      status: 'Completed',
      bookingId: 'DR469EN74',
    },
    {
      doctorName: 'Dr. Alicia Keys',
      doctorImage: { uri: 'https://cdn.pixabay.com/photo/2017/03/14/03/20/woman-2141808_1280.jpg' },
      date: 'Sep 15, 2023 - 14:00 PM',
      status: 'Completed',
      bookingId: 'DR480AK32',
    },
    {
      doctorName: 'Dr. Chris Evans',
      doctorImage: { uri: 'https://cdn.pixabay.com/photo/2017/03/14/03/20/woman-2141808_1280.jpg' },
      date: 'Sep 20, 2023 - 16:00 PM',
      status: 'Cancelled',
      bookingId: 'DR495CE21',
    },
    {
      doctorName: 'Dr. Natalie Portman',
      doctorImage: { uri: 'https://cdn.pixabay.com/photo/2017/03/14/03/20/woman-2141808_1280.jpg' },
      date: 'Sep 25, 2023 - 11:30 AM',
      status: 'Cancelled',
      bookingId: 'DR510NP56',
    },
  ];
  

const BookingList = ({ route }) => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const navigation = useNavigation();
    const [bookingList, setBookingList] = useState([]);
    const { UserId, role } = route.params;
    console.log("the data receive through Props Inside Booking List", UserId,role);
    useEffect(() => {
      const fetchBookings = async () => {
        try {
          let q;
          const bookingsRef = collection(firestore, "bookings");
          if (role === 'patient') {
            q = query(bookingsRef, where("patientId", "==", UserId));
          } else if (role === 'doctor') {
            q = query(bookingsRef, where("doctorId", "==", UserId));
          } else {
            // Handle other roles or errors
          }
  
          const querySnapshot = await getDocs(q);
          const bookings = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setBookingList(bookings);
        } catch (err) {
          console.error("Error getting documents:", err);
        }
      };
  
      if (UserId && role) {
        fetchBookings();
      }
    }, [UserId, role]);
    console.log("Booking List is:", bookingList);
  
  const getFilteredData =  () => {
    return  bookingList?.filter(booking => booking.status === activeTab);
  };
  const navigateToDetails = (bookingId) => {
    console.log('Navigate to details of booking with ID:', bookingId);
  };
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // console.log("Booking List inside Booking List Component",BookingList);

  const renderBookingItem = ({ item }) => (
    <TouchableOpacity style={styles.bookingCard}
    onPress={() => navigation.navigate('bookingDetail', { bookingId: item.id })}
    >
      <View style={styles.doctorInfo}>
        <Image source={{uri: 'https://cdn.pixabay.com/photo/2017/03/14/03/20/woman-2141808_1280.jpg'}} style={styles.doctorImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.doctorName}>{item.patientName}</Text>
          <Text style={styles.bookingAddress}>Status: {item.status}</Text>
          <Text style={styles.bookingId}>Booking ID : {item.id}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  const renderTabBar = () => {
    return (
      <View style={styles.tabBar}>
        {['upcoming', 'completed', 'cancelled'].map(tab => (
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
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointment List</Text>
      </View>
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
      backgroundColor: '#fff',
      paddingTop: 10, // Adjust for the status bar height
      paddingBottom: 16,
      paddingHorizontal: 16
    },
    bookingCard: {
      margin: 10,
      paddingHorizontal: 10,
      paddingVertical:16,
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingBottom: 16,
        paddingHorizontal: 16,
      },
      headerTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 16,
      },
    bookingDate: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    doctorInfo: {
      flexDirection: 'row',
      alignItems: 'center',
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
    doctorName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    bookingAddress: {
      fontSize: 14,
      color: '#666',
      marginVertical: 5,
    },
    bookingId: {
      fontSize: 12,
      color: '#666',
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        marginBottom: 10,
      },
      tabItem: {
        padding: 10,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent', // Default non-active color
      },
      activeTab: {
        borderBottomColor: 'blue', // Active tab color
      },
      tabText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
      }
  });

export default BookingList;
