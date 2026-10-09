// The address of the backend server. Change it if the server runs somewhere else.
const BASE_URL = 'http://localhost:3000';

// Sends one request to the server and gives back its answer.
// If something went wrong, the answer looks like { error: "a friendly message" },
// so every page checks: if (answer.error) { alert(answer.error); return; }
export async function request(method, path, body) {
    const options = { method: method, headers: { 'Content-Type': 'application/json' } };
    if (body) {
        options.body = JSON.stringify(body);
    }
    const response = await fetch(BASE_URL + path, options);
    return response.json();
}
