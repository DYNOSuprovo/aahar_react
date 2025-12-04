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
        return data.answer || data.response || JSON.stringify(data);
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

export const searchFood = async (query) => {
    if (!query) return [];
    try {
        console.log(`🔍 Searching for: "${query}"`);
        const url = `${BACKEND_URL}/nutrition/search/${encodeURIComponent(query)}`;
        console.log(`📡 API URL: ${url}`);

        const response = await fetch(url);
        console.log(`✅ Response status: ${response.status}`);

        if (!response.ok) {
            console.error(`❌ Search failed with status: ${response.status}`);
            return [];
        }

        const data = await response.json();
        console.log(`📊 Search results:`, data);
        console.log(`📝 Number of results: ${data.results?.length || 0}`);
        return data.results || [];
    } catch (error) {
        console.error("❌ Search Error:", error);
        return [];
    }
};

export const analyzeMeal = async (dishNames) => {
    try {
        const response = await fetch(`${BACKEND_URL}/analyze-meal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dish_names: dishNames })
        });
        if (!response.ok) throw new Error("Analysis failed");
        return await response.json();
    } catch (error) {
        console.error("Analysis Error:", error);
        throw error;
    }
};
