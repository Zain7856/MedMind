const baseUrl = 'http://localhost:3000';

export async function createAppointment(UserID, DoctorID, HospitalID, AppointmentDate, Status) {
    try {
        const payload = {
            UserID: UserID,
            DoctorID: DoctorID,
            AppointmentDate: AppointmentDate,
            Status: Status
        };
        
        // Only include HospitalID if it's provided
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
        return data.value || data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }
}

export function getAppointmentById(id) {
    const appointment_details = {};
    return appointment_details;
}
