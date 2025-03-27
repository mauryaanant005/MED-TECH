import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Linking,
  ActivityIndicator,
  Pressable,
  FlatList
} from "react-native";
import { SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";


import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from '../../assets/images/logo.png';
import Icon from 'react-native-ico-material-design';
import { NavigationContainer } from "@react-navigation/native";
import { useRouter } from 'expo-router';
import { useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, FontAwesome5,FontAwesome ,Ionicons} from "@expo/vector-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { FIREBASE_APP } from "../login/FirebaseConfig"; 
import Carousel from "react-native-snap-carousel-v4";
import FeedbackScreen from "./FeedBack";

import axios from "axios";
import { parseString } from "react-native-xml2js";

const { width } = Dimensions.get("window");

const RSS_URL = "https://health.economictimes.indiatimes.com/rss/pharma/regulatory-update"; 


const Tab = createBottomTabNavigator();

const auth = getAuth(FIREBASE_APP);
const db = getFirestore(FIREBASE_APP);

const HomeScreen = () => {

  const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSd4FjuYJiKZd2asXS2EvTJy0fcvmQmJ0mADic6-zL_Xw0fiZg/viewform?usp=dialog';

  const handleFeedback = () => {
    Linking.openURL(googleFormUrl).catch(err => console.error('Error opening Google Form:', err));
  };
  const handleEmail = () => {
    const email = 'medtech3193@gmail.com';
    const subject = encodeURIComponent('User Feedback / Query');
    const body = encodeURIComponent('Hello, I need help with...');
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

    Linking.openURL(mailtoUrl).catch(err => console.error('Error opening email:', err));
  };
  
    const router = useRouter();
    
    const handlehospital = () => {
      router.push('/Home/hospital');
    }
    const handleStore = () => {
      router.push('/Home/Store');
    }
  
    const medicine = () => {
      router.push('/Home/Medicine');
    };
    const [user, setUser] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          fetchUserProfile(currentUser.uid);
        }
      });
  
      return () => unsubscribe();
    }, []);
  
    const fetchUserProfile = async (userId) => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setProfilePic(userDoc.data().profilePic || null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    
    
    const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(RSS_URL);
      parseString(response.data, (err, result) => {
        if (!err) {
          const items = result.rss.channel[0].item.map((item) => ({
            title: item.title[0],
            description: item.description[0],
            link: item.link[0],
            image: item["media:content"] ? item["media:content"][0].$.url : null,
          }));
          setNews(items);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching RSS feed:", error);
      setLoading(false);
    }
  };

  const openArticle = async (url) => {
    await WebBrowser.openBrowserAsync(url);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card1} onPress={() => openArticle(item.link)}>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
      <Text style={styles.readMore}>Tap to read more</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }





    return (
      <ScrollView style={styles.container3}>
        {/* Header Section */}
        
        <View style={styles.header3}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: profilePic || "https://logodix.com/logo/69666.png" }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.welcomeText}>Hi, Welcome Back</Text>
            <Text style={styles.userName}>{user ? user.displayName || "User" : "Rayyan"}</Text>
          </View>
        </View>
        
          <View style={styles.headerIcons}>
          <FontAwesome name="globe" size={24} color="#4A90E2" style={styles.icon} />
            <FontAwesome name="bell" size={24} color="#4A90E2" style={styles.icon} />
            <FontAwesome name="cog" size={24} color="#4A90E2"  style={styles.icon}/>
            
          </View>
        </View>
  
        {/* Search and Actions */}
        <View style={styles.searchActions}>
         
            <TouchableOpacity onPress={medicine}>
            <View style={styles.actionButton}>
              <MaterialIcons name="local-pharmacy" size={40} color="#4A90E2" />
            <Text style={styles.actionText}>Medicine</Text>
            </View>
            </TouchableOpacity>
            
          <TouchableOpacity onPress={()=>{
            router.navigate('/Screens/BarcodeScanner');
          }}>
            <View style={styles.actionButton}>
            <MaterialIcons name="qr-code-scanner" size={40} color="#4A90E2" />
            <Text style={styles.actionText}>Scan</Text>
          </View>
          </TouchableOpacity>
          
          
          {/* <TextInput
            placeholder="Search"
            style={styles.searchInput}
            placeholderTextColor="#999"
          /> */}
        
        </View>
  
        {/* Banner Section */}
        <TouchableOpacity onPress={() => router.push('/Home/Medical_hist')}>
        <View style={styles.banner} >
        <View style={styles.bannerContent}>
      <View style={styles.bannerTextContainer}>
        <Text style={styles.bannerText1}> Check your Medical  History </Text>
        
             
        
      </View>
      
      <Image
        source={{ uri: "https://cdni.iconscout.com/illustration/premium/thumb/medical-report-and-medicine-5378095-4494351.png?f=webp" }} // Replace with banner image
        style={styles.bannerImage}
      />
      
    </View>
    
    
    
          <Text style={styles.knowNowText}>Know now ➔</Text>
        
  </View>
  </TouchableOpacity>
  
         {/* Options */}
         <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionCard} onPress={handleStore}>
            <Image
              source={{
                uri: "https://static.vecteezy.com/system/resources/previews/000/153/588/original/vector-roadmap-location-map.jpg", // Replace with nearby medical store graphic
              }}
              style={styles.optionImage}
            />
           
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionCard} onPress={handlehospital}>
            <Image
              source={{
                uri: "https://thumbs.dreamstime.com/b/isometric-hospital-location-isometric-hospital-location-marker-map-233012793.jpg", // Replace with nearby hospital graphic
              }}
              style={styles.optionImage}
            />
            
          </TouchableOpacity>
        </View>
        <View style={styles.optionText}>
        <Text onPress={handleStore} >Nearby Medical Store</Text>
        <Text onPress={handlehospital}>Nearby Hospital</Text>
        </View>
  
        {/* Symptoms Checker */}
        <TouchableOpacity style={styles.symptomsCard}>
          <Text style={styles.symptomsHeader}>Symptoms Checker</Text>
          <Text style={styles.symptomsSubText}>
            Enter Your Symptoms To Get Personalized Recommendations.
          </Text>
          <TouchableOpacity style={styles.checkButton}  onPress={() => router.push('/Home/Symptom_ch')}>
            <Text style={styles.checkButtonText}>Check Symptoms</Text>
          </TouchableOpacity>
          <Text style={styles.timeText}>Takes 2-3 minutes</Text>
        </TouchableOpacity>
  
        {/* Recent Checks */}
        <View style={styles.recentChecksCard}>
          <Text style={styles.cardTitle}>Recent Checks</Text>
          <View style={styles.checkItem}>
            <MaterialIcons name="healing" size={24} color="#4A90E2" />
            <View style={styles.checkDetails}>
              <Text style={styles.checkTitle}>Headache & Cough</Text>
              <Text style={styles.checkTime}>Today, 10:30 AM</Text>
            </View>
          </View>
          <View style={styles.checkItem}>
            <FontAwesome5 name="tooth" size={24} color="#4A90E2" />
            <View style={styles.checkDetails}>
              <Text style={styles.checkTitle}>Tooth Decay</Text>
              <Text style={styles.checkTime}>Today, 2:00 PM</Text>
            </View>
          </View>
        </View>
  
        {/* Know Your Cure */}
        <TouchableOpacity>
        <View style={styles.knowYourCureCard} >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} >Know Your Cure</Text >
            <TouchableOpacity>
              <MaterialIcons name="search" size={24} color="#4A90E2" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cureScroll} >
            <TouchableOpacity style={styles.cureItem} onPress={() => router.navigate('/Home/Medicine')}>
              <Image
                source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwEbTQpFifrW_qPXNuNhwygIL7UbMrr9t1aA&s" }}
                style={styles.cureImage}
              />
              <Text style={styles.cureText}>Fever</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cureItem}  onPress={() => router.push({ pathname: "/Home/Medicine"})}>
              <Image
                source={{ uri: "https://imgs.search.brave.com/o5A79ZahrIWk8-wjVUdAeBKE5ZrVjeiNr1dECHn1IBY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA2LzExLzA4LzY0/LzM2MF9GXzYxMTA4/NjQ3OF82V3prejBS/MThKVHJGanduR04z/SW5EM1R5b29HaFpt/Qi5qcGc" }}
                style={styles.cureImage}
              />
              <Text style={styles.cureText} >Eye Infection</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cureItem} >
              <Image
                source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBVnbZ4HZ0650lMtCgdmp1KB19LwM6fh82b64l8aKs119QbpgkaG2ogKtYevePQAixgIo&usqp=CAU" }}
                style={styles.cureImage}
              />
              <Text style={styles.cureText}>Stomach Ache</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cureItem}>
              <Image
                source={{ uri: "https://www.oecd.org/adobe/dynamicmedia/deliver/dm-aid--41f28e9f-8a8f-47b9-b278-68a59c8f8e2a/107182c8-en.jpg?preferwebp=true&quality=80" }}
                style={styles.cureImage}
              />
              <Text style={styles.cureText}>Other</Text>
            </TouchableOpacity>
          </ScrollView>
          <Text style={styles.learnMore}>Learn more ➔</Text>
        </View>
        </TouchableOpacity>
  
        {/* News & Updates */}
     
      <View style={styles.container9}>
      <Text style={styles.cardTitle} >Regulatory & Update</Text >
      {news.length > 0 ? (
        <Carousel
        data={news}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width * 0.8}
        loop
        autoplay
        />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>No news available</Text>
      )}
      <Text style={styles.Text3}>For any queries or feedback, feel free to reach out to us.</Text>
    
    </View>
    
    <View style={styles.foot}>
      
    <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleFeedback}>
          <Text style={styles.footerButtonText}>Give Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={handleEmail}>
          <Text style={styles.footerButtonText}>Contact Us</Text>
        </TouchableOpacity>
      </View>
      </View>
    
        </ScrollView>
    );
  
  }
  const styles = StyleSheet.create({
    container3: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 20,
      
     
      
    },
   
    header3: {
      flexDirection: "row", // Ensures the elements are placed side by side
      alignItems: "center",  // Vertically align elements in the center
      marginBottom: 20,
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    welcomeText: {
      marginLeft: 10,  // Reduced the margin to position the text closer to the profile
      fontSize: 16,
      color: "#888",
    },
    userName: {
      marginLeft: 10,  // Reduced the margin to position the username closer to the profile
      fontSize: 20,
      fontWeight: "bold",
    },
    
    headerIcons: {
      flexDirection: "row",
      marginLeft:70,
    },
    icon: {
      marginHorizontal: 10,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 20,
    },
    actionText: {
      fontSize:20,
      marginLeft: 15,
      color: "#4A90E2",
    },
    searchActions: {
      flexDirection: "row",
      marginLeft:20,
      // justifyContent: "space-between",

      marginBottom: 20,
      alignItems: "center",
    },
    searchInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 20,
      padding: 10,
      marginLeft: 10,
      backgroundColor: "#CAD6FF",
    },
    banner: {
      backgroundColor: "#EAF3FF",
      padding: 20,
      borderRadius: 30,
      marginBottom: 20,
      elevation: 5, // Android
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      
    },
    banner: {
      backgroundColor: "#EAF3FF",
      borderRadius: 30,
      padding: 10,
      marginBottom: 20,
      height:215,
    },
    bannerContent: {
      flexDirection: "row", // Align content horizontally
      //alignItems: "center", // Center align items vertically
      //justifyContent: "space-between", // Add space between text and image
    },
    bannerTextContainer: {
      flex: 1, // Make text container take up available space
      marginRight: 10, // Add spacing between text and image
    },
    // bannerText: {
    //   marginTop:20,
    //   fontSize: 30,
    //   fontWeight: "bold",
      
    // },
    bannerText1: {
      fontSize: 25,
      fontWeight: "bold",
      marginTop:45,
      textAlign:'center'
    },
    bannerText2: {
      fontSize: 33,
      fontWeight: "bold",
     
    },
    bannerImage: {
      width: 140,
      height: 180,
     // resizeMode: "contain",
    },
    knowNowText: {
      marginLeft:200,
      color: "d",
    },
    Text1:{
  fontWeight:'semibold',
    },
    
    optionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    optionCard: {
      backgroundColor: "#F5F5F5",
      borderRadius: 10,
      //alignItems: "center",
     // padding: 10,
      width: "48%",
      height: 100,
    },
    optionImage: {
      width: "100%",
      height: 110,
      marginBottom: 10,
      borderRadius: 10,
    },
    optionText: {
      //alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      paddingHorizontal: 38,
    },
    optionText1: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    symptomsCard: {
      backgroundColor: "#EAF3FF",
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
    },
    symptomsHeader: {
      fontSize: 20,
      fontWeight: "bold",
    },
    symptomsSubText: {
      marginVertical: 10,
      color: "#666",
    },
    checkButton: {
      backgroundColor: "#4A90E2",
      borderRadius: 20,
      padding: 10,
      alignItems: "center",
    },
    checkButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    timeText: {
      marginTop: 10,
      color: "#888",
      
    },
   
    recentChecksCard: {
      backgroundColor: "#EAF3FF",
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    checkItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    checkDetails: {
      marginLeft: 10,
    },
    checkTitle: {
      fontSize: 16,
      fontWeight: "bold",
    },
    checkTime: {
      fontSize: 14,
      color: "#666",
    },
    knowYourCureCard: {
      backgroundColor: "#EAF3FF",
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cureScroll: {
      marginVertical: 10,
    },
    cureItem: {
      alignItems: "center",
      marginRight: 20,
    },
    cureImage: {
      width: 90,
      height: 90,
      borderRadius: 20,
    },
    cureText: {
      marginTop: 5,
      fontSize: 14,
      fontWeight: "bold",
    },
    learnMore: {
      color: "#4A90E2",
      textAlign: "right",
    },
    container9: {
      marginTop: 20,
      marginBottom: 100,
    },
    card1: {
      backgroundColor: "#EAF3FF",
      borderRadius: 10,
      padding: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      alignItems: "center",
    },
    image: {
      width: "100%",
      height: 150,
      borderRadius: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 10,
      textAlign: "center",
    },
    description: {
      fontSize: 14,
      color: "#555",
      marginTop: 5,
      textAlign: "center",
    },
    readMore: {
      marginTop: 10,
      fontSize: 14,
      color: "blue",
      fontWeight: "bold",
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    foot:{
    marginBottom:80,  
    },
    Text3:{
      marginTop:40,
      fontWeight:'semibold',
      textAlign:"center"
        },
     
    footer: {
      position: 'absolute',
      bottom: 10,
      left: 10,
      right: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#EAF3FF',
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 15,
      elevation: 5, // Shadow effect for Android
      shadowColor: '#000', // Shadow effect for iOS
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      
     
    },

  
    footerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#007bff',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 10,
    },
    footerButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },

  });
    
  

  export default HomeScreen;