import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const categories = [
  { 
    id: 1, 
    name: "Eye Infection", 
    image: require('../../assets/images/eyeinfection.png'), 
    medicines: [
      { 
        name: "Refresh Tears Eye Drop", 
        description: "Used for dry eyes and bacterial infections.", 
        price: "$5", 
        image: require('../../assets/images/eyeone.png'),
        details: {
          sideEffects: "Most side effects do not require any medical attention and disappear as your body adjusts to the medicine. Consult your doctor if they persist or if you’re worried about them Common side effects of Refresh Eye irritation Burning eyes Eye itching Eye pain Eye discomfort",
          howToUse: "This medicine is for external use only. Use it in the dose and duration as advised by your doctor. Check the label for directions before use. Hold the dropper close to the eye without touching it. Gently squeeze the dropper and place the medicine inside the lower eyelid. Wipe off the extra liquid.",
          howItWorks: "Refresh Tears Eye Drop is a lubricant. It works similar to natural tears and provides temporary relief from burning and discomfort due to dryness of the eye.",
          safetyAdvice: "Do not touch the dropper tip. Do not use expired medicine."
        }
      },
      { 
        name: "Lubistar 0.5% Eye Drop", 
        description: "Antibiotic eye drops for infections.", 
        price: "$7", 
        image: require('../../assets/images/eyetwo.png'),
        details: {
          sideEffects: "Most side effects do not require any medical attention and disappear as your body adjusts to the medicine. Consult your doctor if they persist or if you’re worried about them Common side effects of Lubistar Application site reactions (burning, irritation, itching and redness) Blurred vision",
          howToUse: "This medicine is for external use only. Use it in the dose and duration as advised by your doctor. Check the label for directions before use. Hold the dropper close to the eye without touching it. Gently squeeze the dropper and place the medicine inside the lower eyelid. Wipe off the extra liquid.",
          howItWorks: "Lubistar 0.5% Eye Drop is a combination of two medicines: Carboxymethylcellulose and Oxychloro Complex. Carboxymethylcellulose is a lubricating medicine similar to natural tears. It provides temporary relief of burning and discomfort due to dryness of the eye. Oxychloro Complex is a preservative.",
          safetyAdvice: "Avoid using if you have an allergy to any ingredient."
        }
      },
      { 
        name: "Moxifloxacin", 
        description: "Antibiotic eye drops for infections.", 
        price: "$7", 
        image: require('../../assets/images/eyethree.png'),
        details: {
          sideEffects: "Most side effects do not require any medical attention and disappear as your body adjusts to the medicine. Consult your doctor if they persist or if you’re worried about them Common side effects of Moxifloxacin Application site reactions Blood and Lymphatic System - Anemia, eosinophilia, decrease in white blood cells and platelets.Heart - Palpitations, fast or slow heart rate, heart failure, high or low blood pressure and chest pain.Eye and ENT - Ringing in the ear and blurred vision.Gastrointestinal - Dry mouth, diarrhea, vomiting, constipation, abdominal pain/discomfort, flatulence, abdominal distention, stomach inflammation and reflux.",
          howToUse: "Moxifloxacin is used in the treatment of bacterial infections and bacterial eye infections. It is also used in infections of urinary tract, tonsils, sinus, nose, throat, female genital organ, skin & soft tissues and lungs (pneumonia).",
          howItWorks: "Moxifloxacin is an antibiotic. It works by stopping the action of a bacterial enzyme called DNA-gyrase. This prevents the bacterial cells from dividing and repairing, thereby killing them.",
          safetyAdvice: "Avoid excess dosage."
        }
      }
    ]
  },
  { 
    id: 2, 
    name: "Fever", 
    image: require('../../assets/images/fever.png'), 
    medicines: [
      { 
        name: "Paracetamol", 
        description: "Reduces fever and relieves pain.", 
        price: "$3", 
        image: require('../../assets/images/logo.png'),
        details: {
          sideEffects: "Nausea, liver damage in high doses.",
          howToUse: "Take 500mg every 6 hours with food.",
          howItWorks: "Blocks pain signals and reduces fever.",
          safetyAdvice: "Avoid alcohol while taking this medicine."
        }
      }
    ]
  },
  { 
    id: 3, 
    name: "Fever", 
    image: require('../../assets/images/fever.png'), 
    medicines: [
      { 
        name: "Paracetamol", 
        description: "Reduces fever and relieves pain.", 
        price: "$3", 
        image: require('../../assets/images/logo.png'),
        details: {
          sideEffects: "Nausea, liver damage in high doses.",
          howToUse: "Take 500mg every 6 hours with food.",
          howItWorks: "Blocks pain signals and reduces fever.",
          safetyAdvice: "Avoid alcohol while taking this medicine."
        }
      }
    ]
  },
  { 
    id: 4, 
    name: "Fever", 
    image: require('../../assets/images/fever.png'), 
    medicines: [
      { 
        name: "Paracetamol", 
        description: "Reduces fever and relieves pain.", 
        price: "$3", 
        image: require('../../assets/images/logo.png'),
        details: {
          sideEffects: "Nausea, liver damage in high doses.",
          howToUse: "Take 500mg every 6 hours with food.",
          howItWorks: "Blocks pain signals and reduces fever.",
          safetyAdvice: "Avoid alcohol while taking this medicine."
        }
      }
    ]
  },
  { 
    id: 5, 
    name: "Fever", 
    image: require('../../assets/images/fever.png'), 
    medicines: [
      { 
        name: "Paracetamol", 
        description: "Reduces fever and relieves pain.", 
        price: "$3", 
        image: require('../../assets/images/logo.png'),
        details: {
          sideEffects: "Nausea, liver damage in high doses.",
          howToUse: "Take 500mg every 6 hours with food.",
          howItWorks: "Blocks pain signals and reduces fever.",
          safetyAdvice: "Avoid alcohol while taking this medicine."
        }
      }
    ]
  },
  { 
    id: 6, 
    name: "Fever", 
    image: require('../../assets/images/fever.png'), 
    medicines: [
      { 
        name: "Paracetamol", 
        description: "Reduces fever and relieves pain.", 
        price: "$3", 
        image: require('../../assets/images/logo.png'),
        details: {
          sideEffects: "Nausea, liver damage in high doses.",
          howToUse: "Take 500mg every 6 hours with food.",
          howItWorks: "Blocks pain signals and reduces fever.",
          safetyAdvice: "Avoid alcohol while taking this medicine."
        }
      }
    ]
  },
  
  
  
  
];


export default function MedicineCategories() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  return (
    
    <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}> 
        <FontAwesome name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerText}>Choose Category</Text>
    </View>
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.grid}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={[styles.card, selected === item.id && styles.selectedCard]} 
          onPress={() => router.push({ pathname: "/Home/MedicineList", params: { category: JSON.stringify(item) } })}
        >
          <Image source={item.image} style={styles.image} />
          <Text style={styles.text}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#4285F4", paddingVertical: 15, paddingHorizontal: 15 },
  backButton: { position: "absolute", left: 20, zIndex: 1 },
  headerText: { fontSize: 20, color: "#fff", fontWeight: "bold", marginLeft: 40 },
  grid: { paddingHorizontal: 10, paddingTop: 10 },
  card: { 
    flex: 1, 
    margin: 8, 
    alignItems: "center", 
    padding: 20, // Increased padding
    height: 150, // Increased height
    backgroundColor: "#EAF3FF", 
    borderRadius: 15, 
    elevation: 3 
  },
  selectedCard: { borderWidth: 3, borderColor: "#007BFF" },
  image: { width: 140, height: 100, borderRadius: 15 },
  text: { marginTop: 5, fontSize: 16, textAlign: "center", fontWeight: "600" }
});
