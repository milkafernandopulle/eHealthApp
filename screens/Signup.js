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
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Doctor", value: "doctor" },
    { label: "Patient", value: "patient" },
  ]);

  const handleSignUp = () => {
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role:", value); // Assuming 'value' holds the role
    console.log("Terms Accepted:", termsAccepted);
    // Add any additional logic for handling sign-up here
  };

  return (
    <View style={styles.container}>
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
      <DropDownPicker
        placeholder="Select Your Role"
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
      />
      <TouchableOpacity
        style={[
          styles.checkboxContainer,
          open ? { marginTop: 100 } : {},
        ]}
        onPress={() => setTermsAccepted(!termsAccepted)}
      >
        <MaterialCommunityIcons 
          name={termsAccepted ? 'checkbox-marked' : 'checkbox-blank-outline'} 
          size={24} 
          color={termsAccepted ? 'blue' : 'grey'} 
        />
        <Text style={styles.termsText}>Agree with Terms & Condition</Text>
      </TouchableOpacity>

      <PrimaryButton buttonText="Sign Up"  onPress={handleSignUp} />

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Or</Text>
        <View style={styles.divider} />
      </View>
      <TouchableOpacity>
        <Text style={styles.signInText}>Already have an account ? Sign In</Text>
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
    marginTop:8
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
    marginLeft:8
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
});

export default SignUp;
