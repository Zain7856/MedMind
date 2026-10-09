function addStylesheet(href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

export default function loadFooter() {
    addStylesheet('/assets/css/global.css');
    addStylesheet('/components/Footer/Footer.css');

    const footer = document.createElement('footer');
    footer.id = 'footer';
    footer.className = 'footer';
    footer.innerHTML = `
        <div class="container">
            <div class="footer-content">
                <div class="footer-top flex flex-between">
                    <div class="footer-col">
                        <div class="footer-logo-container" style="display: flex; align-items: center; gap: 10px; margin-bottom: 1rem;">
                            <img class="logo-icon" src="/imgs/logo.png" alt="" style="width: 40px; height: 40px; border-radius: 50%; background: #fff; padding: 2px; object-fit: cover;">
                            <span class="logo-text" style="font-size: 1.25rem; font-weight: 700; color: #fff;">MedMind</span>
                        </div>
                        <p class="footer-text">Your trusted healthcare companion for medical information and doctor consultations.</p>
                    </div>
                    <div class="footer-col">
                        <h3 class="footer-title">Quick Links</h3>
                        <ul class="footer-list">
                            <li class="footer-list-item"><a class="footer-link" href="/Pages/home/home.html">Home</a></li>
                            <li class="footer-list-item"><a class="footer-link" href="/Pages/diseases/diseases.html">Diseases</a></li>
                            <li class="footer-list-item"><a class="footer-link" href="/Pages/symptom-checker/symptom-checker.html">Symptom checker</a></li>
                            <li class="footer-list-item"><a class="footer-link" href="/Pages/doctors/doctors.html">Doctors</a></li>
                            <li class="footer-list-item"><a class="footer-link" href="/Pages/hospitals/hospitals.html">Hospitals</a></li>
                            <li class="footer-list-item"><a class="footer-link" href="/Pages/about/about.html">About</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h3 class="footer-title">Contact Us</h3>
                        <ul class="footer-list">
                            <li class="footer-list-item"><span>📧</span> MedMind1997@gmail.com</li>
                            <li class="footer-list-item"><span>📞</span> +010957602356</li>
                            <li class="footer-list-item"><span>📍</span> KFS, Egypt</li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p class="copyright">© ${new Date().getFullYear()} MedMind. All rights reserved.</p>
                </div>
            </div>
        </div>`;
    document.body.appendChild(footer);
}
