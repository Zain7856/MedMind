import { existsSync } from "node:fs";
import express from "express";
import usersApi from "./API/apiUsers.js";
import providersApi from "./API/apiProviders.js";
import appointmentsApi from "./API/apiAppointments.js";
import diseasesApi from "./API/apiDiseases.js";
import symptomsApi from "./API/apiSymptoms.js";
import chatApi from "./API/apiChat.js";
import statsApi from "./API/apiStats.js";

// The secret Gemini key lives in backend/.env (copy .env.example to make it).
const envPath = new URL(".env", import.meta.url);
if (existsSync(envPath)) {
    process.loadEnvFile(envPath);
} else {
    console.log("No backend/.env file found. The chat will not work until you add one.");
}

const app = express();

app.use(express.json());

// The pages are served from a different address than this server,
// so the browser only lets them talk to us if we say it is OK.
app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
});

app.use(usersApi);
app.use(providersApi);
app.use(appointmentsApi);
app.use(diseasesApi);
app.use(symptomsApi);
app.use(chatApi);
app.use(statsApi);

app.listen(3000, () => {
    console.log("MedMind server is running on http://localhost:3000");
});
