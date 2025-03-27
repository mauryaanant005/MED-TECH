import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet,TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MedicineDetail() {
  const { medicine } = useLocalSearchParams();
  const selectedMedicine = JSON.parse(medicine);
   const router = useRouter();

  return (
    <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}> 
        <FontAwesome name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Image source={selectedMedicine.image} style={styles.image} />
      <Text style={styles.title}>{selectedMedicine.name}</Text>
      

      {/* Medicine-Specific Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uses and Benefits</Text>
        <Text style={styles.sectionText}>{selectedMedicine.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Side Effects</Text>
        <Text style={styles.sectionText}>{selectedMedicine.details.sideEffects}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to Use</Text>
        <Text style={styles.sectionText}>{selectedMedicine.details.howToUse}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How Drug Works</Text>
        <Text style={styles.sectionText}>{selectedMedicine.details.howItWorks}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Advice</Text>
        <Text style={styles.sectionText}>{selectedMedicine.details.safetyAdvice}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 15,marginBottom: 15  },
  image: { width: "100%", height: 220, resizeMode: "contain", borderRadius: 12, marginBottom: 15 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#343a40", textTransform: "capitalize", marginBottom: 15  },
  price: { fontSize: 20, fontWeight: "bold", color: "#28a745", textAlign: "center", marginBottom: 15 },
  section: { backgroundColor: "#fff", padding: 15, marginBottom: 10, borderRadius: 10, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#007BFF", marginBottom: 5 },
  sectionText: { fontSize: 15, color: "#495057", lineHeight: 22 }
});
