import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { getUsers } from "../../api/users-api.js";

loadHeader();

const main = document.createElement('main');
main.className = 'sign-in-page';

const container = document.createElement('div');
container.className = 'sign-in-container';

const card = document.createElement('div');
card.className = 'sign-in-card';

const title = document.createElement('h1');
title.className = 'sign-in-title';  
title.textContent = 'Sign Up';

const form = document.createElement('form');
form.className = 'sign-in-form';

const UserNameInput = document.createElement('input');
UserNameInput.className = 'sign-in-input';
UserNameInput.type = 'text';
UserNameInput.placeholder = 'UserName';
UserNameInput.required = true;

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

const BirthdateInput = document.createElement('input');
BirthdateInput.className = 'sign-in-input';
BirthdateInput.type = 'date';
BirthdateInput.placeholder = 'Birthdate';
BirthdateInput.required = true;

const PhoneInput = document.createElement('input');
PhoneInput.className = 'sign-in-input';
PhoneInput.type = 'tel';
PhoneInput.placeholder = 'Phone';
PhoneInput.required = true;

const roleWrap = document.createElement('div');
roleWrap.className = 'role-wrap';

const roleLabel = document.createElement('p');
roleLabel.className = 'role-label';
roleLabel.textContent = 'Role';

const roleOptions = document.createElement('div');
roleOptions.className = 'role-options';

const patientLabel = document.createElement('label');
patientLabel.className = 'role-option';

const patientRadio = document.createElement('input');
patientRadio.type = 'radio';
patientRadio.name = 'role';
patientRadio.value = 'patient';
patientRadio.required = true;
patientRadio.checked = true;

const patientText = document.createElement('span');
patientText.textContent = 'Patient';

patientLabel.appendChild(patientRadio);
patientLabel.appendChild(patientText);

const doctorLabel = document.createElement('label');
doctorLabel.className = 'role-option';

const doctorRadio = document.createElement('input');
doctorRadio.type = 'radio';
doctorRadio.name = 'role';
doctorRadio.value = 'doctor';

const doctorText = document.createElement('span');
doctorText.textContent = 'Doctor';

doctorLabel.appendChild(doctorRadio);
doctorLabel.appendChild(doctorText);

roleOptions.appendChild(patientLabel);
roleOptions.appendChild(doctorLabel);

roleWrap.appendChild(roleLabel);
roleWrap.appendChild(roleOptions);

const submitBtn = document.createElement('button');
submitBtn.type = 'submit';
submitBtn.className = 'sign-in-btn';
submitBtn.textContent = 'Sign Up';

form.appendChild(UserNameInput);
form.appendChild(emailInput);
form.appendChild(passwordInput);
form.appendChild(BirthdateInput);
form.appendChild(PhoneInput);
form.appendChild(roleWrap);
form.appendChild(submitBtn);

form.onsubmit = function (e) {
  e.preventDefault();
  window.location.href = '/Pages/Home/home.html';
};

const bottomText = document.createElement('p');
bottomText.className = 'sign-in-bottom-text';

const bottomSpan = document.createElement('span');
bottomSpan.textContent = "Already have an account? ";

const signUpLink = document.createElement('a');
signUpLink.href = '/Pages/Sign in/Sign in.html';
signUpLink.className = 'sign-in-bottom-link';
signUpLink.textContent = 'Sign In';
signUpLink.onclick = function (e) {
  e.preventDefault();
  window.location.href = '/Pages/Sign in/Sign in.html';
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