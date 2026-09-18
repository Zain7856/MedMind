import { login } from "../../api/auth-api.js";

// Check if form exists in HTML
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        // Show loading state
        submitBtn.textContent = 'Signing in...';
        submitBtn.disabled = true;
        
        try {
            const user = await login(email, password);
            alert('Sign in successful!');
            
            // Redirect to profile page
            window.location.href = '/Pages/Profile/profile.html';
        } catch (error) {
            alert('Sign in failed: ' + error.message);
        } finally {
            // Reset button
            submitBtn.textContent = 'Sign In';
            submitBtn.disabled = false;
        }
    });
}
