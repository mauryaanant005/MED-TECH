import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH, FIREBASE_DB } from "../login/FirebaseConfig"; 
import { doc, getDoc } from "firebase/firestore";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch User Data from Firebase
  const fetchUserData = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser; // ✅ Correct auth instance
  
      if (!user) {
        console.error("User is not authenticated");
        return;
      }
  
      const docRef = doc(FIREBASE_DB, "users", user.uid); // ✅ Correct Firestore instance
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserName(data.name || "User");
        setProfileImage(data.profileImage || null);
      } else {
        console.log("No user data found.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  // Pick Image and Upload to Firebase
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "You need to allow access to change your profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImageToFirebase(result.assets[0].uri);
    }
  };

  // Upload Image to Firebase Storage
  const uploadImageToFirebase = async (imageUri) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      setLoading(true);
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profile_images/${user.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload failed:", error);
          Alert.alert("Upload Error", "Failed to upload image.");
          setLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setProfileImage(downloadURL);
          await updateDoc(doc(db, "users", user.uid), { profileImage: downloadURL });
          Alert.alert("Success", "Profile picture updated!");
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>My Profile</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <>
          <View style={styles.profileContainer}>
            <Image source={profileImage ? { uri: profileImage } : require("../../assets/images/logo.png")} style={styles.profileImage} />
            <TouchableOpacity onPress={pickImage} style={styles.editIcon}>
              <FontAwesome5 name="pen" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userName}</Text>
        </>
      )}

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("ProfileDetails")}>
        <FontAwesome5 name="user" size={20} color="#4A90E2" />
        <Text style={styles.menuText}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Settings")}>
        <FontAwesome5 name="cogs" size={20} color="#4A90E2" />
        <Text style={styles.menuText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Logout", "Logging out...")}>
        <FontAwesome5 name="sign-out-alt" size={20} color="#4A90E2" />
        <Text style={styles.menuText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    backgroundColor: "#fff", 
    paddingTop: 50 
  },

  backButton: { 
    position: "absolute", 
    left: 20, 
    top: 50 
  },

  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#007AFF", 
    marginBottom: 10 
  },

  userName: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginTop: 10 
  },

  profileContainer: { 
    alignItems: "center", 
    position: "relative", 
    marginBottom: 20 
  },

  profileImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    borderWidth: 2, 
    borderColor: "#007AFF" 
  },

  editIcon: { 
    position: "absolute", 
    bottom: 5, 
    right: 5, 
    backgroundColor: "#007AFF", 
    borderRadius: 15, 
    padding: 5, 
    borderWidth: 1, 
    borderColor: "#fff" 
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    width: "90%",
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },

  menuText: { 
    marginLeft: 15, 
    fontSize: 16, 
    fontWeight: "500", 
    color: "#333" 
  },

  screen: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#f0f0f0" 
  },
});


export default ProfileScreen;
