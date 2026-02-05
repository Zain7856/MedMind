import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";

loadHeader();

const main = document.createElement('main');
main.className = 'sign-in-page';

const container = document.createElement('div');
container.className = 'sign-in-container';

const card = document.createElement('div');
card.className = 'sign-in-card';

const title = document.createElement('h1');
title.className = 'sign-in-title';  
title.textContent = 'Sign In';

const form = document.createElement('form');
form.className = 'sign-in-form';

const emailInput = document.createElement('input');
emailInput.className = 'sign-in-input';
emailInput.type = 'email';
emailInput.placeholder = 'Email';
emailInput.required = true;

const passwordInput = document.createElement('input');
passwordInput.className = 'sign-in-input';
passwordInput.type = 'password';
passwordInput.placeholder = 'Password';
passwordInput.required = true;

const submitBtn = document.createElement('button');
submitBtn.type = 'submit';
submitBtn.className = 'sign-in-btn';
submitBtn.textContent = 'Sign In';

form.appendChild(emailInput);
form.appendChild(passwordInput);
form.appendChild(submitBtn);

form.onsubmit = function (e) {
  e.preventDefault();
  window.location.href = '/Pages/Home/home.html';
};

const bottomText = document.createElement('p');
bottomText.className = 'sign-in-bottom-text';

const bottomSpan = document.createElement('span');
bottomSpan.textContent = "Don't have an account? ";

const signUpLink = document.createElement('a');
signUpLink.href = '/Pages/Sign up/Sign up.html';
signUpLink.className = 'sign-in-bottom-link';
signUpLink.textContent = 'Sign Up';
signUpLink.onclick = function (e) {
  e.preventDefault();
  window.location.href = '/Pages/Sign up/Sign up.html';
};

bottomText.appendChild(bottomSpan);
bottomText.appendChild(signUpLink);

card.appendChild(title);
card.appendChild(form);
card.appendChild(bottomText);
container.appendChild(card);
main.appendChild(container);
document.body.appendChild(main);

loadFooter();