// DoctorProfile.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import * as ImagePicker from 'expo-image-picker';
import { auth, firestore } from '../firebaseConfig'; // Make sure to import the auth module from your firebase config
import { useUserInfo } from '../context/userContext';
import { doc, setDoc } from 'firebase/firestore';

const DoctorProfile = ({ navigation }) => {
  const [name, setName] = useState('');
  const [userID, setUserID] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [image, setImage] = useState(null);
  const { userInfo } = useUserInfo();

  useEffect(() => {
    console.log("user Info on Profile screen is", userInfo);
    // Assuming the user is logged in and you have fetched their data:
    const currentUser = auth.currentUser; // This would be your logged in user object from Firebase auth
    console.log("Current User: " + currentUser);
    if (userInfo) {
      setName(userInfo.name); // Or from Firestore user document
      setEmail(userInfo.email); // Or from Firestore user document
      setRole(userInfo.role); // You would get this from your Firestore user document
      setUserID(userInfo.userID)
    }
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const updateProfile = async () => {
    console.log("user id is",userID);
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Role:', role);
    console.log('Hospital Name:', hospitalName);
    console.log('Speciality:', speciality);
    console.log('Image URI:', image);
    // Update the Firestore document with new profile details
  try {
    await setDoc(doc(firestore, "users", userID), {
      hospitalName,
      speciality,
      image
    }, { merge: true });
    console.log("Profile updated successfully");
    navigation.navigate("DoctorDashboard");
    // Here you can do whatever you need to do upon a successful update
    // For example, navigate back to the dashboard or show a success message
  } catch (error) {
    console.error("Error updating profile:", error);
    // Here you can handle the error, show an error message, etc.
  }
};

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* <Text style={styles.title}>Doctor Profile</Text> */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        style={styles.nonEditableInput}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        style={styles.nonEditableInput}
      />
      <Text style={styles.label}>Role</Text>
      <TextInput
        value={role}
        style={styles.nonEditableInput}
      />
      <Text style={styles.label}>Hospital Name</Text>
      <TextInput
        placeholder="Hospital Name"
        value={hospitalName}
        onChangeText={setHospitalName}
        style={styles.input}
      />
      <Text style={styles.label}>Speciality</Text>
      <TextInput
        placeholder="Speciality"
        value={speciality}
        onChangeText={setSpeciality}
        style={styles.input}
      />
      <PrimaryButton buttonText="Pick an Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={styles.buttonContainer}>
        <PrimaryButton buttonText="Update Profile" onPress={updateProfile} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    paddingHorizontal:30,
    paddingVertical:10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  nonEditableInput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#ebebeb',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius:50
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
  },
  // Add styles for other elements if needed
});

export default DoctorProfile;
