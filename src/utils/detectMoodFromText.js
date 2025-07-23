import axios from "axios";

export const detectMoodFromText = async (text) => {
  try {
    const response = await axios.post("http://localhost:5000/api/detect-mood", {
      text,
    });
    return response.data.mood;
  } catch (error) {
    console.error("Mood detection failed:", error);
    return null;
  }
};