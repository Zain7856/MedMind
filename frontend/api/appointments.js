import { request } from './request.js';

export function bookAppointment(UserID, ProviderID, AppointmentDate) {
    return request('POST', '/appointments', { UserID: UserID, ProviderID: ProviderID, AppointmentDate: AppointmentDate });
}

export function getPatientAppointments(UserID) {
    return request('GET', '/appointments/patient/' + UserID);
}

export function getProviderAppointments(ProviderID) {
    return request('GET', '/appointments/provider/' + ProviderID);
}

// Status is 'Confirmed' or 'Cancelled'
export function setAppointmentStatus(ID, Status) {
    return request('PATCH', '/appointments/' + ID + '/status', { Status: Status });
}
