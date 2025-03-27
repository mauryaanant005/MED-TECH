import React from 'react';
import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Alert
  } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SetPassword() {
  const router = useRouter();
    const [email, setEmail] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); // Password visibility state
    const handleSubmit = () => {
      // Regular expression for basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
      if (!email.trim()) {
        Alert.alert('Validation Error', 'Email is required.');
        return;
      } else if (!emailRegex.test(email)) {
        Alert.alert('Validation Error', 'Please enter a valid email.');
        return;
      }
    
      Alert.alert('Submitted Successfully', `Email: ${email}\nMobile: ${mobile || 'Not Provided'}`);
    };

  return (
    <View style={styles.container2}>
      <TouchableOpacity
              style={styles.backButton2}
              onPress={() => router.push('/login/SignIn')} // Navigate to the previous page or home
            >
               <FontAwesome name="arrow-left" size={24} color="#2260FF" />
            </TouchableOpacity>
            
            <Text style={styles.header2}>Reset Your Password</Text>
            
            <Text style={styles.label2}>Email</Text>
                  <TextInput
                    style={styles.input2}
                    placeholder="example@example.com"
                    placeholderTextColor="#A0A3BD"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={text => setEmail(text)}
                  />
                  <Text style={styles.label2}> Set a New Password</Text>
                        <View style={styles.passwordContainer2}>
                          <TextInput
                            style={styles.passwordInput2}
                            placeholder="Password"
                            placeholderTextColor="#A0A3BD"
                            secureTextEntry={!passwordVisible} // Toggle visibility
                          />
                          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                            <FontAwesome
                              name={passwordVisible ? 'eye-slash' : 'eye'}
                              size={20}
                              color="#A0A3BD"
                            />
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.label2}> Confirm Password</Text>
                        <View style={styles.passwordContainer2}>
                          <TextInput
                            style={styles.passwordInput2}
                            placeholder="Password"
                            placeholderTextColor="#A0A3BD"
                            secureTextEntry={!passwordVisible} // Toggle visibility
                          />
                          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                            <FontAwesome
                              name={passwordVisible ? 'eye-slash' : 'eye'}
                              size={20}
                              color="#A0A3BD"
                            />
                          </TouchableOpacity>
                        </View><TouchableOpacity style={styles.loginButton2} onPress={()=>{
                             if (handleSubmit()) {
                                router.push('/login/SignIn'); 
                              }
                        }} >
                                      <Text style={styles.loginButtonText2}>Create new Password</Text>
                                    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container2:{
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
      },  
      backButton2: {
        marginBottom: 20,
      },
    header2: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 40,
        marginTop: 0,
      },
  
  label2: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  input2: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    marginBottom: 15,
    marginTop:5,
  },
  
  passwordContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    marginBottom: 15,
    marginTop:5,
  },
  passwordInput2: {
    flex: 1,
  },
  loginButton2: {
    marginLeft:60,
    width:240,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginTop:10
  },
  loginButtonText2: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});