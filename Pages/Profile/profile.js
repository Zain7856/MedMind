import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";
import { getCurrentUser, logout } from "../../api/auth-api.js";
import { getAppointments } from "../../api/Appointment-api.js";

async function init() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/Pages/Sign in/Sign in.html';
        return;
    }

    loadHeader();
    loadFooter();

    const fields = ['name', 'email', 'role', 'age', 'phone'];
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            const value = user[field] || user[field.charAt(0).toUpperCase() + field.slice(1)];
            element.textContent = value || 'N/A';
        }
    });

    try {
        const appointmentsList = document.getElementById('appointmentsList');
        const appointments = await getAppointments();

        if (appointments && appointments.length > 0) {
            const userAppointments = appointments.filter(apt =>
                apt.userId === user.id || apt.userId === user.ID ||
                apt.userId === user.email || apt.userId === user.Email
            );

            if (userAppointments.length > 0) {
                appointmentsList.innerHTML = '';
                userAppointments.forEach(appointment => {
                    appointmentsList.appendChild(createAppointmentCard(appointment));
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


    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = logout;
    }

    const editBtn = document.getElementById('editProfileBtn');
    if (editBtn) {
        editBtn.onclick = () => alert('Edit Profile feature coming soon!');
    }
}

function createAppointmentCard(appointment) {
    const card = document.createElement('div');
    card.className = 'appointment-card';

    const title = document.createElement('h3');
    const docId = appointment.doctorId || appointment.DoctorID;
    title.textContent = docId ? 'Doctor Appointment' : 'Hospital Appointment';

    const dateStr = appointment.appointmentDate || appointment.AppointmentDate;
    const date = document.createElement('p');
    date.textContent = dateStr ? new Date(dateStr).toLocaleString() : 'Date not set';

    const meta = document.createElement('div');
    meta.className = 'appointment-meta';

    const dateSpan = document.createElement('span');
    dateSpan.className = 'appointment-date';
    dateSpan.textContent = dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';

    const statusStr = appointment.status || appointment.Status || 'Pending';
    const status = document.createElement('span');
    status.className = `appointment-status status-${statusStr.toLowerCase()}`;
    status.textContent = statusStr;

    meta.appendChild(dateSpan);
    meta.appendChild(status);

    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(meta);

    return card;
}

init();
