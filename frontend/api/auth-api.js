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
                role: raw.role || raw.Role,
                approvalStatus: raw.approvalStatus || raw.ApprovalStatus,
                isBanned: raw.isBanned || raw.IsBanned || 0
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
            role: user.role || user.Role,
            approvalStatus: user.ApprovalStatus || user.approvalStatus,
            isBanned: user.IsBanned || user.isBanned || 0
        };

        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return currentUser;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export function logout(askConfirmation = true) {
    if (askConfirmation) {
        const confirmed = confirm('Are you sure you want to log out?');
        if (!confirmed) return;
    }
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

export async function updateUserProfile(id, userData) {
    const prevUser = getCurrentUser() || {};
    const updatedUser = {
        id: id || userData.id || userData.ID || prevUser.id,
        name: userData.name || userData.Name || prevUser.name,
        email: userData.email || userData.Email || prevUser.email,
        age: userData.age || userData.Age || prevUser.age,
        phone: userData.phone || userData.Phone || prevUser.phone,
        role: userData.role || userData.Role || prevUser.role || 'Patient',
        approvalStatus: userData.approvalStatus || userData.ApprovalStatus || prevUser.approvalStatus || 'Approved',
        isBanned: userData.isBanned || userData.IsBanned || prevUser.isBanned || 0
    };

    try {
        if (id) {
            const response = await fetch(`${baseUrl}/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Name: updatedUser.name,
                    Email: updatedUser.email,
                    Age: updatedUser.age,
                    Phone: updatedUser.phone,
                    Role: updatedUser.role
                })
            });

            if (!response.ok) {
                console.warn('Backend update failed, updating local session');
            }
        }
    } catch (error) {
        console.warn('Backend server unreachable, updating local session:', error);
    }

    currentUser = updatedUser;
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return updatedUser;
}

