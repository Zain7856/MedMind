import { request } from './request.js';

export function getDiseases() {
    return request('GET', '/diseases');
}

// One disease, with its symptoms in disease.Symptoms
export function getDisease(ID) {
    return request('GET', '/diseases/' + ID);
}

// disease looks like { Name, Description, Treatment, SymptomIDs: [1, 2] }
export function addDisease(disease) {
    return request('POST', '/diseases', disease);
}

export function saveDisease(ID, disease) {
    return request('PUT', '/diseases/' + ID, disease);
}

export function deleteDisease(ID) {
    return request('DELETE', '/diseases/' + ID);
}
