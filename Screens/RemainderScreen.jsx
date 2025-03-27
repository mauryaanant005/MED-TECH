import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, Alert 
} from "react-native";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import { FIREBASE_DB } from "../login/FirebaseConfig";
import { collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";
import * as Device from "expo-device";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const MedReminderApp = () => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetchReminders();
  }, []);

  // Fetch reminders from Firestore
  const fetchReminders = async () => {
    try {
      const querySnapshot = await getDocs(collection(FIREBASE_DB, "reminder"));
      const remindersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort reminders (oldest first)
      remindersList.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

      setReminders(remindersList);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  // Delete reminder from Firestore
  const deleteReminder = async (id) => {
    try {
      await deleteDoc(doc(FIREBASE_DB, "reminder", id));
      setReminders(reminders.filter(reminder => reminder.id !== id));
    } catch (error) {
      console.error("Error deleting reminder:", error);
    }
  };

  // Register for Push Notifications
  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== "granted") {
          alert("Failed to get push token!");
          return;
        }
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;

      // Store token in Firestore
      await addDoc(collection(FIREBASE_DB, "push_tokens"), { token });
    }
    return token;
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  // Schedule Notification
  const scheduleNotification = async (reminder) => {
    const reminderTime = new Date(reminder.startDate);
    reminderTime.setHours(reminderTime.getHours() + 5); // Convert to IST
    reminderTime.setMinutes(reminderTime.getMinutes() + 30);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Medicine Reminder 💊",
        body: `Time to take ${reminder.name}!`,
        sound: true,
      },
      trigger: reminderTime, // Schedule notification at IST time
    });
  };

  useEffect(() => {
    reminders.forEach((reminder) => scheduleNotification(reminder));
  }, [reminders]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Med Reminder</Text>

      {/* Reminder List */}
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          // Convert stored UTC time to IST
          const reminderTimeIST = new Date(item.startDate);
          reminderTimeIST.setHours(reminderTimeIST.getHours() + 5);
          reminderTimeIST.setMinutes(reminderTimeIST.getMinutes() + 30);

          return (
            <View style={styles.reminderItem}>
              <Text style={styles.reminderText}>
                {item.name} - {reminderTimeIST.toLocaleString("en-IN")}
              </Text>
              <TouchableOpacity onPress={() => deleteReminder(item.id)}>
                <FontAwesome name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>No reminders yet.</Text>}
      />

      {/* Add Reminder Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/Screens/Addreminder')}>
        <FontAwesome name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f0f8ff" },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  addButton: { 
    position: "absolute", 
    bottom: 70, 
    right: 20, 
    backgroundColor: "#007AFF", 
    width: 60,  
    height: 60, 
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  reminderItem: { 
    backgroundColor: "#e3f2fd", 
    padding: 10, 
    marginVertical: 5, 
    borderRadius: 5, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  reminderText: { fontSize: 16 },
  emptyText: { textAlign: "center", color: "gray", marginTop: 20 },
});

export default MedReminderApp;
