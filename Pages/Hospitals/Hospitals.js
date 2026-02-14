import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { getHospitals } from "../../api/Hospitals-api.js";
import { requireAuth } from "../../api/auth-api.js";

if (!requireAuth()) {
  throw new Error('Authentication required');
}

loadHeader();

const page = document.createElement('div');
page.className = 'hospitals-page';

const container = document.createElement('div');
container.className = 'hospitals-container';

const title = document.createElement('h1');
title.className = 'hospitals-title';
title.textContent = 'Hospitals';

const grid = document.createElement('div');
grid.className = 'hospitals-grid';

function createHospitalCard(hospital) {
  const card = document.createElement('div');
  card.className = 'hospital-card';

  const img = document.createElement('img');
  img.className = 'hospital-img';
  img.alt = hospital.name;
  img.src = hospital.img || '/imgs/logo.png';

  const info = document.createElement('div');
  info.className = 'hospital-info';

  const name = document.createElement('h3');
  name.className = 'hospital-name';
  name.textContent = hospital.name;

  const location = document.createElement('p');
  location.className = 'hospital-location';
  location.textContent = 'Location: ' + (hospital.location || 'Egypt');

  const services = document.createElement('p');
  services.className = 'hospital-services';
  services.textContent = 'Services: ' + (hospital.services || 'General care');

  const btn = document.createElement('button');
  btn.className = 'hospital-btn';
  btn.textContent = 'Book Now';
  btn.onclick = function () {
    // Prioritize lowercase 'id', then '_id', then 'hospitalId', then 'name'
    const hospitalId = hospital.id || hospital._id || hospital.hospitalId || hospital.name;
    window.location.href = '/Pages/Appointment/A-hos.html?hospitalId=' + encodeURIComponent(hospitalId);
  };

  info.appendChild(name);
  info.appendChild(location);
  info.appendChild(services);

  card.appendChild(img);
  card.appendChild(info);
  card.appendChild(btn);

  return card;
}

async function init() {
  let hospitals = await getHospitals();

  if (!Array.isArray(hospitals) || hospitals.length === 0) {
    hospitals = [
      {
        name: 'MedMind General Hospital',
        location: 'KFS, Egypt',
        services: 'Emergency, Surgery, Internal Medicine'
      },
      {
        name: 'City Care Hospital',
        location: 'Cairo, Egypt',
        services: 'Cardiology, ICU, Radiology'
      },
      {
        name: 'Green Life Clinic',
        location: 'Alexandria, Egypt',
        services: 'Dermatology, Pediatrics, Lab tests'
      },
      {
        name: 'Future Health Center',
        location: 'Giza, Egypt',
        services: 'Orthopedics, Physiotherapy, Pharmacy'
      }
    ];
  }

  hospitals.forEach(function (hospital) {
    grid.appendChild(createHospitalCard(hospital));
  });

  container.appendChild(title);
  container.appendChild(grid);
  page.appendChild(container);
  document.body.appendChild(page);

  loadFooter();
}

init();