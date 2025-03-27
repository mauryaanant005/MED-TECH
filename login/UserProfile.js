import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { auth, db } from "../login/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="blue" />;

  return (
    <View style={{ alignItems: "center", margin: 20 }}>
      <Image
        source={{ uri: userData?.profilePic || "https://example.com/default-profile.png" }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{userData?.name}</Text>
      <Text style={{ fontSize: 16, color: "gray" }}>{userData?.email}</Text>
    </View>
  );
};

export default UserProfile;
