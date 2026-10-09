import { request } from './request.js';

export function getDoctors() {
    return request('GET', '/doctors');
}

export function getHospitals() {
    return request('GET', '/hospitals');
}

// One doctor or hospital
export function getProvider(ID) {
    return request('GET', '/providers/' + ID);
}
