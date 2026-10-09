import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { getStats } from "../../api/stats-api.js";

loadHeader();

const SIGN_UP_URL = '../Sign up/Sign up.html';
const GET_STARTED_URL = '../Get Started/Get Started.html';

const btnGetStarted = document.getElementById('btn-get-started');
if (btnGetStarted) {
    btnGetStarted.onclick = function () {
        window.location.href = GET_STARTED_URL;
    };
}

const btnSignUpHero = document.getElementById('btn-sign-up-hero');
if (btnSignUpHero) {
    btnSignUpHero.onclick = function () {
        window.location.href = SIGN_UP_URL;
    };
}

const btnSignUp = document.getElementById('btn-sign-up');
if (btnSignUp) {
    btnSignUp.onclick = function () {
        window.location.href = SIGN_UP_URL;
    };
}

const trustBar = document.getElementById('trust');

if (trustBar) {
    getStats().then(function (stats) {
        if (!stats) return;

        trustBar.querySelectorAll('[data-stat]').forEach(function (el) {
            const value = stats[el.dataset.stat];
            if (typeof value === 'number') {
                el.textContent = value.toLocaleString();
            }
        });

        trustBar.hidden = false;
    });
}

loadFooter();
