import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function MedicineList() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const selectedCategory = JSON.parse(category);

  return (
    <View style={styles.container}>
         <TouchableOpacity style={styles.backButton} onPress={() => router.back()}> 
        <FontAwesome name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.header}>{selectedCategory.name} Medicines</Text>
      <FlatList
        data={selectedCategory.medicines}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push({ pathname: "/Home/MedicineDetails", params: { medicine: JSON.stringify(item) } })}
          >
            <Image source={item.image} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa", 
    padding: 15 
  },
  header: { 
    fontSize: 22, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 15, 
    color: "#343a40", 
    textTransform: "uppercase",
    letterSpacing: 1
  },
  card: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 15, 
    marginVertical: 5, 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3 
  },
  image: { 
    width: 80, 
    height: 80, 
    marginRight: 15, 
    borderRadius: 10 
  },
  info: { 
    flex: 1 
  },
  name: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#212529" 
  },
  description: { 
    fontSize: 14, 
    color: "#6c757d", 
    marginTop: 4 
  },
  price: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#007BFF", 
    marginTop: 6 
  }
});
