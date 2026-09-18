import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { getDiseaseById } from "../../api/Disease-api.js";

async function init() {
    loadHeader();

    const container = document.getElementById('disease-info-container');
    const urlParams = new URLSearchParams(window.location.search);
    const diseaseId = urlParams.get('id');

    if (!diseaseId) {
        renderError(container, 'No disease ID provided.');
        loadFooter();
        return;
    }

    const disease = await getDiseaseById(diseaseId);

    if (!disease || Object.keys(disease).length === 0 || !disease.id) {
        renderError(container, 'Disease details not found.');
    } else {
        renderDiseaseDetails(container, disease);
    }

    loadFooter();
}

function renderDiseaseDetails(container, disease) {
    container.innerHTML = '';

    const hero = document.createElement('section');
    hero.className = 'info-hero';

    const heroContainer = document.createElement('div');
    heroContainer.className = 'container';

    const backBtn = document.createElement('a');
    backBtn.href = 'Disease.html';
    backBtn.className = 'back-btn';
    backBtn.innerHTML = '&larr; Back to Diseases';

    const title = document.createElement('h1');
    title.className = 'info-title';
    title.textContent = disease.name;

    heroContainer.appendChild(backBtn);
    heroContainer.appendChild(title);
    hero.appendChild(heroContainer);

    const mainContent = document.createElement('div');
    mainContent.className = 'container info-main';

    const overview = document.createElement('section');
    overview.className = 'info-card overview-section';
    const overviewTitle = document.createElement('h2');
    overviewTitle.textContent = 'Overview';
    const overviewText = document.createElement('p');
    overviewText.textContent = disease.description || disease.info;

    overview.appendChild(overviewTitle);
    overview.appendChild(overviewText);

    const detailsGrid = document.createElement('div');
    detailsGrid.className = 'info-details-grid';

    const detailSections = [
        { title: 'Symptoms', content: disease.symptoms, class: 'symptoms-card' },
        { title: 'Treatment', content: disease.treatment, class: 'treatment-card' }
    ];

    detailSections.forEach(section => {
        if (section.content) {
            const card = document.createElement('section');
            card.className = `info-card ${section.class}`;

            const h2 = document.createElement('h2');
            h2.textContent = section.title;

            const p = document.createElement('p');
            p.textContent = section.content;

            card.appendChild(h2);
            card.appendChild(p);
            detailsGrid.appendChild(card);
        }
    });

    mainContent.appendChild(overview);
    mainContent.appendChild(detailsGrid);


    const disclaimer = document.createElement('div');
    disclaimer.className = 'medical-disclaimer';
    disclaimer.innerHTML = '<strong>Medical Disclaimer:</strong> This information is for educational purposes only and does not constitute medical advice. Always consult with a qualified healthcare professional for diagnosis and treatment.';
    mainContent.appendChild(disclaimer);

    container.appendChild(hero);
    container.appendChild(mainContent);
}

function renderError(container, message) {
    container.innerHTML = `<div class="container error-state"><p>${message}</p><a href="Disease.html" class="btn btn-primary">Go Back</a></div>`;
}

init();
