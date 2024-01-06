import React, { useEffect, useState,useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,Keyboard  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase, ref, push, onValue, off, set } from 'firebase/database';
import { useUserInfo } from '../context/userContext';
import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc,onSnapshot, runTransaction  } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
const Chat = ({route}) => {
  const [inputText, setInputText] = useState('');
  const { userInfo } = useUserInfo();
  const {chatId} = route.params;
  const [bottomPadding, setBottomPadding] = useState(0);
  const flatListRef = useRef(null);
  const [messages, setMessages] = useState([]);
  // const { userId, otherUserId } = route.params;
  console.log("On Chat Screen 1",chatId);
  console.log("User Info receives from the Context is",userInfo);
  // console.log("On Chat Screen",route.params.userId);
  useEffect(() => {
     console.log("Componed Mounted",flatListRef);
    //  flatListRef.current?._hasTriggeredInitialScrollToIndex(true);
      flatListRef.current?.scrollToEnd({ animated: true });
  }, []);
  
   // This effect handles the keyboard show and hide events
   useEffect(() => {
    // Listen for when the keyboard shows and hides
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setBottomPadding(e.endCoordinates.height); // Set the padding to the keyboard height
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setBottomPadding(0); // Reset the padding when the keyboard hides
      }
    );

    return () => {
      // Clean up the listeners
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

const sendMessage = async () => {
  if (inputText.trim().length > 0) {
    // Create the message object without the serverTimestamp
    const messageObj = {
      text: inputText,
      senderId: userInfo.userID,
      createdAt: new Date(), // Use the JavaScript date object
    };

    // Push the message to the Realtime Database
    const database = getDatabase();
    const newMessageRef = push(ref(database, '/chats/' + chatId + '/messages'));
    set(newMessageRef, messageObj);

    // Push the message to Firestore using arrayUnion and without the serverTimestamp
    const chatDocRef = doc(firestore, 'chats', chatId);
    try {
      await updateDoc(chatDocRef, {
        messages: arrayUnion(messageObj)
      });
      setInputText('');
    } catch (e) {
      console.error("Updating Firestore failed: ", e);
    }
    flatListRef.current?.scrollToEnd({ animated: true });
    // Clear the input
  }
};

// Fetching message history from Firestore on component mount
useEffect(() => {
  const chatDocRef = doc(firestore, 'chats', chatId);
  const unsubscribe = onSnapshot(chatDocRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      setMessages(data.messages || []);
    }
  });

  return () => unsubscribe();
}, [chatId]);
useEffect(() => {
  const database = getDatabase();
  const chatRef = ref(database, 'chats/' + chatId + '/messages');

  const unsubscribe = onValue(chatRef, (snapshot) => {
    const data = snapshot.val();
    const newMessages = [];
    for (let key in data) {
      newMessages.push({ id: key, ...data[key] });
    }
  });

  return () => off(chatRef, 'value', unsubscribe);
}, [chatId]);  
console.log("user Info on chat Screen",userInfo);
  const renderMessageItem = ({ item }) => {
    const isCurrentUserSender = item.senderId === userInfo.userID;
    // const displayName = isCurrentUserSender ? 'You' : item.receiverName; // Assuming 'receiverName' is part of the message object
    return (
      <View style={[
        styles.messageBubble,
        // Align to the left if the current user is the sender (since FlatList is inverted)
        isCurrentUserSender ? styles.senderBubble : styles.receiverBubble
      ]}>
        <Text style={[
          styles.messageText,
          // Different text color for the receiver's messages
          !isCurrentUserSender && styles.receiverText
        ]}>{item.text}</Text>
      </View>
    );
}
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
         ref={flatListRef}
         data={messages}
         renderItem={renderMessageItem}
         contentContainerStyle={[styles.messagesContainer, { paddingBottom: bottomPadding }]}
        //  inverted // This inverts the list so the bottom is the end of the list
         keyExtractor={(item) => item.id}
         onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
         onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#4F8EF7" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop:50,
  },
  messagesContainer: {
    padding: 12
  },
  messageBubble: {
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '70%',
  },
  senderBubble: {
    backgroundColor: '#0078FF', // Darker blue for the sender
    alignSelf: 'flex-end',
  },
  receiverBubble: {
    backgroundColor: '#e7f4ff', // Lighter blue for the receiver
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#333',
  },
  receiverText: {
    color: '#333', // Adjust as needed for visibility on light blue background
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    marginRight: 10,
  },
});

export default Chat;
