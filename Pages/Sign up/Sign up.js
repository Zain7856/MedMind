import { createUser } from "../../api/auth-api.js";

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const user = {
        Name: formData.get('name'),
        Email: formData.get('email'),
        Password: formData.get('password'),
        Age: parseInt(formData.get('age')),
        Phone: formData.get('phone'),
        Role: formData.get('role')
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Show loading state
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;
    
    try {
        const result = await createUser(user);
        alert('Account created successfully! Please sign in.');
        
        // Redirect to login
        window.location.href = '../Sign in/Sign in.html';
    } catch (error) {
        alert('Sign up failed: ' + error.message);
    } finally {
        // Reset button
        submitBtn.textContent = 'Sign Up';
        submitBtn.disabled = false;
    }
});
