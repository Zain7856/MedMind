const baseUrl = 'http://localhost:3000';
export async function getHospitals(){
    try {
        const response = await fetch(`${baseUrl}/hospitals`);
        if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        
        const hospitals_list = await response.json();
        
        
        return hospitals_list.map(hospital => ({
            id: hospital.id,
            name: hospital.name || hospital.Name,
            location: hospital.location,
            services: hospital.services
        }));

    } catch (error) {
        console.error('Error fetching hospitals:', error);
        return [];
    }
}   

export async function getHospitalById(id){
    try {
        const response = await fetch(`${baseUrl}/hospital/${id}`);
        if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const hospital_details = await response.json();
        
        return hospital_details;
    } catch (error) {
        console.error('Error fetching hospital details:', error);
        return {};
    }
}