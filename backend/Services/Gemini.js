import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: "You are MedMind AI, a helpful and professional medical assistant for the MedMind management system. Your goal is to provide general medical information and assist users with their health-related inquiries. Always maintain a professional tone and clearly state that your advice is for informational purposes only and not a substitute for professional medical consultation. If a user describes severe symptoms, advise them to seek immediate medical attention and you will ask the user about ther diseases to know what doctor or hospital need to go to it and continue the chat with them if he send a message replay it dont close your tab on one qs."
});

async function getChatResponse(message) {
    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
            throw new Error("Gemini API key is missing or not configured in .env");
        }

        const result = await model.generateContent(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Service Error:", error.message);
        throw error;
    }
}

export { getChatResponse };
