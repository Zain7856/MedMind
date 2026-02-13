import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { getDoctors } from "../../api/doctors-api.js";
import { requireAuth, getCurrentUser } from "../../api/auth-api.js";

// Check if user is logged in
if (!requireAuth()) {
    // If not logged in, requireAuth will redirect to login
    // Exit early
    throw new Error('Authentication required');
}

loadHeader();

const page = document.createElement('div');
page.className = 'doctors-page';

const container = document.createElement('div');
container.className = 'doctors-container';

const title = document.createElement('h1');
title.className = 'doctors-title';
title.textContent = 'Doctors';

const grid = document.createElement('div');
grid.className = 'doctors-grid';

function createDoctorCard(doctor) {
  const card = document.createElement('div');
  card.className = 'doctor-card';

  const img = document.createElement('img');
  img.className = 'doctor-img';
  img.alt = doctor.name;
  img.src = doctor.img || '/imgs/logo.png';

  const info = document.createElement('div');
  info.className = 'doctor-info';

  const name = document.createElement('h3');
  name.className = 'doctor-name';
  name.textContent = doctor.name;

  const spec = document.createElement('p');
  spec.className = 'doctor-spec';
  const specialization = doctor.specialization || doctor.specialty || 'General';
  spec.textContent = 'Specialization: ' + specialization;

  const phone = document.createElement('p');
  phone.className = 'doctor-phone';
  phone.textContent = 'Phone: ' + (doctor.phone || 'Not provided');

  const location = document.createElement('p');
  location.className = 'doctor-location';
  location.textContent = 'Location: ' + (doctor.location || 'Not provided');

  const about = document.createElement('p');
  about.className = 'doctor-about';
  about.textContent = doctor.about;

  const btnContainer = document.createElement('div');
  btnContainer.className = 'doctor-btn-container';

  const btn = document.createElement('button');
  btn.className = 'doctor-btn';
  btn.textContent = 'Book Now';
  btn.onclick = function () {
    const doctorId = doctor.id || doctor._id || doctor.doctorId || doctor.name;
    window.location.href = '/Pages/Appointment/Appointment.html?doctorId=' + encodeURIComponent(doctorId);
  };

  const cost = document.createElement('span');
  cost.className = 'doctor-cost';
  cost.textContent = doctor.cost ? `$${doctor.cost}` : 'Price not set';

  btnContainer.appendChild(btn);
  btnContainer.appendChild(cost);

  info.appendChild(name);
  info.appendChild(spec);
  info.appendChild(phone);
  info.appendChild(location);
  info.appendChild(about);

  card.appendChild(img);
  card.appendChild(info);
  card.appendChild(btnContainer);

  return card;
}

async function init() {
  let doctors = await getDoctors();

  if (!Array.isArray(doctors) || doctors.length === 0) {
    doctors = [
      {
        name: 'Dr. Sara Ahmed',
        specialty: 'Cardiology',
        about: 'Helping patients with heart health and prevention.'
      }
    ];
  }

  doctors.forEach(function (doctor) {
    grid.appendChild(createDoctorCard(doctor));
  });

  
  container.appendChild(title);
  container.appendChild(grid);
  page.appendChild(container);
  document.body.appendChild(page);

  loadFooter();
}

init();