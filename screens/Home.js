import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import DoctorCard from '../components/DoctorCard';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState([
    {id:1, name: 'Dr. Ayesha', specialty: 'Cardiologist', rating: 5, hospital: 'City Hospital' },
    {id:2, name: 'Dr. John Doe', specialty: 'Dentist', rating: 4, hospital: 'General Hospital' },
    {id:3, name: 'Dr. Jane Smith', specialty: 'Pediatrician', rating: 4.5, hospital: 'Kids Care' },
    {id:4, name: 'Dr. Emily Jones', specialty: 'Dermatologist', rating: 4.7, hospital: 'Skin Center' },
    {id:5, name: 'Dr. William Brown', specialty: 'Neurologist', rating: 5, hospital: 'Brain Health Institute' },
    {id:6, name: 'Dr. Linda Taylor', specialty: 'Psychologist', rating: 4.5, hospital: 'Mind Wellness Clinic' },
    {id:7, name: 'Dr. Michael Davis', specialty: 'Orthopedic', rating: 4.8, hospital: 'Ortho Care' },
    // ... add more doctors as needed
  ]);

  const filteredDoctors = doctors.filter(doctor => {
    const doctorData = `${doctor.name.toLowerCase()} ${doctor.specialty.toLowerCase()} ${doctor.hospital.toLowerCase()}`;
    return doctorData.includes(searchQuery.toLowerCase());
  });

  const handleAppointmentPress = (doctorId, doctorName) => {
    console.log(`Booking appointment for doctorId: ${doctorId}, doctorName: ${doctorName}`);
    // Add additional logic for appointment booking here
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header Section */}
      <View style={styles.header}>
        <View style={styles.locationWrapper}>
          <FontAwesome5 name="map-marker-alt" size={20} color="#4F8EF7" />
          <Text style={styles.locationText}>New York, USA</Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="black" />
        </View>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search"
            style={styles.searchTextInput}
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
          <FontAwesome5 name="search" size={20} color="grey" />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.cardContainer}>
        {filteredDoctors.map((doctor, index) => (
          <DoctorCard
          key={doctor.id} // Assuming each doctor has a unique id
          doctorId={doctor.id}
          doctorName={doctor.name}
          specialty={doctor.specialty}
          rating={doctor.rating}
          hospitalName={doctor.hospital}
          onAppointmentPress={() => handleAppointmentPress(doctor.id, doctor.name)}
        />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // assuming a white background
  },
  header: {
    // styles for the fixed header
    paddingHorizontal: 20,
    paddingTop: 50, // adjust to your status bar height
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchTextInput: {
    flex: 1,
    marginRight: 10,
  },
  cardContainer: {
    // styles for the card container
  },
  // Add other styles as necessary
});

export default Home;
