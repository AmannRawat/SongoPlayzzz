import express from "express";
import axios from "axios";

const router = express.Router();

const HUGGINGFACE_API = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";

// ADD THIS ARRAY DEFINITION BACK
const moodLabels = [
  "happy", "sad", "romantic", "chill", "party", "workout",
  "focus", "angry", "breakup", "motivational", "rainy"
];

router.post("/detect", async (req, res) => {
  const { text } = req.body;
  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY; 

  // Make sure the API key is actually loaded before proceeding
  if (!HF_API_KEY) {
    console.error("NLP ERROR 💀: Hugging Face API Key is not loaded!");
    return res.status(500).json({ error: "Server configuration error." });
  }

  try {
    const response = await axios.post(
      HUGGINGFACE_API,
      {
        inputs: text,
        // Now moodLabels is defined and can be used here
        parameters: { candidate_labels: moodLabels } 
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const topLabel = response.data?.labels?.[0] || "unknown";
    res.json({ mood: topLabel });
  } catch (err) {
    // Log the actual error from Hugging Face if it exists
    if (err.response) {
      console.error("NLP ERROR 💀:", err.response.data);
    } else {
      console.error("NLP ERROR 💀:", err.message);
    }
    res.status(500).json({ error: "Mood detection failed" });
  }
});

export default router;