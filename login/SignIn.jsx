import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';

export default function SignIn() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    // Validation for empty fields
    if (!emailOrMobile || !password) {
      Alert.alert('Error', 'Please enter email/mobile and password');
      return;
    }

    // Ensure valid email format for email login
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailOrMobile && !emailRegex.test(emailOrMobile)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Attempt sign in with email and password
      const response = await signInWithEmailAndPassword(auth, emailOrMobile, password);
      console.log(response);
      Alert.alert('Success', 'Login successful!');
      router.push('/Home/Homepage'); // Redirect to home screen or dashboard
    } catch (error) {
      console.log(error);
      Alert.alert('Sign In Failed', error.message || 'An error occurred while logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}> 
        <FontAwesome name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      {/* Header Section */}
      <Text style={styles.header}>Let's Sign You In</Text>
      <Text style={styles.subHeader}>Welcome Back</Text>

      {/* Email or Mobile Input */}
      <Text style={styles.label}>Email or Mobile Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email or mobile number"
        placeholderTextColor="#A0A3BD"
        keyboardType="default"
        value={emailOrMobile}
        onChangeText={text => setEmailOrMobile(text)}
      />

      {/* Password Input */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#A0A3BD"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <FontAwesome
            name={passwordVisible ? 'eye-slash' : 'eye'}
            size={20}
            color="#A0A3BD"
          />
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => router.push('/login/SetPassword')}>
        <Text style={styles.forgotPassword}>Forgot Password</Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.loginButton} onPress={signIn}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Log In</Text>}
      </TouchableOpacity>

      {/* Social Sign In Options */}
      <Text style={styles.orText}>or sign in with</Text>
      <View style={styles.socialContainer}>
        <FontAwesome name="google" size={24} color="#4285F4" style={styles.icon} />
        <FontAwesome name="facebook" size={24} color="#3b5998" style={styles.icon} />
      </View>

      {/* Sign Up Option */}
      <Text style={styles.signupText}>
        Don't have an account? 
        <Text style={styles.signupLink} onPress={() => router.push('/login/SignUp')}>Sign Up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 20,
    color: '#A0A3BD',
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
  },
  forgotPassword: {
    color: '#4285F4',
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  loginButton: {
    width: 240,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    alignSelf: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    color: '#A0A3BD',
    marginBottom: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signupText: {
    textAlign: 'center',
    color: '#A0A3BD',
  },
  signupLink: {
    color: '#4285F4',
    fontWeight: 'bold',
  },
});
