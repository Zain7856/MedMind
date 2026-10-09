import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { getStats } from "../../api/stats.js";
import { getCurrentUser } from "../../api/users.js";

loadHeader();

document.getElementById('btn-get-started').onclick = function () {
    window.location.href = '../chat/chat.html';
};
document.getElementById('btn-sign-up-hero').onclick = function () {
    window.location.href = '../sign-up/sign-up.html';
};
document.getElementById('btn-sign-up').onclick = function () {
    window.location.href = '../sign-up/sign-up.html';
};

// Somebody who is signed in does not need the sign up buttons.
if (getCurrentUser()) {
    document.getElementById('btn-sign-up-hero').hidden = true;
    document.getElementById('cta').hidden = true;
}

// The three numbers under the banner come from the server.
const stats = await getStats();
for (const element of document.querySelectorAll('[data-stat]')) {
    element.textContent = stats[element.dataset.stat].toLocaleString();
}
document.getElementById('trust').hidden = false;

loadFooter();
