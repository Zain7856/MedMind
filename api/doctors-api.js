const baseUrl = 'http://localhost:3000';
export async function getDoctors(){
    try {
        const response = await fetch(`${baseUrl}/doctors`);
        if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        
        const doctors_list = await response.json();
const doctorsArray = doctors_list.value || doctors_list;
        
        
        return doctorsArray.map(doctor => ({
            id: doctor.ID,
            name: doctor.Name,
            specialization: doctor.Specialization,
            phone: doctor.Phone,
            img: doctor.Img,
            location: doctor.Location,
            cost: doctor.cost
        }));

    } catch (error) {
        console.error('Error fetching Doctor:', error);
        return [];
    }
}   

export async function getDoctorsByid(id){
    try {
        const response = await fetch(`${baseUrl}/doctors/${id}`);
        if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const doctor_details = await response.json();
        
        return doctor_details;
    } catch (error) {
        console.error('Error fetching doctor details:', error);
        return {};
    }
}


