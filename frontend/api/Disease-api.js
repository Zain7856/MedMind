const baseUrl = 'http://localhost:3000';
export async function getDiseases() {
    try {
        const response = await fetch(`${baseUrl}/diseases`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);


        const diseases_list = await response.json();
        const diseasesArray = diseases_list.value || diseases_list;

        return diseasesArray.map(disease => ({
            id: disease.ID || disease.id,
            name: disease.name || disease.Name,
            description: disease.description || disease.about || disease.About,
            symptoms: disease.symptoms || disease.Symptoms,
            treatment: disease.treatment || disease.Treatment,
            info: disease.INFO || disease.info || disease.about
        }));

    } catch (error) {
        console.error('Error fetching diseases:', error);
        return [];
    }
}

export async function getDiseaseById(id) {
    try {
        const response = await fetch(`${baseUrl}/disease/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const disease = await response.json();

        return {
            id: disease.ID || disease.id,
            name: disease.name || disease.Name,
            description: disease.description || disease.about || disease.About,
            symptoms: disease.symptoms || disease.Symptoms,
            treatment: disease.treatment || disease.Treatment,
            info: disease.INFO || disease.info || disease.about
        };
    } catch (error) {
        console.error('Error fetching disease details:', error);
        return {};
    }
}


