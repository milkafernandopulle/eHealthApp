import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { auth, firestore } from "../firebaseConfig";
import { useUserInfo } from "../context/userContext";
import { doc, updateDoc } from "firebase/firestore";
import { AntDesign } from '@expo/vector-icons';

const PatientProfile = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [image, setImage] = useState(null);
  const { userInfo, logout } = useUserInfo();
  const [isValid, setIsValid] = useState(true); // New state for form validation
  const [errorMessage, setErrorMessage] = useState('');

  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
       <View style={styles.topButton}> 
       <Pressable   onPress={() => handleLogout()} >
        <View style={styles.innerButtonConatiner}>
        <AntDesign name="logout" size={28} color="black" />
          <Text style={styles.buttonText}>Logout</Text>
        </View>
       </Pressable>
       </View>
      ),
    });
  }, [navigation, logout]);

  useEffect(() => {
    console.log("the user Info received from global state inside patient profile is",userInfo);
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setRole(userInfo.role);
      // Fetch the image from Firestore if it exists
      if (userInfo.image) {
        setImage(userInfo.image);
      }
    }
  }, [userInfo]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const updateProfile = async () => {
    if (!name || !email || !role) {
      setIsValid(false);
      setErrorMessage('All fields are required'); // Set error message
      return; // Stop the function if validation fails
    }
    setIsValid(true);
    setErrorMessage('');
    try {
      const userRef = doc(firestore, "users", userInfo.userID);
      await updateDoc(userRef, {
        hospitalName,
        speciality,
        image,
      });
      alert("Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      alert("Error updating profile.");
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.navigate("SignIn");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <MaterialIcons name="account-circle" size={100} color="#bdbdbd" />
          )}
          <TouchableOpacity onPress={pickImage} style={styles.iconContainer}>
            <MaterialIcons
              name="edit"
              size={24}
              color="#ffffff"
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Patient Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            // editable={false}
          />
          <Text style={styles.label}>Patient Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            // editable={false}
          />
          <Text style={styles.label}>Role</Text>
          <TextInput
            value={role}
            onChangeText={setRole}
            style={styles.input}
            editable={false}
          />
        </View>
        <View style={styles.buttonContainer}></View>
        {!isValid && <Text style={styles.errorText}>{errorMessage}</Text>}
        <PrimaryButton buttonText="Update Profile" onPress={updateProfile} />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageContainer: {
    alignItems: "center",
    position: "relative", // Add this to position your edit icon absolutely
    marginBottom: 20,
  },
  iconContainer: {
    position: "absolute", // Position the icon over the image
    right: 62,
    top: 17,
    backgroundColor: "red", // Your icon background color
    borderRadius: 20, // Circular background
    padding: 4,
  },
  editIcon: {
    // If you need any styling for the icon
  },
  imagePicker: {
    marginTop: 10,
    padding: 10,
    alignItems: "center",
  },
  imagePickerText: {
    color: "#0000ff",
  },
  infoContainer: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    width: 250,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#ebebeb",
  },
  buttonContainer: {
    marginTop: 30,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  topButton:{
    width:100,
    marginRight:20
  },
  innerButtonConatiner:{
    flexDirection:"row",
    justifyContent:"space-around"
  },
  buttonText:{
     fontSize:18,
     fontWeight:"bold",
     color:"black"
  }
});

export default PatientProfile;
