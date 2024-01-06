import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const DoctorCard = ({doctorId,doctorName, specialty, onAppointmentPress ,hospitalName,doctorImage}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Image
          source={{ uri: doctorImage }} // Replace with actual image path
          style={styles.doctorImage}
        />
        <View style={styles.infoContainer}>
          <View style={styles.professionalTag}>
            <MaterialCommunityIcons name="stethoscope" size={16} color="#4F8EF7" />
            <Text style={styles.professionalText}>Professional Doctor</Text>
          </View>
          <Text style={styles.doctorName}>{doctorName}</Text>
          <Text style={styles.specialty}>{specialty}</Text>
          <Text style={styles.specialty}>{hospitalName}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => onAppointmentPress(doctorId, doctorName)} style={styles.appointmentButton}>
        <Text style={styles.appointmentText}>Make Appointment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 12,
    marginVertical: 8,
    marginHorizontal:20
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  professionalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e7f4ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  professionalText: {
    marginLeft: 4,
    color: '#4F8EF7',
    fontSize: 12,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  specialty: {
    fontSize: 14,
    color: 'grey',
  },
  favoriteButton: {
    marginLeft: 12,
  },
  appointmentButton: {
    backgroundColor: '#4F8EF7',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  appointmentText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DoctorCard;
