const baseUrl = 'http://localhost:3000';

let currentUser = null;

export function isLoggedIn() {
    return getCurrentUser() !== null;
}


export function getCurrentUser() {
    if (!currentUser) {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            const data = JSON.parse(stored);
            const raw = data.value || data;
            currentUser = {
                id: raw.id || raw.ID,
                name: raw.name || raw.Name,
                email: raw.email || raw.Email,
                age: raw.age || raw.Age,
                phone: raw.phone || raw.Phone,
                role: raw.role || raw.Role
            };
        }
    }
    return currentUser;
}

export async function login(email, password) {
    try {
        const response = await fetch(`${baseUrl}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email.trim(),
                password: password,
                Email: email.trim(),
                Password: password
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = 'Login failed';
            try {
                const errorObj = JSON.parse(errorText);
                errorMessage = errorObj.error || errorObj.message || errorText;
            } catch (e) {
                errorMessage = errorText;
            }
            throw new Error(errorMessage);
        }

        const loginData = await response.json();
        const user = loginData.user || loginData.value || loginData;

        currentUser = {
            id: user.id || user.ID,
            name: user.name || user.Name,
            email: user.email || user.Email,
            age: user.age || user.Age,
            phone: user.phone || user.Phone,
            role: user.role || user.Role
        };

        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return currentUser;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = '/Pages/Sign in/Sign in.html';
}

export function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = '/Pages/Sign in/Sign in.html';
        return false;
    }
    return true;
}

export function getUsers() {
    const Users_List = [];
    return Users_List;
}

export function getUserById(id) {
    const User_Details = {};
    return User_Details;
}

export async function createUser(user) {
    const User_requariyFields = ['Name', 'Email', 'Password', 'Age', 'Phone', 'Role'];
    const missingFields = User_requariyFields.filter(field => !user[field]);

    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    try {
        const response = await fetch(`${baseUrl}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to create user');
        }

        const data = await response.json();
        const userResult = data.value || data;
        return {
            id: userResult.id || userResult.ID,
            name: userResult.name || userResult.Name,
            email: userResult.email || userResult.Email,
            age: userResult.age || userResult.Age,
            phone: userResult.phone || userResult.Phone,
            role: userResult.role || userResult.Role
        };
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}
