import { signUp } from "../../api/users.js";

const roleSelect = document.getElementById('role');
const roleFields = document.getElementById('roleFieldsContainer');

// Extra questions that only doctors and hospitals see.
const doctorFields = `
  <div class="role-fields-title">Doctor Information</div>
  <div class="form-group">
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
  <div class="role-fields-title">Hospital Information</div>
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

roleSelect.addEventListener('change', function () {
    if (roleSelect.value === 'Doctor') {
        roleFields.innerHTML = doctorFields;
    } else if (roleSelect.value === 'Hospital') {
        roleFields.innerHTML = hospitalFields;
    } else {
        roleFields.innerHTML = '';
    }
});

document.getElementById('signupForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const form = new FormData(event.target);
    const role = form.get('role');

    const user = {
        Name: form.get('name').trim(),
        Email: form.get('email').trim(),
        Password: form.get('password'),
        Age: form.get('age') || null,
        Phone: form.get('phone'),
        Role: role
    };

    if (role === 'Doctor') {
        user.Specialization = form.get('specialization');
        user.Location = form.get('location');
        user.Cost = form.get('cost') || null;
        user.About = form.get('about');
        user.Img = form.get('img');
    } else if (role === 'Hospital') {
        user.Location = form.get('location');
        user.Services = form.get('services');
        user.Img = form.get('img');
    }

    const answer = await signUp(user);
    if (answer.error) {
        alert(answer.error);
        return;
    }

    if (answer.ApprovalStatus === 'Pending') {
        alert('Account created! The admin has to approve it before you can sign in.');
    } else {
        alert('Account created! You can sign in now.');
    }
    window.location.href = '../sign-in/sign-in.html';
});
