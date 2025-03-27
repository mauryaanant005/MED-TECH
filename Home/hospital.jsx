import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const API_KEY = "1_pomSfwjXZOGqFWITsTNu0xcxheiUTv7Z5_YZINutM"; // Replace with your API key

const HospitalMap = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [region, setRegion] = useState(null);
  const [filter, setFilter] = useState("distance"); // Default filter: distance
  const navigation = useNavigation();

  useEffect(() => {
    const fetchHospitals = async () => {
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

        const url = `https://discover.search.hereapi.com/v1/discover?at=${lat},${lng}&q=hospital&apiKey=${API_KEY}`;
        const response = await axios.get(url);

        setHospitals(response.data.items);
      } catch (err) {
        setError("Failed to fetch hospitals");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  // Filter hospitals
  const sortedHospitals = hospitals.sort((a, b) => {
    if (filter === "distance") {
      return a.distance - b.distance; // Sort by distance (closest first)
    } else if (filter === "rating") {
      return (b.rating || 0) - (a.rating || 0); // Sort by rating (highest first)
    }
  });

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        region && (
          <>
            {/* Map Section */}
            <MapView style={styles.map} initialRegion={region}>
              <Marker coordinate={region} title="You are here" pinColor="blue" />
              {sortedHospitals.map((hospital, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: hospital.position.lat,
                    longitude: hospital.position.lng,
                  }}
                  title={hospital.title}
                  description={hospital.address.label}
                />
              ))}
            </MapView>

            {/* Filter Section */}
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[styles.filterButton, filter === "distance" && styles.activeFilter]}
                onPress={() => setFilter("distance")}
              >
                <Text style={styles.filterText}>Sort by Distance</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filter === "rating" && styles.activeFilter]}
                onPress={() => setFilter("rating")}
              >
                <Text style={styles.filterText}>Sort by Rating</Text>
              </TouchableOpacity>
            </View>

            {/* Hospital List */}
            <FlatList
              data={sortedHospitals}
              keyExtractor={(item, index) => index.toString()}
              style={styles.list}
              renderItem={({ item }) => (
                <View style={styles.hospitalCard}>
                  <Text style={styles.hospitalName}>{item.title}</Text>
                  <Text style={styles.hospitalAddress}>{item.address.label}</Text>
                  <Text style={styles.hospitalDistance}>
                    Distance: {item.distance} meters
                  </Text>
                </View>
              )}
            />
          </>
        )
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
    height: Dimensions.get("window").height * 0.5,
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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#ddd",
  },
  activeFilter: {
    backgroundColor: "#007bff",
  },
  filterText: {
    color: "#000",
    fontWeight: "bold",
  },
  list: {
    flex: 1,
    paddingHorizontal: 10,
  },
  hospitalCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 3,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  hospitalAddress: {
    fontSize: 14,
    color: "gray",
  },
  hospitalDistance: {
    fontSize: 14,
    color: "blue",
  },
});

export default HospitalMap;
