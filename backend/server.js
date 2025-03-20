import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import axios from "axios";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ Correct API URL
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // ✅ Correct payload format
        const requestData = {
            contents: [{ parts: [{ text: message }] }]
        };

        const response = await axios.post(GEMINI_API_URL, requestData);

        console.log("Full Gemini API Response:", JSON.stringify(response.data, null, 2));

        // ✅ Correct response extraction
        const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";

        console.log("Extracted Response:", responseText);
        res.json({ reply: responseText });

    } catch (error) {
        console.error("Google Gemini API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Something went wrong with Gemini API" });
    }
});

// ✅ Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve React frontend correctly
const frontendPath = path.join(__dirname, "ai-chatbot", "dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
