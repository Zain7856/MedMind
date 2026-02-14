import loadHeader from "../../components/Header/header.js";
import loadFooter from "../../components/Footer/footer.js";

loadHeader();

const exploreGetStarted = document.getElementById('explore-get-started');
if (exploreGetStarted) {
  exploreGetStarted.onclick = function () {
    window.location.href = '/Pages/Get Started/Get Started.html';
  };
}

const contactBtn = document.getElementById('btn-contact');
if (contactBtn) {
  contactBtn.onclick = function () {
    window.location.href = '/Pages/contact_us/Contact.html';
  };
}

const signUpBtn = document.getElementById('btn-sign-up');
if (signUpBtn) {
  signUpBtn.onclick = function () {
    window.location.href = '/Pages/Sign up/Sign up.html';
  };
}

const exploreDiseases = document.getElementById('explore-diseases');
if (exploreDiseases) {
  exploreDiseases.onclick = function () {
    window.location.href = '/Pages/Disease/Disease.html';
  };
}

const exploreHospitals = document.getElementById('explore-hospitals');
if (exploreHospitals) {
  exploreHospitals.onclick = function () {
    window.location.href = '/Pages/Hospitals/Hospitals.html';
  };
}


const exploreDoctors = document.getElementById('explore-doctors');
if (exploreDoctors) {
  exploreDoctors.onclick = function () {
    window.location.href = '/Pages/Doctors/Doctors.html';
  };
}

loadFooter();