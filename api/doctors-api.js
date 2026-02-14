const baseUrl = 'http://localhost:3000';
export async function getDoctors() {
    try {
        const response = await fetch(`${baseUrl}/doctors`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);


        const doctors_list = await response.json();
        const doctorsArray = doctors_list.value || doctors_list;

        return doctorsArray.map(doctor => ({
            id: doctor.ID || doctor.id,
            name: doctor.Name || doctor.name,
            specialization: doctor.Specialization || doctor.specialization,
            phone: doctor.Phone || doctor.phone,
            img: doctor.Img || doctor.img,
            location: doctor.Location || doctor.location,
            cost: doctor.cost || doctor.Cost,
            about: doctor.about || doctor.About
        }));

    } catch (error) {
        console.error('Error fetching Doctor:', error);
        return [];
    }
}

export async function getDoctorsByid(id) {
    try {
        const response = await fetch(`${baseUrl}/doctors/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const doctor = await response.json();

        return {
            id: doctor.ID || doctor.id,
            name: doctor.Name || doctor.name,
            specialization: doctor.Specialization || doctor.specialization,
            phone: doctor.Phone || doctor.phone,
            img: doctor.Img || doctor.img,
            location: doctor.Location || doctor.location,
            cost: doctor.cost || doctor.Cost,
            about: doctor.about || doctor.About
        };
    } catch (error) {
        console.error('Error fetching doctor details:', error);
        return {};
    }
}


