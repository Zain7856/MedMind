import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { getDisease } from "../../api/diseases.js";
import { getSymptom } from "../../api/symptoms.js";
import { esc } from "../../components/helpers.js";

loadHeader();

const container = document.getElementById('disease-info-container');
const id = new URLSearchParams(window.location.search).get('id');

const disease = await getDisease(id);

if (disease.error) {
    container.innerHTML = '<div class="container error-state"><p>Disease not found.</p><a href="../diseases/diseases.html" class="btn btn-primary">Go back</a></div>';
} else {
    showDisease(disease);
}

loadFooter();

function showDisease(disease) {
    // Every symptom is a button. Clicking it shows more about that symptom.
    let chips = '';
    for (const symptom of disease.Symptoms) {
        chips += '<button type="button" class="symptom-chip" data-id="' + symptom.ID + '">' + esc(symptom.Name) + '</button>';
    }
    if (chips === '') {
        chips = '<p>No symptoms are listed for this disease yet.</p>';
    }

    container.innerHTML = `
        <section class="info-hero">
            <div class="container">
                <a href="../diseases/diseases.html" class="back-btn">&larr; Back to Diseases</a>
                <h1 class="info-title">${esc(disease.Name)}</h1>
            </div>
        </section>
        <div class="container info-main">
            <section class="info-card overview-section">
                <h2>Overview</h2>
                <p>${esc(disease.Description)}</p>
            </section>
            <div class="info-details-grid">
                <section class="info-card symptoms-card">
                    <h2>Symptoms</h2>
                    <div class="symptom-chips">${chips}</div>
                    <div class="symptom-panel" id="symptom-panel" hidden></div>
                </section>
                <section class="info-card treatment-card">
                    <h2>Treatment</h2>
                    <p>${esc(disease.Treatment || 'No treatment notes yet.')}</p>
                </section>
            </div>
            <div class="medical-disclaimer">
                <strong>Medical Disclaimer:</strong> This information is for educational purposes only and does not constitute medical advice. Always consult with a qualified healthcare professional for diagnosis and treatment.
            </div>
        </div>`;

    for (const chip of container.querySelectorAll('.symptom-chip')) {
        chip.onclick = function () {
            showSymptom(chip.dataset.id);
        };
    }
}

// Fills the little panel under the chips: what the symptom is, and which other diseases have it.
async function showSymptom(symptomId) {
    const symptom = await getSymptom(symptomId);
    const panel = document.getElementById('symptom-panel');

    let others = '';
    for (const other of symptom.Diseases) {
        if (String(other.ID) !== String(id)) {
            others += '<a href="disease.html?id=' + other.ID + '">' + esc(other.Name) + '</a> ';
        }
    }
    if (others === '') {
        others = 'No other disease in our list.';
    }

    panel.innerHTML = '<strong>' + esc(symptom.Name) + '</strong><p>' + esc(symptom.Description || 'No description yet.') + '</p><p>Also a symptom of: ' + others + '</p>';
    panel.hidden = false;
}
