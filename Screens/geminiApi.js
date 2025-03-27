import axios from "axios";

const API_KEY = "AIzaSyCwYNN9dkTLDaFLDDbeetdCC56rClouL-0"; // Replace with your actual API key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

export const fetchGeminiResponse = async (message) => {
  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [{ parts: [{ text: message }] }],
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error fetching response from Gemini API:", error);
    return "I'm having trouble processing your request. Please try again.";
  }
};
