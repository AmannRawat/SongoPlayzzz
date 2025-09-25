// import dotenv from "dotenv";
// dotenv.config();

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// This explicitly finds and loads .env file.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, './.env') });

//checker
// console.log("From index.js, API Key is:", process.env.HUGGINGFACE_API_KEY); 


import express from "express";
import cors from "cors";
// Importing mood route
import moodRoute from "./routes/moodRoute.js";
import fetch from "node-fetch";


const app = express();

// Middleware setup
app.use(cors());
app.use(express.json()); // to parse JSON bodies

//  Use the route
app.use("/api/mood", moodRoute);

app.post("/api/autocomplete", async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim().length < 2) {
    return res.status(400).json({ error: "Invalid query" });
  }

  try {
    const response = await fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    res.json({ suggestions: data[1] });
  } catch (error) {
    console.error("Autocomplete fetch error:", error);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

app.get("/api/search", async (req, res) => {
  const { query } = req.query; // Search queries usually come from URL query params

  if (!query) {
    return res.status(400).json({ error: "Search query is missing" });
  }

  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  if (!YOUTUBE_API_KEY) {
    console.error("YOUTUBE API Key is not loaded!");
    return res.status(500).json({ error: "Server configuration error." });
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&key=${YOUTUBE_API_KEY}&type=video&maxResults=10`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("YouTube API Error:", data.error.message);
      return res.status(500).json({ error: data.error.message });
    }

    res.json(data.items); // Send the array of video items back to the front-end
  } catch (error) {
    console.error("Server search error:", error);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running at http://localhost:${PORT}`));