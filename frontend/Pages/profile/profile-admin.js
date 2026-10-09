import { getAllUsers, approveUser, rejectUser, deleteAccount } from "../../api/users.js";
import { getDiseases, getDisease, addDisease, saveDisease, deleteDisease } from "../../api/diseases.js";
import { getSymptoms, addSymptom, saveSymptom, deleteSymptom, getSymptom } from "../../api/symptoms.js";
import { esc } from "../../components/helpers.js";

// Makes every button with a data-action inside a list work.
// actions looks like { edit: function (id) {...}, remove: function (id) {...} }
function bindButtons(list, actions) {
    for (const button of list.querySelectorAll('button[data-action]')) {
        button.onclick = function () {
            actions[button.dataset.action](button.dataset.id);
        };
    }
}

// A finished server call: show the error, or run the next step.
function failed(answer) {
    if (answer.error) {
        alert(answer.error);
        return true;
    }
    return false;
}

export function loadAdminPanel() {
    // The tab buttons show one tab and hide the others.
    for (const tabButton of document.querySelectorAll('.admin-tab-btn')) {
        tabButton.onclick = function () {
            for (const other of document.querySelectorAll('.admin-tab-btn')) {
                other.classList.remove('active');
            }
            tabButton.classList.add('active');
            for (const tab of document.querySelectorAll('.admin-tab-content')) {
                tab.hidden = true;
            }
            document.getElementById('adminTab-' + tabButton.dataset.tab).hidden = false;
        };
    }

    showUsers();
    showDiseases();
    showSymptoms();
    setUpDiseaseForm();
    setUpSymptomForm();
}

// ----- users -----

async function showUsers() {
    const users = await getAllUsers();
    const pendingList = document.getElementById('pendingList');
    const usersList = document.getElementById('usersList');

    let pendingHtml = '';
    let usersHtml = '';
    for (const user of users) {
        const row = getUserRow(user);
        usersHtml += row;
        if (user.ApprovalStatus === 'Pending') {
            pendingHtml += row;
        }
    }
    pendingList.innerHTML = pendingHtml || '<p class="loading-text">Nobody is waiting for approval 🎉</p>';
    usersList.innerHTML = usersHtml;

    const actions = {
        approve: async function (id) {
            if (!failed(await approveUser(id))) showUsers();
        },
        reject: async function (id) {
            if (!confirm('Reject this user? They will not be able to sign in.')) return;
            if (!failed(await rejectUser(id))) showUsers();
        },
        remove: async function (id) {
            if (!confirm('Delete this user and all of their appointments for good?')) return;
            if (!failed(await deleteAccount(id))) showUsers();
        }
    };
    bindButtons(pendingList, actions);
    bindButtons(usersList, actions);
}

// One row with the user's info and the buttons the admin can use on them.
function getUserRow(user) {
    let buttons = '';
    if (user.ApprovalStatus !== 'Approved') {
        buttons += '<button class="admin-action-btn admin-btn-approve" data-action="approve" data-id="' + user.ID + '">✅ Approve</button>';
    }
    if (user.ApprovalStatus !== 'Rejected' && user.Role !== 'Admin') {
        buttons += '<button class="admin-action-btn admin-btn-reject" data-action="reject" data-id="' + user.ID + '">🚫 Reject</button>';
    }
    if (user.Role !== 'Admin') {
        buttons += '<button class="admin-action-btn admin-btn-delete" data-action="remove" data-id="' + user.ID + '">🗑️ Delete</button>';
    }

    return `
        <div class="admin-user-row">
            <div class="admin-user-info">
                <strong>${esc(user.Name)}</strong>
                <span>${esc(user.Email)}</span>
                <span class="admin-badge badge-role">${esc(user.Role)}</span>
                <span class="admin-badge badge-status-${user.ApprovalStatus.toLowerCase()}">${user.ApprovalStatus}</span>
            </div>
            <div class="admin-user-actions">${buttons}</div>
        </div>`;
}

// ----- diseases -----

async function showDiseases() {
    const list = document.getElementById('diseasesList');
    const diseases = await getDiseases();

    let html = '';
    for (const disease of diseases) {
        html += `
            <div class="admin-user-row">
                <div class="admin-user-info"><strong>${esc(disease.Name)}</strong></div>
                <div class="admin-user-actions">
                    <button class="admin-action-btn admin-btn-edit" data-action="edit" data-id="${disease.ID}">✏️ Edit</button>
                    <button class="admin-action-btn admin-btn-delete" data-action="remove" data-id="${disease.ID}">🗑️ Delete</button>
                </div>
            </div>`;
    }
    list.innerHTML = html || '<p class="loading-text">No diseases yet.</p>';

    bindButtons(list, {
        edit: editDisease,
        remove: async function (id) {
            if (!confirm('Delete this disease?')) return;
            if (!failed(await deleteDisease(id))) showDiseases();
        }
    });
}

// The id of the disease being edited. Empty means the form is adding a new one.
let editingDiseaseId = '';

async function drawSymptomBoxes(tickedIds) {
    const box = document.getElementById('diseaseSymptoms');
    const symptoms = await getSymptoms();

    let html = '';
    for (const symptom of symptoms) {
        let checked = '';
        if (tickedIds.includes(symptom.ID)) checked = ' checked';
        html += '<label class="admin-checkbox"><input type="checkbox" value="' + symptom.ID + '"' + checked + '> ' + esc(symptom.Name) + '</label>';
    }
    box.innerHTML = html;
}

function clearDiseaseForm() {
    editingDiseaseId = '';
    document.getElementById('diseaseFormTitle').textContent = 'Add a disease';
    document.getElementById('diseaseName').value = '';
    document.getElementById('diseaseDescription').value = '';
    document.getElementById('diseaseTreatment').value = '';
    drawSymptomBoxes([]);
}

async function editDisease(id) {
    const disease = await getDisease(id);
    editingDiseaseId = id;
    document.getElementById('diseaseFormTitle').textContent = 'Edit ' + disease.Name;
    document.getElementById('diseaseName').value = disease.Name;
    document.getElementById('diseaseDescription').value = disease.Description || '';
    document.getElementById('diseaseTreatment').value = disease.Treatment || '';

    const tickedIds = [];
    for (const symptom of disease.Symptoms) {
        tickedIds.push(symptom.ID);
    }
    drawSymptomBoxes(tickedIds);
    document.getElementById('diseaseForm').scrollIntoView();
}

function setUpDiseaseForm() {
    clearDiseaseForm();
    document.getElementById('diseaseClear').onclick = clearDiseaseForm;

    document.getElementById('diseaseForm').onsubmit = async function (event) {
        event.preventDefault();

        const symptomIds = [];
        for (const box of document.querySelectorAll('#diseaseSymptoms input:checked')) {
            symptomIds.push(Number(box.value));
        }
        const disease = {
            Name: document.getElementById('diseaseName').value.trim(),
            Description: document.getElementById('diseaseDescription').value.trim(),
            Treatment: document.getElementById('diseaseTreatment').value.trim(),
            SymptomIDs: symptomIds
        };

        let answer;
        if (editingDiseaseId) {
            answer = await saveDisease(editingDiseaseId, disease);
        } else {
            answer = await addDisease(disease);
        }
        if (failed(answer)) return;

        clearDiseaseForm();
        showDiseases();
    };
}

// ----- symptoms -----

async function showSymptoms() {
    const list = document.getElementById('symptomsList');
    const symptoms = await getSymptoms();

    let html = '';
    for (const symptom of symptoms) {
        html += `
            <div class="admin-user-row">
                <div class="admin-user-info"><strong>${esc(symptom.Name)}</strong></div>
                <div class="admin-user-actions">
                    <button class="admin-action-btn admin-btn-edit" data-action="edit" data-id="${symptom.ID}">✏️ Edit</button>
                    <button class="admin-action-btn admin-btn-delete" data-action="remove" data-id="${symptom.ID}">🗑️ Delete</button>
                </div>
            </div>`;
    }
    list.innerHTML = html || '<p class="loading-text">No symptoms yet.</p>';

    bindButtons(list, {
        edit: editSymptom,
        remove: async function (id) {
            if (!confirm('Delete this symptom? Diseases will not have it any more.')) return;
            if (failed(await deleteSymptom(id))) return;
            showSymptoms();
            drawSymptomBoxes([]);
        }
    });
}

// The id of the symptom being edited. Empty means the form is adding a new one.
let editingSymptomId = '';

function clearSymptomForm() {
    editingSymptomId = '';
    document.getElementById('symptomFormTitle').textContent = 'Add a symptom';
    document.getElementById('symptomName').value = '';
    document.getElementById('symptomDescription').value = '';
}

async function editSymptom(id) {
    const symptom = await getSymptom(id);
    editingSymptomId = id;
    document.getElementById('symptomFormTitle').textContent = 'Edit ' + symptom.Name;
    document.getElementById('symptomName').value = symptom.Name;
    document.getElementById('symptomDescription').value = symptom.Description || '';
    document.getElementById('symptomForm').scrollIntoView();
}

function setUpSymptomForm() {
    document.getElementById('symptomClear').onclick = clearSymptomForm;

    document.getElementById('symptomForm').onsubmit = async function (event) {
        event.preventDefault();

        const symptom = {
            Name: document.getElementById('symptomName').value.trim(),
            Description: document.getElementById('symptomDescription').value.trim()
        };

        let answer;
        if (editingSymptomId) {
            answer = await saveSymptom(editingSymptomId, symptom);
        } else {
            answer = await addSymptom(symptom);
        }
        if (failed(answer)) return;

        clearSymptomForm();
        showSymptoms();
        // The disease form lists every symptom, so it needs the new list too.
        drawSymptomBoxes([]);
    };
}
