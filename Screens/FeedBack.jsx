import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, ScrollView, Image, TouchableOpacity } from "react-native";
import { Button, Card, Title, Paragraph, Menu, Switch } from "react-native-paper";
import { AirbnbRating } from "react-native-ratings";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../login/FirebaseConfig";

export default function FeedbackScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(3);
  
  const [image, setImage] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    // Auto-fill user email if logged in
    if (FIREBASE_AUTH.currentUser) {
      setEmail(auth.currentUser.email);
    }

    // Fetch feedback in real time
    const unsubscribe = onSnapshot(collection(FIREBASE_DB, "feedbacks"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFeedbackList(data);
    });

    return () => unsubscribe();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleSubmit = async () => {
    if (!feedback) {
      Alert.alert("Error", "Feedback is required!");
      return;
    }

    try {
      await addDoc(collection(db, "feedbacks"), {
        name: anonymous ? "Anonymous" : name,
        email: anonymous ? "anonymous@feedback.com" : email,
        feedback,
        image,
        timestamp: new Date()
      });

      Alert.alert("Success", "Feedback submitted successfully!");
      setName("");
      setEmail("");
      setFeedback("");
      setRating(3);
       setImage(null);
    } catch (error) {
      Alert.alert("Error", "Failed to submit feedback.");
    }
  };

  return (
    <ScrollView style={{ padding: 20, backgroundColor: "#EAF3FF" }}>
      <Card style={{ padding: 20, borderRadius: 15,backgroundColor:"#EAF3FF" }}>
        <Title style={{ textAlign: "center", marginBottom: 10 }}>Feedback / Complaint Form</Title>
        <Paragraph style={{ textAlign: "center", color: "gray" }}>
          Let us know how we can improve our services.
        </Paragraph>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
          <Text style={{ fontWeight: "bold", flex: 1 }}>Submit Anonymously</Text>
          <Switch value={anonymous} onValueChange={() => setAnonymous(!anonymous)} />
        </View>

        {!anonymous && (
          <>
            <Text style={{ marginTop: 15, fontWeight: "bold" }}>Your Name</Text>
            <TextInput
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 10,
                borderRadius: 8,
                marginTop: 5
              }}
            />

            <Text style={{ marginTop: 15, fontWeight: "bold" }}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              value={email}
              keyboardType="email-address"
              onChangeText={setEmail}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 10,
                borderRadius: 8,
                marginTop: 5
              }}
            />
          </>
        )}

        <Text style={{ marginTop: 15, fontWeight: "bold" }}>Feedback / Complaint</Text>
        <TextInput
          placeholder="Write your feedback here..."
          value={feedback}
          onChangeText={setFeedback}
          multiline
          numberOfLines={4}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 10,
            borderRadius: 8,
            marginTop: 5,
            textAlignVertical: "top"
          }}
        />

       

        <Text style={{ marginTop: 15, fontWeight: "bold" }}>Rate Your Experience</Text>
        <AirbnbRating
  count={5}
  defaultRating={rating ?? 3} // Use default value here
  onFinishRating={(value) => setRating(value)}
  size={30}
  showRating={false}
/>


        <Text style={{ marginTop: 15, fontWeight: "bold" }}>Upload Image (Optional)</Text>
        <TouchableOpacity onPress={pickImage} style={{ marginTop: 5 }}>
          {image ? <Image source={{ uri: image }} style={{ width: "100%", height: 150, borderRadius: 8 }} /> :
            <Button mode="outlined">Pick an Image</Button>}
        </TouchableOpacity>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={{
            marginTop: 20,
            padding: 10,
            borderRadius: 8,
            backgroundColor: "#4A90E2"
          }}
        >
          Submit Feedback
        </Button>
      </Card>

      {/* Real-time feedback display */}
      <Title style={{ marginTop: 30, textAlign: "center" }}>Recent Feedback</Title>
      {feedbackList.map((item) => (
        <Card key={item.id} style={{ marginVertical: 10, padding: 10,marginBottom:100, borderRadius: 15 }}>
          <Title>{item.name}</Title>
          <Paragraph>{item.feedback}</Paragraph>
          <Paragraph style={{ fontSize: 12, color: "gray" }}>Type: {item.complaintType}</Paragraph>
        </Card>
      ))}
    </ScrollView>
  );
}
