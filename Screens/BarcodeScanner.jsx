import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { db } from "../login/FirebaseConfig"; // Correct (uppercase "F")
import { doc, getDoc } from "firebase/firestore";
import { Button, Card } from "react-native-paper";
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get("window");

const BarcodeScanner = () => {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullScreen, setFullScreen] = useState(true);
  const [scannedData, setScannedData] = useState(null); 

  useEffect(() => {
    (async () => {
      if (!permission || permission.status !== "granted") {
        await requestPermission();
      }
    })();
  }, [permission]);

  const handleBarCodeScanned = async ({ data }) => { 
    setScanned(true);
    setFullScreen(false);
    setLoading(true);
    console.log("📡 Scanned Product ID:", data); 

    try {
      const docRef = doc(db, "medicines", data);
      const docSnap = await getDoc(docRef);
      
      console.log("📜 Document Data:", docSnap.exists() ? docSnap.data() : "Not Found"); 

      if (docSnap.exists()) {
        setScannedData(docSnap.data());
      } else {
        setScannedData(null);
      }
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    } finally {
      setLoading(false);
    }
};


  if (!permission) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (permission.status !== "granted") {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}> 
              <FontAwesome name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
      <View
        style={[
          styles.cameraContainer,
          fullScreen ? styles.fullCamera : styles.miniCamera,
        ]}
      >
        <CameraView
          style={styles.scanner}
          barcodeScannerSettings={{ barcodeTypes: ["code128"] }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
      </View>

      {scanned && (
        <Button
          mode="contained"
          onPress={() => {
            setScanned(false);
            setScannedData(null);
            setFullScreen(true);
          }}
          style={styles.scanAgainButton}
        >
          Scan Again
        </Button>
      )}

      {loading && <ActivityIndicator size="large" color="#6200EE" style={styles.loading} />}

      {scannedData && (
        <Card style={styles.card}>
          <Card.Title title="Medicine Details" />
          <Card.Content>
            <Text style={styles.dataText}>📦 Product ID: {scannedData.product_id}</Text>
            <Text style={styles.dataText}>🔞 What is the dosage of medicine? {scannedData.Dosage}</Text>
            <Text style={styles.dataText}>💊 Name: {scannedData.name}</Text>
            <Text style={styles.dataText}>🏭 Manufacturer: {scannedData.manufacturer}</Text>
            <Text style={styles.dataText}>🛑 Expiry Date: {scannedData.expiry_date}</Text>
            <Text style={styles.dataText}>🔢 Batch Number: {scannedData.batch_number}</Text>
            <Text style={styles.dataText}>💰 Price: {scannedData.price}</Text>
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f8f9fa", // Light modern background
    paddingTop: 20,
  },
  backButton: { position: "absolute", left: 20, zIndex: 1,top: 20 },
  cameraContainer: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "#000",
  },
  fullCamera: {
    width: width * 0.9,
    height: height * 0.75,
    alignSelf: "center",
    borderRadius: 20,
    marginVertical: height * 0.05,
  },
  miniCamera: {
    top: 30,
    width: "90%",
    height: 220,
  },
  scanner: {
    width: "100%",
    height: "100%",
  },
  scanAgainButton: {
    marginTop: 40,
    backgroundColor: "#007AFF", // Modern blue shade
    borderRadius: 10,
    paddingVertical: 10,
    width: "80%",
    alignSelf: "center",
  },
  loading: {
    marginTop: 20,
  },
  card: {
    width: "90%",
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  dataText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333", // Dark gray text for readability
    marginVertical: 6,
  },
});

export default BarcodeScanner;