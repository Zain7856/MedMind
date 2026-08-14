import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { getCurrentUser, logout, updateUserProfile } from "../../api/auth-api.js";
import {
    getAppointments,
    getAppointmentsByDoctorUserId,
    getAppointmentsByHospitalUserId,
    updateAppointmentStatus,
    adminGetAllUsers,
    adminApproveUser,
    adminRejectUser,
    adminBanUser,
    adminUnbanUser
} from "../../api/Appointment-api.js";

const BASE_URL = 'http://localhost:3000';

async function init() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/Pages/Sign in/Sign in.html';
        return;
    }

    loadHeader();
    loadFooter();

    // Populate basic personal info
    const fields = ['name', 'email', 'role', 'age', 'phone'];
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            const value = user[field] || user[field.charAt(0).toUpperCase() + field.slice(1)];
            element.textContent = value || 'N/A';
        }
    });

    // Role badge
    const roleBadge = document.getElementById('roleBadge');
    if (roleBadge) {
        roleBadge.textContent = user.role || 'Patient';
        roleBadge.className = `role-badge role-${(user.role || 'patient').toLowerCase()}`;
    }

    // Profile subtitle
    const subtitle = document.getElementById('profileSubtitle');
    const roleMap = {
        Doctor: 'View your patients and manage your doctor profile',
        Hospital: 'View hospital appointments and manage your facility profile',
        Admin: 'Full platform control and user management',
        Patient: 'Manage your personal information and appointments'
    };
    if (subtitle) subtitle.textContent = roleMap[user.role] || roleMap['Patient'];

    // Profile Picture logic
    const profilePic = document.getElementById('profilePic');
    const profilePicInput = document.getElementById('profilePicInput');
    const removePicBtn = document.getElementById('removePicBtn');
    const storageKey = `medmind_profile_pic_${user.email || user.id || 'default'}`;
    const defaultLogo = '../../imgs/logo.png';

    const savedPic = localStorage.getItem(storageKey);
    if (savedPic) {
        profilePic.src = savedPic;
        if (removePicBtn) removePicBtn.style.display = 'inline-block';
    } else {
        profilePic.src = defaultLogo;
        if (removePicBtn) removePicBtn.style.display = 'none';
    }

    if (profilePicInput) {
        profilePicInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) { alert('File size exceeds 5MB.'); return; }
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target.result;
                profilePic.src = dataUrl;
                localStorage.setItem(storageKey, dataUrl);
                if (removePicBtn) removePicBtn.style.display = 'inline-block';
                const headerAvatar = document.querySelector('.header-user-avatar');
                if (headerAvatar) headerAvatar.src = dataUrl;
            };
            reader.readAsDataURL(file);
        });
    }

    if (removePicBtn) {
        removePicBtn.addEventListener('click', () => {
            localStorage.removeItem(storageKey);
            profilePic.src = defaultLogo;
            removePicBtn.style.display = 'none';
            if (profilePicInput) profilePicInput.value = '';
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.onclick = logout;

    // Edit Profile button
    const editBtn = document.getElementById('editProfileBtn');
    if (editBtn) editBtn.onclick = () => openEditProfileModal(user);

    // =================== ROLE-SPECIFIC UI ===================
    const role = (user.role || 'Patient');

    if (role === 'Patient') {
        document.getElementById('patientSection').style.display = 'block';
        await loadPatientAppointments(user);
    } else if (role === 'Doctor') {
        document.getElementById('doctorSection').style.display = 'block';
        await loadDoctorDashboard(user);
    } else if (role === 'Hospital') {
        document.getElementById('hospitalSection').style.display = 'block';
        await loadHospitalDashboard(user);
    } else if (role === 'Admin') {
        document.getElementById('adminSection').style.display = 'block';
        await loadAdminPanel(user);
    }
}

// ===== PATIENT =====
async function loadPatientAppointments(user) {
    const list = document.getElementById('appointmentsList');
    try {
        const all = await getAppointments();
        const mine = all.filter(a =>
            a.userId === user.id || a.userId === user.ID ||
            String(a.userId) === String(user.id)
        );
        if (mine.length > 0) {
            list.innerHTML = '';
            mine.forEach(a => list.appendChild(createAppointmentCard(a)));
        } else {
            list.innerHTML = '<p class="loading-text">No appointments found</p>';
        }
    } catch (err) {
        list.innerHTML = '<p class="loading-text">Error loading appointments</p>';
    }
}

// ===== DOCTOR =====
async function loadDoctorDashboard(user) {
    // Load doctor profile
    await loadDoctorProfile(user);

    // Load patients/appointments
    const list = document.getElementById('doctorAppointmentsList');
    try {
        const appointments = await getAppointmentsByDoctorUserId(user.id);
        if (appointments.length > 0) {
            list.innerHTML = '';
            appointments.forEach(a => list.appendChild(createPatientAppointmentCard(a)));
        } else {
            list.innerHTML = '<p class="loading-text">No patient appointments yet</p>';
        }
    } catch (err) {
        list.innerHTML = '<p class="loading-text">Error loading patients</p>';
    }

    // Edit profile toggle
    document.getElementById('editDoctorProfileBtn')?.addEventListener('click', () => {
        const form = document.getElementById('doctorProfileForm');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });
    document.getElementById('cancelDoctorEdit')?.addEventListener('click', () => {
        document.getElementById('doctorProfileForm').style.display = 'none';
    });
    document.getElementById('doctorProfileForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveDoctorProfile(user);
    });
}

async function loadDoctorProfile(user) {
    const infoDiv = document.getElementById('doctorProfileInfo');
    try {
        const res = await fetch(`${BASE_URL}/doctors/user/${user.id}`);
        if (!res.ok) {
            infoDiv.innerHTML = '<p class="loading-text">No profile created yet. Click "Edit Profile" to add your info.</p>';
            return;
        }
        const doc = await res.json();
        infoDiv.innerHTML = `
            <div class="info-item"><label>Specialization:</label><span>${doc.Specialization || 'N/A'}</span></div>
            <div class="info-item"><label>Location:</label><span>${doc.Location || 'N/A'}</span></div>
            <div class="info-item"><label>Phone:</label><span>${doc.Phone || 'N/A'}</span></div>
            <div class="info-item"><label>Consultation Fee:</label><span>${doc.cost ? doc.cost + ' L.E' : 'N/A'}</span></div>
            <div class="info-item"><label>About:</label><span>${doc.About || 'N/A'}</span></div>
        `;
        // Pre-fill edit form
        if (document.getElementById('doc-specialization')) document.getElementById('doc-specialization').value = doc.Specialization || '';
        if (document.getElementById('doc-location')) document.getElementById('doc-location').value = doc.Location || '';
        if (document.getElementById('doc-phone')) document.getElementById('doc-phone').value = doc.Phone || '';
        if (document.getElementById('doc-cost')) document.getElementById('doc-cost').value = doc.cost || '';
        if (document.getElementById('doc-about')) document.getElementById('doc-about').value = doc.About || '';
        if (document.getElementById('doc-img')) document.getElementById('doc-img').value = doc.Img || '';
    } catch (err) {
        infoDiv.innerHTML = '<p class="loading-text">Error loading profile</p>';
    }
}

async function saveDoctorProfile(user) {
    try {
        const payload = {
            Name: user.name,
            Specialization: document.getElementById('doc-specialization').value,
            Location: document.getElementById('doc-location').value,
            Phone: document.getElementById('doc-phone').value || user.phone,
            cost: parseFloat(document.getElementById('doc-cost').value) || 0,
            About: document.getElementById('doc-about').value,
            Img: document.getElementById('doc-img').value
        };
        const res = await fetch(`${BASE_URL}/doctors/user/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to save profile');
        alert('✅ Doctor profile updated!');
        document.getElementById('doctorProfileForm').style.display = 'none';
        await loadDoctorProfile(user);
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// ===== HOSPITAL =====
async function loadHospitalDashboard(user) {
    await loadHospitalProfile(user);

    const list = document.getElementById('hospitalAppointmentsList');
    try {
        const appointments = await getAppointmentsByHospitalUserId(user.id);
        if (appointments.length > 0) {
            list.innerHTML = '';
            appointments.forEach(a => list.appendChild(createPatientAppointmentCard(a)));
        } else {
            list.innerHTML = '<p class="loading-text">No appointments at your hospital yet</p>';
        }
    } catch (err) {
        list.innerHTML = '<p class="loading-text">Error loading appointments</p>';
    }

    document.getElementById('editHospitalProfileBtn')?.addEventListener('click', () => {
        const form = document.getElementById('hospitalProfileForm');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });
    document.getElementById('cancelHospitalEdit')?.addEventListener('click', () => {
        document.getElementById('hospitalProfileForm').style.display = 'none';
    });
    document.getElementById('hospitalProfileForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveHospitalProfile(user);
    });
}

async function loadHospitalProfile(user) {
    const infoDiv = document.getElementById('hospitalProfileInfo');
    try {
        const res = await fetch(`${BASE_URL}/hospitals/user/${user.id}`);
        if (!res.ok) {
            infoDiv.innerHTML = '<p class="loading-text">No profile created yet. Click "Edit Profile" to add your info.</p>';
            return;
        }
        const hos = await res.json();
        infoDiv.innerHTML = `
            <div class="info-item"><label>Name:</label><span>${hos.Name || 'N/A'}</span></div>
            <div class="info-item"><label>Location:</label><span>${hos.Location || 'N/A'}</span></div>
            <div class="info-item"><label>Phone:</label><span>${hos.Phone || 'N/A'}</span></div>
            <div class="info-item"><label>Services:</label><span>${hos.Services || 'N/A'}</span></div>
        `;
        if (document.getElementById('hos-location')) document.getElementById('hos-location').value = hos.Location || '';
        if (document.getElementById('hos-phone')) document.getElementById('hos-phone').value = hos.Phone || '';
        if (document.getElementById('hos-services')) document.getElementById('hos-services').value = hos.Services || '';
        if (document.getElementById('hos-img')) document.getElementById('hos-img').value = hos.img || '';
    } catch (err) {
        infoDiv.innerHTML = '<p class="loading-text">Error loading profile</p>';
    }
}

async function saveHospitalProfile(user) {
    try {
        const payload = {
            Name: user.name,
            Location: document.getElementById('hos-location').value,
            Phone: document.getElementById('hos-phone').value || user.phone,
            Services: document.getElementById('hos-services').value,
            img: document.getElementById('hos-img').value
        };
        const res = await fetch(`${BASE_URL}/hospitals/user/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to save profile');
        alert('✅ Hospital profile updated!');
        document.getElementById('hospitalProfileForm').style.display = 'none';
        await loadHospitalProfile(user);
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// ===== ADMIN =====
async function loadAdminPanel(user) {
    // Tab switching
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.admin-tab-content').forEach(tab => tab.style.display = 'none');
            document.getElementById(`adminTab-${btn.dataset.tab}`).style.display = 'block';
        });
    });

    // Load pending users
    await loadPendingUsers();
    // Load all users on request (tab click)
    const allUsersTab = document.querySelector('.admin-tab-btn[data-tab="allusers"]');
    if (allUsersTab) {
        allUsersTab.addEventListener('click', () => loadAllUsers());
    }

    // Search filter
    document.getElementById('adminUserSearch')?.addEventListener('input', filterAdminUsers);
}

let _allUsers = [];
async function loadPendingUsers() {
    const list = document.getElementById('pendingUsersList');
    try {
        const users = await adminGetAllUsers();
        _allUsers = users;
        const pending = users.filter(u => u.ApprovalStatus === 'Pending');
        if (pending.length === 0) {
            list.innerHTML = '<p class="loading-text">No pending approvals 🎉</p>';
        } else {
            list.innerHTML = '';
            pending.forEach(u => list.appendChild(createAdminUserRow(u, true)));
        }
    } catch (err) {
        list.innerHTML = '<p class="loading-text">Error loading users</p>';
    }
}

async function loadAllUsers() {
    const list = document.getElementById('allUsersList');
    list.innerHTML = '<p class="loading-text">Loading...</p>';
    try {
        _allUsers = await adminGetAllUsers();
        renderAdminUserList(_allUsers, list);
    } catch (err) {
        list.innerHTML = '<p class="loading-text">Error loading users</p>';
    }
}

function renderAdminUserList(users, container) {
    container.innerHTML = '';
    if (users.length === 0) {
        container.innerHTML = '<p class="loading-text">No users found</p>';
        return;
    }
    users.forEach(u => container.appendChild(createAdminUserRow(u, false)));
}

function filterAdminUsers() {
    const query = document.getElementById('adminUserSearch').value.toLowerCase();
    const filtered = _allUsers.filter(u =>
        (u.Name || '').toLowerCase().includes(query) ||
        (u.Email || '').toLowerCase().includes(query) ||
        (u.Role || '').toLowerCase().includes(query)
    );
    renderAdminUserList(filtered, document.getElementById('allUsersList'));
}

function createAdminUserRow(user, isPending) {
    const row = document.createElement('div');
    row.className = `admin-user-row ${user.IsBanned ? 'is-banned' : ''} ${user.ApprovalStatus === 'Pending' ? 'is-pending' : ''}`;

    const info = document.createElement('div');
    info.className = 'admin-user-info';
    info.innerHTML = `
        <strong>${user.Name}</strong>
        <span>${user.Email}</span>
        <span class="admin-badge badge-role">${user.Role}</span>
        <span class="admin-badge badge-status-${(user.ApprovalStatus || '').toLowerCase()}">${user.ApprovalStatus || 'N/A'}</span>
        ${user.IsBanned ? '<span class="admin-badge badge-banned">🚫 BANNED</span>' : ''}
    `;

    const actions = document.createElement('div');
    actions.className = 'admin-user-actions';

    if (user.ApprovalStatus === 'Pending') {
        const approveBtn = makeAdminBtn('✅ Approve', 'admin-btn-approve', async () => {
            await adminApproveUser(user.ID);
            alert(`${user.Name} approved!`);
            await loadPendingUsers();
        });
        const rejectBtn = makeAdminBtn('❌ Reject', 'admin-btn-reject', async () => {
            if (confirm(`Reject ${user.Name}?`)) {
                await adminRejectUser(user.ID);
                alert(`${user.Name} rejected.`);
                await loadPendingUsers();
            }
        });
        actions.appendChild(approveBtn);
        actions.appendChild(rejectBtn);
    }

    if (!isPending) {
        if (!user.IsBanned) {
            const banBtn = makeAdminBtn('🚫 Ban', 'admin-btn-ban', async () => {
                if (confirm(`Ban ${user.Name}? This will cancel their pending appointments.`)) {
                    await adminBanUser(user.ID);
                    alert(`${user.Name} has been banned.`);
                    await loadAllUsers();
                }
            });
            actions.appendChild(banBtn);
        } else {
            const unbanBtn = makeAdminBtn('✅ Unban', 'admin-btn-approve', async () => {
                await adminUnbanUser(user.ID);
                alert(`${user.Name} has been unbanned.`);
                await loadAllUsers();
            });
            actions.appendChild(unbanBtn);
        }
    }

    row.appendChild(info);
    row.appendChild(actions);
    return row;
}

function makeAdminBtn(text, cls, handler) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.className = `admin-action-btn ${cls}`;
    btn.onclick = handler;
    return btn;
}

// ===== SHARED CARDS =====
function createAppointmentCard(appointment) {
    const card = document.createElement('div');
    card.className = 'appointment-card';

    const docName = appointment.doctorName;
    const hosName = appointment.hospitalName;
    const title = document.createElement('h3');
    title.textContent = docName ? `Doctor: ${docName}` : (hosName ? `Hospital: ${hosName}` : 'Appointment');

    const dateStr = appointment.appointmentDate;
    const date = document.createElement('p');
    date.textContent = dateStr ? new Date(dateStr).toLocaleString() : 'Date not set';

    const statusStr = appointment.status || 'Pending';
    const status = document.createElement('span');
    status.className = `appointment-status status-${statusStr.toLowerCase()}`;
    status.textContent = statusStr;

    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(status);
    return card;
}

function createPatientAppointmentCard(appointment) {
    const card = document.createElement('div');
    card.className = 'appointment-card doctor-appointment-card';

    const patientName = appointment.userName || 'Patient';
    const patientPhone = appointment.patientPhone || 'N/A';
    const dateStr = appointment.appointmentDate;
    const statusStr = appointment.status || 'Pending';

    card.innerHTML = `
        <div class="patient-info">
            <strong>👤 ${patientName}</strong>
            <span>📞 ${patientPhone}</span>
            <span>📅 ${dateStr ? new Date(dateStr).toLocaleString() : 'N/A'}</span>
        </div>
        <div class="appointment-actions">
            <span class="appointment-status status-${statusStr.toLowerCase()}">${statusStr}</span>
            ${statusStr === 'Pending' ? `
                <button class="appt-action-btn confirm-btn" data-id="${appointment.id}">✅ Confirm</button>
                <button class="appt-action-btn cancel-btn" data-id="${appointment.id}">❌ Cancel</button>
            ` : ''}
        </div>
    `;

    // Bind status update buttons
    card.querySelectorAll('.confirm-btn').forEach(btn => {
        btn.onclick = async () => {
            await updateAppointmentStatus(btn.dataset.id, 'Confirmed');
            btn.closest('.appointment-actions').querySelector('.appointment-status').textContent = 'Confirmed';
            btn.closest('.appointment-actions').querySelector('.appointment-status').className = 'appointment-status status-confirmed';
            btn.parentElement.querySelectorAll('.appt-action-btn').forEach(b => b.remove());
        };
    });
    card.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.onclick = async () => {
            if (confirm('Cancel this appointment?')) {
                await updateAppointmentStatus(btn.dataset.id, 'Cancelled');
                btn.closest('.appointment-actions').querySelector('.appointment-status').textContent = 'Cancelled';
                btn.closest('.appointment-actions').querySelector('.appointment-status').className = 'appointment-status status-cancelled';
                btn.parentElement.querySelectorAll('.appt-action-btn').forEach(b => b.remove());
            }
        };
    });

    return card;
}

// ===== EDIT PROFILE MODAL =====
function openEditProfileModal(user) {
    const existingModal = document.getElementById('editProfileModal');
    if (existingModal) existingModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'editProfileModal';
    overlay.className = 'modal-overlay';

    const card = document.createElement('div');
    card.className = 'modal-card edit-profile-card';

    card.innerHTML = `
        <h2 class="modal-title">Edit Profile</h2>
        <form class="edit-profile-form" id="editProfileForm">
            <div class="edit-field">
                <label for="editName">Full Name</label>
                <input type="text" id="editName" value="${user.name || ''}" required>
            </div>
            <div class="edit-field">
                <label for="editEmail">Email Address</label>
                <input type="email" id="editEmail" value="${user.email || ''}" required>
            </div>
            <div class="edit-field">
                <label for="editAge">Age</label>
                <input type="number" id="editAge" value="${user.age || ''}" min="1" max="120">
            </div>
            <div class="edit-field">
                <label for="editPhone">Phone Number</label>
                <input type="tel" id="editPhone" value="${user.phone || ''}">
            </div>
            <div class="modal-buttons edit-modal-buttons">
                <button type="submit" class="modal-btn modal-btn-primary">Save Changes</button>
                <button type="button" id="closeEditModalBtn" class="modal-btn modal-btn-secondary">Cancel</button>
            </div>
        </form>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    card.querySelector('#closeEditModalBtn').onclick = () => overlay.remove();

    card.querySelector('#editProfileForm').onsubmit = async (e) => {
        e.preventDefault();
        const updatedData = {
            name: card.querySelector('#editName').value.trim(),
            email: card.querySelector('#editEmail').value.trim(),
            age: card.querySelector('#editAge').value.trim(),
            phone: card.querySelector('#editPhone').value.trim(),
            role: user.role || 'Patient'
        };
        try {
            const updatedUser = await updateUserProfile(user.id, updatedData);
            ['name', 'email', 'role', 'age', 'phone'].forEach(f => {
                const el = document.getElementById(f);
                if (el) el.textContent = updatedUser[f] || 'N/A';
            });
            overlay.remove();
            alert('Profile updated successfully!');
        } catch (err) {
            alert('Failed to update profile: ' + err.message);
        }
    };
}

init();
