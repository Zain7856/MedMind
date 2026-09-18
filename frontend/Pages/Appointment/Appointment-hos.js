import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { createAppointment } from "../../api/Appointment-api.js";
import { getHospitalById } from "../../api/Hospitals-api.js";
import { requireAuth, getCurrentUser } from "../../api/auth-api.js";
import showSuccessModal from "./Modal.js";
if (!requireAuth()) {
  throw new Error('Authentication required');
}

loadHeader();

const params = new URLSearchParams(window.location.search);
const hospitalIdFromUrl = params.get('hospitalId') || '';

const currentUser = getCurrentUser();

const page = document.createElement('main');
page.className = 'appointment-page';

const container = document.createElement('div');
container.className = 'appointment-container';

const card = document.createElement('div');
card.className = 'appointment-card';

const title = document.createElement('h1');
title.className = 'appointment-title';
title.textContent = 'Book Hospital Appointment';

const subtitle = document.createElement('p');
subtitle.className = 'appointment-subtitle';
subtitle.textContent = 'Fill the form to confirm your hospital appointment.';

const backBtn = document.createElement('button');
backBtn.type = 'button';
backBtn.className = 'appointment-back-btn';
backBtn.textContent = '← Back to Hospitals';
backBtn.onclick = function () {
  window.location.href = '/Pages/Hospitals/Hospitals.html';
};

const topBar = document.createElement('div');
topBar.className = 'appointment-top-bar';
topBar.appendChild(backBtn);

const form = document.createElement('form');
form.className = 'appointment-form';

function createField(labelText, inputEl) {
  const field = document.createElement('div');
  field.className = 'appointment-field';
  const label = document.createElement('label');
  label.className = 'appointment-label';
  label.textContent = labelText;
  field.appendChild(label);
  field.appendChild(inputEl);
  return field;
}

const userIdInput = document.createElement('input');
userIdInput.className = 'appointment-input';
userIdInput.type = 'text';
userIdInput.placeholder = 'Your Name';
userIdInput.required = true;
if (currentUser && currentUser.name) {
  userIdInput.value = currentUser.name;
  userIdInput.readOnly = true;
}

const hospitalIdInput = document.createElement('input');
hospitalIdInput.className = 'appointment-input';
hospitalIdInput.type = 'hidden';
hospitalIdInput.value = hospitalIdFromUrl;

const hospitalNameDisplay = document.createElement('input');
hospitalNameDisplay.className = 'appointment-input';
hospitalNameDisplay.type = 'text';
hospitalNameDisplay.value = 'Loading hospital...';
hospitalNameDisplay.readOnly = true;

const appointmentDateInput = document.createElement('input');
appointmentDateInput.className = 'appointment-input';
appointmentDateInput.type = 'datetime-local';
appointmentDateInput.required = true;

const statusSelect = document.createElement('select');
statusSelect.className = 'appointment-input';
statusSelect.required = true;
['Pending', 'Confirmed', 'Cancelled'].forEach(function (status) {
  const opt = document.createElement('option');
  opt.value = status;
  opt.textContent = status;
  statusSelect.appendChild(opt);
});
statusSelect.value = 'Pending';

const submitBtn = document.createElement('button');
submitBtn.type = 'submit';
submitBtn.className = 'appointment-btn';
submitBtn.textContent = 'Confirm Appointment';

form.appendChild(createField('Name', userIdInput));
form.appendChild(hospitalIdInput);
form.appendChild(createField('Hospital', hospitalNameDisplay));
form.appendChild(createField('Appointment Date', appointmentDateInput));
form.appendChild(createField('Status', statusSelect));
form.appendChild(submitBtn);

card.appendChild(topBar);
card.appendChild(title);
card.appendChild(subtitle);
card.appendChild(form);
container.appendChild(card);
page.appendChild(container);
document.body.appendChild(page);
loadFooter();

form.onsubmit = async function (e) {
  e.preventDefault();
  try {
    const hospitalId = hospitalIdInput.value.trim();
    const dateTime = appointmentDateInput.value;
    const status = statusSelect.value;
    const userId = currentUser ? currentUser.id : null;

    if (!userId || !hospitalId || !dateTime) {
      alert('Please fill in all required fields');
      return;
    }

    const result = await createAppointment(userId, hospitalId, 'Hospital', dateTime, status);
    console.log('Appointment created:', result);
    showSuccessModal('Appointment Confirmed!', 'Your hospital appointment has been booked successfully.');
  } catch (error) {
    console.error('Error:', error);
    alert('Error: ' + (error.message || 'Failed to create appointment'));
  }
};

async function init() {
  if (!hospitalIdFromUrl) {
    hospitalNameDisplay.value = 'No hospital selected';
    return;
  }
  try {
    const hospital = await getHospitalById(hospitalIdFromUrl);
    hospitalNameDisplay.value = hospital?.name || hospital?.Name || hospitalIdFromUrl;
  } catch (error) {
    console.error('Error loading hospital:', error);
    hospitalNameDisplay.value = hospitalIdFromUrl;
  }
}

init();
