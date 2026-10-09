// The Gemini model that answers the chat.
const MODEL = "gemini-2.5-flash";

// Only the last 20 messages are sent, so long chats do not get slow or expensive.
// It is an even number because messages come in pairs (user, model).
const MAX_HISTORY = 20;

const SYSTEM_PROMPT = "You are MedMind AI, a helpful, empathetic, and professional medical assistant for the MedMind platform. " +
    "Your goal is to provide general medical information, help users understand their symptoms, and guide them on whether they should consult a Doctor or visit a Hospital. " +
    "Always maintain a professional tone and clearly state that your advice is for informational purposes only and not a substitute for professional medical consultation. " +
    "If a user describes severe, life-threatening, or emergency symptoms (such as severe chest pain, difficulty breathing, sudden numbness, or heavy bleeding), urge them to seek immediate emergency medical care. " +
    "Continue the conversation naturally and remember context from previous messages.";

// history looks like [{ role: "user", text: "..." }, { role: "model", text: "..." }]
// Gives back the answer text, or null if Gemini could not answer.
async function askGemini(message, history) {
    const contents = [];
    for (const item of history.slice(-MAX_HISTORY)) {
        contents.push({ role: item.role, parts: [{ text: item.text }] });
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const url = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent";
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: contents
        })
    });

    if (!response.ok) {
        console.log("Gemini said no: " + response.status + " " + (await response.text()));
        return null;
    }

    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0) return null;
    return data.candidates[0].content.parts[0].text;
}

export { askGemini }
