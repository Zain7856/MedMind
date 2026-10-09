import express from "express";
import { askGemini } from "../Services/Gemini.js";

const router = express.Router();

// Gemini charges for every character, so a message can only be this long.
const MAX_MESSAGE_LENGTH = 1000;

router.post("/chat", async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Please type a message." });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
        return res.status(400).json({ error: "Please keep your message under " + MAX_MESSAGE_LENGTH + " characters." });
    }
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "The assistant is not set up yet. Add GEMINI_API_KEY to backend/.env." });
    }

    const answer = await askGemini(message, history || []);
    if (answer === null) {
        return res.status(503).json({ error: "The assistant is busy. Please try again in a minute." });
    }
    res.json({ response: answer });
});

export default router;
