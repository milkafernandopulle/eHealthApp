import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isUserInfoLoaded, setIsUserInfoLoaded] = useState(false);
  useEffect(() => {
    const loadUserInfo = async () => {
      setIsUserInfoLoaded(true)
      try {
        const storedUserInfo = await SecureStore.getItemAsync('userInfo');
        if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
          setIsUserInfoLoaded(false)
        }
      } catch (e) {
        console.log("Error reading user info: ", e);
        setIsUserInfoLoaded(false)
      }
    };

    loadUserInfo();
  }, []);

  const persistUserInfo = async (userInfo) => {
    try {
      const jsonValue = JSON.stringify(userInfo);
      await SecureStore.setItemAsync('userInfo', jsonValue);
    } catch (e) {
      console.log("Error saving user info: ", e);
    }
  };
  
  const handleSetUserInfo = (info) => {
    setUserInfo(info);
    persistUserInfo(info);
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('userInfo');
      await SecureStore.deleteItemAsync('userToken');
      setUserInfo(null);
    } catch (e) {
      // removing error
      console.log("Error removing user info: ", e);
    }
  };

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo: handleSetUserInfo,logout,isUserInfoLoaded  }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserInfo = () => useContext(UserContext);
