from flask import Flask, request, jsonify
import pickle
import numpy as np
import logging
import os
import pandas as pd
from sklearn import __version__ as sklearn_version

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# 🔥 Ensure the model file path is correct
model_path = os.path.join(os.path.dirname(__file__), "svc.pkl")

# Load the model safely
try:
    with open(model_path, "rb") as model_file:
        model_info = pickle.load(model_file)
        
        # Check for scikit-learn version
        if hasattr(model_info, "_sklearn_version"):
            logger.info(f"Model trained with scikit-learn version: {model_info._sklearn_version}")
            logger.info(f"Current scikit-learn version: {sklearn_version}")

        model = model_info
    logger.info("✅ Model loaded successfully.")
except Exception as e:
    logger.error(f"❌ Error loading model: {e}")
    model = None

# 🩺 Health check endpoint
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "model_loaded": model is not None})

# 🔥 Define all possible symptoms from training data
ALL_FEATURES = [
    "itching", "headache", "nausea", "fatigue", "restlessness", "skin_rash",
    "abdominal_pain", "abnormal_menstruation", "acidity", "acute_liver_failure",
    "altered_sensorium", "vomiting", "yellowish_skin", "high_fever", "indigestion",
    "anxiety", "back_pain", "belly_pain", "blackheads", "bladder_discomfort"
]  # Add all trained model features

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data or "features" not in data:
            return jsonify({"error": "No features provided"}), 400

        symptoms = data["features"]
        logger.info(f"🛠 Received symptoms: {symptoms}")

        features = process_symptoms(symptoms)  # ✅ Fixed function
        logger.info(f"📊 Processed feature vector: \n{features}")

        if model is None:
            return jsonify({"error": "Model not loaded"}), 500

        prediction = model.predict(features)
        logger.info(f"🔮 Prediction output: {prediction}")

        response = {
            "disease": get_disease_description(prediction[0]),
            "precautions": get_precautions(prediction[0]),
            "medications": get_medications(prediction[0])
        }
        return jsonify(response)

    except Exception as e:
        logger.error(f"🚨 ERROR: {str(e)}")
        return jsonify({"error": str(e)}), 500


# ✅ Convert symptoms into a feature vector matching the trained model
# Define the complete list of symptoms used during training
symptomsList = [
    "itching", "headache", "nausea", "fatigue", "restlessness", "skin_rash",
    "anxiety", "back_pain", "belly_pain", "blackheads", "bladder_discomfort",
    "abdominal_pain", "abnormal_menstruation", "acidity", "acute_liver_failure",
    "altered_sensorium", "vomiting", "yellowish_skin", "high_fever", "indigestion",
    "yellowing_of_eyes", "yellow_urine", "weight_loss", "weakness_of_one_body_side",
    "watering_from_eyes", "visual_disturbances", "ulcers_on_tongue", "unsteadiness",
    "stomach_bleeding", "stiff_neck", "spinning_movements", "small_dents_in_nails",
    "sinus_pressure", "silver_like_dusting", "shivering", "scurring", "sweating",
    "swelling_joints", "swelling_of_stomach", "swollen_extremeties", "sunken_eyes",
    "stomach_pain", "stomach_bleeding", "skin_peeling", "skin_peeling", "skin_rash",
    "skin_redness", "skin_peeling", "skin_peeling", "skin_rash", "skin_redness",
    "skin_peeling", "skin_peeling", "skin_rash", "skin_redness", "skin_peeling",
    "skin_peeling", "skin_rash", "skin_redness", "skin_peeling", "skin_peeling",
    
    # Add all missing symptoms from your training dataset
]

def process_symptoms(symptoms):
    # Create a feature vector with all symptoms, setting 1 if present, else 0
    feature_vector = [1 if symptom in symptoms else 0 for symptom in symptomsList]

    # Convert to DataFrame with correct feature names
    df = pd.DataFrame([feature_vector], columns=symptomsList)

    return df


# 🔍 Example function to map predictions to disease names
def get_disease_description(prediction):
    disease_mapping = {
        0: "Disease A",
        1: "Disease B",
        2: "Disease C"
    }
    return disease_mapping.get(prediction, "Unknown Disease")


# 🏥 Example function for precautions
def get_precautions(prediction):
    precautions_mapping = {
        0: "Avoid allergens and stay hydrated.",
        1: "Get plenty of rest and take prescribed medications.",
        2: "Consult a doctor for a proper diagnosis."
    }
    return precautions_mapping.get(prediction, "General Precautionary Advice")


# 💊 Example function for medications
def get_medications(prediction):
    medications_mapping = {
        0: "Medication A for Disease A",
        1: "Medication B for Disease B",
        2: "Medication C for Disease C"
    }
    return medications_mapping.get(prediction, "Consult a healthcare provider for medication.")


if __name__ == "__main__":
    if model is None:
        logger.error("❌ Cannot start application: Model not loaded")
        exit(1)
    
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
