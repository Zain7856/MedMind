export default function loadHeader() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!document.querySelector('link[href*="global.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/css/global.css';
        document.head.appendChild(link);
    }

    if (!document.querySelector('link[href*="header.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/components/Header/header.css';
        document.head.appendChild(link);
    }

    const header = document.createElement('header');
    header.id = 'header';
    header.className = 'header';

    const container = document.createElement('div');
    container.className = 'container';

    const headerContent = document.createElement('div');
    headerContent.className = 'header-content flex-between';

    const logoDiv = document.createElement('div');
    logoDiv.className = 'header-logo';

    const logoLink = document.createElement('a');
    logoLink.href = '/Pages/Home/home.html';
    logoLink.className = 'logo-link';
    logoLink.onclick = function (e) {
        e.preventDefault();
        window.location.href = '/Pages/Home/home.html';
    };

    const logoIcon = document.createElement('img');
    logoIcon.className = 'logo-icon';
    logoIcon.src = '/imgs/logo.png';

    const logoText = document.createElement('span');
    logoText.className = 'logo-text';
    logoText.textContent = 'MedMind';

    logoLink.appendChild(logoIcon);
    logoLink.appendChild(logoText);
    logoDiv.appendChild(logoLink);


    const hamburgerBtn = document.createElement('button');
    hamburgerBtn.id = 'hamburger-btn';
    hamburgerBtn.className = 'hamburger-btn hide-desktop';

    for (let i = 0; i < 3; i++) {
        const line = document.createElement('span');
        line.className = 'hamburger-line';
        hamburgerBtn.appendChild(line);
    }

    const navMenu = document.createElement('nav');
    navMenu.id = 'nav-menu';
    navMenu.className = 'nav-menu';

    const navList = document.createElement('ul');
    navList.className = 'nav-list flex';

    const navItems = [
        { label: 'Home', href: '/Pages/Home/home.html' },
        { label: 'Get Started', href: '/Pages/Get Started/Get Started.html' },
        { label: 'Hospitals', href: '/Pages/Hospitals/Hospitals.html' },
        { label: 'Doctors', href: '/Pages/Doctors/Doctors.html' },
        { label: 'Diseases', href: '/Pages/Disease/Disease.html' },
        { label: 'About', href: '/Pages/About us/About.html' },
    ];

    navItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'nav-item';

        const a = document.createElement('a');
        a.href = item.href;
        a.className = 'nav-link';
        a.textContent = item.label;

        a.onclick = function (e) {
            e.preventDefault();
            window.location.href = item.href;
        };

        li.appendChild(a);
        navList.appendChild(li);
    });

    navMenu.appendChild(navList);

    // Show Sign Up button when not logged in, Profile dropdown menu when logged in
    if (currentUser) {
        const userEmail = currentUser.email || currentUser.Email || currentUser.id || currentUser.ID || 'default';
        const userPic = localStorage.getItem(`medmind_profile_pic_${userEmail}`);
        const userName = currentUser.name || currentUser.Name || 'My Profile';
        const displayEmail = currentUser.email || currentUser.Email || '';
        const userRole = currentUser.role || currentUser.Role || 'Member';

        const profileContainer = document.createElement('div');
        profileContainer.className = 'header-profile-container';

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'header-profile-trigger';

        const avatarWrapper = document.createElement('div');
        avatarWrapper.className = 'header-avatar-wrapper';

        const avatarImg = document.createElement('img');
        avatarImg.className = 'header-user-avatar';
        avatarImg.src = userPic || '/imgs/logo.png';
        avatarImg.alt = userName;

        const onlineDot = document.createElement('span');
        onlineDot.className = 'header-online-dot';

        avatarWrapper.appendChild(avatarImg);
        avatarWrapper.appendChild(onlineDot);

        const nameSpan = document.createElement('span');
        nameSpan.className = 'header-user-name';
        nameSpan.textContent = userName;

        const chevron = document.createElement('span');
        chevron.className = 'header-chevron';
        chevron.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;

        trigger.appendChild(avatarWrapper);
        trigger.appendChild(nameSpan);
        trigger.appendChild(chevron);

        const dropdown = document.createElement('div');
        dropdown.className = 'header-profile-dropdown';

        dropdown.innerHTML = `
            <div class="dropdown-user-info">
                <img class="dropdown-avatar" src="${userPic || '/imgs/logo.png'}" alt="${userName}">
                <div class="dropdown-user-details">
                    <span class="dropdown-user-name">${userName}</span>
                    <span class="dropdown-user-email">${displayEmail}</span>
                    <span class="dropdown-user-badge">${userRole}</span>
                </div>
            </div>
            <div class="dropdown-divider"></div>
            <a href="/Pages/Profile/profile.html" class="dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                My Profile
            </a>
            <a href="/Pages/Profile/profile.html" class="dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                My Appointments
            </a>
            <div class="dropdown-divider"></div>
            <button type="button" id="headerLogoutBtn" class="dropdown-item dropdown-item-danger">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Logout
            </button>
        `;

        profileContainer.appendChild(trigger);
        profileContainer.appendChild(dropdown);

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            profileContainer.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!profileContainer.contains(e.target)) {
                profileContainer.classList.remove('active');
            }
        });

        setTimeout(() => {
            const logoutBtn = dropdown.querySelector('#headerLogoutBtn');
            if (logoutBtn) {
                logoutBtn.onclick = function () {
                    if (confirm('Are you sure you want to log out?')) {
                        localStorage.removeItem('currentUser');
                        window.location.href = '/Pages/Sign in/Sign in.html';
                    }
                };
            }
        }, 0);


        headerContent.appendChild(logoDiv);
        headerContent.appendChild(hamburgerBtn);
        headerContent.appendChild(navMenu);
        headerContent.appendChild(profileContainer);
    } else {
        const signBtn = document.createElement('button');
        signBtn.className = 'btn btn-primary';
        signBtn.textContent = 'Sign Up';
        signBtn.onclick = function () {
            window.location.href = '/Pages/Sign up/Sign up.html';
        };

        headerContent.appendChild(logoDiv);
        headerContent.appendChild(hamburgerBtn);
        headerContent.appendChild(navMenu);
        headerContent.appendChild(signBtn);
    }

    container.appendChild(headerContent);
    header.appendChild(container);

    hamburgerBtn.onclick = function () {
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    };

    document.body.prepend(header);
}

