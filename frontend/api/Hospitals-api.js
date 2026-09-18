const baseUrl = 'http://localhost:3000';

export async function getHospitals() {
    try {
        const response = await fetch(`${baseUrl}/hospitals`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const hospitals_list = await response.json();
        const hospitalsArray = hospitals_list.value || hospitals_list;

        return hospitalsArray.map(hospital => ({
            id: hospital.ID || hospital.id,
            name: hospital.Name || hospital.name,
            location: hospital.Location || hospital.location,
            phone: hospital.Phone || hospital.phone,
            img: hospital.Img || hospital.img || hospital.image,
            services: hospital.Services || hospital.services,
            role: hospital.Role || 'Hospital'
        }));

    } catch (error) {
        console.error('Error fetching hospitals:', error);
        return [];
    }
}

export async function getHospitalById(id) {
    try {
        const response = await fetch(`${baseUrl}/hospitals/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const hospital = await response.json();

        return {
            id: hospital.ID || hospital.id,
            name: hospital.Name || hospital.name,
            location: hospital.Location || hospital.location,
            phone: hospital.Phone || hospital.phone,
            img: hospital.Img || hospital.img || hospital.image,
            services: hospital.Services || hospital.Services,
            role: hospital.Role || 'Hospital'
        };
    } catch (error) {
        console.error('Error fetching hospital details:', error);
        return {};
    }
}
