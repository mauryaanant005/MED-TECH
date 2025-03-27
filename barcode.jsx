import React from "react";
import { View } from "react-native";
import BarcodeScanner from "../app/Screens/BarcodeScanner"; // Adjusted path

export default function BarcodeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <BarcodeScanner />
    </View>
  );
}
