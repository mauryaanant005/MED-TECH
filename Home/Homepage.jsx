import React from "react";
import { View, Text} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "../Screens/ProfileScreen";
import HomeScreen from "../Screens/HomeScreen";
import ChatBot from "../Screens/ChatBot";
import RemainderScreen from "../Screens/RemainderScreen";
import { MaterialIcons, FontAwesome5,FontAwesome ,Ionicons} from "@expo/vector-icons";



const Tab = createBottomTabNavigator();







const MedicalApp = () => {
  return (
   
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#4A90E2",
            position: "absolute",
            // bottom: 20,
            // marginLeft:40,
            // width: "80%",
            
            height: 60,
            // borderRadius: 30,
            paddingHorizontal: 12,

            // Floating effect
            // elevation: 8,
            // shadowColor: "#000",
            // shadowOpacity: 0.25,
            // shadowOffset: {
            //   width: 0,
            //   height: 4,
            // },
            shadowRadius: 8,

            // Other styles
            borderTopWidth: 0,
            alignItems: "center",
            justifyContent: "center",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: "Poppins_400Regular",
            paddingBottom: 5,
          },
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "white",
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Reminder"
          component={RemainderScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatBot}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="chat" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    
  );
};

export default MedicalApp;