export default function loadFooter() {
  if (!document.querySelector('link[href*="global.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/global.css';
    document.head.appendChild(link);
  }

  if (!document.querySelector('link[href*="Footer.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/components/Footer/Footer.css';
    document.head.appendChild(link);
  }

  const footer = document.createElement('footer');
  footer.id = 'footer';
  footer.className = 'footer';

  const container = document.createElement('div');
  container.className = 'container';

  const footerContent = document.createElement('div');
  footerContent.className = 'footer-content';

  const footerTop = document.createElement('div');
  footerTop.className = 'footer-top flex flex-between';

  const aboutCol = document.createElement('div');
  aboutCol.className = 'footer-col';

  const logoContainer = document.createElement('div');
  logoContainer.className = 'footer-logo-container';
  logoContainer.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-bottom: 1rem;';

  const logoIcon = document.createElement('img');
  logoIcon.className = 'logo-icon';
  logoIcon.src = '/imgs/logo.png';
  logoIcon.style.cssText = 'width: 40px; height: 40px; border-radius: 50%; background: #fff; padding: 2px; object-fit: cover;';

  const logoText = document.createElement('span');
  logoText.className = 'logo-text';
  logoText.textContent = 'MedMind';
  logoText.style.cssText = 'font-size: 1.25rem; font-weight: 700; color: #fff;';

  logoContainer.appendChild(logoIcon);
  logoContainer.appendChild(logoText);

  const aboutText = document.createElement('p');
  aboutText.className = 'footer-text';
  aboutText.textContent = 'Your trusted healthcare companion for medical information and doctor consultations.';

  aboutCol.appendChild(logoContainer);
  aboutCol.appendChild(aboutText);

  const linksCol = document.createElement('div');
  linksCol.className = 'footer-col';

  const linksTitle = document.createElement('h3');
  linksTitle.className = 'footer-title';
  linksTitle.textContent = 'Quick Links';

  const linksList = document.createElement('ul');
  linksList.className = 'footer-list';

  const footerLinks = [
    { label: 'Home', href: '/Pages/Home/home.html' },
    { label: 'Diseases', href: '/Pages/Disease/Disease.html' },
    { label: 'Doctors', href: '/Pages/Doctors/Doctors.html' },
    { label: 'Hospitals', href: '/Pages/Hospitals/Hospitals.html' },
    { label: 'About', href: '/Pages/About us/About.html' },
  ];

  footerLinks.forEach(item => {
    const li = document.createElement('li');
    li.className = 'footer-list-item';

    const a = document.createElement('a');
    a.href = item.href;
    a.className = 'footer-link';
    a.textContent = item.label;

    a.onclick = function (e) {
      e.preventDefault();
      window.location.href = item.href;
    };

    li.appendChild(a);
    linksList.appendChild(li);
  });

  linksCol.appendChild(linksTitle);
  linksCol.appendChild(linksList);

  const contactCol = document.createElement('div');
  contactCol.className = 'footer-col';

  const contactTitle = document.createElement('h3');
  contactTitle.className = 'footer-title';
  contactTitle.textContent = 'Contact Us';

  const contactList = document.createElement('ul');
  contactList.className = 'footer-list';

  const contactItems = [
    { icon: '📧', text: 'MedMind1997@gmail.com' },
    { icon: '📞', text: '+010957602356' },
    { icon: '📍', text: 'KFS, Egypt' }
  ];

  contactItems.forEach(item => {
    const li = document.createElement('li');
    li.className = 'footer-list-item';
    li.innerHTML = `<span>${item.icon}</span> ${item.text}`;
    contactList.appendChild(li);
  });

  contactCol.appendChild(contactTitle);
  contactCol.appendChild(contactList);

  footerTop.appendChild(aboutCol);
  footerTop.appendChild(linksCol);
  footerTop.appendChild(contactCol);

  const footerBottom = document.createElement('div');
  footerBottom.className = 'footer-bottom';

  const copyright = document.createElement('p');
  copyright.className = 'copyright';
  copyright.textContent = `© ${new Date().getFullYear()} MedMind. All rights reserved.`;

  footerBottom.appendChild(copyright);

  footerContent.appendChild(footerTop);
  footerContent.appendChild(footerBottom);
  container.appendChild(footerContent);
  footer.appendChild(container);

  document.body.appendChild(footer);
}