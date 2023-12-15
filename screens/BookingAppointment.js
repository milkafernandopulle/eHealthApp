import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';

const Appointment = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [appointmentType, setAppointmentType] = useState(null);
    const dates = ["Today", "Mon 5 Oct", "Tue 6 Oct", "Wed 7 Oct"]; // Add more dates as needed
    const times = ["7:00 PM", "7:30 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"]; // Add more times as needed
    const appointmentTypes = ["Video Call", "Visit"];
      // Placeholder function for making an appointment
  const makeAppointment = () => {
    // Implement your logic to make an appointment
    console.log('Appointment made!');
    console.log("selectedDate",selectedDate);
    console.log("selectedTime",selectedTime);
    console.log("appointmentType", appointmentType);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log('Back button pressed')}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
      </View>

      {/* Doctor Profile Image */}
      <View style={styles.imageContainer}>
      <Image
        source={{ uri: 'https://cdn.pixabay.com/photo/2017/03/14/03/20/woman-2141808_1280.jpg' }} // Replace with actual image path
        style={styles.doctorImage}
      />
      </View>
      {/* Doctor Details */}
      <View style={styles.doctorDetails}>
        <Text style={styles.doctorName}>Dr. Jonny Wilson</Text>
        <Text style={styles.specialty}>Dentist</Text>
        <Text style={styles.location}>New York, United States</Text>
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
          style={[styles.dateButton, selectedDate === date && styles.selectedDateButton]}
          onPress={() => setSelectedDate(date)}
        >
          <Text style={[styles.dateText, selectedDate === date && styles.selectedDateText]}>
            {date.split(' ')[0]} {/* Day */}
          </Text>
          <Text style={[styles.dateText, selectedDate === date && styles.selectedDateText]}>
            {date.split(' ')[1]} {/* Date */}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

      {/* Time Selection */}
      <Text style={styles.sectionTitle}>Select Time</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.timeScrollView}>
        {times.map((time, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.timeButton, selectedTime === time && styles.selectedTimeButton]}
            onPress={() => setSelectedTime(time)}
          >
            <Text style={styles.timeText}>{time}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

       {/* Appointment Type Selection */}
       <Text style={styles.sectionTitle}>Appointment Type</Text>
      <View style={styles.appointmentTypeContainer}>
        {appointmentTypes.map((type, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.appointmentTypeButton,
              appointmentType === type && styles.selectedAppointmentTypeButton
            ]}
            onPress={() => setAppointmentType(type)}
          >
            <Text style={[
              styles.appointmentTypeText,
              appointmentType === type && styles.selectedAppointmentTypeText
            ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Make Appointment Button */}
      <View style={styles.buttonContainer}>
      <PrimaryButton buttonText="Book Appointment"  onPress={makeAppointment}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 44, // Adjust for the status bar height
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 16,
  },
  imageContainer:{
    display:"flex",
    alignItems: 'center',
    justifyContent:"center"
  },
  doctorImage: {
    width: '90%',
    height: 180, // Adjust the height as necessary
    borderRadius:8,
    objectFit:"contain"
  },
  doctorDetails: {
    padding: 16,
    backgroundColor: '#fff',
  },
  doctorName: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 4,
  },
  specialty: {
    fontSize: 18,
    color: '#666',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  horizontalScrollView: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
  },
  makeAppointmentButton: {
    marginHorizontal: 20,
    backgroundColor: '#4F8EF7',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  makeAppointmentText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  dateScrollView: {
    paddingVertical: 10,
    paddingHorizontal: 16
  },
  dateButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    borderRadius: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    height:65,
    width:100
  },
  selectedDateButton: {
    backgroundColor: '#4F8EF7',
  },
  dateText: {
    color: 'black',
    textAlign: 'center',
  },
  selectedDateText: {
    color: 'white',
  },
  dateText: {
    color: 'black',
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    height:65,
    width:100,
    justifyContent: 'center',
    alignItems: 'center',
  },selectedTimeButton: {
    // Same styles as selectedDateButton
    backgroundColor: '#4F8EF7',
  },

  timeText: {
    // Same styles as dateText
    color: 'black',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 5,
    marginBottom: 5
  },
  buttonContainer:{
    paddingHorizontal: 16,
  },
  appointmentTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  appointmentTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  selectedAppointmentTypeButton: {
    borderColor: '#4F8EF7',
    backgroundColor: '#4F8EF7',
  },
  appointmentTypeText: {
    textAlign: 'center',
    color: 'black',
  },
  selectedAppointmentTypeText: {
    color: 'white',
  },
});

export default Appointment;
