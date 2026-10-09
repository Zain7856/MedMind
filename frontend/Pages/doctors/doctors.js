import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { getDoctors } from "../../api/providers.js";
import { getCurrentUser } from "../../api/users.js";
import { esc, canBook } from "../../components/helpers.js";

loadHeader();

const user = getCurrentUser();
const grid = document.getElementById('doctors-grid');

// Only patients can book. Visitors are asked to sign in. Everybody else sees no button.
function getBookButton(doctor) {
    if (canBook(user)) {
        return '<a class="doctor-btn" href="/Pages/booking/booking.html?id=' + doctor.ID + '">Book now</a>';
    }
    if (user === null) {
        return '<a class="doctor-btn" href="/Pages/sign-in/sign-in.html">Sign in to book</a>';
    }
    return '';
}

function showDoctor(doctor) {
    const card = document.createElement('div');
    card.className = 'doctor-card';
    card.innerHTML = `
        <img class="doctor-img" src="${esc(doctor.Img || '/imgs/logo.png')}" alt="${esc(doctor.Name)}">
        <div class="doctor-info">
            <h3 class="doctor-name">${esc(doctor.Name)}</h3>
            <p class="doctor-spec">Specialization: ${esc(doctor.Specialization || 'General')}</p>
            <p class="doctor-phone">Phone: ${esc(doctor.Phone || 'Not provided')}</p>
            <p class="doctor-location">Location: ${esc(doctor.Location || 'Not provided')}</p>
            <p class="doctor-about">${esc(doctor.About)}</p>
        </div>
        <div class="doctor-btn-container">
            ${getBookButton(doctor)}
            <span class="doctor-cost">${doctor.Cost ? esc(doctor.Cost) + ' L.E' : 'Price not set'}</span>
        </div>`;
    grid.appendChild(card);
}

const doctors = await getDoctors();

if (doctors.length === 0) {
    grid.innerHTML = '<p>No doctors listed yet.</p>';
}
for (const doctor of doctors) {
    showDoctor(doctor);
}

loadFooter();
