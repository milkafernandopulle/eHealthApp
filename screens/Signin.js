import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import * as SecureStore from 'expo-secure-store';
import PrimaryButton from "../components/PrimaryButton";
import { auth, firestore } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUserInfo } from "../context/userContext";
import Heading from "../components/heading";
import { validateEmail } from "../utils/validation";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { setUserInfo } = useUserInfo();
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const handleSignIn = async () => {
    setErrors({}); // Reset errors state
    let newErrors = {};
    // Validate inputs
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await SecureStore.setItemAsync('userToken', userCredential.user.accessToken);
      const userDoc = await getDoc(
        doc(firestore, "users", userCredential.user.uid)
      );
      if (userDoc.exists()) {
        const userInfo = userDoc.data();
        console.log("user Info inside SignIn Page is", userInfo);
        setUserInfo({
          role: userInfo?.role,
          userID: userCredential?.user.uid,
          email: userInfo?.email,
          name: userInfo?.name,
          availability: userInfo?.availability,
          hospitalName: userInfo?.hospitalName,
          image: userInfo?.image,
          speciality: userInfo?.speciality,
        });
        await SecureStore.setItemAsync('userInfo', JSON.stringify({
          role: userInfo?.role,
          userID: userCredential?.user.uid,
          email: userInfo?.email,
          name: userInfo?.name,
          availability: userInfo?.availability,
          hospitalName: userInfo?.hospitalName,
          image: userInfo?.image,
          speciality: userInfo?.speciality,
        }))
        navigation.navigate("Main");
        // if (userInfo.role === 'doctor') {
        //   navigation.navigate("doctorTabs");
        // } else if (userInfo.role === 'patient') {
        //   navigation.navigate("patientTabs");
        // }
        setEmail("");
        setPassword("");
      } else {
        console.log("No user data found in Firestore");
        setErrors({ firebase: "No user data found." });
      }
    } catch (error) {
      setErrors({ password: "Please Enter Correct Password." });
      console.log("Error: " + error);
    }
    }
  };

  const handleNavigate =()=>{
   navigation.navigate("SignUp");
   setEmail("");
   setPassword("");
   setErrors("");
  }

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
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>
            Hi! Welcome back, you’ve been missed
          </Text>

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
          <View style={styles.errorContainer}>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          {errors.firebase && (
            <Text style={styles.errorText}>{errors.firebase}</Text>
          )}
          </View>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          <PrimaryButton buttonText="Sign In" onPress={handleSignIn} />

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.divider} />
          </View>
          <TouchableOpacity onPress={handleNavigate}>
            <Text style={styles.signUpText}>
              Don’t have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
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
  input: {
    height: 50,
    borderColor: "gray",
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: "center", // Centers the dropdown icon vertically
    paddingHorizontal: 10,
    // The background color for the dropdown needs to be set for Android
    backgroundColor: Platform.OS === "android" ? "#fff" : undefined,
  },
  forgotPassword: {
    color: "blue",
    textAlign: "right",
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  signInButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
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
  signUpText: {
    color: "blue",
    textAlign: "center",
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
  errorContainer:{
    height:50
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
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 35,
    top:  33,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});

export default SignIn;
