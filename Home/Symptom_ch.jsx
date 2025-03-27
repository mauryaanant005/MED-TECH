import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const symptomsData = {
    Headache: {
      condition: 'Migraine or Tension Headache',
      causes: ['Stress', 'Dehydration', 'Eye strain'],
      precautions: [
        'Stay hydrated and avoid excessive caffeine',
        'Take regular breaks from screen time',
        'Practice relaxation techniques like deep breathing',
      ],
      doctorAdvice: 'If headaches persist or worsen, consult a neurologist.',
      additionalInfo: 'Migraines can last from hours to days, often accompanied by nausea and sensitivity to light.',
    },
    Fever: {
      condition: 'Viral or Bacterial Infection',
      causes: ['Flu', 'Common cold', 'Inflammatory response'],
      precautions: [
        'Stay hydrated and rest adequately',
        'Take paracetamol if fever is high',
        'Monitor for other symptoms like rash or breathing difficulty',
      ],
      doctorAdvice: 'Seek medical attention if fever lasts more than 3 days.',
      additionalInfo: 'High fever above 103°F may indicate a serious infection and requires immediate attention.',
    },
    Cough: {
      condition: 'Respiratory Infection or Allergy',
      causes: ['Cold or flu', 'Allergic reaction', 'Lung infection'],
      precautions: [
        'Drink warm fluids to soothe the throat',
        'Avoid smoking and exposure to dust',
        'Use a humidifier if air is dry',
      ],
      doctorAdvice: 'Persistent cough for more than 2 weeks requires a doctor visit.',
      additionalInfo: 'Chronic cough could be a symptom of asthma, GERD, or even lung diseases.',
    },

    Cold: {
        condition: 'Common Cold or Upper Respiratory Infection',
        causes: ['Viral infection', 'Weather changes', 'Weakened immune system'],
        precautions: [
          'Drink plenty of warm fluids',
          'Rest and avoid exposure to cold weather',
          'Use steam inhalation for nasal congestion',
        ],
        doctorAdvice: 'Seek medical attention if symptoms persist for more than 10 days.',
        additionalInfo: 'Common colds are typically viral and self-limiting but can lead to sinus infections if untreated.',
      },
      Flu: {
        condition: 'Influenza Virus Infection',
        causes: ['Influenza virus types A and B', 'Low immunity', 'Exposure to infected persons'],
        precautions: [
          'Get a flu vaccine annually',
          'Stay hydrated and get adequate rest',
          'Use antiviral medications if prescribed',
        ],
        doctorAdvice: 'Visit a doctor if flu symptoms are severe, especially for high-risk individuals.',
        additionalInfo: 'Flu can cause complications such as pneumonia, especially in the elderly and immunocompromised individuals.',
      },
      StomachPain: {
        condition: 'Gastrointestinal Issues',
        causes: ['Food poisoning', 'Indigestion', 'Gastritis or ulcers'],
        precautions: [
          'Avoid spicy and fatty foods',
          'Drink herbal teas to ease digestion',
          'Monitor bowel movements for abnormalities',
        ],
        doctorAdvice: 'Seek emergency care if pain is severe and accompanied by vomiting or fever.',
        additionalInfo: 'Chronic stomach pain may indicate peptic ulcers, IBS, or gallbladder disease.',
      },
      Vomiting: {
        condition: 'Gastrointestinal Distress or Infection',
        causes: ['Foodborne illness', 'Motion sickness', 'Migraine'],
        precautions: [
          'Stay hydrated with electrolyte drinks',
          'Avoid solid food until nausea subsides',
          'Rest in a cool, ventilated area',
        ],
        doctorAdvice: 'Persistent vomiting beyond 24 hours may require medical intervention.',
        additionalInfo: 'Frequent vomiting can lead to dehydration and electrolyte imbalance.',
      },
      Diarrhea: {
        condition: 'Infectious or Non-Infectious Gastroenteritis',
        causes: ['Viral or bacterial infection', 'Food intolerance', 'Contaminated water'],
        precautions: [
          'Drink oral rehydration solutions',
          'Avoid dairy and greasy foods',
          'Wash hands frequently to prevent infection',
        ],
        doctorAdvice: 'Seek medical help if diarrhea persists beyond 48 hours or is accompanied by blood.',
        additionalInfo: 'Chronic diarrhea may indicate Crohn’s disease, IBS, or lactose intolerance.',
      },
      Constipation: {
        condition: 'Slow Bowel Movements or Dietary Deficiency',
        causes: ['Low fiber intake', 'Dehydration', 'Lack of physical activity'],
        precautions: [
          'Increase fiber intake with fruits and vegetables',
          'Drink plenty of water daily',
          'Exercise regularly to stimulate bowel movement',
        ],
        doctorAdvice: 'Chronic constipation should be evaluated for potential underlying disorders.',
        additionalInfo: 'Untreated constipation can lead to hemorrhoids or fecal impaction.',
      },
      Fatigue: {
        condition: 'Chronic Fatigue Syndrome or Nutritional Deficiency',
        causes: ['Iron deficiency', 'Lack of sleep', 'Thyroid disorders'],
        precautions: [
          'Follow a balanced diet with adequate iron',
          'Maintain a consistent sleep schedule',
          'Limit caffeine intake in the evening',
        ],
        doctorAdvice: 'If fatigue persists despite lifestyle changes, seek medical evaluation.',
        additionalInfo: 'Persistent fatigue may indicate anemia, depression, or fibromyalgia.',
      },
      Depression: {
        condition: 'Major Depressive Disorder',
        causes: ['Genetics', 'Chronic stress', 'Neurotransmitter imbalance'],
        precautions: [
          'Engage in therapy or counseling',
          'Practice mindfulness and relaxation techniques',
          'Stay socially connected to supportive people',
        ],
        doctorAdvice: 'Severe depression requires psychiatric intervention.',
        additionalInfo: 'Untreated depression can lead to suicidal thoughts or self-harm tendencies.',
      },
      Anxiety: {
        condition: 'Generalized Anxiety Disorder or Panic Disorder',
        causes: ['Chronic stress', 'Genetic predisposition', 'Hormonal imbalances'],
        precautions: [
          'Practice deep breathing and relaxation exercises',
          'Avoid caffeine and stimulants',
          'Engage in physical activity to reduce stress',
        ],
        doctorAdvice: 'Seek medical help if anxiety interferes with daily activities.',
        additionalInfo: 'Long-term anxiety can contribute to heart disease, insomnia, and digestive problems.',
      },
      Hypertension: {
        condition: 'High Blood Pressure',
        causes: ['Excessive salt intake', 'Stress', 'Obesity'],
        precautions: [
          'Reduce sodium intake in diet',
          'Exercise regularly for heart health',
          'Monitor blood pressure levels frequently',
        ],
        doctorAdvice: 'Chronic hypertension needs medical treatment to prevent heart disease.',
        additionalInfo: 'Uncontrolled hypertension can lead to stroke, kidney disease, and vision loss.',
      },
      HeartPalpitations: {
        condition: 'Arrhythmia or Anxiety-Related Palpitations',
        causes: ['Caffeine consumption', 'Stress', 'Heart disease'],
        precautions: [
          'Limit intake of caffeine and alcohol',
          'Practice relaxation techniques like yoga',
          'Monitor heart rate during episodes',
        ],
        doctorAdvice: 'Persistent palpitations should be checked by a cardiologist.',
        additionalInfo: 'Heart palpitations can sometimes indicate atrial fibrillation or heart failure.',
      },
      SwollenFeet: {
        condition: 'Edema or Poor Circulation',
        causes: ['Prolonged sitting', 'Kidney disease', 'Heart failure'],
        precautions: [
          'Keep legs elevated when sitting',
          'Reduce salt intake to prevent fluid retention',
          'Wear compression socks if necessary',
        ],
        doctorAdvice: 'Chronic swelling may indicate serious circulatory issues.',
        additionalInfo: 'Persistent swelling may be linked to deep vein thrombosis or lymphedema.',
      },
      HairLoss: {
        condition: 'Alopecia or Nutritional Deficiency',
        causes: ['Hormonal changes', 'Iron deficiency', 'Genetic predisposition'],
        precautions: [
          'Increase intake of biotin and iron-rich foods',
          'Avoid excessive heat styling and harsh chemicals',
          'Massage scalp with essential oils for stimulation',
        ],
        doctorAdvice: 'Consult a dermatologist if hair loss is excessive and persistent.',
        additionalInfo: 'Severe hair loss may be linked to thyroid dysfunction or autoimmune disorders.',
      },
      WeakBones: {
        condition: 'Osteoporosis or Calcium Deficiency',
        causes: ['Aging', 'Vitamin D deficiency', 'Hormonal imbalances'],
        precautions: [
          'Consume calcium-rich foods like dairy and leafy greens',
          'Engage in weight-bearing exercises',
          'Get adequate sun exposure for vitamin D synthesis',
        ],
        doctorAdvice: 'Bone density tests may be needed for elderly individuals.',
        additionalInfo: 'Osteoporosis increases the risk of fractures, especially in older adults.',
      },
      FrequentUrination: {
        condition: 'Diabetes or Urinary Tract Infection',
        causes: ['High blood sugar levels', 'Bladder irritation', 'Kidney dysfunction'],
        precautions: [
          'Monitor blood sugar levels if diabetic',
          'Drink plenty of water to flush toxins',
          'Avoid caffeine and spicy foods',
        ],
        doctorAdvice: 'Frequent urination accompanied by pain should be checked for UTIs.',
        additionalInfo: 'Chronic urination issues may indicate interstitial cystitis or prostate problems.',
      },
      ChestPain: {
    condition: 'Heart Disease or Acid Reflux',
    causes: ['Angina or heart attack', 'GERD', 'Anxiety'],
    precautions: [
      'Avoid heavy meals before sleeping',
      'Reduce stress and practice deep breathing',
      'Seek immediate medical help for severe pain',
    ],
    doctorAdvice: 'Severe or radiating chest pain needs emergency care.',
    additionalInfo: 'Heart-related chest pain is usually accompanied by shortness of breath and sweating.',
  },
  JointPain: {
    condition: 'Arthritis or Inflammation',
    causes: ['Osteoarthritis', 'Rheumatoid arthritis', 'Injury'],
    precautions: [
      'Maintain a healthy weight to reduce joint stress',
      'Engage in low-impact exercises like swimming',
      'Apply warm or cold packs for relief',
    ],
    doctorAdvice: 'Chronic joint pain should be assessed for arthritis or autoimmune disorders.',
    additionalInfo: 'Untreated joint pain can lead to mobility issues and joint deformity.',
  },
  BackPain: {
    condition: 'Muscle Strain or Spinal Issue',
    causes: ['Poor posture', 'Herniated disc', 'Osteoporosis'],
    precautions: [
      'Practice good posture while sitting and standing',
      'Use a firm mattress for sleeping',
      'Engage in stretching exercises',
    ],
    doctorAdvice: 'Persistent or severe back pain requires a doctor’s evaluation.',
    additionalInfo: 'Sciatica and spinal stenosis are common causes of chronic back pain.',
  },
  Dizziness: {
    condition: 'Low Blood Pressure or Inner Ear Disorder',
    causes: ['Dehydration', 'Vertigo', 'Anemia'],
    precautions: [
      'Drink plenty of fluids to stay hydrated',
      'Stand up slowly from sitting or lying down',
      'Avoid sudden head movements',
    ],
    doctorAdvice: 'Frequent dizziness should be checked for underlying conditions.',
    additionalInfo: 'Severe dizziness can indicate Meniere’s disease or neurological disorders.',
  },
  Fever: {
    condition: 'Viral or Bacterial Infection',
    causes: ['Flu', 'COVID-19', 'Malaria'],
    precautions: [
      'Stay hydrated and rest well',
      'Take paracetamol if needed',
      'Use cold compress to lower body temperature',
    ],
    doctorAdvice: 'Seek medical attention if fever exceeds 102°F (39°C) or lasts more than 3 days.',
    additionalInfo: 'Prolonged fever can indicate typhoid, tuberculosis, or dengue fever.',
  },
  Insomnia: {
    condition: 'Sleep Disorder or Anxiety',
    causes: ['Stress', 'Poor sleep hygiene', 'Caffeine intake'],
    precautions: [
      'Follow a consistent sleep schedule',
      'Avoid screens before bedtime',
      'Practice meditation and relaxation techniques',
    ],
    doctorAdvice: 'Chronic insomnia may require cognitive behavioral therapy or medication.',
    additionalInfo: 'Untreated insomnia can lead to mental health disorders and impaired daily function.',
  },
  SkinRash: {
    condition: 'Allergy or Skin Infection',
    causes: ['Eczema', 'Fungal infection', 'Contact dermatitis'],
    precautions: [
      'Avoid irritants like harsh soaps and synthetic fabrics',
      'Use hypoallergenic skincare products',
      'Keep skin moisturized and hydrated',
    ],
    doctorAdvice: 'If rashes persist or spread, consult a dermatologist.',
    additionalInfo: 'Severe skin rashes can be associated with lupus or psoriasis.',
  },
  SoreThroat: {
    condition: 'Viral or Bacterial Infection',
    causes: ['Strep throat', 'Cold or flu', 'Allergies'],
    precautions: [
      'Gargle with warm salt water',
      'Drink warm teas and honey',
      'Avoid smoking and pollutants',
    ],
    doctorAdvice: 'If sore throat lasts more than a week, get tested for bacterial infections.',
    additionalInfo: 'Untreated strep throat can lead to complications like rheumatic fever.',
  },
  BlurredVision: {
    condition: 'Eye Strain or Diabetes-Related Retinopathy',
    causes: ['Dry eyes', 'High blood sugar', 'Nerve damage'],
    precautions: [
      'Reduce screen time and take breaks',
      'Use artificial tears if eyes feel dry',
      'Maintain good blood sugar levels',
    ],
    doctorAdvice: 'Persistent blurred vision needs an eye exam.',
    additionalInfo: 'Severe vision issues could indicate glaucoma or cataracts.',
  },
  NightSweats: {
    condition: 'Hormonal Imbalance or Infection',
    causes: ['Menopause', 'Tuberculosis', 'Hyperthyroidism'],
    precautions: [
      'Keep room temperature cool at night',
      'Avoid spicy foods before bed',
      'Stay hydrated throughout the day',
    ],
    doctorAdvice: 'Frequent night sweats may require a medical checkup.',
    additionalInfo: 'Serious causes include leukemia and endocarditis.',
  },
  WeightLoss: {
    condition: 'Malnutrition or Metabolic Disorder',
    causes: ['Hyperthyroidism', 'Cancer', 'Diabetes'],
    precautions: [
      'Consume a nutrient-rich diet',
      'Monitor calorie intake and appetite changes',
      'Stay physically active but avoid excessive exercise',
    ],
    doctorAdvice: 'Unexplained weight loss should be investigated.',
    additionalInfo: 'Drastic weight loss may be linked to celiac disease or malabsorption syndromes.',
  },
  WeightGain: {
    condition: 'Obesity or Hormonal Changes',
    causes: ['Hypothyroidism', 'PCOS', 'Medication side effects'],
    precautions: [
      'Follow a balanced diet and avoid junk food',
      'Engage in regular physical activity',
      'Monitor weight changes and hormonal levels',
    ],
    doctorAdvice: 'Persistent unexplained weight gain needs a doctor’s evaluation.',
    additionalInfo: 'Conditions like Cushing’s syndrome and fluid retention can also cause weight gain.',
  },
  DryMouth: {
    condition: 'Dehydration or Salivary Gland Dysfunction',
    causes: ['Diabetes', 'Side effects of medication', 'Sjogren’s syndrome'],
    precautions: [
      'Drink water frequently and avoid caffeine',
      'Use sugar-free gum or lozenges',
      'Maintain good oral hygiene',
    ],
    doctorAdvice: 'Chronic dry mouth may require a salivary gland assessment.',
    additionalInfo: 'Persistent dryness can lead to dental decay and difficulty swallowing.',
  },
  ShortnessOfBreath: {
    condition: 'Lung or Heart Disease',
    causes: ['Asthma', 'COPD', 'Heart failure'],
    precautions: [
      'Avoid smoking and pollutants',
      'Practice deep breathing exercises',
      'Use prescribed inhalers if necessary',
    ],
    doctorAdvice: 'Sudden or severe breathing difficulty requires emergency care.',
    additionalInfo: 'Breathing issues may indicate pulmonary embolism or heart conditions.',
  },
  EarPain: {
    condition: 'Ear Infection or Sinus Pressure',
    causes: ['Otitis media', 'Wax buildup', 'Allergies'],
    precautions: [
      'Avoid inserting objects into the ear',
      'Use warm compresses for pain relief',
      'Treat nasal congestion to reduce ear pressure',
    ],
    doctorAdvice: 'Persistent or severe ear pain requires an ENT specialist.',
    additionalInfo: 'Untreated ear infections can lead to hearing loss or eardrum perforation.',
  },
  ChestPain: {
    condition: 'Heart Disease or Acid Reflux',
    causes: ['Angina or heart attack', 'GERD', 'Anxiety'],
    precautions: [
      'Avoid heavy meals before sleeping',
      'Reduce stress and practice deep breathing',
      'Seek immediate medical help for severe pain',
    ],
    doctorAdvice: 'Severe or radiating chest pain needs emergency care.',
    additionalInfo: 'Heart-related chest pain is usually accompanied by shortness of breath and sweating.',
  },
  JointPain: {
    condition: 'Arthritis or Inflammation',
    causes: ['Osteoarthritis', 'Rheumatoid arthritis', 'Injury'],
    precautions: [
      'Maintain a healthy weight to reduce joint stress',
      'Engage in low-impact exercises like swimming',
      'Apply warm or cold packs for relief',
    ],
    doctorAdvice: 'Chronic joint pain should be assessed for arthritis or autoimmune disorders.',
    additionalInfo: 'Untreated joint pain can lead to mobility issues and joint deformity.',
  },
  BackPain: {
    condition: 'Muscle Strain or Spinal Issue',
    causes: ['Poor posture', 'Herniated disc', 'Osteoporosis'],
    precautions: [
      'Practice good posture while sitting and standing',
      'Use a firm mattress for sleeping',
      'Engage in stretching exercises',
    ],
    doctorAdvice: 'Persistent or severe back pain requires a doctor’s evaluation.',
    additionalInfo: 'Sciatica and spinal stenosis are common causes of chronic back pain.',
  },
  Dizziness: {
    condition: 'Low Blood Pressure or Inner Ear Disorder',
    causes: ['Dehydration', 'Vertigo', 'Anemia'],
    precautions: [
      'Drink plenty of fluids to stay hydrated',
      'Stand up slowly from sitting or lying down',
      'Avoid sudden head movements',
    ],
    doctorAdvice: 'Frequent dizziness should be checked for underlying conditions.',
    additionalInfo: 'Severe dizziness can indicate Meniere’s disease or neurological disorders.',
  },
  Fever: {
    condition: 'Viral or Bacterial Infection',
    causes: ['Flu', 'COVID-19', 'Malaria'],
    precautions: [
      'Stay hydrated and rest well',
      'Take paracetamol if needed',
      'Use cold compress to lower body temperature',
    ],
    doctorAdvice: 'Seek medical attention if fever exceeds 102°F (39°C) or lasts more than 3 days.',
    additionalInfo: 'Prolonged fever can indicate typhoid, tuberculosis, or dengue fever.',
  },
  Insomnia: {
    condition: 'Sleep Disorder or Anxiety',
    causes: ['Stress', 'Poor sleep hygiene', 'Caffeine intake'],
    precautions: [
      'Follow a consistent sleep schedule',
      'Avoid screens before bedtime',
      'Practice meditation and relaxation techniques',
    ],
    doctorAdvice: 'Chronic insomnia may require cognitive behavioral therapy or medication.',
    additionalInfo: 'Untreated insomnia can lead to mental health disorders and impaired daily function.',
  },
  SkinRash: {
    condition: 'Allergy or Skin Infection',
    causes: ['Eczema', 'Fungal infection', 'Contact dermatitis'],
    precautions: [
      'Avoid irritants like harsh soaps and synthetic fabrics',
      'Use hypoallergenic skincare products',
      'Keep skin moisturized and hydrated',
    ],
    doctorAdvice: 'If rashes persist or spread, consult a dermatologist.',
    additionalInfo: 'Severe skin rashes can be associated with lupus or psoriasis.',
  },
  SoreThroat: {
    condition: 'Viral or Bacterial Infection',
    causes: ['Strep throat', 'Cold or flu', 'Allergies'],
    precautions: [
      'Gargle with warm salt water',
      'Drink warm teas and honey',
      'Avoid smoking and pollutants',
    ],
    doctorAdvice: 'If sore throat lasts more than a week, get tested for bacterial infections.',
    additionalInfo: 'Untreated strep throat can lead to complications like rheumatic fever.',
  },
  BlurredVision: {
    condition: 'Eye Strain or Diabetes-Related Retinopathy',
    causes: ['Dry eyes', 'High blood sugar', 'Nerve damage'],
    precautions: [
      'Reduce screen time and take breaks',
      'Use artificial tears if eyes feel dry',
      'Maintain good blood sugar levels',
    ],
    doctorAdvice: 'Persistent blurred vision needs an eye exam.',
    additionalInfo: 'Severe vision issues could indicate glaucoma or cataracts.',
  },
  NightSweats: {
    condition: 'Hormonal Imbalance or Infection',
    causes: ['Menopause', 'Tuberculosis', 'Hyperthyroidism'],
    precautions: [
      'Keep room temperature cool at night',
      'Avoid spicy foods before bed',
      'Stay hydrated throughout the day',
    ],
    doctorAdvice: 'Frequent night sweats may require a medical checkup.',
    additionalInfo: 'Serious causes include leukemia and endocarditis.',
  },
  WeightLoss: {
    condition: 'Malnutrition or Metabolic Disorder',
    causes: ['Hyperthyroidism', 'Cancer', 'Diabetes'],
    precautions: [
      'Consume a nutrient-rich diet',
      'Monitor calorie intake and appetite changes',
      'Stay physically active but avoid excessive exercise',
    ],
    doctorAdvice: 'Unexplained weight loss should be investigated.',
    additionalInfo: 'Drastic weight loss may be linked to celiac disease or malabsorption syndromes.',
  },
  WeightGain: {
    condition: 'Obesity or Hormonal Changes',
    causes: ['Hypothyroidism', 'PCOS', 'Medication side effects'],
    precautions: [
      'Follow a balanced diet and avoid junk food',
      'Engage in regular physical activity',
      'Monitor weight changes and hormonal levels',
    ],
    doctorAdvice: 'Persistent unexplained weight gain needs a doctor’s evaluation.',
    additionalInfo: 'Conditions like Cushing’s syndrome and fluid retention can also cause weight gain.',
  },
  DryMouth: {
    condition: 'Dehydration or Salivary Gland Dysfunction',
    causes: ['Diabetes', 'Side effects of medication', 'Sjogren’s syndrome'],
    precautions: [
      'Drink water frequently and avoid caffeine',
      'Use sugar-free gum or lozenges',
      'Maintain good oral hygiene',
    ],
    doctorAdvice: 'Chronic dry mouth may require a salivary gland assessment.',
    additionalInfo: 'Persistent dryness can lead to dental decay and difficulty swallowing.',
  },
  ShortnessOfBreath: {
    condition: 'Lung or Heart Disease',
    causes: ['Asthma', 'COPD', 'Heart failure'],
    precautions: [
      'Avoid smoking and pollutants',
      'Practice deep breathing exercises',
      'Use prescribed inhalers if necessary',
    ],
    doctorAdvice: 'Sudden or severe breathing difficulty requires emergency care.',
    additionalInfo: 'Breathing issues may indicate pulmonary embolism or heart conditions.',
  },
  EarPain: {
    condition: 'Ear Infection or Sinus Pressure',
    causes: ['Otitis media', 'Wax buildup', 'Allergies'],
    precautions: [
      'Avoid inserting objects into the ear',
      'Use warm compresses for pain relief',
      'Treat nasal congestion to reduce ear pressure',
    ],
    doctorAdvice: 'Persistent or severe ear pain requires an ENT specialist.',
    additionalInfo: 'Untreated ear infections can lead to hearing loss or eardrum perforation.',
  },
};

export default function SymptomChecker() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'white';
  const [inputSymptom, setInputSymptom] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [text, setText] = useState('');
  const navigation = useNavigation();

  const handleCheckSymptom = () => {
    setLoading(true);
    setTimeout(() => {
      const symptom = inputSymptom.trim().toLowerCase();
      const foundSymptom = Object.keys(symptomsData).find(
        key => key.toLowerCase() === symptom
      );
  
      if (foundSymptom) {
        setDiagnosis(symptomsData[foundSymptom]);
      } else {
        setDiagnosis({
          condition: 'No match found',
          causes: ['Symptom not in database'],
          precautions: ['Try rephrasing your symptom or consulting a doctor.'],
          doctorAdvice: 'If symptoms persist, seek medical advice.',
        });
      }
      setLoading(false);
    }, 1500);
  };
  
  const openWikipedia = (symptom) => {
    const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(inputSymptom)}`;
    Linking.openURL(wikiUrl).catch((err) =>
      console.error('Failed to open URL:', err)
    );
  };
  
 

  return (
    <ScrollView>
    <View style={[styles.container, isDark && styles.containerDark]}>
       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <FontAwesome name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
      <Text style={[styles.title, isDark && styles.textDark]}> Symptom Checker</Text>
      
      <TextInput
        style={[styles.input, isDark && styles.inputDark]}
        placeholder="Enter your symptom (e.g., Headache)"
        placeholderTextColor={isDark ? '#aaa' : '#666'}
        value={text || inputSymptom}
        onChangeText={(value) => {
          setText('');
          setInputSymptom(value);
        }}
        multiline
      />

         
      
      <TouchableOpacity
        style={[styles.checkButton, loading && styles.checkButtonDisabled]}
        onPress={handleCheckSymptom}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.checkButtonText}>Check</Text>}
      </TouchableOpacity>

      {diagnosis && (
        <Animated.View entering={FadeInDown} style={[styles.diagnosisCard, isDark && styles.diagnosisCardDark]}>
          <Text style={[styles.diagnosisTitle, isDark && styles.textDark]}>Possible Condition: {diagnosis.condition}</Text>
          <Text style={[styles.diagnosisText, isDark && styles.textDark]}>Causes:</Text>
          {diagnosis.causes.map((cause, index) => (
            <Text key={index} style={styles.bulletText}>• {cause}</Text>
          ))}
          <Text style={[styles.diagnosisText, isDark && styles.textDark]}>Precautions:</Text>
          {diagnosis.precautions.map((precaution, index) => (
            <Text key={index} style={styles.bulletText}>• {precaution}</Text>
          ))}
          <Text style={[styles.diagnosisText, isDark && styles.textDark]}>Doctor's Advice:</Text>
          <Text style={styles.bulletText}>{diagnosis.doctorAdvice}</Text>
          
          <Text style={[styles.diagnosisText, isDark && styles.textDark]}>Note:</Text>
          {diagnosis.additionalInfo && (
            
            <Text style={[styles.additionalInfo, isDark && styles.textDark]}>{diagnosis.additionalInfo}</Text>
          )}
          
          <TouchableOpacity onPress={() => openWikipedia(inputSymptom)}>
             <Text style={[styles.moreInfoText, isDark && styles.textDark]}>For More Info</Text>
          </TouchableOpacity>

          <Text style={[styles.disclaimer, isDark && styles.textDark]}>
            ⚠️ Disclaimer: Consult your doctor before making any medical decisions. This tool is for informational purposes only.
          </Text>
        </Animated.View>
      )}
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f8',marginBottom: 10},
  backButton: { marginTop: 30, marginBottom: 20 },
  containerDark: { backgroundColor: '#1e1e1e' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#222',textAlign:'center' },
  textDark: { color: '#fff' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16,marginTop:20 },
  inputDark: { backgroundColor: '#333', color: '#fff' },
  checkButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  label: { marginTop: 20, fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
  buttonContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 10 },
  symptomButton: { backgroundColor: '#e0e0e0', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, margin: 5 },
  buttonText: { fontSize: 16, textAlign: 'center' },
  checkButton: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 10, alignItems: 'center' },
  checkButtonDisabled: { opacity: 0.6 },
  checkButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  diagnosisCard: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginTop: 20 },
  diagnosisCardDark: { backgroundColor: '#333' },
  diagnosisTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  diagnosisText: { fontSize: 16, fontWeight: '600', marginTop: 10 },
  bulletText: { fontSize: 14, marginTop: 4, color: '#444' },
  additionalInfo: { fontSize: 14, fontStyle: 'italic', marginTop: 10, color: '#888' },
  disclaimer: { fontSize: 9, marginTop: 15, color: 'gray', fontWeight: 'bold', textAlign: 'center' },
  moreInfoText: {    fontSize: 14,    color: '#007bff',   marginTop: 10,    textDecorationLine: 'underline',    fontWeight: '600',  },
  
});
