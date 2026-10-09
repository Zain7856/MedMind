import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { getCurrentUser, requireSignIn, signOut, editProfile, changePassword, deleteAccount } from "../../api/users.js";
import { getPatientAppointments, getProviderAppointments, setAppointmentStatus } from "../../api/appointments.js";
import { loadAdminPanel } from "./profile-admin.js";
import { esc } from "../../components/helpers.js";

// Photos bigger than this fill up the browser's small storage.
const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

if (!requireSignIn()) {
    throw new Error('Not signed in');
}

loadHeader();
loadFooter();

const user = getCurrentUser();

const subtitles = {
    Patient: 'Manage your personal information and appointments',
    Doctor: 'See your patients and manage your doctor listing',
    Hospital: 'See your appointments and manage your hospital listing',
    Admin: 'Approve accounts and manage diseases and symptoms'
};

showPersonalInfo();
showPhoto();

// Show only the part of the page that this role can use.
if (user.Role === 'Patient') {
    document.getElementById('patientSection').hidden = false;
    showPatientAppointments();
} else if (user.Role === 'Doctor' || user.Role === 'Hospital') {
    document.getElementById('providerSection').hidden = false;
    showListing();
    showProviderAppointments();
} else if (user.Role === 'Admin') {
    document.getElementById('adminSection').hidden = false;
    loadAdminPanel();
}

document.getElementById('logoutBtn').onclick = function () {
    if (confirm('Are you sure you want to log out?')) {
        signOut();
    }
};
document.getElementById('editProfileBtn').onclick = openEditForm;
document.getElementById('deleteAccountBtn').onclick = deleteMyAccount;
// The admin account is the only way to run the site, so it cannot be deleted.
if (user.Role === 'Admin') {
    document.getElementById('deleteAccountBtn').hidden = true;
}
document.getElementById('passwordForm').addEventListener('submit', changeMyPassword);

// ----- personal info and photo -----

function showPersonalInfo() {
    const fields = { name: user.Name, email: user.Email, role: user.Role, age: user.Age, phone: user.Phone };
    for (const id in fields) {
        document.getElementById(id).textContent = fields[id] || 'N/A';
    }

    const badge = document.getElementById('roleBadge');
    badge.textContent = user.Role;
    badge.className = 'role-badge role-' + user.Role.toLowerCase();

    document.getElementById('profileSubtitle').textContent = subtitles[user.Role];
}

// The photo is saved inside this browser only, so it does not follow you to another device.
function showPhoto() {
    const photoKey = 'medmind_profile_pic_' + user.Email;
    const picture = document.getElementById('profilePic');
    const input = document.getElementById('profilePicInput');
    const removeButton = document.getElementById('removePicBtn');

    function show(photo) {
        picture.src = photo || '../../imgs/logo.png';
        removeButton.hidden = !photo;
        const headerPicture = document.querySelector('.header-user-avatar');
        if (headerPicture) headerPicture.src = photo || '/imgs/logo.png';
    }
    show(localStorage.getItem(photoKey));

    input.addEventListener('change', function () {
        const file = input.files[0];
        if (!file) return;
        if (file.size > MAX_PHOTO_BYTES) {
            alert('That photo is too big. Please pick one under 2 MB.');
            return;
        }
        const reader = new FileReader();
        reader.onload = function () {
            localStorage.setItem(photoKey, reader.result);
            show(reader.result);
        };
        reader.readAsDataURL(file);
    });

    removeButton.onclick = function () {
        localStorage.removeItem(photoKey);
        input.value = '';
        show(null);
    };
}

// ----- patient -----

async function showPatientAppointments() {
    const list = document.getElementById('patientAppointments');
    const appointments = await getPatientAppointments(user.ID);

    if (appointments.length === 0) {
        list.innerHTML = '<p class="loading-text">No appointments yet.</p>';
        return;
    }

    list.innerHTML = '';
    for (const appointment of appointments) {
        const card = document.createElement('div');
        card.className = 'appointment-card';
        card.innerHTML = `
            <h3>${esc(appointment.ProviderRole)}: ${esc(appointment.ProviderName)}</h3>
            <p>${new Date(appointment.AppointmentDate).toLocaleString()}</p>
            <span class="appointment-status status-${appointment.Status.toLowerCase()}">${appointment.Status}</span>
            ${appointment.Status === 'Pending' ? '<button class="appt-action-btn cancel-btn" data-id="' + appointment.ID + '">❌ Cancel</button>' : ''}`;
        list.appendChild(card);
    }
    bindStatusButtons(list, showPatientAppointments);
}

// ----- doctor or hospital -----

function showListing() {
    const info = document.getElementById('listingInfo');

    if (user.Role === 'Doctor') {
        document.getElementById('listingTitle').textContent = 'My Doctor Listing';
        info.innerHTML = `
            <div class="info-item"><label>Specialization:</label><span>${esc(user.Specialization || 'N/A')}</span></div>
            <div class="info-item"><label>Location:</label><span>${esc(user.Location || 'N/A')}</span></div>
            <div class="info-item"><label>Consultation Fee:</label><span>${user.Cost ? esc(user.Cost) + ' L.E' : 'N/A'}</span></div>
            <div class="info-item"><label>About:</label><span>${esc(user.About || 'N/A')}</span></div>`;
    } else {
        document.getElementById('listingTitle').textContent = 'My Hospital Listing';
        info.innerHTML = `
            <div class="info-item"><label>Location:</label><span>${esc(user.Location || 'N/A')}</span></div>
            <div class="info-item"><label>Services:</label><span>${esc(user.Services || 'N/A')}</span></div>`;
    }
}

async function showProviderAppointments() {
    const list = document.getElementById('providerAppointments');
    const appointments = await getProviderAppointments(user.ID);

    if (appointments.length === 0) {
        list.innerHTML = '<p class="loading-text">No appointments yet.</p>';
        return;
    }

    list.innerHTML = '';
    for (const appointment of appointments) {
        const card = document.createElement('div');
        card.className = 'appointment-card doctor-appointment-card';
        card.innerHTML = `
            <div class="patient-info">
                <strong>👤 ${esc(appointment.PatientName)}</strong>
                <span>📞 ${esc(appointment.PatientPhone || 'N/A')}</span>
                <span>📅 ${new Date(appointment.AppointmentDate).toLocaleString()}</span>
            </div>
            <div class="appointment-actions">
                <span class="appointment-status status-${appointment.Status.toLowerCase()}">${appointment.Status}</span>
                ${appointment.Status === 'Pending' ? `
                    <button class="appt-action-btn confirm-btn" data-id="${appointment.ID}">✅ Confirm</button>
                    <button class="appt-action-btn cancel-btn" data-id="${appointment.ID}">❌ Cancel</button>` : ''}
            </div>`;
        list.appendChild(card);
    }
    bindStatusButtons(list, showProviderAppointments);
}

// Makes the Confirm and Cancel buttons inside a list work, then draws the list again.
function bindStatusButtons(list, drawListAgain) {
    for (const button of list.querySelectorAll('.confirm-btn')) {
        button.onclick = async function () {
            await setAppointmentStatus(button.dataset.id, 'Confirmed');
            drawListAgain();
        };
    }
    for (const button of list.querySelectorAll('.cancel-btn')) {
        button.onclick = async function () {
            if (!confirm('Cancel this appointment?')) return;
            await setAppointmentStatus(button.dataset.id, 'Cancelled');
            drawListAgain();
        };
    }
}

// ----- edit profile -----

// One form for everything: your info, and your listing if you are a doctor or a hospital.
function openEditForm() {
    let listingFields = '';
    if (user.Role === 'Doctor') {
        listingFields = `
            <div class="edit-field"><label for="editSpecialization">Specialization</label><input type="text" id="editSpecialization" value="${esc(user.Specialization)}"></div>
            <div class="edit-field"><label for="editLocation">Location / City</label><input type="text" id="editLocation" value="${esc(user.Location)}"></div>
            <div class="edit-field"><label for="editCost">Consultation fee (L.E)</label><input type="number" id="editCost" min="0" value="${esc(user.Cost)}"></div>
            <div class="edit-field"><label for="editAbout">About</label><textarea id="editAbout" rows="3">${esc(user.About)}</textarea></div>
            <div class="edit-field"><label for="editImg">Photo URL</label><input type="url" id="editImg" value="${esc(user.Img)}"></div>`;
    } else if (user.Role === 'Hospital') {
        listingFields = `
            <div class="edit-field"><label for="editLocation">Location / Address</label><input type="text" id="editLocation" value="${esc(user.Location)}"></div>
            <div class="edit-field"><label for="editServices">Services</label><input type="text" id="editServices" value="${esc(user.Services)}"></div>
            <div class="edit-field"><label for="editImg">Photo URL</label><input type="url" id="editImg" value="${esc(user.Img)}"></div>`;
    }

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal-card edit-profile-card">
            <h2 class="modal-title">Edit Profile</h2>
            <form class="edit-profile-form" id="editProfileForm">
                <div class="edit-field"><label for="editName">Full name</label><input type="text" id="editName" value="${esc(user.Name)}" required></div>
                <div class="edit-field"><label for="editEmail">Email</label><input type="email" id="editEmail" value="${esc(user.Email)}" required></div>
                <div class="edit-field"><label for="editAge">Age</label><input type="number" id="editAge" min="0" max="120" value="${esc(user.Age)}"></div>
                <div class="edit-field"><label for="editPhone">Phone</label><input type="tel" id="editPhone" value="${esc(user.Phone)}"></div>
                ${listingFields}
                <div class="modal-buttons edit-modal-buttons">
                    <button type="submit" class="modal-btn modal-btn-primary">Save changes</button>
                    <button type="button" id="closeEditForm" class="modal-btn modal-btn-secondary">Cancel</button>
                </div>
            </form>
        </div>`;
    document.body.appendChild(overlay);

    document.getElementById('closeEditForm').onclick = function () {
        overlay.remove();
    };

    document.getElementById('editProfileForm').onsubmit = async function (event) {
        event.preventDefault();

        // A little helper: the value of a field, or null if this role has no such field.
        function valueOf(id) {
            const field = document.getElementById(id);
            if (!field) return null;
            return field.value.trim() || null;
        }

        const answer = await editProfile(user.ID, {
            Name: valueOf('editName'),
            Email: valueOf('editEmail'),
            Age: valueOf('editAge'),
            Phone: valueOf('editPhone'),
            Specialization: valueOf('editSpecialization'),
            Location: valueOf('editLocation'),
            Cost: valueOf('editCost'),
            About: valueOf('editAbout'),
            Img: valueOf('editImg'),
            Services: valueOf('editServices')
        });
        if (answer.error) {
            alert(answer.error);
            return;
        }

        // The easiest way to show the new info everywhere (page and menu) is to load the page again.
        window.location.reload();
    };
}

// ----- password and account -----

async function changeMyPassword(event) {
    event.preventDefault();

    const answer = await changePassword(
        user.ID,
        document.getElementById('currentPassword').value,
        document.getElementById('newPassword').value
    );
    if (answer.error) {
        alert(answer.error);
        return;
    }

    alert('Password changed.');
    event.target.reset();
}

async function deleteMyAccount() {
    if (!confirm('Delete your account for good? Your appointments will be deleted too.')) return;

    const answer = await deleteAccount(user.ID);
    if (answer.error) {
        alert(answer.error);
        return;
    }
    signOut();
}
