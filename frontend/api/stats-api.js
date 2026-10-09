const baseUrl = 'http://localhost:3000';

export async function getStats() {
    try {
        const response = await fetch(`${baseUrl}/stats`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const stats = await response.json();

        return {
            doctors: stats.doctors ?? 0,
            hospitals: stats.hospitals ?? 0,
            diseases: stats.diseases ?? 0
        };

    } catch (error) {
        console.error('Error fetching stats:', error);
        return null;
    }
}
