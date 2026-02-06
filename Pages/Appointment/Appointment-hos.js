
import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";

loadHeader();

const params = new URLSearchParams(window.location.search);
const hospitalIdFromUrl = params.get('hospitalId') || '';

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
userIdInput.placeholder = 'UserID';
userIdInput.required = true;

const hospitalIdInput = document.createElement('input');
hospitalIdInput.className = 'appointment-input';
hospitalIdInput.type = 'text';
hospitalIdInput.placeholder = 'HospitalID';
hospitalIdInput.value = hospitalIdFromUrl;
hospitalIdInput.required = true;

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

form.appendChild(createField('UserID', userIdInput));
form.appendChild(createField('HospitalID', hospitalIdInput));
form.appendChild(createField('AppointmentDate', appointmentDateInput));
form.appendChild(createField('Status', statusSelect));
form.appendChild(submitBtn);

form.onsubmit = function (e) {
  e.preventDefault();

  const payload = {
    UserID: userIdInput.value.trim(),
    HospitalID: hospitalIdInput.value.trim(),
    AppointmentDate: appointmentDateInput.value,
    Status: statusSelect.value
  };

  console.log('Hospital Appointment Payload:', payload);
  alert('Appointment created successfully!');
};

card.appendChild(title);
card.appendChild(subtitle);
card.appendChild(form);

container.appendChild(card);
page.appendChild(container);
document.body.appendChild(page);

loadFooter();
