const baseUrl = 'http://localhost:3000';

export async function createAppointment(UserID, DoctorID, HospitalID, AppointmentDate, Status) {
    try {
        const payload = {
            UserID: UserID,
            DoctorID: DoctorID,
            AppointmentDate: AppointmentDate,
            Status: Status
        };

        if (HospitalID !== null && HospitalID !== undefined) {
            payload.HospitalID = HospitalID;
        }

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
        return appointments.map(apt => ({
            id: apt.ID,
            userId: apt.UserID,
            doctorId: apt.DoctorID,
            hospitalId: apt.HospitalID,
            appointmentDate: apt.AppointmentDate,
            status: apt.Status
        }));
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }
}

export async function getAppointmentById(id) {
    try {
        const response = await fetch(`${baseUrl}/appointments/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const apt = await response.json();
        return {
            id: apt.ID || apt.id,
            userId: apt.UserID || apt.userId,
            doctorId: apt.DoctorID || apt.doctorId,
            hospitalId: apt.HospitalID || apt.hospitalId,
            appointmentDate: apt.AppointmentDate || apt.appointmentDate,
            status: apt.Status || apt.status
        };
    } catch (error) {
        console.error('Error fetching appointment details:', error);
        return null;
    }
}
