
// BookingConfirmation.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const BookingConfirmation = ({navigation}) => {
  return (
    <View style={styles.container}>
      <AntDesign name="checkcircle" size={100} color="green" />
      <Text style={styles.confirmationText}>Booking Confirmed</Text>
      <Text style={styles.confirmationText} onPress={()=>navigation.navigate("Show Booking")}>Go to <Text style={{color:"#0165fc",textDecorationLine:"underline"}}>Booking</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  confirmationText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default BookingConfirmation;
