function showSuccessModal(modalTitleParam, modalTextParam) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const card = document.createElement('div');
    card.className = 'modal-card';

    const iconSuccess = document.createElement('div');
    iconSuccess.className = 'modal-icon';
    iconSuccess.innerHTML = '✓';

    const modalTitle = document.createElement('h2');
    modalTitle.className = 'modal-title';
    modalTitle.textContent = modalTitleParam;

    const modalText = document.createElement('p');
    modalText.className = 'modal-text';
    modalText.textContent = modalTextParam;

    const btnContainer = document.createElement('div');
    btnContainer.className = 'modal-buttons';

    const profileBtn = document.createElement('button');
    profileBtn.className = 'modal-btn modal-btn-primary';
    profileBtn.textContent = 'Go to My Profile';
    profileBtn.onclick = function () {
        window.location.href = '/Pages/Profile/profile.html';
    };

    const homeBtn = document.createElement('button');
    homeBtn.className = 'modal-btn modal-btn-secondary';
    homeBtn.textContent = 'Return to Home';
    homeBtn.onclick = function () {
        window.location.href = '/Pages/home/home.html';
    };

    btnContainer.appendChild(profileBtn);
    btnContainer.appendChild(homeBtn);

    card.appendChild(iconSuccess);
    card.appendChild(modalTitle);
    card.appendChild(modalText);
    card.appendChild(btnContainer);

    overlay.appendChild(card);
    document.body.appendChild(overlay);
}

export default showSuccessModal;