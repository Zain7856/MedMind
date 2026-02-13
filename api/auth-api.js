const baseUrl = 'http://localhost:3000';

// Store current user in localStorage
let currentUser = null;

// Check if user is logged in
export function isLoggedIn() {
    if (!currentUser) {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            currentUser = JSON.parse(stored);
        }
    }
    return currentUser !== null;
}

// Get current user
export function getCurrentUser() {
    if (!currentUser) {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            currentUser = JSON.parse(stored);
        }  
    }
    return currentUser;
}

// Login user
export async function login(email, password) {
    try {
        const response = await fetch(`${baseUrl}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Login failed');
        }
        
        const user = await response.json();
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Logout user
export function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = '/Pages/Sign in/Sign in.html';
}

// Protect page - redirect to login if not authenticated
export function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = '/Pages/Sign in/Sign in.html';
        return false;
    }
    return true;
}

export function getUsers(){
 const Users_List = [];
 return Users_List;
}
    
export function getUserById(id){
 const User_Details = {};
 return User_Details;
}

export async function createUser(user){
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
         
         return await response.json();
     } catch (error) {
         console.error('Error creating user:', error);
         throw error;
     }
}
