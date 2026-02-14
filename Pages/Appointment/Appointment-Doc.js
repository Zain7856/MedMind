
import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { createAppointment } from "../../api/Appointment-api.js";
import { getDoctorsByid } from "../../api/doctors-api.js";
import { requireAuth } from "../../api/auth-api.js";
if (!requireAuth()) {
  throw new Error('Authentication required');
}

loadHeader();

const params = new URLSearchParams(window.location.search);
const doctorIdFromUrl = params.get('doctorId') || '';

const page = document.createElement('main');
page.className = 'appointment-page';

const container = document.createElement('div');
container.className = 'appointment-container';

const card = document.createElement('div');
card.className = 'appointment-card';

const title = document.createElement('h1');
title.className = 'appointment-title';
title.textContent = 'Book Appointment';

const subtitle = document.createElement('p');
subtitle.className = 'appointment-subtitle';
subtitle.textContent = 'Fill the form to confirm your appointment.';

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
userIdInput.type = 'email';
userIdInput.placeholder = 'Email';
userIdInput.required = true;

const doctorIdInput = document.createElement('input');
doctorIdInput.className = 'appointment-input';
doctorIdInput.type = 'hidden';
doctorIdInput.value = doctorIdFromUrl;

const doctorNameDisplay = document.createElement('input');
doctorNameDisplay.className = 'appointment-input';
doctorNameDisplay.type = 'text';
doctorNameDisplay.value = 'Loading doctor...';
doctorNameDisplay.readOnly = true;

const backBtn = document.createElement('button');
backBtn.type = 'button';
backBtn.className = 'appointment-back-btn';
backBtn.textContent = '← Back to Doctors';
backBtn.onclick = function () {
  window.location.href = '/Pages/Doctors/Doctors.html';
};

const appointmentDateInput = document.createElement('input');
appointmentDateInput.className = 'appointment-input';
appointmentDateInput.type = 'datetime-local';
appointmentDateInput.required = true;

const statusSelect = document.createElement('select');
statusSelect.className = 'appointment-input';
statusSelect.required = true;

const statusOptions = ['Pending', 'Confirmed', 'Cancelled'];
statusOptions.forEach(function (status) {
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

form.appendChild(createField('Email', userIdInput));
form.appendChild(doctorIdInput);
form.appendChild(createField('Doctor', doctorNameDisplay));
form.appendChild(createField('Appointment Date', appointmentDateInput));
form.appendChild(createField('Status', statusSelect));
form.appendChild(submitBtn);

const topBar = document.createElement('div');
topBar.className = 'appointment-top-bar';
topBar.appendChild(backBtn);
card.appendChild(topBar);

form.onsubmit = async function (e) {
  e.preventDefault();

  try {
    // Get form values
    const email = userIdInput.value.trim();
    const doctorId = doctorIdInput.value.trim();
    const dateTime = appointmentDateInput.value; // Format: YYYY-MM-DDTHH:MM
    const status = statusSelect.value;

    // Basic validation
    if (!email || !doctorId || !dateTime) {
      alert('Please fill in all required fields');
      return;
    }

    // Create appointment
    const result = await createAppointment(
      email,          // UserID
      doctorId,       // DoctorID
      null,           // HospitalID (null for doctor appointments)
      dateTime + ":00", // Add seconds
      status
    );

    alert('Appointment created successfully!');
    console.log('Appointment created:', result);

  } catch (error) {
    console.error('Error:', error);
    alert('Error: ' + (error.message || 'Failed to create appointment'));
  }
};

card.appendChild(title);
card.appendChild(subtitle);
card.appendChild(form);

container.appendChild(card);
page.appendChild(container);
document.body.appendChild(page);

loadFooter();

async function init() {
  if (doctorIdFromUrl) {
    try {
      const doctor = await getDoctorsByid(doctorIdFromUrl);
      if (doctor && (doctor.name || doctor.Name)) {
        doctorNameDisplay.value = doctor.name || doctor.Name;
      } else {
        doctorNameDisplay.value = 'Doctor not found';
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
      doctorNameDisplay.value = 'Error loading doctor';
    }
  } else {
    doctorNameDisplay.value = 'No doctor selected';
  }
}

init();
