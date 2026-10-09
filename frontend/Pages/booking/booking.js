import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { getProvider } from "../../api/providers.js";
import { bookAppointment } from "../../api/appointments.js";
import { getCurrentUser, requireSignIn } from "../../api/users.js";
import { canBook } from "../../components/helpers.js";

// Booking needs a signed-in patient.
if (!requireSignIn()) {
    throw new Error('Not signed in');
}
const user = getCurrentUser();
if (!canBook(user)) {
    alert('Only patients can book appointments.');
    window.location.href = '/Pages/home/home.html';
    throw new Error('Not a patient');
}

loadHeader();
loadFooter();

const providerId = new URLSearchParams(window.location.search).get('id');
const provider = await getProvider(providerId);

document.getElementById('patient-name').value = user.Name;

if (provider.error) {
    document.getElementById('provider-name').value = 'Doctor or hospital not found';
} else {
    document.getElementById('provider-name').value = provider.Name;
    if (provider.Role === 'Hospital') {
        document.getElementById('booking-title').textContent = 'Book a hospital appointment';
        document.getElementById('back-link').href = '../hospitals/hospitals.html';
    } else {
        document.getElementById('booking-title').textContent = 'Book a doctor appointment';
    }
}

// The date picker cannot go back in time. (The server checks this too.)
const now = new Date();
const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
document.getElementById('appointment-date').min = localNow.toISOString().slice(0, 16);

document.getElementById('booking-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    if (provider.error) {
        alert('Pick a doctor or hospital first.');
        return;
    }

    const date = document.getElementById('appointment-date').value;
    const answer = await bookAppointment(user.ID, provider.ID, date);
    if (answer.error) {
        alert(answer.error);
        return;
    }

    alert('Appointment booked! You can see it in your profile.');
    window.location.href = '/Pages/profile/profile.html';
});
