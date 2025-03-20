import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";

dotenv.config();

const genAI = new GoogleGenerativeAI("AIzaSyBfzLVooSZATjtsmvhISCmbveLi783L8AQ");




async function testModel() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
        console.log("Google Gemini API initialized successfully!");
    } catch (error) {
        console.error("Error initializing Google Gemini:", error);
    }
}

testModel();


const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the AI Chatbox API using Google Gemini!");
});

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        console.log("Model Object:", model);

        // Ensure you're calling the API properly
        const chat = await model.generateContent(message);

        console.log("Chat Response:", chat);  // Debugging

        if (!chat || !chat.response) {
            throw new Error("Invalid response from Gemini API");
        }

        res.json({ reply: chat.response.text() });
    } catch (error) {
        console.error("Google Gemini API Error:", error);
        res.status(500).json({ error: "Something went wrong with Gemini API" });
    }
});
const __dirname = path.resolve();

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "ai-chatbot", "dist")));
    app.get("*", (req, res) =>{
        res.sendFile(path.resolve(__dirname, 'ai-chatbot', 'dist', 'index.html'))
    })
}
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
