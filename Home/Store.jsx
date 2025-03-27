import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const API_KEY = "1_pomSfwjXZOGqFWITsTNu0xcxheiUTv7Z5_YZINutM"; // Replace with your API key

const MedicalMap = () => {
  const [medicals, setMedicals] = useState([]);
  const [filteredMedicals, setFilteredMedicals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [region, setRegion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMedicals = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission denied for location");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const lat = location.coords.latitude;
        const lng = location.coords.longitude;

        setRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });

        // Fetch nearby medical stores
        const url = `https://discover.search.hereapi.com/v1/discover?at=${lat},${lng}&q=pharmacy&apiKey=${API_KEY}`;
        const response = await axios.get(url);

        setMedicals(response.data.items);
        setFilteredMedicals(response.data.items); // Initialize filtered list
      } catch (err) {
        setError("Failed to fetch medicals");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicals();
  }, []);

  // Function to filter medical stores
  const filterMedicals = (text) => {
    setSearchQuery(text);
    if (text === "") {
      setFilteredMedicals(medicals);
    } else {
      const filtered = medicals.filter((medical) =>
        medical.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredMedicals(filtered);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search Medical Store"
        value={searchQuery}
        onChangeText={filterMedicals}
      />

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          {region && (
            <MapView style={styles.map} initialRegion={region}>
              <Marker coordinate={region} title="You are here" pinColor="blue" />
              {filteredMedicals.map((medical, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: medical.position.lat,
                    longitude: medical.position.lng,
                  }}
                  title={medical.title}
                  description={medical.address.label}
                />
              ))}
            </MapView>
          )}

          {/* Medical Stores List */}
          <FlatList
            data={filteredMedicals}
            keyExtractor={(item, index) => index.toString()}
            style={styles.list}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.storeName}>{item.title}</Text>
                <Text style={styles.storeAddress}>{item.address.label}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  map: {
    height: "50%", // Adjust height to show both map and list
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 10,
    borderRadius: 20,
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 10,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  list: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 3,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  storeAddress: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
});

export default MedicalMap;
