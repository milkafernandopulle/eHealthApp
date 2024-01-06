import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { firestore } from "../firebaseConfig";

const ChatListItem = ({ chat, onPress, userId }) => {
  const { opponentDetails, lastMessage } = chat;
  console.log("Opponent Detail is>>", opponentDetails);
  return (
    <TouchableOpacity onPress={onPress} style={styles.chatItem}>
      <Image source={{ uri: opponentDetails.image }} style={styles.avatar} />
      <View style={styles.chatDetails}>
        <Text style={styles.userName}>{opponentDetails.name}</Text>
        {opponentDetails.speciality && (
          <Text style={styles.lastMessage}>{opponentDetails.speciality}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    padding: 10,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "white", // Set a background color for the item
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 8,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Decrease the shadow opacity
    shadowRadius: 2,
    // Elevation for Android
    elevation: 1, // Decrease the elevation
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatDetails: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: "grey",
  },
  chatMeta: {
    alignItems: "flex-end",
  },
  time: {
    fontSize: 12,
    color: "grey",
  },
  unreadBadge: {
    marginTop: 4,
    backgroundColor: "#34B7F1", // Use WhatsApp green color or any color you prefer
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadCountText: {
    color: "white",
    fontSize: 12,
  },
});

export default ChatListItem;
