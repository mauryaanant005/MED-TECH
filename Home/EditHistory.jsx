import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../login/FirebaseConfig';

export default function EditHistory() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecord();
  }, []);

  const fetchRecord = async () => {
    try {
      const docRef = doc(FIREBASE_DB, 'medical_history', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRecord(docSnap.data());
      } else {
        console.error('No such document!');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!record.firstName || !record.lastName || !record.dateOfBirth) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      const docRef = doc(FIREBASE_DB, 'medical_history', id);
      await updateDoc(docRef, record);
      Alert.alert('Success', 'Record updated successfully!');
      router.push('/Home/Medical_hist'); // Navigate back to history list
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4285F4" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>Edit Medical Record</Text>

      {record && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={record.firstName}
            onChangeText={(text) => setRecord({ ...record, firstName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={record.lastName}
            onChangeText={(text) => setRecord({ ...record, lastName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Date of Birth"
            value={record.dateOfBirth}
            onChangeText={(text) => setRecord({ ...record, dateOfBirth: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={record.email}
            onChangeText={(text) => setRecord({ ...record, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Height (cm)"
            value={record.height}
            onChangeText={(text) => setRecord({ ...record, height: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            value={record.weight}
            onChangeText={(text) => setRecord({ ...record, weight: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Allergies"
            value={record.allergies}
            onChangeText={(text) => setRecord({ ...record, allergies: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Medications"
            value={record.medications}
            onChangeText={(text) => setRecord({ ...record, medications: text })}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#EAF4F4' },
  backButton: { marginTop: 30, marginBottom: 20 },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#fff', padding: 10, marginBottom: 10, borderRadius: 8 },
  saveButton: { backgroundColor: '#4285F4', padding: 15, borderRadius: 10, marginTop: 10 },
  saveButtonText: { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
});