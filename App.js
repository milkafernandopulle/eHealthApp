import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PatientDashboard from "./screens/PatientDashboard";
import SignIn from "./screens/Signin";
import SignUp from "./screens/Signup";
import DoctorDashboard from "./screens/DcotorDashboard";
import { UserProvider, useUserInfo, useUserRole } from "./context/userContext";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Chat from "./screens/Chat";
import Appointment from "./screens/BookingAppointment";
import Home from "./screens/Home";
import BookingList from "./screens/BookingList";
import DoctorProfile from "./screens/DcotorProfile";
import BookingConfirmation from "./screens/BookingConfimation";
import BookingDetail from "./screens/bookingDetail";
import Prescription from "./screens/Prescription";
import PatientPrescription from "./screens/PatientPrescription";
import { Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PatientProfile from "./screens/PatientProfile";
import ChatList from "./screens/ChatList";
import Payment from "./screens/Payment";
import Snackbar from 'react-native-snackbar';
const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const PatientTabs = createBottomTabNavigator();
const DoctorTabs = createBottomTabNavigator();

function DoctorTabNavigator() {
  const { userInfo } = useUserInfo();
  console.log("User Info inside bottom Tab Navigator", userInfo);
  useEffect(() => {
    // Assuming userInfo.speciality, userInfo.hospitalName are the required fields
    if (!userInfo.speciality || !userInfo.hospitalName) {
      Snackbar.show({
        text: 'Please complete your profile',
        duration: Snackbar.LENGTH_LONG,
        action: {
          text: 'UPDATE',
          textColor: 'green',
          onPress: () => { /* Navigate to DoctorProfile screen */ },
        },
      });
    }
  }, [userInfo]);
  return (
    <DoctorTabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Show Booking") {
            iconName = focused
              ? "ios-information-circle"
              : "ios-information-circle-outline";
            // Return the icon component
            return <MaterialIcons name="dashboard" size={size} color={color} />;
          } else if (route.name === "ChatList") {
            return <Ionicons name="chatbox" size={24} color={color} />;
          } else if (route.name === "DoctorProfile") {
            return <FontAwesome name="user-circle" size={24} color={color} />;
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
      }}
    >
      <DoctorTabs.Screen
        name="Show Booking"
        component={BookingList}
        initialParams={{ UserId: userInfo.userID, role: userInfo.role }}
      />
      {/* <DoctorTabs.Screen
        name="Chat"
        component={Chat}
        initialParams={{ patientUserId: userInfo.userID, role: userInfo.role }}
      /> */}
      <DoctorTabs.Screen
        name="ChatList"
        component={ChatList}
        initialParams={{ UserId: userInfo.userID, role: userInfo.role }}
      />
      <DoctorTabs.Screen name="DoctorProfile" component={DoctorProfile} />

      {/* Add other tabs for doctor here */}
    </DoctorTabs.Navigator>
  );
}

function PatientTabNavigator() {
  const { userInfo } = useUserInfo();
  const navigation = useNavigation();
  console.log("User Info Inside PatientTabNavigator is >>>>>", userInfo);
  return (
    <PatientTabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "PatientDashboard") {
            iconName = focused
              ? "ios-information-circle"
              : "ios-information-circle-outline";
            // Return the icon component
            return <MaterialIcons name="dashboard" size={size} color={color} />;
          } else if (route.name === "ChatList") {
            return <Ionicons name="chatbox" size={24} color={color} />;
          } else if (route.name === "Show Booking") {
            return (
              <MaterialCommunityIcons
                name="calendar-check"
                size={24}
                color={color}
              />
            );
          } else if (route.name === "Prescription") {
            return <Ionicons name="ios-medkit-sharp" size={24} color={color} />;
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
      }}
    >
      <PatientTabs.Screen
        name="PatientDashboard"
        component={PatientDashboard}
        options={{
          headerShown: true, // Ensure the header is shown for this screen
          title: "Patient Dashboard", // Set the title for the header
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("PatientProfile");
              }}
              style={{ marginRight: 22 }}
            >
              {userInfo.role === "patient" &&
                (userInfo.image ? (
                  <Image
                    source={{ uri: userInfo.image }}
                    style={{ height: 30, width: 30, borderRadius: 30 }}
                  />
                ) : (
                  <FontAwesome name="user-circle-o" size={24} color="black" />
                ))}
            </TouchableOpacity>
          ),
        }}
      />
      <PatientTabs.Screen
        name="Show Booking"
        component={BookingList}
        initialParams={{ UserId: userInfo.userID, role: userInfo.role }}
      />
      <PatientTabs.Screen name="Prescription" component={PatientPrescription} />
      <PatientTabs.Screen
        name="ChatList"
        component={ChatList}
        initialParams={{ UserId: userInfo.userID, role: userInfo.role }}
      />
      {/* <DoctorTabs.Screen name="Chat" component={Chat}  initialParams={{ doctorUserId: userInfo.userID,role:userInfo.role }} /> */}
      {/* Add other tabs for patient here */}
    </PatientTabs.Navigator>
  );
}

function AuthFlow() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignIn} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
    </AuthStack.Navigator>
  );
}

function MainFlow() {
  const { userInfo } = useUserInfo();
  console.log("user info: " + JSON.stringify(userInfo));
  return userInfo.role === "doctor" ? (
    <DoctorTabNavigator />
  ) : (
    <PatientTabNavigator />
  );
}

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <MainStack.Navigator screenOptions={{ headerShown: false }}>
          <MainStack.Screen name="Auth" component={AuthFlow} />
          <MainStack.Screen name="Main" component={MainFlow} />
          <MainStack.Screen name="bookAppointment" component={Appointment} />
          <MainStack.Screen name="bookingList" component={BookingList} />
          <MainStack.Screen name="bookingDetail" component={BookingDetail} />
          <MainStack.Screen
            name="BookingConfirmation"
            component={BookingConfirmation}
          />
          <MainStack.Screen name="PresCription" component={Prescription} />
          <MainStack.Screen name="PatientProfile" component={PatientProfile} />
          <MainStack.Screen name="Chat" component={Chat} />
          <MainStack.Screen name="Payment" component={Payment} />
        </MainStack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
