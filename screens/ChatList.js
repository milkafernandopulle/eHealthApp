import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { firestore } from "../firebaseConfig";
import ChatListItem from "./ChatListItem";

// Dummy data for chats
const chatsData = [
  {
    id: "1",
    userName: "John Doe",
    avatarUri: "https://via.placeholder.com/150",
    lastMessage: "Hey, how are you?",
    time: "15:00",
    unreadCount: 2,
  },
  {
    id: "2",
    userName: "John Doe",
    avatarUri: "https://via.placeholder.com/150",
    lastMessage: "Hey, how are you?",
    time: "15:00",
    unreadCount: 2,
  },
  {
    id: "3",
    userName: "John Doe",
    avatarUri: "https://via.placeholder.com/150",
    lastMessage: "Hey, how are you?",
    time: "15:00",
    unreadCount: 2,
  },
  {
    id: "4",
    userName: "John Doe",
    avatarUri: "https://via.placeholder.com/150",
    lastMessage: "Hey, how are you?",
    time: "15:00",
    unreadCount: 2,
  },
  {
    id: "5",
    userName: "John Doe",
    avatarUri: "https://via.placeholder.com/150",
    lastMessage: "Hey, how are you?",
    time: "15:00",
    unreadCount: 2,
  },
  {
    id: "6",
    userName: "John Doe",
    avatarUri: "https://via.placeholder.com/150",
    lastMessage: "Hey, how are you?",
    time: "15:00",
    unreadCount: 2,
  },
  {
    id: "7",
    userName: "John Doe",
    avatarUri: "https://via.placeholder.com/150",
    lastMessage: "Hey, how are you?",
    time: "15:00",
    unreadCount: 2,
  },
  {
    id: "8",
    userName: "John Doe",
    avatarUri: "https://via.placeholder.com/150",
    lastMessage: "Hey, how are you?",
    time: "15:00",
    unreadCount: 2,
  },
  {
    id: "9",
    userName: "John Doe",
    avatarUri: "https://via.placeholder.com/150",
    lastMessage: "Hey, how are you?",
    time: "15:00",
    unreadCount: 2,
  },
  {
    id: "10",
    userName: "John Doe",
    avatarUri: "https://via.placeholder.com/150",
    lastMessage: "Hey, how are you?",
    time: "15:00",
    unreadCount: 2,
  },
  {
    id: "11",
    userName: "John Doe",
    avatarUri: "https://via.placeholder.com/150",
    lastMessage: "Hey, how are you?",
    time: "15:00",
    unreadCount: 2,
  },
  {
    id: "12",
    userName: "John Doe",
    avatarUri: "https://via.placeholder.com/150",
    lastMessage: "Hey, how are you?",
    time: "15:00",
    unreadCount: 2,
  },
  // ... more chat data
];

const ChatList = ({ navigation, route }) => {
  const [chats, setChats] = useState([]);
  const { UserId, role } = route.params;
  console.log("data receve through params is", route.params);
  console.log("The userId and role inside chat List is", UserId, role);
  useEffect(() => {
    const chatsRef = collection(firestore, "chats");
    const q = query(chatsRef, where(role === "patient" ? "patientId" : "doctorId", "==", UserId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatsData = [];
      querySnapshot.forEach((doc) => {
        chatsData.push({ id: doc.id, ...doc.data() });
      });
      fetchOpponentDetails(chatsData);
    });

    return () => unsubscribe();
  }, [UserId, role]);

  const fetchOpponentDetails = async (chatsData) => {
    const chatsWithOpponentDetails = await Promise.all(
      chatsData.map(async (chat) => {
        // Determine the opponent's ID based on the current user's role
        const opponentId = role === 'doctor' ? chat.patientId : chat.doctorId;

        // Fetch the opponent's details
        const opponentRef = doc(firestore, 'users', opponentId);
        const opponentDoc = await getDoc(opponentRef);

        // Combine chat data with opponent details
        if (opponentDoc.exists()) {
          return {
            ...chat,
            opponentDetails: opponentDoc.data(),
          };
        }
        return chat; // In case the opponent doesn't exist, return the chat data as is
      })
    );

    setChats(chatsWithOpponentDetails); // Update the state with the new chats data including opponent details
  };

  console.log("The data inside Chat List State is", chats);

  const handlePressChat = (chatId) => {
    console.log(chatId);
    // Navigate to the conversation screen with params
    navigation.navigate("Chat", { chatId });
  };

  return (
    <View style={styles.rootContainer}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          console.log("The Item inside renderer...", item);
          return (
            <ChatListItem
              chat={item}
              userId={UserId}
              onPress={() => handlePressChat(item.id)}
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    width: "100%",
  },
});

export default ChatList;
