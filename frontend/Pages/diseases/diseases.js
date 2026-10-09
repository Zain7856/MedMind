import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { getDiseases } from "../../api/diseases.js";
import { esc } from "../../components/helpers.js";

loadHeader();

const grid = document.getElementById('diseases-grid');
const diseases = await getDiseases();

if (diseases.length === 0) {
    grid.innerHTML = '<p>No diseases added yet.</p>';
}

for (const disease of diseases) {
    const card = document.createElement('div');
    card.className = 'disease-card';
    card.innerHTML = `
        <div class="disease-info">
            <h3 class="disease-name">${esc(disease.Name)}</h3>
            <p class="disease-about">${esc(disease.Description || 'No description available.')}</p>
        </div>
        <a class="disease-btn" href="../disease/disease.html?id=${disease.ID}">Learn More</a>`;
    grid.appendChild(card);
}

loadFooter();
