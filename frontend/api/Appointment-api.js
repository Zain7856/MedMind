const baseUrl = 'http://localhost:3000';

function mapAppointment(apt) {
    return {
        id: apt.ID || apt.id,
        userId: apt.UserID || apt.userId,
        providerId: apt.ProviderID || apt.providerId,
        providerType: apt.ProviderType || apt.providerType,
        providerName: apt.ProviderName || apt.providerName,
        appointmentDate: apt.AppointmentDate || apt.appointmentDate,
        status: apt.Status || apt.status,
        userName: apt.UserName || apt.userName,
        patientPhone: apt.PatientPhone || apt.patientPhone,
        patientAge: apt.PatientAge || apt.patientAge
    };
}

export async function createAppointment(UserID, ProviderID, ProviderType, AppointmentDate, Status) {
    try {
        const payload = {
            UserID,
            ProviderID,
            ProviderType,
            AppointmentDate,
            Status
        };

        const response = await fetch(`${baseUrl}/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to create appointment');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
}

export async function getAppointments() {
    try {
        const response = await fetch(`${baseUrl}/appointments`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const appointments = data.value || data;
        return appointments.map(mapAppointment);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }
}

export async function getAppointmentsByDoctorUserId(doctorUserId) {
    try {
        const response = await fetch(`${baseUrl}/appointments/doctor/${doctorUserId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return (data.value || data).map(mapAppointment);
    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        return [];
    }
}

export async function getAppointmentsByHospitalUserId(hospitalUserId) {
    try {
        const response = await fetch(`${baseUrl}/appointments/hospital/${hospitalUserId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return (data.value || data).map(mapAppointment);
    } catch (error) {
        console.error('Error fetching hospital appointments:', error);
        return [];
    }
}

export async function updateAppointmentStatus(id, Status) {
    try {
        const response = await fetch(`${baseUrl}/appointments/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Status })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error updating appointment status:', error);
        throw error;
    }
}

export async function getAppointmentById(id) {
    try {
        const response = await fetch(`${baseUrl}/appointments/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return mapAppointment(await response.json());
    } catch (error) {
        console.error('Error fetching appointment details:', error);
        return null;
    }
}

export async function adminApproveUser(userId) {
    const r = await fetch(`${baseUrl}/admin/users/${userId}/approve`, { method: 'PATCH' });
    if (!r.ok) throw new Error((await r.json()).error || 'Failed to approve');
    return r.json();
}

export async function adminRejectUser(userId) {
    const r = await fetch(`${baseUrl}/admin/users/${userId}/reject`, { method: 'PATCH' });
    if (!r.ok) throw new Error((await r.json()).error || 'Failed to reject');
    return r.json();
}

export async function adminBanUser(userId) {
    const r = await fetch(`${baseUrl}/admin/users/${userId}/ban`, { method: 'PATCH' });
    if (!r.ok) throw new Error((await r.json()).error || 'Failed to ban');
    return r.json();
}

export async function adminUnbanUser(userId) {
    const r = await fetch(`${baseUrl}/admin/users/${userId}/unban`, { method: 'PATCH' });
    if (!r.ok) throw new Error((await r.json()).error || 'Failed to unban');
    return r.json();
}

export async function adminGetAllUsers() {
    const r = await fetch(`${baseUrl}/users`);
    if (!r.ok) throw new Error('Failed to fetch users');
    return r.json();
}
