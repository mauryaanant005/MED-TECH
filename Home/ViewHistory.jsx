import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../login/FirebaseConfig';

export default function ViewHistory() {
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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.header}>Medical Record</Text>
      </View>

      {/* Medical Record Details */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {record ? (
          <View style={styles.recordContainer}>
            <Text style={styles.label}>👤 Name: <Text style={styles.value}>{record.firstName} {record.lastName}</Text></Text>
            <Text style={styles.label}>🎂 Date of Birth: <Text style={styles.value}>{record.dateOfBirth}</Text></Text>
            <Text style={styles.label}>📧 Email: <Text style={styles.value}>{record.email}</Text></Text>
            <Text style={styles.label}>📏 Height: <Text style={styles.value}>{record.height} cm</Text></Text>
            <Text style={styles.label}>⚖ Weight: <Text style={styles.value}>{record.weight} kg</Text></Text>
            <Text style={styles.label}>🌿 Allergies: <Text style={styles.value}>{record.allergies}</Text></Text>
            <Text style={styles.label}>💊 Medications: <Text style={styles.value}>{record.medications}</Text></Text>
            <Text style={styles.label}>🏃 Exercise: <Text style={styles.value}>{record.exerciseFrequency}</Text></Text>
          </View>
        ) : (
          <Text style={styles.noDataText}>No record found.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9FC' },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerContainer: {
    backgroundColor: '#4285F4',
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },

  backButton: {
    marginRight: 10,
    padding: 5,
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },

  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },

  recordContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    width: '100%',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },

  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },

  value: {
    fontSize: 16,
    color: '#555',
    fontWeight: '400',
  },

  noDataText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});