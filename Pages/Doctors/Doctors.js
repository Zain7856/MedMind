import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { getDoctors } from "../../api/doctors-api.js";

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
  img.src = doctor.image || '/imgs/logo.png';

  const info = document.createElement('div');
  info.className = 'doctor-info';

  const name = document.createElement('h3');
  name.className = 'doctor-name';
  name.textContent = doctor.name;

  const spec = document.createElement('p');
  spec.className = 'doctor-spec';
  const specialization = doctor.specialization || doctor.specialty || 'General';
  spec.textContent = 'Specialization: ' + specialization;

  const about = document.createElement('p');
  about.className = 'doctor-about';
  about.textContent = doctor.about;

  const btn = document.createElement('button');
  btn.className = 'doctor-btn';
  btn.textContent = 'Book Now';
  btn.onclick = function () {
    const doctorId = doctor.id || doctor._id || doctor.doctorId || doctor.name;
    window.location.href = '/Pages/Appointment/Appointment.html?doctorId=' + encodeURIComponent(doctorId);
  };

  info.appendChild(name);
  info.appendChild(spec);
  info.appendChild(about);

  card.appendChild(img);
  card.appendChild(info);
  card.appendChild(btn);

  return card;
}

let doctors = getDoctors();

if (!Array.isArray(doctors) || doctors.length === 0) {
  doctors = [
    {
      name: 'Dr. Sara Ahmed',
      specialty: 'Cardiology',
      about: 'Helping patients with heart health and prevention.'
    },
    {
      name: 'Dr. Omar Hassan',
      specialty: 'Dermatology',
      about: 'Skin care, acne treatment, and modern dermatology.'
    },
    {
      name: 'Dr. Mariam Ali',
      specialty: 'Pediatrics',
      about: 'Caring for children and supporting healthy growth.'
    },
    {
      name: 'Dr. Youssef Nabil',
      specialty: 'Neurology',
      about: 'Diagnosis and care for brain and nerve conditions.'
    },
        {
      name: 'Dr. Youssef Nabil',
      specialty: 'Neurology',
      about: 'Diagnosis and care for brain and nerve conditions.'
    },
        {
      name: 'Dr. Youssef Nabil',
      specialty: 'Neurology',
      about: 'Diagnosis and care for brain and nerve conditions.'
    },
        {
      name: 'Dr. Youssef Nabil',
      specialty: 'Neurology',
      about: 'Diagnosis and care for brain and nerve conditions.'
    },
        {
      name: 'Dr. Youssef Nabil',
      specialty: 'Neurology',
      about: 'Diagnosis and care for brain and nerve conditions.'
    },
        {
      name: 'Dr. Youssef Nabil',
      specialty: 'Neurology',
      about: 'Diagnosis and care for brain and nerve conditions.'
    },    {
      name: 'Dr. Youssef Nabil',
      specialty: 'Neurology',
      about: 'Diagnosis and care for brain and nerve conditions.'
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