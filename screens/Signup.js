import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  ImageBackground,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import firebase, { firestore } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import Heading from "../components/heading";
import { validateEmail, validatePassword } from "../utils/validation";
import ConfirmationAlert from "../components/ConfimationAlert";
import AlertConfirmation from "../components/ConfimationAlert";
const SignUp = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [items, setItems] = useState([
    { label: "Doctor", value: "doctor" },
    { label: "Patient", value: "patient" },
  ]);
  const hideSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  // Validation functions
  const validateForm = () => {
    let newErrors = {};

    // Check if all fields are filled
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    if (!value) newErrors.role = "Role is required.";

    // If all fields are filled, check for specific validation
    if (!newErrors.email && !validateEmail(email)) {
      newErrors.email = "Please enter a valid email.";
    }
    if (!newErrors.password && !validatePassword(password)) {
      newErrors.password =
        "Password must be at least 6 characters long, include an uppercase letter and a special character.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    setErrors((prevErrors) => ({ ...prevErrors, firebase: undefined }));
    console.log("Attempting to sign up user with email:", email);
    if (validateForm()) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("Firebase auth user created:", userCredential.user);
          const user = userCredential.user;
          // Store user info in Firestore
          return setDoc(doc(firestore, "users", user.uid), {
            name: name,
            email: email,
            role: value,
          });
        })
        .then(() => {
          console.log("User info saved in Firestore");
          setShowSuccessMessage(true);
          // navigation.navigate("SignIn");
        })
        .catch((error) => {
          console.error("Error in user sign-up:", error.message);
          setErrors({ firebase: error.message });
        });
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.pexels.com/photos/48604/pexels-photo-48604.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      }}
      style={styles.backgroundImage}
      resizeMode="cover" // Cover the entire screen
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Heading />
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Fill your information below to register your account.
            </Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            placeholder="Name"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <TextInput
            style={styles.passwordInput}
            onChangeText={setPassword}
            value={password}
            secureTextEntry={passwordVisibility}
            placeholder="Password"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisibility(!passwordVisibility)}
          >
            <MaterialCommunityIcons
              name={passwordVisibility ? "eye-off" : "eye"}
              size={24}
              color="grey"
            />
          </TouchableOpacity>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          <DropDownPicker
            placeholder="Select Your Role"
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
          />
          {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
          {errors.firebase && (
            <Text style={styles.errorText}>{errors.firebase}</Text>
          )}
          <View style={styles.buttonContainer}>
            <PrimaryButton buttonText="Sign Up" onPress={handleSignUp} />
          </View>
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.divider} />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.signInText}>
              Already have an account ? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {showSuccessMessage && (
       <AlertConfirmation
       visible={showSuccessMessage}
       message="You have been registered successfully!"
       buttonText="Sign In"
       onButtonClick={() => {
         hideSuccessMessage();
         navigation.navigate("SignIn");
       }}
     />
    )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 8,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: Platform.OS === "android" ? "#fff" : undefined,
  },
  checkbox: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  termsText: {
    color: "blue",
    marginLeft: 8,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "black",
  },
  dividerText: {
    marginHorizontal: 10,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  socialIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  signInText: {
    color: "blue",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 18,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.15)", // Adjust the last value for more/less opacity
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    textAlign: "left",
  },
  passwordInput: {
    height: 50,
    borderColor: "gray",
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: Platform.OS === "android" ? "#fff" : undefined,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 30, // Add padding to make room for the icon inside the text input
    position:"relative"
  },
  eyeIcon: {
    position: "absolute",
    right: 35,
    top:95,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});

export default SignUp;
