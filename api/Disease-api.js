const baseUrl = 'http://localhost:3000';
export async function getDiseases(){
    try {
        const response = await fetch(`${baseUrl}/diseases`);
        if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        
        const diseases_list = await response.json();
        
        
        return diseases_list.map(disease => ({
            id: disease.id,
            name: disease.name || disease.Name,
            description: disease.description,
            symptoms: disease.symptoms,
            treatment: disease.treatment,
            img: disease.img
        }));

    } catch (error) {
        console.error('Error fetching diseases:', error);
        return [];
    }
}   

export async function getDiseaseById(id){
    try {
        const response = await fetch(`${baseUrl}/disease/${id}`);
        if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const disease_details = await response.json();
        
        return disease_details;
    } catch (error) {
        console.error('Error fetching disease details:', error);
        return {};
    }
}


