import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, FlatList, Alert } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Notifications from "expo-notifications";
import { FontAwesome } from "@expo/vector-icons";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import moment from "moment-timezone";
import { FIREBASE_DB } from "../login/FirebaseConfig";

export default function AddReminder({ isVisible, onClose }) {
  const [medicineName, setMedicineName] = useState("");
  const [frequency, setFrequency] = useState("Once Daily");
  const [startDate, setStartDate] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);

  // ✅ Correctly Set Notification Handler
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to send notifications is required!");
        return;
      }

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      // ✅ Correct way to listen for received notifications
      const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification Received: ", notification);
      });

      return () => {
        Notifications.removeNotificationSubscription(notificationListener);
      };
    })();

    fetchReminders();
  }, []);

  const scheduleNotification = async (name, date) => {
    if (date <= new Date()) {
      alert("The selected time is in the past. Please choose a future time.");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Medicine Reminder",
        body: `⏰ Time to take your medicine: ${name}`,
      },
      trigger: { date, repeats: false },
    });
  };

  const handleAddReminder = async () => {
    if (!medicineName) return;

    const istStartDate = moment(startDate).tz("Asia/Kolkata").toDate();
    const newReminder = {
      name: medicineName,
      frequency,
      startDate: istStartDate,
    };

    try {
      const docRef = await addDoc(collection(FIREBASE_DB, "reminder"), newReminder);
      setReminders([...reminders, { ...newReminder, id: docRef.id }]);
      scheduleNotification(medicineName, istStartDate);
      setMedicineName("");
    } catch (error) {
      console.error("Error adding reminder: ", error);
    }
  };

  const fetchReminders = async () => {
    const querySnapshot = await getDocs(collection(FIREBASE_DB, "reminder"));
    const fetchedReminders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setReminders(fetchedReminders);
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="times" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add New Reminder</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Medicine Name"
            value={medicineName}
            onChangeText={setMedicineName}
          />

          <Text style={styles.label}>Start Date/Time</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setStartDatePickerVisible(true)}>
            <Text>{moment(startDate).format("DD-MM-YYYY hh:mm A")}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="datetime"
            onConfirm={(date) => {
              setStartDate(date);
              setStartDatePickerVisible(false);
            }}
            onCancel={() => setStartDatePickerVisible(false)}
          />

          <TouchableOpacity style={styles.addReminderButton} onPress={handleAddReminder}>
            <Text style={styles.addReminderButtonText}>Add Reminder</Text>
          </TouchableOpacity>

          <FlatList
            data={reminders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.reminderItem}>
                <Text>{item.name} - {moment(item.startDate).format("hh:mm A")}</Text>
                <TouchableOpacity>
                  <FontAwesome name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, margin: 20 },
  closeButton: { alignSelf: "flex-end", marginBottom: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 10 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  dateInput: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 },
  addReminderButton: { backgroundColor: "#007AFF", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 10 },
  addReminderButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  reminderItem: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#e3f2fd", padding: 10, marginVertical: 5, borderRadius: 5 },
});
