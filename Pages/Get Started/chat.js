import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { sendMessageToAssistant } from "../../api/chat-api.js";

async function init() {
    loadHeader();
    loadFooter();

    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');

    addMessage('bot', "Hello! I'm your MedMind Assistant. How can I help you with your health today?");

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();

        if (!message) return;

        addMessage('user', message);
        userInput.value = '';

        const typingId = addTypingIndicator();

        const responseData = await sendMessageToAssistant(message);

        removeTypingIndicator(typingId);
        addMessage('bot', responseData.response || "I'm sorry, I couldn't process that.");
    });
}

function addMessage(sender, text) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const content = document.createElement('div');
    content.className = 'message-content';
    content.textContent = text;

    messageDiv.appendChild(content);
    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    const id = 'typing-' + Date.now();

    const indicator = document.createElement('div');
    indicator.id = id;
    indicator.className = 'message bot-message typing-indicator';
    indicator.innerHTML = `
        <div class="message-content">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;

    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const indicator = document.getElementById(id);
    if (indicator) indicator.remove();
}

init();