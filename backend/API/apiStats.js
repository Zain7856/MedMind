import express from "express";
import { getStats } from "../Services/Stats.js";

const st = express.Router();

st.get("/stats", (req, res) => {
    try {
        const stats = getStats();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default st;
