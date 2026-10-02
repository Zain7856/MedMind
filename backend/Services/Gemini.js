import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const SYSTEM_INSTRUCTION = "You are MedMind AI, a helpful, empathetic, and professional medical assistant for the MedMind platform. Your goal is to provide general medical information, help users understand their symptoms, and guide them on whether they should consult a Doctor or visit a Hospital. Always maintain a professional tone and clearly state that your advice is for informational purposes only and not a substitute for professional medical consultation. If a user describes severe, life-threatening, or emergency symptoms (such as severe chest pain, difficulty breathing, sudden numbness, or heavy bleeding), urge them to seek immediate emergency medical care. Continue the conversation naturally and remember context from previous messages.";

// Candidate models in priority order with automatic fallback if a model experiences high demand (503)
const CANDIDATE_MODELS = [
    "gemini-flash-lite-latest",
    "gemini-3.5-flash",
    "gemini-flash-latest",
    "gemini-3.8-flash"
];

function getGenAIClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
        throw new Error("Gemini API key is missing or not configured in .env");
    }
    return new GoogleGenerativeAI(apiKey);
}

async function getChatResponse(message, history = []) {
    const genAI = getGenAIClient();
    let lastError = null;

    // Format history for Gemini if provided: [{ role: 'user'|'model', parts: [{ text }] }]
    const formattedHistory = Array.isArray(history) ? history.map(item => {
        const role = (item.role === 'assistant' || item.role === 'bot' || item.role === 'model') ? 'model' : 'user';
        const text = typeof item.text === 'string' ? item.text : (item.parts?.[0]?.text || item.content || '');
        return {
            role,
            parts: [{ text }]
        };
    }).filter(item => item.parts[0].text) : [];

    for (const modelName of CANDIDATE_MODELS) {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: SYSTEM_INSTRUCTION
            });

            if (formattedHistory.length > 0) {
                const chat = model.startChat({ history: formattedHistory });
                const result = await chat.sendMessage(message);
                const response = await result.response;
                return response.text();
            } else {
                const result = await model.generateContent(message);
                const response = await result.response;
                return response.text();
            }
        } catch (error) {
            console.warn(`Model ${modelName} unavailable (${error.message}). Trying fallback model...`);
            lastError = error;
        }
    }

    console.error("Gemini Service Error (all models failed):", lastError?.message);
    throw lastError || new Error("All Gemini models failed to respond");
}

export { getChatResponse };

