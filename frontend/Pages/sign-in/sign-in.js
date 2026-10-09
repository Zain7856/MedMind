import { signIn } from "../../api/users.js";

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const answer = await signIn(email, password);
    if (answer.error) {
        alert(answer.error);
        return;
    }

    window.location.href = '/Pages/profile/profile.html';
});
