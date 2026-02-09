import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { getDiseases } from "../../api/Disease-api.js";

loadHeader();

const page = document.createElement('div');
page.className = 'diseases-page';

const container = document.createElement('div');
container.className = 'diseases-container';

const title = document.createElement('h1');
title.className = 'diseases-title';
title.textContent = 'Diseases';

const grid = document.createElement('div');
grid.className = 'diseases-grid';

function createDiseaseCard(disease) {
  const card = document.createElement('div');
  card.className = 'disease-card';

  const diseaseName = disease.name || disease.Name || 'Disease';

  const img = document.createElement('img');
  img.className = 'disease-img';
  img.alt = diseaseName;
  img.src = disease.img || '/imgs/logo.png';

  const info = document.createElement('div');
  info.className = 'disease-info';

  const name = document.createElement('h3');
  name.className = 'disease-name';
  name.textContent = diseaseName;

  const desc = document.createElement('p');
  desc.className = 'disease-about';
  desc.textContent = disease.description || disease.about || 'No description available.';

  const btn = document.createElement('button');
  btn.className = 'disease-btn';
  btn.textContent = 'Learn More';
  btn.onclick = function () {
    const symptomsText = disease.symptoms || 'Not provided';
    const treatmentText = disease.treatment || 'Not provided';
    alert('Symptoms: ' + symptomsText + '\n\nTreatment: ' + treatmentText);
  };

  info.appendChild(name);
  info.appendChild(desc);

  card.appendChild(img);
  card.appendChild(info);
  card.appendChild(btn);

  return card;
}

async function init() {
  let Diseases = await getDiseases();

  if (!Array.isArray(Diseases) || Diseases.length === 0) {
    Diseases = [
      {
        name: 'Heart Disease',
        description: 'Heart disease refers to a range of conditions that affect the heart and blood vessels, including coronary artery disease, heart failure, and arrhythmias.',
        symptoms: 'Chest pain, shortness of breath, fatigue.',
        treatment: 'Lifestyle changes, medicines, and sometimes surgery.'
      }
    ];
  }

  Diseases.forEach(function (disease) {
    grid.appendChild(createDiseaseCard(disease));
  });

  container.appendChild(title);
  container.appendChild(grid);
  page.appendChild(container);
  document.body.appendChild(page);

  loadFooter();
}

init();