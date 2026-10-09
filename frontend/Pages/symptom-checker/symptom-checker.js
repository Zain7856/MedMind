import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { getSymptoms, checkSymptoms } from "../../api/symptoms.js";
import { getCurrentUser } from "../../api/users.js";
import { esc } from "../../components/helpers.js";

loadHeader();

const symptomList = document.getElementById('symptom-list');
const results = document.getElementById('results');

// One checkbox for every symptom in the database.
const symptoms = await getSymptoms();
for (const symptom of symptoms) {
    const label = document.createElement('label');
    label.className = 'checker-symptom';
    label.title = symptom.Description || '';
    label.innerHTML = '<input type="checkbox" value="' + symptom.ID + '" data-name="' + esc(symptom.Name) + '"> ' + esc(symptom.Name);
    symptomList.appendChild(label);
}

document.getElementById('check-button').onclick = async function () {
    const ticked = symptomList.querySelectorAll('input:checked');
    if (ticked.length === 0) {
        alert('Tick at least one symptom.');
        return;
    }

    const ids = [];
    const names = [];
    for (const box of ticked) {
        ids.push(Number(box.value));
        names.push(box.dataset.name);
    }

    const diseases = await checkSymptoms(ids);
    if (diseases.error) {
        alert(diseases.error);
        return;
    }
    if (diseases.length === 0) {
        results.innerHTML = '<p>No disease in our list has these symptoms.</p>';
        return;
    }

    let html = '<h2>Possible matches</h2>';
    const matchNames = [];
    for (const disease of diseases) {
        matchNames.push(disease.Name);
        html += `
            <div class="checker-result">
                <div>
                    <strong>${esc(disease.Name)}</strong>
                    <span>Matches ${disease.Matches} of your ${ids.length} symptoms</span>
                </div>
                <a href="../disease/disease.html?id=${disease.ID}">Learn more</a>
            </div>`;
    }
    html += '<p class="checker-warning">This is not a diagnosis. Please see a doctor if you are worried.</p>';

    // Only signed-in users can chat, so only they get the button.
    if (getCurrentUser()) {
        html += '<button type="button" class="checker-btn" id="ask-button">Ask the assistant about this</button>';
    }
    results.innerHTML = html;

    const askButton = document.getElementById('ask-button');
    if (askButton) {
        askButton.onclick = function () {
            // Only the best 3 matches go into the message, so it stays short.
            const message = 'I have these symptoms: ' + names.join(', ') + '. The symptom checker matched: ' + matchNames.slice(0, 3).join(', ') + '. What should I do?';
            window.location.href = '../chat/chat.html?message=' + encodeURIComponent(message);
        };
    }
};

loadFooter();
