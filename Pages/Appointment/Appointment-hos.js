import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { createAppointment } from "../../api/Appointment-api.js";
import { getHospitalById } from "../../api/Hospitals-api.js";
import { requireAuth, getCurrentUser } from "../../api/auth-api.js";

if (!requireAuth()) {
    throw new Error('Authentication required');
}

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
userIdInput.type = 'email';
userIdInput.placeholder = 'Email';
userIdInput.required = true;

const currentUser = getCurrentUser();
if (currentUser && (currentUser.email || currentUser.Email)) {
    userIdInput.value = currentUser.email || currentUser.Email;
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
form.appendChild(hospitalIdInput);
form.appendChild(createField('Hospital', hospitalNameDisplay));
form.appendChild(createField('Appointment Date', appointmentDateInput));
form.appendChild(createField('Status', statusSelect));
form.appendChild(submitBtn);

form.onsubmit = async function (e) {
    e.preventDefault();

    try {
        // Get form values
        const email = userIdInput.value.trim();
        let hospitalId = hospitalIdInput.value.trim();
        const dateTime = appointmentDateInput.value; // Format: YYYY-MM-DDTHH:MM
        const status = statusSelect.value;

        // Basic validation
        if (!email || !hospitalId || !dateTime) {
            alert('Please fill in all required fields');
            return;
        }

        // Convert hospital name to ID if needed
        if (isNaN(hospitalId)) {
            const hospital = await getHospitalById(hospitalId);
            if (!hospital || !hospital.ID) {
                alert('Invalid hospital selected');
                return;
            }
            hospitalId = hospital.ID.toString();
        }

        // Create appointment
        const result = await createAppointment(
            email,          // UserID
            null,           // DoctorID (null for hospital appointments)
            hospitalId,     // HospitalID (now numeric)
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

card.appendChild(topBar);
card.appendChild(title);
card.appendChild(subtitle);
card.appendChild(form);

container.appendChild(card);
page.appendChild(container);
document.body.appendChild(page);

loadFooter();

async function init() {
    if (!hospitalIdFromUrl) {
        hospitalNameDisplay.value = 'No hospital selected';
        return;
    }

    try {
        const hospital = await getHospitalById(hospitalIdFromUrl);
        hospitalNameDisplay.value = hospital?.Name || hospital?.name || hospitalIdFromUrl;
    } catch (error) {
        console.error('Error loading hospital:', error);
        hospitalNameDisplay.value = hospitalIdFromUrl;
    }
}

init();
