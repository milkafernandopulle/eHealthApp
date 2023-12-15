import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';

const Payment = () => {
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  const handleAddCard = () => {
    // Add logic to handle adding card
    console.log('Add Card');
  };

  return (
    <ScrollView style={styles.container}>
       {/* Doctor Profile Image */}
       <View style={styles.imageContainer}>
      <Image
        source={{ uri: 'https://sea.mastercard.com/content/dam/public/mastercardcom/sea/en/consumer/cards/consumer-platinum-credit-card_1280x720.png' }} // Replace with actual image path
        style={styles.cardImage}
      />
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Card Holder Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setCardHolderName}
          value={cardHolderName}
          placeholder="Name as it appears on your card"
        />

        <Text style={styles.inputLabel}>Card Number</Text>
        <TextInput
          style={styles.input}
          onChangeText={setCardNumber}
          value={cardNumber}
          placeholder="1234 5678 9123 4567"
          keyboardType="numeric"
        />

        <View style={styles.expiryCvvRow}>
          <View style={styles.expiryContainer}>
            <Text style={styles.inputLabel}>Expiry Date</Text>
            <TextInput
              style={styles.inputHalf}
              onChangeText={setExpiryDate}
              value={expiryDate}
              placeholder="MM/YY"
            />
          </View>
          <View style={styles.cvvContainer}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              style={styles.inputHalf}
              onChangeText={setCvv}
              value={cvv}
              placeholder="000"
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveCard} onPress={() => setSaveCard(!saveCard)}>
          <View style={saveCard ? styles.checkboxChecked : styles.checkbox} />
          <Text style={styles.saveCardText}>Save Card</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
            <PrimaryButton buttonText="Add Card" onPress={handleAddCard} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop:50,
    backgroundColor: '#fff',
  },
  imageContainer:{
    display:"flex",
    alignItems: 'center',
    justifyContent:"center",
  },
  cardImage: {
    width: '100%',
    height: 250, // Adjust the height as necessary
    objectFit:"cover"
  },
  inputSection: {
    marginTop: 50,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 20,
  },
  inputHalf: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  expiryCvvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expiryContainer: {
    flex: 1,
    marginRight: 10,
  },
  cvvContainer: {
    flex: 1,
  },
  saveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop:25,
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 3,
    marginRight: 10,
  },
  checkboxChecked: {
    height: 20,
    width: 20,
    backgroundColor: '#4F8EF7',
    borderRadius: 3,
    marginRight: 10,
  },
  saveCardText: {
    fontSize: 16,
  },
  buttonContainer:{
    marginTop:50
  }
});

export default Payment;