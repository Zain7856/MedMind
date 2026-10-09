import { request } from './request.js';

export function getSymptoms() {
    return request('GET', '/symptoms');
}

// One symptom, with the diseases that have it in symptom.Diseases
export function getSymptom(ID) {
    return request('GET', '/symptoms/' + ID);
}

// The symptom checker: diseases that match the ticked symptoms, best match first
export function checkSymptoms(SymptomIDs) {
    return request('POST', '/symptom-check', { SymptomIDs: SymptomIDs });
}

export function addSymptom(symptom) {
    return request('POST', '/symptoms', symptom);
}

export function saveSymptom(ID, symptom) {
    return request('PUT', '/symptoms/' + ID, symptom);
}

export function deleteSymptom(ID) {
    return request('DELETE', '/symptoms/' + ID);
}
