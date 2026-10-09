import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { getHospitals } from "../../api/providers.js";
import { getCurrentUser } from "../../api/users.js";
import { esc, canBook } from "../../components/helpers.js";

loadHeader();

const user = getCurrentUser();
const grid = document.getElementById('hospitals-grid');

// Only patients can book. Visitors are asked to sign in. Everybody else sees no button.
function getBookButton(hospital) {
    if (canBook(user)) {
        return '<a class="hospital-btn" href="/Pages/booking/booking.html?id=' + hospital.ID + '">Book now</a>';
    }
    if (user === null) {
        return '<a class="hospital-btn" href="/Pages/sign-in/sign-in.html">Sign in to book</a>';
    }
    return '';
}

function showHospital(hospital) {
    const card = document.createElement('div');
    card.className = 'hospital-card';
    card.innerHTML = `
        <img class="hospital-img" src="${esc(hospital.Img || '/imgs/logo.png')}" alt="${esc(hospital.Name)}">
        <div class="hospital-info">
            <h3 class="hospital-name">${esc(hospital.Name)}</h3>
            <p class="hospital-location">Location: ${esc(hospital.Location || 'Egypt')}</p>
            <p class="hospital-services">Services: ${esc(hospital.Services || 'General care')}</p>
        </div>
        ${getBookButton(hospital)}`;
    grid.appendChild(card);
}

const hospitals = await getHospitals();

if (hospitals.length === 0) {
    grid.innerHTML = '<p>No hospitals listed yet.</p>';
}
for (const hospital of hospitals) {
    showHospital(hospital);
}

loadFooter();
