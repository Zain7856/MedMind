// Disease Info Page - Created from scratch

// DOM Elements
const page = document.createElement('main');
page.className = 'disease-info-page';

const container = document.createElement('div');
container.className = 'disease-info-container';

const card = document.createElement('div');
card.className = 'disease-info-card';

const header = document.createElement('div');
header.className = 'disease-info-header';

const title = document.createElement('h1');
title.className = 'disease-info-title';
title.textContent = 'Loading...';

const content = document.createElement('div');
content.className = 'disease-info-content';
content.id = 'disease-info-content';
content.innerHTML = '<p>Loading disease information...</p>';

// Build page structure
header.appendChild(title);
card.appendChild(header);
card.appendChild(content);
container.appendChild(card);
page.appendChild(container);
document.body.appendChild(page);

// Get disease ID from URL
const urlParams = new URLSearchParams(window.location.search);
const diseaseId = urlParams.get('id');

// Create sections function
const createSection = (title, content, className) => {
    const section = document.createElement('div');
    section.className = `disease-section ${className}`;
    
    const sectionTitle = document.createElement('h2');
    sectionTitle.className = 'disease-section-title';
    sectionTitle.textContent = title;
    
    const sectionContent = document.createElement('div');
    sectionContent.className = 'disease-section-content';
    sectionContent.textContent = content;
    
    section.appendChild(sectionTitle);
    section.appendChild(sectionContent);
    return section;
};

// Load disease data
async function init() {
    if (!diseaseId) {
        title.textContent = 'No Disease Specified';
        content.innerHTML = '<p class="error-message">No disease specified</p>';
        return;
    }
    
    try {
        // Import API function
        const { getDiseaseById } = await import('../../api/Disease-api.js');
        const disease = await getDiseaseById(diseaseId);
        
        if (!disease) {
            title.textContent = 'Disease Not Found';
            content.innerHTML = '<p class="error-message">Disease not found</p>';
            return;
        }
        
        // Update title
        title.textContent = disease.Name || disease.name || 'Unknown Disease';
        
        // Clear content and add sections
        content.innerHTML = '';
        
        const descriptionSection = createSection('Description', disease.description || 'No description available', 'description-section');
        const infoSection = createSection('Info', disease.INFO || 'No information available', 'info-section');
        const symptomsSection = createSection('Symptoms', disease.symptoms || 'No symptoms available', 'symptoms-section');
        const treatmentSection = createSection('Treatment', disease.treatment || 'No treatment available', 'treatment-section');
        
        content.appendChild(descriptionSection);
        content.appendChild(infoSection);
        content.appendChild(symptomsSection);
        content.appendChild(treatmentSection);
        
    } catch (error) {
        console.error('Error loading disease:', error);
        content.innerHTML = '<p class="error-message">Error loading disease information</p>';
    }
}

// Initialize
init();
