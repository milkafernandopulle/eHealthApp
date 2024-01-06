import React, { useState, useEffect } from "react";
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
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { auth, firestore } from "../firebaseConfig";
import { useUserInfo } from "../context/userContext";
import { doc, updateDoc } from "firebase/firestore";

const DoctorProfile = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [availability, setAvailability] = useState("");
  const [image, setImage] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { userInfo } = useUserInfo();

  useEffect(() => {
    if (userInfo) {
      console.log(
        "The user Info we received inside doctor Profile Page is",
        userInfo
      );
      setName(userInfo.name);
      setEmail(userInfo.email);
      setRole(userInfo.role);
      setHospitalName(userInfo.hospitalName);
      setAvailability(userInfo.availability);
      setSpeciality(userInfo.speciality);
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
    if (!name || !email || !role || !hospitalName || !speciality || !availability) {
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
        availability,
      });
      alert("Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      alert("Error updating profile.");
      console.error("Error updating profile:", error);
    }
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
          <Text style={styles.label}>Name</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} />
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <Text style={styles.label}>Role</Text>
          <TextInput value={role} onChangeText={setRole} style={styles.input} />
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
          <Text style={styles.label}>Availability</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioContainer}
              onPress={() => setAvailability("Yes")}
            >
              <View
                style={[
                  styles.outerCircle,
                  availability === "Yes" && styles.selectedOuterCircle,
                ]}
              >
                {availability === "Yes" && <View style={styles.innerCircle} />}
              </View>
              <Text style={styles.radioText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioContainer}
              onPress={() => setAvailability("No")}
            >
              <View
                style={[
                  styles.outerCircle,
                  availability === "No" && styles.selectedOuterCircle,
                ]}
              >
                {availability === "No" && <View style={styles.innerCircle} />}
              </View>
              <Text style={styles.radioText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonContainer}>
        {!isValid && <Text style={styles.errorText}>{errorMessage}</Text>}
        <PrimaryButton buttonText="Update Profile" onPress={updateProfile} />
        </View>
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
  radioGroup: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  outerCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedOuterCircle: {
    borderColor: "blue", // or another color that indicates selection
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "blue", // or another color that indicates selection
  },
  radioText: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default DoctorProfile;
