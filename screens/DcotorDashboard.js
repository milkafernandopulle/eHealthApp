import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BookingList from './BookingList';
import { collection, getDoc, getDocs } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

const DoctorDashboard = ({ route }) => {
    const [bookingList, setBookingList] = useState([]);
  // console.log("the patams on dcotor dashboard is", route.params)
  useEffect(() => {
    const getData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "bookings"));
        const bookings = querySnapshot.docs.map(doc => ({
          id: doc.id, // Document ID
          ...doc.data() // Document data
        }));
        setBookingList(bookings); // Update the state with the bookings list
      } catch (err) {
        console.log("Error getting documents:", err);
      }
    };
    getData();
  }, []);
  console.log("Booking List is:", bookingList);
  return (
    <BookingList BookingList={bookingList} />
  );
};
export default DoctorDashboard;
