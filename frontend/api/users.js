import { request } from './request.js';

// The signed-in user is kept in this browser (localStorage), without the password.
// It looks like { ID, Name, Email, Age, Phone, Role, ... }
export function getCurrentUser() {
    const saved = localStorage.getItem('currentUser');
    if (!saved) return null;
    return JSON.parse(saved);
}

export function saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Pages that need a signed-in user start with: if (!requireSignIn()) throw ...
export function requireSignIn() {
    if (getCurrentUser()) return true;
    window.location.href = '/Pages/sign-in/sign-in.html';
    return false;
}

export function signOut() {
    localStorage.removeItem('currentUser');
    window.location.href = '/Pages/sign-in/sign-in.html';
}

export async function signIn(email, password) {
    const answer = await request('POST', '/users/login', { email: email, password: password });
    if (!answer.error) {
        saveCurrentUser(answer);
    }
    return answer;
}

export function signUp(user) {
    return request('POST', '/users', user);
}

export async function editProfile(ID, user) {
    const answer = await request('PUT', '/users/' + ID, user);
    if (!answer.error) {
        saveCurrentUser(answer);
    }
    return answer;
}

export function changePassword(ID, CurrentPassword, NewPassword) {
    return request('PUT', '/users/' + ID + '/password', { CurrentPassword: CurrentPassword, NewPassword: NewPassword });
}

export function deleteAccount(ID) {
    return request('DELETE', '/users/' + ID);
}

// ----- admin -----

export function getAllUsers() {
    return request('GET', '/users');
}

export function approveUser(ID) {
    return request('PATCH', '/admin/users/' + ID + '/approve');
}

export function rejectUser(ID) {
    return request('PATCH', '/admin/users/' + ID + '/reject');
}
