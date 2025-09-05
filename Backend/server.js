// Backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// ✅ Route for generating images
app.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("🎨 Received prompt:", prompt);

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "512x512",
    });

    console.log("✅ Image generated:", response.data[0].url);

    res.json({ imageUrl: response.data[0].url });
  } catch (error) {
    console.error("❌ OpenAI error details:", error);

    // If OpenAI sends structured error
    if (error.response) {
      console.error("Response data:", error.response.data);
      res.status(500).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
