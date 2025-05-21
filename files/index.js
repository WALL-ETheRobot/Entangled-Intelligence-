import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve frontend from /public
app.use(express.static(path.join(__dirname, "public")));

const API_KEY = process.env.GENAI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

app.post("/ask", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }
  try {
    const payload = { contents: [{ parts: [{ text: prompt }] }] };
    const response = await axios.post(API_URL, payload, {
      headers: { "Content-Type": "application/json" }
    });
    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    res.json({ response: reply });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Fallback for front-end SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});