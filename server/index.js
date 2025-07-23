import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// Importing mood route
import moodRoute from "./routes/moodRoute.js";
import fetch from "node-fetch";

dotenv.config();

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

// Default route (optional)
app.get("/", (req, res) => {
  res.send("SongoPlayz NLP API is live");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running at http://localhost:${PORT}`));