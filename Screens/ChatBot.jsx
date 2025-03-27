import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Alert, Clipboard, Modal, TextInput, Button } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import axios from "axios";

const API_KEY = "AIzaSyCp7_TiFl0J7DRqalxM_IbZ2UUFkTiC4Io"; // Replace with your actual API key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
const UNSPLASH_ACCESS_KEY = "rXV9omqMTG1-5O9x8R_eSk2Co1MSobnB3ux5QrKvlzY";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello! I'm your medical assistant. Ask me about symptoms, treatments, or general health advice.",
        createdAt: new Date(),
        user: { _id: 2, name: "Medical AI", avatar: "https://th.bing.com/th/id/OIP.nLyPW5Jl35_0FUR3FBNFUwHaHa?w=185&h=186&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
      },
    ]);
  }, []);

  const fetchGeminiResponse = async (newMessages) => {
    try {
      const userMessage = newMessages[0].text;
  
      // Reject non-medical topics
      const nonMedicalKeywords = ["sports", "finance", "movies", "cricket"];
      if (nonMedicalKeywords.some((word) => userMessage.toLowerCase().includes(word))) {
        return "I'm here to assist with healthcare-related queries only. Please ask me about medical topics.";
      }
  
      // Check if the user is requesting an image
      if (userMessage.toLowerCase().includes("show me an image of")) {
        const query = userMessage.replace("show me an image of", "").trim();
        const imageResponse = await fetchMedicalImage(query);
        return imageResponse; // This will return an object with an image URL
      }
  
      // Fetch text response from Gemini API
      const response = await axios.post(GEMINI_API_URL, {
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
      });
  
      return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure. Can you rephrase?";
    } catch (error) {
      console.error("Gemini API Error:", error.response?.data || error.message);
      return "I'm having trouble processing your request. Please try again.";
    }
  };
  
  

  const fetchMedicalImage = async (query) => {
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query, client_id: UNSPLASH_ACCESS_KEY, per_page: 1 },
      });
  
      if (response.data.results.length > 0) {
        return { image: response.data.results[0].urls.small }; // ✅ Ensure object format
      } else {
        return "Sorry, I couldn't find an image for that.";
      }
    } catch (error) {
      console.error("Image Fetch Error:", error);
      return "Sorry, I couldn't fetch the image. Please try again.";
    }
  };
  

  const onSend = useCallback(async (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
  
    const botResponse = await fetchGeminiResponse(newMessages);
  
    let botMessage;
    if (typeof botResponse === "object" && botResponse.image) {
      botMessage = {
        _id: Math.random().toString(),
        text: "Here is the image you requested:",
        image: botResponse.image,  // ✅ This ensures the image is displayed
        createdAt: new Date(),
        user: { _id: 2, name: "Medical AI", avatar: "https://i.pravatar.cc/300" },
      };
    } else {
      botMessage = {
        _id: Math.random().toString(),
        text: botResponse,
        createdAt: new Date(),
        user: { _id: 2, name: "Medical AI", avatar: "https://i.pravatar.cc/300" },
      };
    }
  
    setMessages((prevMessages) => GiftedChat.append(prevMessages, [botMessage]));
  }, [messages]);
  

  const onLongPress = (context, message) => {
    Alert.alert("Message Options", "Choose an action", [
      {
        text: "Edit Message",
        onPress: () => {
          setEditingMessage(message);
          setNewMessageText(message.text);
          setModalVisible(true);
        },
      },
      {
        text: "Copy Message",
        onPress: () => copyToClipboard(message.text),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const saveEditedMessage = () => {
    if (editingMessage) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === editingMessage._id ? { ...msg, text: newMessageText } : msg
        )
      );
      setModalVisible(false);
      setEditingMessage(null);
    }
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert("Copied to Clipboard!");
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1 }}
        onLongPress={onLongPress}
      />
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            value={newMessageText}
            onChangeText={setNewMessageText}
          />
          <Button title="Save" onPress={saveEditedMessage} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingBottom: 70 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  input: { width: 300, height: 40, backgroundColor: "#fff", padding: 10, marginBottom: 10, borderRadius: 5 },
});

export default Chatbot;
