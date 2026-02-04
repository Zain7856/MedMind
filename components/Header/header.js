export default function loadHeader() {
  if (!document.querySelector('link[href*="global.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assest/css/global.css';
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
  headerContent.className = 'header-content flex flex-between';


  const logoDiv = document.createElement('div');
  logoDiv.className = 'header-logo';

  const logoLink = document.createElement('a');
  logoLink.href = '/';
  logoLink.className = 'logo-link';
  logoLink.onclick = function (e) {
    e.preventDefault();
    window.location.href = '/pages/home/home.html';
  };

  const logoIcon = document.createElement('span');
  logoIcon.className = 'logo-icon';
  logoIcon.textContent = '⚕️';

  const logoText = document.createElement('span');
  logoText.className = 'logo-text';
  logoText.textContent = 'MedCheck';

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
    { label: 'Home', href: '/pages/home/home.html' },
    { label: 'About', href: '/pages/about/about.html' },
    { label: 'Diseases', href: '/pages/diseases/diseases.html' },
    { label: 'Doctors', href: '/pages/doctors/doctors.html' },
    { label: 'Contact', href: '/pages/contact/contact.html' }
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

  const signBtn = document.createElement('button');
  signBtn.className = 'btn btn-primary';
  signBtn.textContent = 'Sign Up';
  signBtn.onclick = function () {
    window.location.href = '/pages/signup/signup.html';
  };

  headerContent.appendChild(logoDiv);
  headerContent.appendChild(hamburgerBtn);
  headerContent.appendChild(navMenu);
  headerContent.appendChild(signBtn);

  container.appendChild(headerContent);
  header.appendChild(container);

  hamburgerBtn.onclick = function () {
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  };

  document.body.prepend(header);
}