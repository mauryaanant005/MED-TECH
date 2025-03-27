import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Alert,
    ScrollView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { FIREBASE_DB } from '../login/FirebaseConfig'; // Import Firestore
import { collection, addDoc } from 'firebase/firestore';

export default function MedicalHist() {
    const router = useRouter();
    const [date, setDate] = useState(null);
    const [selectedGender, setSelectedGender] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [allergies, setAllergies] = useState('');
    const [medications, setMedications] = useState('');
    const [exerciseFrequency, setExerciseFrequency] = useState(null);

    const radioButtons = [
        { id: '1', label: 'Never', value: 'never' },
        { id: '2', label: '1-2 Days', value: '1-2 days' },
        { id: '3', label: '3-4 Days', value: '3-4 days' },
        { id: '4', label: '5+ Days', value: '5+ days' },
    ];

    const handleSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            Alert.alert('Validation Error', 'Email is required.');
            return;
        } else if (!emailRegex.test(email)) {
            Alert.alert('Validation Error', 'Please enter a valid email.');
            return;
        }

        try {
            await addDoc(collection(FIREBASE_DB, 'medical_history'), {
                firstName,
                lastName,
                dateOfBirth: date ? date.toISOString() : '',
                gender: selectedGender,
                height,
                weight,
                email,
                allergies,
                medications,
                exerciseFrequency
            });

            Alert.alert('Success', 'Medical history saved successfully!');
            router.push('/Home/Medical_hist');
        } catch (error) {
            console.error('Error adding document: ', error);
            Alert.alert('Error', 'Failed to save medical history.');
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowPicker(false);
        setDate(selectedDate || date);
    };

    return (
        <ScrollView>
            <View style={styles.container5}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.backButton5} onPress={() => router.push('/Home/Homepage')}>
                        <FontAwesome name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.header6}>Your Medical History</Text>
                </View>

                <Text style={styles.subHeader6}>General Patient Information</Text>
                
                <Text style={styles.label5}>Patient Name:</Text>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.inputHalf} 
                        placeholder="First Name" 
                        placeholderTextColor="#A0A3BD" 
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                    <TextInput 
                        style={styles.inputHalf} 
                        placeholder="Last Name" 
                        placeholderTextColor="#A0A3BD" 
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>

                <Text style={styles.label5}>Date of Birth</Text>
                <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input1}>
                    <Text style={{ color: date ? '#000' : '#A0A3BD', marginTop: 15 }}>
                        {date ? date.toLocaleDateString('en-US') : 'DD/MM/YYYY'}
                    </Text>
                </TouchableOpacity>

                {showPicker && (
                    <DateTimePicker
                        value={date || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <Text style={styles.label5}>Gender:</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={selectedGender} onValueChange={setSelectedGender} style={styles.picker}>
                        <Picker.Item label="Please Select" value="" />
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Female" value="female" />
                    </Picker>
                </View>

                <Text style={styles.label5}>Height (Cm):</Text>
                <TextInput style={styles.input1} placeholder="Ex: 176" keyboardType="numeric" value={height} onChangeText={setHeight} />

                <Text style={styles.label5}>Weight (Kg):</Text>
                <TextInput style={styles.input1} placeholder="Ex: 76" keyboardType="numeric" value={weight} onChangeText={setWeight} />

                <Text style={styles.label5}>Email</Text>
                <TextInput 
                    style={styles.input1} 
                    placeholder="example@example.com" 
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.subHeader7}>Patient Medical History</Text>

                <Text style={styles.label5}>Allergies</Text>
                <TextInput 
                    style={styles.input1} 
                    placeholder="Enter your allergies here..."
                    multiline
                    numberOfLines={4}
                    value={allergies}
                    onChangeText={setAllergies}
                />

                <Text style={styles.label5}>Medications</Text>
                <TextInput 
                    style={styles.input1} 
                    placeholder="Enter your medications here..."
                    multiline
                    numberOfLines={4}
                    value={medications}
                    onChangeText={setMedications}
                />

                <Text style={styles.label5}>Exercise Frequency</Text>
                <View style={styles.radioContainer}>
                    {radioButtons.map((button) => (
                        <TouchableOpacity key={button.id} style={styles.radioButton} onPress={() => setExerciseFrequency(button.value)}>
                            <View style={[styles.radioCircle, exerciseFrequency === button.value && styles.radioSelected]} />
                            <Text style={styles.radioLabel}>{button.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.loginButton5} onPress={handleSubmit}>
                    <Text style={styles.loginButtonText5}>Save & Submit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container5: {
      flex: 1,
      backgroundColor: '#F4F6F9',
      padding: 20,
  },
  headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
  },
  backButton5: {
      marginRight: 10,
  },
  header6: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#333',
  },
  subHeader6: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 10,
      color: '#555',
  },
  label5: {
      fontSize: 16,
      fontWeight: '500',
      marginTop: 10,
      color: '#666',
  },
  inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  inputHalf: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 12,
      padding: 12,
      backgroundColor: '#fff',
      marginRight: 5,
  },
  input1: {
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 12,
      padding: 12,
      backgroundColor: '#fff',
      marginBottom: 12,
  },
  pickerContainer: {
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 12,
      backgroundColor: '#fff',
      marginBottom: 10,
  },
  picker: {
      height: 50,
      width: '100%',
  },
  radioContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginVertical: 10,
  },
  radioButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: '#D1D5DB',
      marginBottom: 8,
  },
  radioCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#A0A3BD',
      marginRight: 8,
  },
  radioSelected: {
      backgroundColor: '#007AFF',
      borderColor: '#007AFF',
  },
  radioLabel: {
      fontSize: 16,
      color: '#333',
  },
  loginButton5: {
      backgroundColor: '#007AFF',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
  },
  loginButtonText5: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  },
});