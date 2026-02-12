const baseUrl = 'http://localhost:3000';

export async function sendMessageToAssistant(message) {
    try {
        const response = await fetch(`${baseUrl}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        return data;
    } catch (error) {
        console.error('Error sending message to assistant:', error);
        return { response: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later." };
    }
}
