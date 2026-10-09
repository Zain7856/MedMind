import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { sendChatMessage } from "../../api/chat.js";
import { requireSignIn } from "../../api/users.js";
import { esc } from "../../components/helpers.js";

// Only signed-in users can chat.
if (!requireSignIn()) {
    throw new Error('Not signed in');
}

loadHeader();
loadFooter();

const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

// Everything said so far. It is sent along so the assistant remembers the chat.
const history = [];

// The symptom checker can open this page with a first message already typed in.
const params = new URLSearchParams(window.location.search);
if (params.get('message')) {
    userInput.value = params.get('message');
}

// Bold text (**like this**) and bullet points, after the text is made safe.
function formatBotMessage(text) {
    let html = esc(text);
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/^\s*[\*\-]\s+(.*)$/gm, '• $1');
    return html;
}

function addMessage(sender, text) {
    const message = document.createElement('div');
    message.className = 'message ' + sender + '-message';
    if (sender === 'bot') {
        message.innerHTML = '<div class="message-content">' + formatBotMessage(text) + '</div>';
    } else {
        message.innerHTML = '<div class="message-content">' + esc(text) + '</div>';
    }
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return message;
}

addMessage('bot', "Hello! I'm your MedMind Assistant. How can I help you with your health today?");

chatForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const text = userInput.value.trim();
    if (!text) return;

    addMessage('user', text);
    userInput.value = '';

    // Three bouncing dots while we wait for the answer.
    const typing = document.createElement('div');
    typing.className = 'message bot-message typing-indicator';
    typing.innerHTML = '<div class="message-content"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const answer = await sendChatMessage(text, history);
    typing.remove();

    if (answer.error) {
        addMessage('bot', answer.error);
        return;
    }

    addMessage('bot', answer.response);
    history.push({ role: 'user', text: text });
    history.push({ role: 'model', text: answer.response });
});
