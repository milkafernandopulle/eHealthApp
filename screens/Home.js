import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, ScrollView,Alert } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import DoctorCard from '../components/DoctorCard';
import { useNavigation } from '@react-navigation/native';
const Home = ({DoctorList}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
 console.log("Dcotor List inside Home",DoctorList);
  const filteredDoctors = DoctorList.filter(doctor => {
    const doctorData = `${doctor?.name?.toLowerCase()} ${doctor?.speciality?.toLowerCase()} ${doctor?.hospitalName?.toLowerCase()}`;
    return doctorData.includes(searchQuery.toLowerCase());
  });

  const handleAppointmentPress = (doctorId, doctorName,speciality,availability,dcotorImage) => {
    console.log("The image is",dcotorImage)
    if(availability === "No"){
      return (
        Alert.alert(
          "Availibility",
          "This doctor is not availabe!",
          [
            { text: "Back", onPress: () => console.log("Yes Pressed") }
          ]
        )
      )
    }
    else{
    navigation.navigate("bookAppointment", {
      doctorId: doctorId,
      doctorName: doctorName,
      doctorSpeciality:speciality,
      dcotorImage:dcotorImage
    });
  }
    console.log(`Booking appointment for doctorId: ${doctorId}, doctorName: ${doctorName} and ${speciality}`);
    // Add additional logic for appointment booking here
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header Section */}
      <View style={styles.header}>
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
           specialty={doctor.speciality}
           rating={5}
           doctorImage={doctor.image}
           hospitalName={doctor.hospitalName}
           onAppointmentPress={() => handleAppointmentPress(doctor.id, doctor.name,doctor.speciality,doctor.availability,doctor.image)}
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
    // paddingTop: 50, // adjust to your status bar height
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
