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
  Button,
  Pressable,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AntDesign } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import PrimaryButton from "../components/PrimaryButton";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { auth, firestore } from "../firebaseConfig";
import { useUserInfo } from "../context/userContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const DoctorProfile = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [image, setImage] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [phoneNumber, setPhoneNumber] = useState("");

  const { userInfo, logout } = useUserInfo();
  const hours = Array.from({ length: 24 }, (_, index) => index);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.topButton}>
          <Pressable onPress={() => handleLogout()}>
            <View style={styles.innerButtonConatiner}>
              <AntDesign name="logout" size={28} color="black" />
              <Text style={styles.buttonText}>Logout</Text>
            </View>
          </Pressable>
        </View>
      ),
    });
  }, [navigation, logout]);
  // useEffect(() => {
  //   if (userInfo) {
  //     console.log(
  //       "The user Info we received inside doctor Profile Page is",
  //       userInfo
  //     );
  //     setName(userInfo.name);
  //     setEmail(userInfo.email);
  //     setRole(userInfo.role);
  //     setHospitalName(userInfo.hospitalName);
  //     // setAvailability(userInfo.availability);
  //     setSpeciality(userInfo.speciality);
  //     // Fetch the image from Firestore if it exists
  //     if (userInfo.image) {
  //       setImage(userInfo.image);
  //     }
  //   }
  // }, [userInfo]);
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        // Replace this with your actual database fetching logic
        const docRef = doc(firestore, "users", userInfo.userID);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        console.log("The Doc Snap Got from Db is >>>", data);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name);
          setEmail(data.email);
          setHospitalName(data.hospitalName);
          setSpeciality(data.speciality);
          setImage(data.image);
          setRole(data.role);

          // Handling dates and times
          if (data.startDate) {
            setStartDate(data.startDate);
          }
          if (data.endDate) {
            setEndDate(data.endDate);
          }
          if (data.formattedStartTime) {
            const [hours, minutes] = data.formattedStartTime.split(":");
            setStartTime(new Date(0, 0, 0, hours, minutes));
          }
          if (data.formattedEndTime) {
            const [hours, minutes] = data.formattedEndTime.split(":");
            setEndTime(new Date(0, 0, 0, hours, minutes));
          }
          if (data.phoneNumber) {
            setPhoneNumber(data.phoneNumber);
          }
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };

    fetchDoctorDetails();
  }, []);

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

  const isPhoneNumberValid = (number) => {
    const minPhoneNumberLength = 11;
    return number.length >= minPhoneNumberLength;
  };

  const updateProfile = async () => {
    const formattedDate = selectedDate;
    const formattedStartTime = `${startTime.getHours()}:00`; // Format time as 'HH:MM'
    const formattedEndTime = `${endTime.getHours()}:00`; // Format time as 'HH:MM'
    if (
      !name ||
      !email ||
      !role ||
      !hospitalName ||
      !speciality ||
      !startDate ||
      !endDate ||
      !formattedStartTime ||
      !formattedEndTime ||
      !phoneNumber
    ) {
      setIsValid(false);
      setErrorMessage("All fields are required"); // Set error message
      return; // Stop the function if validation fails
    }
    if (!isPhoneNumberValid(phoneNumber)) {
      setIsValid(false);
      setErrorMessage("Phone number must be at least 11 digits.");
      return;
    }

    setIsValid(true);
    setErrorMessage("");
    try {
      const userRef = doc(firestore, "users", userInfo.userID);
      await updateDoc(userRef, {
        hospitalName,
        speciality,
        image,
        startDate,
        endDate,
        formattedStartTime,
        formattedEndTime,
        phoneNumber,
      });
      alert("Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      alert("Error updating profile.");
      console.error("Error updating profile:", error);
    }
  };
  const onStartDateConfirm = (day) => {
    setStartDatePickerVisible(false);
    setStartDate(day.dateString);
  };

  const onEndDateConfirm = (day) => {
    setEndDatePickerVisible(false);
    if (day.dateString >= startDate) {
      setEndDate(day.dateString);
    } else {
      alert("End date must be after start date.");
    }
  };
  const getMarkedDates = (startDate, endDate) => {
    let dates = {};
    let current = moment(startDate);
    const end = moment(endDate);

    while (current.diff(end) <= 0) {
      const dateString = current.format("YYYY-MM-DD");
      dates[dateString] = {
        selected: true,
        color:
          startDate === dateString || endDate === dateString
            ? "green"
            : "lightgreen",
        textColor: "white",
      };
      current.add(1, "days");
    }
    return dates;
  };

  const handleLogout = async () => {
    await logout();
    navigation.navigate("SignIn");
  };
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 150,
      }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
    >
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
          <TextInput
            value={role}
            onChangeText={setRole}
            style={styles.input}
            editable={false}
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
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={(text) => {
              setIsValid(true); // Reset validation
              setPhoneNumber(text.replace(/[^0-9]/g, "")); // Allow numbers only
            }}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
            style={styles.input}
          />
          {!isPhoneNumberValid(phoneNumber) && phoneNumber.length > 0 && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Please enter a valid phone number with minimum 11 digits.
              </Text>
            </View>
          )}
          <Text style={styles.label}>Availability</Text>
          <View style={styles.availabilityContainer}>
            <View style={styles.dateRangeContainer}>
              <Pressable
                style={styles.selectDate}
                onPress={() => setStartDatePickerVisible(true)}
              >
                <Text>
                  {startDate ? `Start Date: ${startDate}` : "Select Start Date"}
                </Text>
              </Pressable>
              {isStartDatePickerVisible && (
                <Calendar
                  onDayPress={onStartDateConfirm}
                  markedDates={getMarkedDates(startDate, endDate)}
                  minDate={moment().format("YYYY-MM-DD")}
                />
              )}

              <Pressable
                style={styles.selectDate}
                onPress={() => setEndDatePickerVisible(true)}
              >
                <Text>
                  {endDate ? `End Date: ${endDate}` : "Select End Date"}
                </Text>
              </Pressable>
              {isEndDatePickerVisible && (
                <Calendar
                  onDayPress={onEndDateConfirm}
                  markedDates={getMarkedDates(startDate, endDate)}
                  minDate={startDate || moment().format("YYYY-MM-DD")}
                />
              )}
            </View>
            <Text style={styles.label}>Start Time</Text>
            <View style={styles.timePicker}>
              <Picker
                selectedValue={startTime.getHours()}
                style={styles.timePicker}
                onValueChange={(itemValue) => {
                  const newStartTime = new Date(startTime);
                  newStartTime.setHours(itemValue);
                  newStartTime.setMinutes(0);
                  setStartTime(newStartTime);
                }}
                mode="dropdown"
              >
                {hours.map((hour) => (
                  <Picker.Item key={hour} label={`${hour}:00`} value={hour} />
                ))}
              </Picker>
            </View>
            <Text style={styles.label}>End Time</Text>
            <View style={styles.timePicker}>
              <Picker
                selectedValue={endTime.getHours()}
                onValueChange={(itemValue) => {
                  const newEndTime = new Date(endTime);
                  newEndTime.setHours(itemValue);
                  newEndTime.setMinutes(0);
                  setEndTime(newEndTime);
                }}
                mode="dropdown"
              >
                {hours.map((hour) => (
                  <Picker.Item key={hour} label={`${hour}:00`} value={hour} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          {!isValid && <Text style={styles.errorText}>{errorMessage}</Text>}
          <PrimaryButton buttonText="Update Profile" onPress={updateProfile} />
        </View>
      </KeyboardAvoidingView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingBottom: 50,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageContainer: {
    alignItems: "center",
    position: "relative",
    marginBottom: 20,
  },
  iconContainer: {
    position: "absolute",
    right: 62,
    top: 17,
    backgroundColor: "red",
    borderRadius: 20,
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
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  calendarContainer: {
    marginBottom: 20,
  },
  selectDate: {
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 6,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  timePicker: {
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 6,
    marginBottom: 8,
  },
  topButton: {
    width: 100,
    marginRight: 20,
  },
  innerButtonConatiner: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  errorContainer: {
    width: 250,
  },
});

export default DoctorProfile;
