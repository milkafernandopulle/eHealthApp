import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { auth, firestore } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUserInfo } from "../context/userContext";

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserInfo } = useUserInfo();

  const handleSignIn = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User is signed in
        const user = userCredential.user;
        console.log("User info inside signIn.js:", user);
        // Retrieve user info from Firestore
        getDoc(doc(firestore, "users", user.uid)).then((docSnap) => {
          if (docSnap.exists()) {
            const userInfo = docSnap.data();
            console.log("User info:", userInfo);
            // Redirect based on role
            // ... in handleSignIn function
            // if (userInfo.role === "doctor") {
            //   // Navigate to Doctor's dashboard
            //   navigation.navigate("Main", { screen: 'DoctorDashboard', params: { userName: userInfo.name } });
            // } else if (userInfo.role === "patient") {
            //   // Navigate to Patient's dashboard
            //   navigation.navigate("Main", { screen: 'PatientDashboard', params: { userName: userInfo.name } });
            // }
            setUserInfo({ role: userInfo.role, userID: user.uid,email:userInfo.email,name:userInfo.name }); // Set the user role in context
            navigation.navigate("Main");
          } else {
            console.log("No user data found in Firestore");
          }
        });
      })
      .catch((error) => {
        // Handle errors here
        console.log("error: " + error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Hi! Welcome back, you’ve been missed</Text>

      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        placeholder="Password"
      />

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <PrimaryButton buttonText="Sign In" onPress={handleSignIn} />

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Or</Text>
        <View style={styles.divider} />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.signUpText}>Don’t have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
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
});

export default SignIn;
