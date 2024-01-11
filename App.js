import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PatientDashboard from "./screens/PatientDashboard";
import { LogBox } from 'react-native';
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
import CustomToast from "./components/CustomToast";
import Loading from "./components/Loading";
import ViewPrescription from "./screens/ViewPrescription";
const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const PatientTabs = createBottomTabNavigator();
const DoctorTabs = createBottomTabNavigator();
LogBox.ignoreAllLogs(); 
function DoctorTabNavigator() {
  const [isVisible, setIsVisible] = useState(true);
  const { userInfo, setUserInfo } = useUserInfo();
  console.log("User Info inside bottom Tab Navigator", userInfo);
  useEffect(() => {
    if (!userInfo.speciality || !userInfo.hospitalName) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [userInfo, setUserInfo]);
  return (
    <>
      <DoctorTabs.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Show Booking") {
              iconName = focused
                ? "ios-information-circle"
                : "ios-information-circle-outline";
              // Return the icon component
              return (
                <MaterialIcons name="dashboard" size={size} color={color} />
              );
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
      <CustomToast visible={isVisible} message="Please complete your" />
    </>
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

function MainFlow() {
  const { userInfo } = useUserInfo();
  if (!userInfo) {
    return <Loading />;
  }
  return userInfo.role === "doctor" ? (
    <DoctorTabNavigator />
  ) : (
    <PatientTabNavigator />
  );
}

export default function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [isUserInfoLoaded, setIsUserInfoLoaded] = useState(false);
  useEffect(() => {
    async function loadUserInfo() {
      const storedUserInfo = await SecureStore.getItemAsync("userInfo");
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
      setIsUserInfoLoaded(true);
    }

    loadUserInfo();
  }, []);

  if (!isUserInfoLoaded) {
    return <Loading />;
  }

  return (
    <UserProvider>
      <NavigationContainer>
        {userInfo ? (
          <MainStack.Navigator screenOptions={{ headerShown: false }}>
            <MainStack.Screen name="Main" component={MainFlow} />
            <MainStack.Screen name="bookAppointment" component={Appointment} />
            <MainStack.Screen name="bookingList" component={BookingList} />
            <MainStack.Screen name="bookingDetail" component={BookingDetail} />
            <MainStack.Screen
              name="BookingConfirmation"
              component={BookingConfirmation}
            />
             <MainStack.Screen name="PatientProfile" component={PatientProfile} options={{ headerShown: true }} />
            <MainStack.Screen name="Prescription" component={Prescription} />
            <MainStack.Screen name="Chat" component={Chat} />
            <MainStack.Screen name="Payment" component={Payment} />
            <AuthStack.Screen name="SignIn" component={SignIn} />
            <AuthStack.Screen name="SignUp" component={SignUp} />
            <AuthStack.Screen name="ViewPrescription" component={ViewPrescription} />
            <AuthStack.Screen name="EditPrescription" component={Prescription} />
          </MainStack.Navigator>
        ) : (
          <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="SignIn" component={SignIn} />
            <AuthStack.Screen name="SignUp" component={SignUp} />
            <MainStack.Screen name="Main" component={MainFlow} />
            <MainStack.Screen name="PatientProfile" component={PatientProfile} options={{ headerShown: true }} />
            <AuthStack.Screen name="ViewPrescription" component={ViewPrescription} />
          </AuthStack.Navigator>
        )}
      </NavigationContainer>
    </UserProvider>
  );
}
