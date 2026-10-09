import { getCurrentUser, signOut } from '../../api/users.js';
import { esc } from '../helpers.js';

function addStylesheet(href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

// The menu only shows what the current visitor can open.
function getMenuLinks(user) {
    const links = [
        { icon: '🏠', label: 'Home', href: '/Pages/home/home.html' },
        { icon: '📚', label: 'Diseases', href: '/Pages/diseases/diseases.html' },
        { icon: '🩺', label: 'Symptoms', href: '/Pages/symptom-checker/symptom-checker.html' },
        { icon: '👨‍⚕️', label: 'Doctors', href: '/Pages/doctors/doctors.html' },
        { icon: '🏥', label: 'Hospitals', href: '/Pages/hospitals/hospitals.html' }
    ];
    if (user) {
        links.push({ icon: '💬', label: 'Chat', href: '/Pages/chat/chat.html' });
    }
    links.push({ icon: 'ℹ️', label: 'About', href: '/Pages/about/about.html' });
    return links;
}

export default function loadHeader() {
    addStylesheet('/assets/css/global.css');
    addStylesheet('/components/Header/header.css');

    const user = getCurrentUser();

    let menuHtml = '';
    for (const link of getMenuLinks(user)) {
        let active = '';
        if (window.location.pathname === link.href) active = ' active';
        menuHtml += '<li class="nav-item"><a class="nav-link' + active + '" href="' + link.href + '">' + link.icon + ' ' + link.label + '</a></li>';
    }

    // On the right: the sign in / sign up buttons, or the profile menu.
    let rightHtml = '';
    if (user) {
        // The profile photo is saved in this browser only (see profile.js).
        const photo = localStorage.getItem('medmind_profile_pic_' + user.Email) || '/imgs/logo.png';
        rightHtml = `
            <div class="header-profile-container" id="profile-menu">
                <button type="button" class="header-profile-trigger" id="profile-trigger">
                    <div class="header-avatar-wrapper">
                        <img class="header-user-avatar" src="${esc(photo)}" alt="">
                        <span class="header-online-dot"></span>
                    </div>
                    <span class="header-user-name">${esc(user.Name)}</span>
                </button>
                <div class="header-profile-dropdown">
                    <div class="dropdown-user-info">
                        <img class="dropdown-avatar" src="${esc(photo)}" alt="">
                        <div class="dropdown-user-details">
                            <span class="dropdown-user-name">${esc(user.Name)}</span>
                            <span class="dropdown-user-email">${esc(user.Email)}</span>
                            <span class="dropdown-user-badge">${esc(user.Role)}</span>
                        </div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <a href="/Pages/profile/profile.html" class="dropdown-item">👤 My profile</a>
                    <button type="button" class="dropdown-item dropdown-item-danger" id="sign-out-button">🚪 Log out</button>
                </div>
            </div>`;
    } else {
        rightHtml = `
            <div class="header-guest-buttons">
                <a class="nav-link" href="/Pages/sign-in/sign-in.html">Sign in</a>
                <a class="btn" href="/Pages/sign-up/sign-up.html">Sign up</a>
            </div>`;
    }

    const header = document.createElement('header');
    header.id = 'header';
    header.className = 'header';
    header.innerHTML = `
        <div class="container">
            <div class="header-content flex-between">
                <div class="header-logo">
                    <a href="/Pages/home/home.html" class="logo-link">
                        <img class="logo-icon" src="/imgs/logo.png" alt="">
                        <span class="logo-text">MedMind</span>
                    </a>
                </div>
                <button type="button" class="hamburger-btn hide-desktop" id="hamburger-button">
                    <span class="hamburger-line"></span><span class="hamburger-line"></span><span class="hamburger-line"></span>
                </button>
                <nav class="nav-menu" id="nav-menu"><ul class="nav-list flex">${menuHtml}</ul></nav>
                ${rightHtml}
            </div>
        </div>`;
    document.body.prepend(header);

    // Phone menu: the three-lines button opens and closes the menu.
    const hamburger = document.getElementById('hamburger-button');
    hamburger.onclick = function () {
        hamburger.classList.toggle('active');
        document.getElementById('nav-menu').classList.toggle('active');
    };

    if (user) {
        const profileMenu = document.getElementById('profile-menu');
        document.getElementById('profile-trigger').onclick = function (event) {
            event.stopPropagation();
            profileMenu.classList.toggle('active');
        };
        // A click anywhere else closes the profile menu.
        document.addEventListener('click', function () {
            profileMenu.classList.remove('active');
        });
        document.getElementById('sign-out-button').onclick = function () {
            if (confirm('Are you sure you want to log out?')) {
                signOut();
            }
        };
    }
}
