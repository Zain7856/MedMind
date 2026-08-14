import { createUser } from "../../api/auth-api.js";

const roleSelect = document.getElementById('role');
const roleFieldsContainer = document.getElementById('roleFieldsContainer');

const doctorFields = `
  <div class="form-group" id="field-specialization">
    <label for="specialization">Specialization</label>
    <input type="text" id="specialization" name="specialization" placeholder="e.g. Cardiology">
  </div>
  <div class="form-row">
    <div class="form-group">
      <label for="location">Location / City</label>
      <input type="text" id="location" name="location" placeholder="e.g. Cairo">
    </div>
    <div class="form-group">
      <label for="cost">Consultation Fee (L.E)</label>
      <input type="number" id="cost" name="cost" min="0" placeholder="e.g. 500">
    </div>
  </div>
  <div class="form-group">
    <label for="about">About You (optional)</label>
    <textarea id="about" name="about" rows="3" placeholder="Brief description about your experience..."></textarea>
  </div>
  <div class="form-group">
    <label for="img">Profile Photo URL (optional)</label>
    <input type="url" id="img" name="img" placeholder="https://...">
  </div>
`;

const hospitalFields = `
  <div class="form-group">
    <label for="location">Hospital Location / Address</label>
    <input type="text" id="location" name="location" placeholder="e.g. Nasr City, Cairo" required>
  </div>
  <div class="form-group">
    <label for="services">Services Offered (optional)</label>
    <input type="text" id="services" name="services" placeholder="e.g. Emergency, Cardiology, Surgery">
  </div>
  <div class="form-group">
    <label for="img">Hospital Photo URL (optional)</label>
    <input type="url" id="img" name="img" placeholder="https://...">
  </div>
`;

roleSelect.addEventListener('change', () => {
  const role = roleSelect.value;
  if (role === 'Doctor') {
    roleFieldsContainer.innerHTML = `<div class="role-fields-title">Doctor Information</div>` + doctorFields;
  } else if (role === 'Hospital') {
    roleFieldsContainer.innerHTML = `<div class="role-fields-title">Hospital Information</div>` + hospitalFields;
  } else {
    roleFieldsContainer.innerHTML = '';
  }
});

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const role = formData.get('role');

    const user = {
        Name: formData.get('name'),
        Email: formData.get('email'),
        Password: formData.get('password'),
        Age: parseInt(formData.get('age')),
        Phone: formData.get('phone'),
        Role: role
    };

    // Add role-specific fields
    if (role === 'Doctor') {
        user.Specialization = formData.get('specialization') || null;
        user.Location = formData.get('location') || null;
        user.cost = formData.get('cost') || null;
        user.About = formData.get('about') || null;
        user.Img = formData.get('img') || null;
    } else if (role === 'Hospital') {
        user.Location = formData.get('location') || null;
        user.Services = formData.get('services') || null;
        user.img = formData.get('img') || null;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;
    
    try {
        await createUser(user);

        // Show pending approval message based on role
        if (role === 'Doctor' || role === 'Hospital') {
            alert('✅ Account created!\n\nYour account has been submitted as Pending. Please wait for Admin approval before signing in.');
        } else {
            alert('✅ Account created!\n\nYour account is pending Admin approval. You will be notified once approved.');
        }

        window.location.href = '../Sign in/Sign in.html';
    } catch (error) {
        alert('Sign up failed: ' + error.message);
    } finally {
        submitBtn.textContent = 'Sign Up';
        submitBtn.disabled = false;
    }
});
