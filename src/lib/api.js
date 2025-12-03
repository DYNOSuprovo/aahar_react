const BACKEND_URL = "https://diet-suggest-aahar.onrender.com";

export const getSessionId = () => {
    if (typeof window === 'undefined') return null;
    let sessionId = localStorage.getItem('aahar_session_id');
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('aahar_session_id', sessionId);
    }
    return sessionId;
};

export const sendMessageToBackend = async (message) => {
    const sessionId = getSessionId();
    try {
        const response = await fetch(`${BACKEND_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: message,
                session_id: sessionId
            }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        // Handle different possible response formats
        return data.response || data.answer || data.message || JSON.stringify(data);
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const getChatHistory = async () => {
    const sessionId = getSessionId();
    try {
        const response = await fetch(`${BACKEND_URL}/history?session_id=${sessionId}`);
        if (!response.ok) return [];
        const data = await response.json();
        return data.history || [];
    } catch (error) {
        console.error("History Error:", error);
        return [];
    }
};
