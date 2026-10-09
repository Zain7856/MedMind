import express from "express";
import { getStats } from "../Services/Stats.js";

const router = express.Router();

router.get("/stats", (req, res) => {
    res.json(getStats());
});

export default router;
