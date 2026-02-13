import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { getCurrentUser, logout } from "../../api/auth-api.js";
import { getAppointments } from "../../api/Appointment-api.js";

// Check if user is logged in
if (!getCurrentUser()) {
    window.location.href = '/Pages/Sign in/Sign in.html';
    throw new Error('Authentication required');
}

loadHeader();

const page = document.createElement('main');
page.className = 'profile-page';

const container = document.createElement('div');
container.className = 'profile-container';

const card = document.createElement('div');
card.className = 'profile-card';

// Profile Header
const header = document.createElement('div');
header.className = 'profile-header';

const logo = document.createElement('img');
logo.src = '../../imgs/logo.png';
logo.alt = 'MedMind Logo';
logo.className = 'profile-logo';

const title = document.createElement('h1');
title.textContent = 'My Profile';

const subtitle = document.createElement('p');
subtitle.textContent = 'Manage your personal information and appointments';

header.appendChild(logo);
header.appendChild(title);
header.appendChild(subtitle);

// Profile Content
const content = document.createElement('div');
content.className = 'profile-content';

// Personal Info Section
const personalSection = document.createElement('div');
personalSection.className = 'profile-section';

const personalTitle = document.createElement('h2');
personalTitle.textContent = 'Personal Information';

const infoGrid = document.createElement('div');
infoGrid.className = 'info-grid';

// User info fields
const createInfoItem = (label, value) => {
    const item = document.createElement('div');
    item.className = 'info-item';
    
    const labelEl = document.createElement('label');
    labelEl.textContent = label + ':';
    
    const valueEl = document.createElement('span');
    valueEl.textContent = value;
    
    item.appendChild(labelEl);
    item.appendChild(valueEl);
    return item;
};

const userName = createInfoItem('Name', 'Loading...');
const userEmail = createInfoItem('Email', 'Loading...');
const userRole = createInfoItem('Role', 'Loading...');
const userAge = createInfoItem('Age', 'Loading...');
const userPhone = createInfoItem('Phone', 'Loading...');

infoGrid.appendChild(userName);
infoGrid.appendChild(userEmail);
infoGrid.appendChild(userRole);
infoGrid.appendChild(userAge);
infoGrid.appendChild(userPhone);

personalSection.appendChild(personalTitle);
personalSection.appendChild(infoGrid);

// Appointments Section
const appointmentsSection = document.createElement('div');
appointmentsSection.className = 'profile-section';

const appointmentsTitle = document.createElement('h2');
appointmentsTitle.textContent = 'My Appointments';

const appointmentsList = document.createElement('div');
appointmentsList.id = 'appointmentsList';
appointmentsList.className = 'appointments-list';
appointmentsList.innerHTML = '<p class="loading-text">Loading appointments...</p>';

appointmentsSection.appendChild(appointmentsTitle);
appointmentsSection.appendChild(appointmentsList);

// Action Buttons
const actions = document.createElement('div');
actions.className = 'profile-actions';

const editBtn = document.createElement('button');
editBtn.id = 'editProfileBtn';
editBtn.className = 'profile-btn';
editBtn.textContent = 'Edit Profile';

const logoutBtn = document.createElement('button');
logoutBtn.id = 'logoutBtn';
logoutBtn.className = 'profile-btn logout-btn';
logoutBtn.textContent = 'Logout';
logoutBtn.onclick = logout;

actions.appendChild(editBtn);
actions.appendChild(logoutBtn);

// Assemble card
content.appendChild(personalSection);
content.appendChild(appointmentsSection);
content.appendChild(actions);

card.appendChild(header);
card.appendChild(content);

container.appendChild(card);
page.appendChild(container);
document.body.appendChild(page);

loadFooter();

// Load user data and appointments
async function init() {
    const user = getCurrentUser();
    if (user) {
        // Update personal info
        document.getElementById('userName').textContent = user.Name || 'N/A';
        document.getElementById('userEmail').textContent = user.Email || 'N/A';
        document.getElementById('userRole').textContent = user.Role || 'N/A';
        document.getElementById('userAge').textContent = user.Age || 'N/A';
        document.getElementById('userPhone').textContent = user.Phone || 'N/A';
        
        // Load appointments
        try {
            const appointments = await getAppointments();
            const appointmentsList = document.getElementById('appointmentsList');
            
            if (appointments && appointments.length > 0) {
                appointmentsList.innerHTML = '';
                
                // Filter appointments for current user
                const userAppointments = appointments.filter(apt => 
                    apt.UserID === user.ID || apt.UserID === user.Email
                );
                
                if (userAppointments.length > 0) {
                    userAppointments.forEach(appointment => {
                        const aptCard = createAppointmentCard(appointment);
                        appointmentsList.appendChild(aptCard);
                    });
                } else {
                    appointmentsList.innerHTML = '<p class="loading-text">No appointments found</p>';
                }
            } else {
                appointmentsList.innerHTML = '<p class="loading-text">No appointments found</p>';
            }
        } catch (error) {
            console.error('Error loading appointments:', error);
            document.getElementById('appointmentsList').innerHTML = 
                '<p class="loading-text">Error loading appointments</p>';
        }
    }
}

function createAppointmentCard(appointment) {
    const card = document.createElement('div');
    card.className = 'appointment-card';
    
    const title = document.createElement('h3');
    title.textContent = appointment.DoctorID ? 'Doctor Appointment' : 'Hospital Appointment';
    
    const date = document.createElement('p');
    date.textContent = new Date(appointment.AppointmentDate).toLocaleString();
    
    const meta = document.createElement('div');
    meta.className = 'appointment-meta';
    
    const dateSpan = document.createElement('span');
    dateSpan.className = 'appointment-date';
    dateSpan.textContent = new Date(appointment.AppointmentDate).toLocaleDateString();
    
    const status = document.createElement('span');
    status.className = `appointment-status status-${appointment.Status.toLowerCase()}`;
    status.textContent = appointment.Status;
    
    meta.appendChild(dateSpan);
    meta.appendChild(status);
    
    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(meta);
    
    return card;
}

init();
