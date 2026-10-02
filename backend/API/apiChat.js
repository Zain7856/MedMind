import express from "express";
import { getChatResponse } from "../Services/Gemini.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const response = await getChatResponse(message);
        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
