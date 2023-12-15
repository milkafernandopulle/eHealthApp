import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Chat = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { id: 'm1', text: 'Hello, how can I help you today?', sender: 'doctor' },
    { id: 'm2', text: 'I wanted to ask about my appointment.', sender: 'patient' },
    { id: 'm3', text: 'Hello, I will write some medicine for you.', sender: 'doctor' },
    // Add more dummy messages here
  ]);

  const sendMessage = () => {
    if (inputText.trim().length > 0) {
      // Prepend new messages to the start of the messages array
      setMessages(previousMessages => [{ id: Date.now().toString(), text: inputText, sender: 'patient' }, ...previousMessages]);
      setInputText('');
    }
  };
  

  const renderMessageItem = ({ item }) => (
    <View style={[styles.messageBubble, item.sender === 'patient' ? styles.senderBubble : styles.receiverBubble]}>
      <Text style={[styles.messageText, item.sender !== 'patient' && styles.receiverText]}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesContainer}
        inverted // Invert the order so new messages appear at the bottom
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
    padding: 10,
  },
  messageBubble: {
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '70%',
  },
  senderBubble: {
    backgroundColor: '#0078FF', // Dark blue
    alignSelf: 'flex-end',
  },
  receiverBubble: {
    backgroundColor: '#e7f4ff', // Light blue
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
