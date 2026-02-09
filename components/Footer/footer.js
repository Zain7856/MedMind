export default function loadFooter() {
  if (!document.querySelector('link[href*="global.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assest/css/global.css';
    document.head.appendChild(link);
  }

  if (!document.querySelector('link[href*="footer.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/components/Footer/footer.css';
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

  const aboutTitle = document.createElement('img');
  aboutTitle.src = '/imgs/logo.png';
  aboutTitle.className = 'footer-title';

  const aboutText = document.createElement('p');
  aboutText.className = 'footer-text';
  aboutText.textContent = 'Your trusted healthcare companion for medical information and doctor consultations.';

  aboutCol.appendChild(aboutTitle);
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
    { label: 'About', href: '/Pages/About us/About.html'},
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
  copyright.textContent = `© ${new Date().getFullYear()} MedCheck. All rights reserved.`;

  footerBottom.appendChild(copyright);

  footerContent.appendChild(footerTop);
  footerContent.appendChild(footerBottom);
  container.appendChild(footerContent);
  footer.appendChild(container);

  document.body.appendChild(footer);
}