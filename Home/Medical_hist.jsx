import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, FlatList, 
    ActivityIndicator, Alert 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../login/FirebaseConfig';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function MedicalHistory() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  // Fetch medical history from Firestore
  const fetchMedicalHistory = async () => {
    try {
      const historyCollection = collection(FIREBASE_DB, 'medical_history');
      const snapshot = await getDocs(historyCollection);
      const historyData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(historyData);
    } catch (error) {
      console.error('Error fetching medical history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a record
  const handleDelete = async (id) => {
    Alert.alert('Confirm', 'Are you sure you want to delete this record?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: async () => {
          try {
            await deleteDoc(doc(FIREBASE_DB, 'medical_history', id));
            setHistory(history.filter(item => item.id !== id));
            Alert.alert('Deleted', 'Record has been deleted.');
          } catch (error) {
            console.error('Error deleting document:', error);
          }
        } 
      },
    ]);
  };

  // Generate PDF Report
  const handleDownload = async (record) => {
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Medical History Report</h2>
          <p><strong>Patient Name:</strong> ${record.firstName} ${record.lastName}</p>
          <p><strong>Date of Birth:</strong> ${record.dateOfBirth}</p>
          <p><strong>Email:</strong> ${record.email}</p>
          <p><strong>Height:</strong> ${record.height} cm</p>
          <p><strong>Weight:</strong> ${record.weight} kg</p>
          <p><strong>Allergies:</strong> ${record.allergies}</p>
          <p><strong>Medications:</strong> ${record.medications}</p>
          <p><strong>Exercise Frequency:</strong> ${record.exerciseFrequency}</p>
        </body>
      </html>
    `;

    try {
        const { uri } = await Print.printToFileAsync({ html });
        const pdfPath = `${FileSystem.documentDirectory}${record.firstName}_Report.pdf`;
        await FileSystem.moveAsync({ from: uri, to: pdfPath });
        await Sharing.shareAsync(pdfPath);
        Alert.alert('Success', 'PDF report generated and ready to share');
      } catch (error) {
        console.error('Error generating PDF:', error);
        Alert.alert('Error', 'Failed to generate PDF report');
      }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/Home/Homepage')}>
        <FontAwesome name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>Medical History</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4285F4" style={{ marginTop: 20 }} />
      ) : history.length === 0 ? (
        <Text style={styles.noDataText}>No history yet.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.historyText}>{item.firstName} {item.lastName}</Text>
              <Text style={styles.historyDate}>{item.dateOfBirth}</Text>

              {/* Action Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => router.push({ pathname: '/Home/ViewHistory', params: { id: item.id } })}>
                  <FontAwesome name="eye" size={22} color="#4285F4" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push({ pathname: '/Home/EditHistory', params: { id: item.id } })}>
                  <FontAwesome name="edit" size={22} color="#FFA500" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDownload(item)}>
                  <FontAwesome name="download" size={22} color="#28A745" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <FontAwesome name="trash" size={22} color="#DC3545" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => router.push('/Home/Med_hi')}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#EAF4F4' },
  backButton: { marginTop: 30, marginBottom: 20 },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  noDataText: { fontSize: 16, color: 'gray', textAlign: 'center', marginTop: 20 },
  historyItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  historyText: { fontSize: 18, fontWeight: 'bold' },
  historyDate: { fontSize: 14, color: 'gray', marginTop: 5 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#4285F4',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});