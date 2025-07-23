import express from "express";
import axios from "axios";

const router = express.Router();

const HUGGINGFACE_API = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

const moodLabels = [
  "happy", "sad", "romantic", "chill", "party", "workout",
  "focus", "angry", "breakup", "motivational", "rainy"
];

router.post("/detect", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await axios.post(
      HUGGINGFACE_API,
      {
        inputs: text,
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
    console.error("NLP ERROR 💀:", err.message);
    res.status(500).json({ error: "Mood detection failed" });
  }
});

export default router;